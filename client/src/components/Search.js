import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import '../css/search.css';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Button, makeStyles } from '@material-ui/core/';
import profilePicturePlaceholder from '../images/profile-placeholder.png'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory, useParams } from 'react-router';
import { addFriend, createNotification, loadUsers } from '../store/user';
import FriendAcceptBtns from './FriendAcceptBtns';
import Friends from './Friends';
import LeftNavigation from './LeftNavigation';
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
function CheckRelationShip({ownerId, friendId, relationships}){
    const classes = useStyles();
    const history = useHistory();
    const {id} = useParams();
    const {value} = useParams();
    const dispatch = useDispatch();
    const [sync, setSync] = useState(false);
    

    useEffect(()=>{
        if(sync)
        {
            setSync(false);
            dispatch(loadUsers(id, value));
        }
    }, [sync]);

    const handleAddPerson = () =>{
        const data = {
            "since": new Date(),
            "friendId": friendId,
            "actionUserId": ownerId,
            
        }
        const notification = {
            "friendId": friendId,
            "typeId": 3,
            "createdAt": new Date(),
        }
        setSync(true)
        dispatch(createNotification(notification, id))
        dispatch(addFriend(id, data));
    }
    let status = 0;
    let action_user = 0;
    relationships.map(relation => {
        if ((ownerId === relation.user_id 
            && friendId === relation.friend_id) 
            || (ownerId === relation.friend_id 
            && friendId === relation.user_id)) {

            status = relation.status  
            action_user = relation.action_user_id
        }
    })
    if (status === 1 && action_user !== ownerId)
        return <FriendAcceptBtns userId={ownerId} friendId={friendId}/>

    else if (status === 1 && action_user === ownerId)
        return <Button 
                    variant="contained" 
                    className={`add-button`} 
                    disabled
                    disableElevation
                    >Friend Request Sent</Button>
    else if (status === 2)
    return <Button 
                variant="contained" 
                className={`${classes.button} add-button`} 
                disableElevation 
                startIcon={<PersonIcon />}
                onClick={()=> history.push(`/profile/${friendId}`)}
                >View Profile</Button>
    else if (status === 3 && action_user === ownerId)
        return <Button
            variant="contained"
            className={`add-button`}
            disabled
            disableElevation
        >Friend Request Declined</Button>
    else if (status === 0 && action_user === 0){
        return <Button 
                variant="contained" 
                className={`${classes.button} add-button`} 
                disableElevation 
                startIcon={<PersonAddIcon />}
                onClick={handleAddPerson}
                >Add Friend</Button>
    }
}
function SearchEntry({user, relationships, owner}){
    const history = useHistory();
    return (
        <>
            <div className="entry-container">
                <div className="search-left">
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
                </div>
                <div className="add-button-container">
                    <CheckRelationShip ownerId={owner.id} friendId={user.id} relationships={relationships}/>
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
    const friends = useSelector(state => state.user.friends)

    if(!users) return null
    if(!relationships) return null

    return (
        <>
            <Navigation />
            <div className="home-body-container">
                <div className="left-nav-container">
                    <LeftNavigation user={owner} />
                </div>
                <div className="body-container">
                    {users.length
                    ?   <Paper className="paper-container">
                            {users.map(user =>
                            <SearchEntry key={user.id} owner={owner} user={user} relationships={relationships} />
                            )}
                        </Paper>
                    : <h1 className="no-results">No results found.</h1>
                    }
               </div>
                <div className="right-nav-container">
                    <Friends friends={friends} />
                </div>
            </div>
            
        </>
    )
}