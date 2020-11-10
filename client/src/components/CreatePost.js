import React, { useState } from 'react';
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
import candleIcon from '../images/candle.svg';

const useStyle = makeStyles({
    icon:{
        color: 'white',
        fontSize: 50,
    },
    icons: {
        fontSize: 40,
        color: '#666',
    }
})
export default function CreatePost(){
    const [clicked, setClicked] = useState(false);
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
                    <div className="events-buttons-container">
                        {Object.entries(eventsIcons).map(([key,value]) => 
                            <div className="icon-container">
                                <div className="icon">
                                    {value}
                                </div>
                                <p className="icon-label">
                                    {key}
                                </p>
                            </div>
                            )}
                    </div>
                    <div className="divider"/>
                    <div className="add-more-buttons-container">
                    </div>
                </div>
            : null}
        </div>

    );
}