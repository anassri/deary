import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../css/profile.css'
import coverPicturePlaceholder from '../images/cover-placeholder.jpg'
import profilePicturePlaceholder from '../images/profile-placeholder.png'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { 
    makeStyles, 
    Button, 
    IconButton, 
    Dialog, 
    DialogTitle, 
    TextField, 
    CircularProgress,
    DialogActions } from '@material-ui/core';
import Navigation from './Navigation';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { formatDistanceToNowStrict } from 'date-fns';
import EditIcon from '@material-ui/icons/Edit';
import { loadUser, editUser, editCover, editPhoto, loadUserPosts, loadFriends } from '../store/user';
import { useParams } from 'react-router';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import LeftNavigation from './LeftNavigation';
import Friends from './Friends';
import { addFriend, createNotification } from '../store/user';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        backgroundColor: '#EFEFEF',
        width: 840,
        height: 52,
        borderRadius: 40,
    },
    icon: {
        paddingLeft: 17,
    },
    iconButton: {
        backgroundColor: '#e0e0e0',
        color: '#666666',
        borderRadius: 40,
    },
    input: {
        margin: '0 25px',
        maxWidth: '90%',
    }
}));

export function Profile({ user, authUser, posts, friends}){
    const [open, setOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [coverPictureFile, setCoverPictureFile] = useState(null);
    const [owner, setOwner] = useState(false);
    const [errors, setErrors] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {id} =useParams();

    const firstname = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
    const lastname = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)

    useEffect(()=>{
        setFullName(user.firstName+' '+user.lastName);
        setBio(user.bio);
        setCity(user.city);
        setState(user.state);
        setCountry(user.country);
        setOwner(authUser.id === parseInt(id));
    }, [id])

    useEffect(()=>{
        if (profilePictureFile) savePhoto();
    }, [profilePictureFile]);

    useEffect(()=>{
        if (coverPictureFile) saveCover();
    }, [coverPictureFile]);

    const joinedAt = formatDistanceToNowStrict(new Date(user.createdAt), { addSuffix: true });

    const handleCoverButton = () => {
        document.getElementById("upload-cover-photo").click();
    }
    const handlePhotoButton = () => {
        document.getElementById("upload-profile-photo").click();
    }
    const handleEditOpen = () => {
        setOpen(true);
    }
    const handleEditClose = () => {
        setOpen(false);
    }
    const handleProfilePicture =  (e) =>{
        setProfilePictureFile(e.target.files[0]);
    }
    const handleCoverPicture = async (e) =>{
        setCoverPictureFile(e.target.files[0]);
    }

    const handleSaveProfile = (e) =>{
        e.preventDefault();
        saveData();
    }
    const saveCover = () =>{
        const data = new FormData();
        data.append('coverPicture', coverPictureFile);
        dispatch(editCover(data, user.id));
    }
    const savePhoto = () =>{
        const data = new FormData();
        data.append('profilePicture', profilePictureFile);
        dispatch(editPhoto(data, user.id));
    }
    const saveData = () => {
        const name = fullName.split(' ')
        if (!name[1]) return setErrors('Please enter your full name.')
        const firstName = name[0];
        const lastName = name.splice(1).join(' ');
     
        const data = {
            firstName,
            lastName,
            bio,
            city,
            state,
            country,
        }
        dispatch(editUser(data, user.id));
        setOpen(false);

    }
    let isFriends = false;
    let pendingRequest = false;
    user.relationships.map(relationship =>{
        if (user.id === relationship.user_id || user.id === relationship.friend_id){
            if (relationship.status === 2)
                isFriends = true;
            else if (relationship.status === 1)
                pendingRequest = true;
            
        }

    })
    const handleAddPerson = () => {
        const data = {
            "since": new Date(),
            "friendId": user.id,
            "actionUserId": authUser.id,
        }
        const notification = {
            "friendId": user.id,
            "typeId": 3,
            "createdAt": new Date(),
        }
        dispatch(createNotification(notification, authUser.id))
        dispatch(addFriend(authUser.id, data));
    }
    return (
        <>
            <Navigation />
            <div className="home-body-container profile">
                <div className="left-nav-container profile">
                    <LeftNavigation user={user} />
                </div>
                <div className="profile-container">
                    <div className="top-picture-section-container">
                        <div className="cover-picture-container">
                            <img
                                src={user.coverPicture ? user.coverPicture : coverPicturePlaceholder}
                                alt="cover placeholder"
                                className="cover-picture"
                            />
                        </div>
                        <div className="profile-picture-container">
                            <img
                                src={user.profilePicture ? user.profilePicture : profilePicturePlaceholder}
                                alt="profile placeholder"
                                className="profile-picture"
                                height="175"
                                width="175"
                            />
                            {owner 
                            ? 
                            <div className="upload-profile-picture-button-container">
                                <input 
                                    accept="image/png, image/jpeg" 
                                    id="upload-profile-photo" 
                                    type="file" 
                                    style={{ display: 'none' }} 
                                    onChange={handleProfilePicture}
                                    />
                                <IconButton
                                    variant="contained"
                                    color="default"
                                    className={classes.iconButton}
                                    type="file"
                                    onClick={handlePhotoButton}
                                >
                                    <PhotoCameraIcon />
                                </IconButton>
                            </div>
                            : null
                            }
                        </div>
                        {owner
                        ?   <div className="upload-cover-photo-container">
                                <input 
                                    accept="image/png, image/jpeg" 
                                    id="upload-cover-photo" 
                                    type="file" 
                                    style={{ display: 'none' }}
                                    onChange={handleCoverPicture}
                                    />
                                <Button
                                    variant="contained"
                                    color="default"
                                    type="file"
                                    className={classes.iconButton}
                                    startIcon={<PhotoCameraIcon />}
                                    onClick={handleCoverButton}
                                >
                                    Upload cover photo
                                </Button>
                            </div>
                        : null
                        }
                        <div className="basic-info-container">
                            <div className="name-header">
                                <h1>{firstname+' '+lastname}</h1>
                            </div>
                            <div className="bio-container">
                                {user.bio}
                            </div>
                            {user.city
                                ? <div className="location-container">
                                    <LocationOnIcon className="info-icon"/>
                                    <p>{user.city}{user.state ? ', ' + user.state : null}{user.country ? ', ' + user.country : null}</p>
                                </div>
                                : null}
                            <div className="joined-container">
                                <DateRangeIcon className="info-icon"/>
                                <p>{joinedAt}</p>
                            </div>
                            {owner
                                ?
                                <div className="edit-profile-container">
                                    <Button
                                        variant="contained"
                                        color="default"
                                        className={classes.iconButton}
                                        startIcon={<EditIcon />}
                                        onClick={handleEditOpen}
                                    >
                                        Edit Profile
                                </Button>
                                <Dialog
                                    open={open}
                                    onClose={handleEditClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    maxWidth='md'
                                    fullWidth
                                >
                                <DialogTitle id="alert-dialog-title">{"Edit Profile"}</DialogTitle>
                                    <form className="dialog-content-container" onSubmit={handleSaveProfile}>
                                        <DialogTitle id="alert-dialog-title">{"Full Name"}</DialogTitle>
                                        <TextField 
                                            id="fullname-input" 
                                            value={fullName}
                                            className={classes.input}
                                            onChange={e => setFullName(e.target.value)}/>
                                        <DialogTitle id="alert-dialog-title">{"Bio"}</DialogTitle>
                                        <TextField 
                                            id="bio-input" 
                                            multiline 
                                            rows={1}
                                            value={bio}
                                            fullWidth
                                            className={classes.input}
                                            onChange={e => setBio(e.target.value)} />
                                        <DialogTitle id="alert-dialog-title">{"Location"}</DialogTitle>
                                        <TextField 
                                            id="city-input" 
                                            value={city}
                                            className={classes.input} 
                                            onChange={e => setCity(e.target.value)} />

                                        <TextField 
                                            id="state-input" 
                                            value={state}
                                            className={classes.input}
                                            onChange={e => setState(e.target.value)} />

                                        <TextField 
                                            id="country-input" 
                                            value={country}
                                            className={classes.input}
                                            onChange={e => setCountry(e.target.value)} />

                                        <DialogActions>
                                            <Button 
                                                variant="contained" 
                                                type="submit"
                                                color="default" 
                                                className={classes.iconButton}
                                                style={{margin: 15}}
                                                >Save</Button>
                                        </DialogActions>
                                    </form>
                                </Dialog>
                            </div>
                            : pendingRequest && !owner && !isFriends
                            ? <div className="edit-profile-container">
                                <Button 
                                variant="contained" 
                                className={`add-button`} 
                                disabled
                                disableElevation
                                >Pending Friend Request</Button>
                                </div>
                            : !owner && !isFriends
                            ? <div className="edit-profile-container">
                                <Button 
                                variant="contained" 
                                className={`${classes.button} add-button`} 
                                disableElevation 
                                color="primary"
                                startIcon={<PersonAddIcon />}
                                onClick={handleAddPerson}
                                >Add Friend</Button>
                                </div>
                            : null
                            }
                        </div>
                    </div>
                        <div className="profile-body-container">
                        {owner
                        ?    <div className="create-post-profile">
                                <CreatePost />
                            </div>
                        :   null
                        }
                        {isFriends || owner
                            ? posts.map((post, i)=> <PostCard key={i} post={post} user={user}/>)
                            : null}
                    </div>
                </div>
                <div className="right-nav-container">
                    <Friends friends={friends} />
                </div>
            </div>
        </>
    )
}

export default function ProfileContainer(){
    const user = useSelector(state => state.user);
    const authUser = useSelector( state => state.auth.user)
    const posts = useSelector(state => state.user.posts);
    const friends = useSelector(state => state.user.friends)

    const sortedPosts = posts.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser(id))
        dispatch(loadUserPosts(id));
        dispatch(loadFriends(authUser.id))        
    }, [id])
    if(!user.id) return null;
    return <Profile user={user} authUser={authUser} posts={sortedPosts} friends={friends}/>
}