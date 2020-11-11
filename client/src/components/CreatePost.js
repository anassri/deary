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
import { Button, IconButton, InputBase, TextField } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector } from 'react-redux';

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
    const token = useSelector(state => state.auth.token)
    const [clicked, setClicked] = useState(false);
    const [locationField, setLocationField] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [locations, setLocations] = useState([]);
    const [eventType, setEventType] = useState("");
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
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
        })()
    }, [searchTerm])

    let timeout=null;
    const handleSearchTerm = (e) =>{
        let input = e.target.value
        clearTimeout(timeout);

        timeout = setTimeout(()=>{
            setOpenDropdown(true);
            setSearchTerm(input);
        }, 1000)
    }

    const handleLocationContainer = () =>{
        locationField ? setLocationField(false) : setLocationField(true); 
    }
    const handleLocationClear = () =>{
        setLocationField(false)
        setSelectedLocation('');
        setLocations([]);
        setOpenDropdown(false);

    }
    console.log(selectedLocation)
    return (
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
                                {selectedLocation
                                ?   <div className="location-text-container">
                                        <p className="location-text">is in <span style={{fontWeight: 'bold'}}>{selectedLocation}</span></p>
                                        <IconButton
                                            style={{color: '#666'}}
                                            size="small"
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
                                <Button onClick={()=>setEventType(key)} className={classes.evenButtons}>
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
                    <div className="divider"/>
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
                        <IconButton className={classes.iconButtons}>
                            <PersonAddIcon />
                        </IconButton>
                        <IconButton 
                            className={classes.iconButtons}
                            onClick={handleLocationContainer}
                            >
                            <LocationOnIcon />
                        </IconButton>
                        {locationField && !selectedLocation
                        ?   <div className="search-location-container" style={{ width: 300, height: 40 }}>
                                <InputBase
                                    placeholder="Search location..."
                                    onChange={handleSearchTerm}
                                    className="search-field-input"
                                    inputProps={{ 'aria-label': 'naked'}} 
                                        />
                                {openDropdown
                                ?   <div className="search-dropdown-container">
                                        {locations.length
                                            ? locations.map(location => <Button key={location.id} onClick={() => setSelectedLocation(`${location.address.city}, ${location.address.state} ${location.address.country}`)}>
                                            {location.address.city}, {location.address.state} {location.address.country}
                                            </Button>) 

                                        : null}
                                    </div>
                                : null}
                            </div>
                        : null}


                    </div>
                </div>
            : null}
        </div>

    );
}