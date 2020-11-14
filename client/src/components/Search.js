import React from 'react';
import Navigation from './Navigation';
import '../css/search.css';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Button, makeStyles } from '@material-ui/core/';
import profilePicturePlaceholder from '../images/profile-placeholder.png'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory, useParams } from 'react-router';
import { addFriend, createNotification } from '../store/user';
const useStyles = makeStyles((theme) => ({
    button: {
        background: "linear-gradient(43deg, rgba(51,221,135,1) 0%, rgba(68,226,141,1) 72%, rgba(100,237,152,1) 87%, rgba(156,255,172,1) 100%)",
        color: "#fff",
    },
    icon: {
        margin: '0 20px',
        alignItems: 'start',
    }
}));
function CheckRelationShip({ownerId, userId, relationships}){
    const classes = useStyles();
    const history = useHistory();
    const {idq} = useParams();
    const dispatch = useDispatch();
    const id = Number.parseInt(idq[0])
    let status = 0;
    let action_user = 0;

    const handleAddPerson = () =>{
        const data = {
            "friendId": userId,
            "createdAt": new Date(),
        }
        const notification = {
            "friendId": userId,
            "typeId": 3,
            "createdAt": new Date(),
        }
        dispatch(createNotification(notification, id))
        dispatch(addFriend(id, data));
    }
    relationships.map(relation => {
        if ((ownerId === relation.user_id && userId === relation.friend_id) 
            || (ownerId === relation.friend_id && userId === relation.user_id)) {
            status = relation.status  
            action_user = relation.action_user_id
            // console.log("relation.user_id", relation.user_id)
            // console.log("relation.friend_id", relation.friend_id)
        }
    })

    if (status === 1 && action_user !== ownerId){
        return <Button 
                    variant="contained" 
                    className={`add-button`} 
                    disabled
                    >Accept</Button>
    }
    else if (status === 1 && action_user === ownerId)
        return <Button 
                    variant="contained" 
                    className={`add-button`} 
                    disabled
                    >Pending Request</Button>
    else if (status === 2)
    return <Button 
                variant="contained" 
                className={`${classes.button} add-button`} 
                disableElevation 
                startIcon={<PersonIcon />}
                onClick={()=> history.push(`/profile/${userId}`)}
                >View Profile</Button>
    else if (status === 3)
        return null
    return <Button 
                variant="contained" 
                className={`${classes.button} add-button`} 
                disableElevation 
                startIcon={<PersonAddIcon />}
                onClick={handleAddPerson}
                >Add Friend</Button>
    
}
function SearchEntry({user, relationships, owner}){
    const history = useHistory();
    return (
        <>
            <div className="entry-container">
                <div className="thumbnail-container" style={{cursor: 'pointer'}}>
                    {user.profilePicture 
                        ? <img
                            src={user.profilePicture}
                            alt="profile placeholder"
                            className="thumbnail-image"
                            height='60'
                            width='60'
                            onClick={()=> history.push(`/profile/${user.id}`)}
                            />
                        : <img
                            src={profilePicturePlaceholder}
                            alt="profile placeholder"
                            className="thumbnail-image"
                            height='60'
                            width='60'
                            onClick={() => history.push(`/profile/${user.id}`)}
                        />}
                </div>
                <div className="name-container">
                    <p className="fullname search" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => history.push(`/profile/${user.id}`)}>
                        {user.firstName + " " + user.lastName} </p>
                </div>
                <div className="add-button-container">
                    <CheckRelationShip ownerId={owner.id} userId={user.id} relationships={relationships}/>
                </div>
            </div>
            <div className="divider"/>
        </>
    )
}
export default function Search(){
    const users = useSelector(state => state.user.users);
    const owner = useSelector(state => state.auth.user);
    const relationships = useSelector(state => state.user.relationships)
    
    if(!users) return null
    if(!relationships) return null

    return (
        <>
            <Navigation />
            <div className="content-container">
                <Paper className="paper-container">{users.map(user =>
                    <SearchEntry key={user.id} owner={owner} user={user} relationships={relationships} />
                )}</Paper>
            </div>
        </>
    )
}