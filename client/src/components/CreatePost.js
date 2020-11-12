import React, { useState, useEffect } from 'react';
import '../css/create-post.css'
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import WorkIcon from '@material-ui/icons/Work';
import SchoolIcon from '@material-ui/icons/School';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import NatureIcon from '@material-ui/icons/Nature';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import StarIcon from '@material-ui/icons/Star';
import candleIcon from '../images/candle_grey.svg';
import candleGreenIcon from '../images/candle.svg';
import { Button, IconButton, InputBase } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/post';
import { loadPosts as userPosts } from '../store/user';
import { loadPosts as friendsPosts } from '../store/post';
import LoadingPost from './LoadingPost';

const useStyle = makeStyles({
    icon:{
        color: 'white',
        fontSize: 50,
    },
    icons: {
        fontSize: 40,
        color: '#666',
    },
    greenIcons: {
        fontSize: 40,
        color: '#33DD87',
    },
    iconButtons:{
        color: '#666',
        fontSize: 40,
    },
    evenButtons:{
        textTransform: 'none',
    },
    closeButton: {
        '&:hover': {
            background: '#eee',
        },
        background: '#ddd',
        
    },
    button: {
        background: "linear-gradient(43deg, rgba(51,221,135,1) 0%, rgba(68,226,141,1) 72%, rgba(100,237,152,1) 87%, rgba(156,255,172,1) 100%)",
        color: "#fff",
    },
})
export default function CreatePost(){
    const token = useSelector(state => state.auth.token);
    const friends = useSelector(state => state.user.friends);
    const userId = useSelector(state => state.auth.user.id);
    const dispatch = useDispatch();

    const [searchFriends, setSearchFriends] = useState("");
    const [friendsField, setFriendsField] = useState(false);
    const [openFriendsDropdown, setOpenFriendsDropdown] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [locationField, setLocationField] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [locations, setLocations] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [sync, setSync] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [eventType, setEventType] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedFriendsIds, setSelectedFriendsIds] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [description, setDescription] = useState("");


    const classes = useStyle();
    const eventsIcons = {
        "work": <WorkIcon className={classes.icons} />,
        "education": <SchoolIcon className={classes.icons} />,
        "relationship": <FavoriteIcon className={classes.icons} />,
        "home": <HomeIcon className={classes.icons} />,
        "family": <NatureIcon className={classes.icons} />,
        "travel": <FlightTakeoffIcon className={classes.icons} />,
        "activities": <LocalActivityIcon className={classes.icons} />,
        "health": <DirectionsRunIcon className={classes.icons} />,
        "achievements": <StarIcon className={classes.icons} />,
        "rememberance": <img
            src={candleIcon}
            alt="candle icon"
            height="40"
            className="event-post-icon"
        />,
    }
    const greenEventsIcons = {
        "work": <WorkIcon className={classes.greenIcons} />,
        "education": <SchoolIcon className={classes.greenIcons} />,
        "relationship": <FavoriteIcon className={classes.greenIcons} />,
        "home": <HomeIcon className={classes.greenIcons} />,
        "family": <NatureIcon className={classes.greenIcons} />,
        "travel": <FlightTakeoffIcon className={classes.greenIcons} />,
        "activities": <LocalActivityIcon className={classes.greenIcons} />,
        "health": <DirectionsRunIcon className={classes.greenIcons} />,
        "achievements": <StarIcon className={classes.greenIcons} />,
        "rememberance": <img
            src={candleGreenIcon}
            alt="candle icon"
            height="40"
            className="event-post-icon"
        />,
    }
    
    const handlePhotoButton = () => {
        document.getElementById("upload-photo").click();
    }
    const handlePhoto = e => {
        if(e.target.files[0]){
            setPhoto(e.target.files[0])
            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
        }
    }
    useEffect(()=>{
        if(searchTerm){
            (async () => {
                try {
                    const res = await fetch(`/api/posts/location/${searchTerm}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                    });
                    if (res.ok) {
                        const { data } = await res.json();
                        setLocations(data);
                    }
                } catch (e) {
                    console.error(e);
                    return e;
                }
            })()}
    }, [searchTerm])

    useEffect(()=>{
        const timeout = setTimeout(() => {
            setSync(false);
            setLoading(false);
            dispatch(userPosts(userId))
            dispatch(friendsPosts(userId))
        }, 3000);
        return () => {
            clearTimeout(timeout)
        }
    }, [sync])

    let timeout=null;
    const handleSearchTerm = (e) =>{
        let input = e.target.value
        clearTimeout(timeout);

        timeout = setTimeout(()=>{
            setOpenDropdown(true);
            setSearchTerm(input);
        }, 1000)
    }
    const clearForm = () => {

    }
    const handlePost = () => {
        setLoading(true);

        const data = new FormData();
        const date = new Date();
        if (photo) data.append("photo", photo);

        data.append("post_type", eventType);
        if (selectedFriendsIds.length) data.append("tagged_friends", selectedFriendsIds);
        if (selectedLocation) data.append("location", selectedLocation);
        data.append("description", description);
        data.append("user_id", userId);
        data.append("created_at", `${date}`);
        setClicked(false);
        setSync(true);
        dispatch(createPost(data));
        clearForm();

    }
    const handleLocationClear = () =>{
        setLocationField(false)
        setSelectedLocation('');
        setLocations([]);
        setOpenDropdown(false);
    }
    const handleFriendClear = () =>{
        setFriendsField(false)
        setSelectedFriends('');
        setFriendsField(false);
    }
    const handleFriendTerm = (e) => {
        setOpenFriendsDropdown(true);
        setSearchFriends(e.target.value);
    }
    return (
        <>
            <div className="create-post-container">
                <div className="expand-create-button-container" onClick={() => clicked ? setClicked(false) : setClicked(true)}>
                    <div className="create-button-icon">
                        <AddIcon className={classes.icon}/>
                    </div>
                    <div className="create-button-label">
                        <p>Share a moment from your life.</p>
                    </div>
                </div>
                {clicked
                ?   <div className="create-post-body-container">
                        <div className="divider"/>
                        {eventType 
                        ?   <div className="event-body-container">
                                <div className="back-button-container">
                                    <IconButton
                                        className={classes.iconButtons}
                                        style={{margin: '10px 10px'}}
                                        onClick={() => setEventType("") }>
                                        <KeyboardBackspaceIcon />
                                    </IconButton>
                                </div>
                                <div className="chosen-icon-container">
                                    <div className="green-icon">
                                        {greenEventsIcons[eventType]}
                                    </div>
                                    <p className="green-icon-label" style={{fontWeight: 'bold'}}>
                                        {eventType.toUpperCase()}
                                    </p>
                                </div>
                                <div className="tags-container">
                                    {selectedFriends.length
                                        ? selectedFriends.map((friend) => <div className="friend-text-container">
                                            <p className="friend-text">with <span style={{ fontWeight: 'bold' }}>{friend} </span></p>
                                            <IconButton
                                                style={{ color: '#666' }}
                                                size="small"
                                                className="icon-button"
                                                onClick={() => selectedFriends.length === 1 
                                                    ? handleFriendClear()
                                                    : setSelectedFriends([...selectedFriends.slice(0, selectedFriends.length-1)])
                                                }>
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        </div>
                                        )
                                        : null}
                                    {selectedLocation
                                    ?   <div className="location-text-container">
                                            <p className="location-text">in <span style={{fontWeight: 'bold'}}>{selectedLocation}</span></p>
                                            <IconButton
                                                style={{color: '#666'}}
                                                size="small"
                                                className="icon-button"
                                                onClick={handleLocationClear}>
                                                <CloseIcon fontSize="inherit"/>
                                            </IconButton>
                                        </div>
                                    : null}
                                    
                                </div>
                                <div className="description-input-container">
                                    <form className="form-container">
                                        <textarea 
                                            type="text"
                                            placeholder="Write a description..."
                                            className="description-text-field" 
                                            onChange={e => setDescription(e.target.value)}/>
                                        <Button
                                            variant="contained"
                                            className={`${classes.button} post-button`}
                                            disableElevation
                                            onClick={handlePost}
                                        >Post</Button>
                                    </form>
                                </div>
                                {photoPreview
                                ?   <div className="photo-preview-container"> 
                                        <div className="close-button-container">
                                            <IconButton 
                                                className={classes.closeButton}
                                                onClick={() => { setPhoto(null); setPhotoPreview(null);}}>
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                        <img
                                            src={photoPreview}
                                            alt="uploaded photo"
                                            className="uploaded-photo"
                                        />
                                    </div>
                                : null}
                            </div>
                        :   <div className="events-buttons-container">
                                {Object.entries(eventsIcons).map(([key,value]) => 
                                    <Button key={key} onClick={()=>setEventType(key)} className={classes.evenButtons}>
                                        <div className="icon-container">
                                            <div className="icon">
                                                {value}
                                            </div>
                                            <p className="icon-label">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </p>
                                        </div>
                                    </Button>
                                )}
                            </div>
                        }
                        
                        {eventType 
                        ?   <>
                                <div className="divider" />
                                <div className="add-more-buttons-container">
                                    <input
                                        accept="image/png, image/jpeg"
                                        id="upload-photo"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handlePhoto}
                                    />
                                    <IconButton 
                                        className={classes.iconButtons}
                                        type="file"
                                        onClick={handlePhotoButton}
                                        >
                                        <ImageIcon />
                                    </IconButton>
                                    <IconButton 
                                        className={classes.iconButtons}
                                        onClick={() => friendsField ? setFriendsField(false) : setFriendsField(true)}
                                        >
                                        <PersonAddIcon />
                                    </IconButton>
                                    {friendsField 
                                        ? <div className="friend-container" >
                                            <InputBase
                                                placeholder="Friend..."
                                                onChange={handleFriendTerm}
                                                className="friend-field-input"
                                                inputProps={{ 'aria-label': 'naked' }}
                                            />
                                            {openFriendsDropdown
                                                ?   <div className="friend-dropdown-container">
                                                    {friends.map(friend => <Button key={friend.id} onClick={() => {
                                                        setSelectedFriends([...selectedFriends, friend.firstName + " " + friend.lastName]);
                                                        setSelectedFriendsIds([...selectedFriendsIds, friend.id]);
                                                        setFriendsField(false);
                                                        }}>
                                                                {friend.firstName + " " + friend.lastName}
                                                            </Button>)}
                                                    </div>
                                                : null}
                                        </div>
                                    : null}
                                    <IconButton 
                                        className={classes.iconButtons}
                                        onClick={() => locationField ? setLocationField(false) : setLocationField(true)}
                                        >
                                        <LocationOnIcon />
                                    </IconButton>
                                    {locationField && !selectedLocation
                                    ?   <div className="search-location-container">
                                            <InputBase
                                                placeholder="Search location..."
                                                onChange={handleSearchTerm}
                                                className="search-field-input"
                                                inputProps={{ 'aria-label': 'naked'}} 
                                                    />
                                            {openDropdown
                                            ?   <div className="search-dropdown-container">
                                                    {locations.length
                                                        ? locations.map(location => <Button 
                                                                    key={location.id} 
                                                                    onClick={() => setSelectedLocation(location.address.country_code === "us"
                                                                                                        ? location.address.name + ", " + location.address.state + " USA"
                                                                                                        : location.address.name + ", " + location.address.country)}>
                                                        {location.address.country_code === "us"
                                                        ? location.address.name + ", " + location.address.state + " USA" 
                                                        : location.address.name + ", " + location.address.country
                                                        }
                                                        </Button>) 

                                                    : null}
                                                </div>
                                            : null}
                                        </div>
                                    : null}
                                </div>
                            </>
                        : null}
                    </div>
                : null}
            </div>
            {loading
            ? <LoadingPost />
            : null}
        </>

    );
}