import React, { useState } from 'react';
import '../css/post.css';
import { Paper, Button, makeStyles, InputBase, InputAdornment, IconButton } from '@material-ui/core/';
import { useHistory } from 'react-router';
import { formatDistanceToNowStrict, parse } from 'date-fns';
import profilePicturePlaceholder from '../images/profile-placeholder.png'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import coverPicturePlaceholder from '../images/cover-placeholder.jpg'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
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
import Comments from './Comments';

const useStyle = makeStyles({
    paper:{
        width: 680,
        marginBottom: 20,
        marginRight: 20
    },
    inputRoot: {
        backgroundColor: '#EFEFEF',
        width: 580,
        height: 52,
        borderRadius: 40,
        padding: 20,
    },
    icons:{
        fontSize: 60,
        color: '#33DD87',
    }

})

export const Fullname = ({user}) => {
    const firstname = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
    const lastname = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)
    const history = useHistory()

    return(
        <div className="name-container">
            <p className="fullname"
                style={{ cursor: 'pointer' }}
                onClick={() => history.push(`/profile/${user.id}`)}>
                {firstname + " " + lastname} </p>
        </div>
    )
}
export const ProfilePic = ({user, size=60})=>{
    const history = useHistory()

    return (
        <div className="photo-container" style={{ cursor: 'pointer' }}>
            {user.profilePicture
                ? <img
                    src={user.profilePicture}
                    alt="profile placeholder"
                    className="thumbnail-image"
                    height={size}
                    width={size}
                    onClick={() => history.push(`/profile/${user.id}`)}
                />
                : <img
                    src={profilePicturePlaceholder}
                    alt="profile placeholder"
                    className="thumbnail-image"
                    height={size}
                    width={size}
                    onClick={() => history.push(`/profile/${user.id}`)}
                />}
        </div>
    )
}
export default function PostCard({user, post}){
    const [likeClicked, setLikeClicked] = useState(false);
    const [commentClicked, setCommentClicked] = useState(false);
    const classes = useStyle()
    const posted = formatDistanceToNowStrict(new Date(post.created_at), { addSuffix: true });
    const eventsIcons = {
        "work": <WorkIcon className={classes.icons}/>,
        "education": <SchoolIcon className={classes.icons}/>,
        "relationship": <FavoriteIcon className={classes.icons}/>,
        "home": <HomeIcon className={classes.icons}/>,
        "family": <NatureIcon className={classes.icons}/>,
        "travel": <FlightTakeoffIcon className={classes.icons}/>,
        "activities": <LocalActivityIcon className={classes.icons}/>,
        "health": <DirectionsRunIcon className={classes.icons}/>,
        "achievements": <StarIcon className={classes.icons}/>,
        "rememberance": <img
                    src={candleIcon}
                    alt="candle icon"
                    height="60"
                    className="event-icon"
                />,
    }
    return (
        <div className={classes.paper}>
            <Paper className="paper-card">
                <div className="header-container">
                    <div className="left-side-container">
                        <ProfilePic user={post.owner} />
                        <div className="name-time-container">
                            <Fullname user={post.owner}/>
                            <div className="time-container">
                                <p>{posted}</p>
                            </div>
                        </div>
                    </div>
                    <div className="right-side-container">
                        <MoreHorizIcon style={{fontSize: 40}}/>
                    </div>
                </div>
                <div className="body-container">
                    <div className="body-description-container">
                        <div className="event-type-container">
                            {eventsIcons[post.type.type]}
                        </div>
                        <p className="icon-tag">{post.type.type.toUpperCase()}</p>
                        <p className="description">{post.description}</p>
                    </div>
                    <div className="body-photo-container">
                        <img
                            src={post.owner.coverPicture ? post.owner.coverPicture : coverPicturePlaceholder}
                            alt="cover placeholder"
                            className="body-photo"
                        />
                    </div>
                </div>
                <div className="footer-container">
                    <div className="button-section">
                        <div className="footer-left-side">
                            <ThumbUpAltIcon 
                                className="footer-buttons"
                                style={{cursor: 'pointer'}}
                                color={likeClicked ? "primary" : "secondary"}
                                onClick={() => likeClicked ? setLikeClicked(false) : setLikeClicked(true)}/>
                            <ChatBubbleIcon
                                className="footer-buttons"
                                style={{ cursor: 'pointer' }}
                                color="secondary"
                                onClick={() => commentClicked ? setCommentClicked(false) : setCommentClicked(true)}
                                />
                        </div>
                        <div className="footer-right-side">
                            <ChatBubbleIcon />
                        </div>
                    </div>
                    <div>
                        {commentClicked 
                            ? <Comments owner={user} post={post} />
                            : null
                        }
                    </div>
                </div>
            </Paper>
        </div>
    )

}