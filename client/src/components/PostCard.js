import React, { useEffect, useState } from 'react';
import '../css/post.css';
import { Paper, 
    Button, 
    makeStyles,
    TextField,
    Dialog,
    DialogActions,
    DialogContent, 
    IconButton,
    DialogTitle,
    MenuItem,
    Menu,  } from '@material-ui/core/';
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
import { addLike, deleteLike, loadPosts } from '../store/post';
import { useDispatch } from 'react-redux';

const useStyle = makeStyles({
    paper:{
        width: 780,
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
    const [likeCount, setLikeCount] = useState(0);
    const [commentClicked, setCommentClicked] = useState(false);
    const [syncData, setSyncData] = useState(false);
    const dispatch = useDispatch()
    const classes = useStyle()
    const posted = formatDistanceToNowStrict(new Date(post.created_at), { addSuffix: true });
    const [descriptionArea, setDescriptionArea] = useState('')
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [postSyncNeeded, setPostSyncNeeded] = useState(false);
    const [commentArea, setCommentArea] = useState('')

    useEffect(()=>{
        post.likes.map(like => {
            if (like.user_id === user.id) setLikeClicked(true);
        });
        
        dispatch(loadPosts(user.id))
        setLikeCount(post.likes.length)
        // setSyncData(false);
        console.log("hit hit")
    }, [likeClicked])
    
    useEffect(()=>{
        console.log("hit")
    }, [likeClicked])
    
    const handleLiked = async () =>{
        if (likeClicked){
            setLikeClicked(false);
            await dispatch(deleteLike(post.id, user.id));
        } else {
            setLikeClicked(true);
            await dispatch(addLike(post.id, user.id));
        }
        setSyncData(true);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = async () => {
        setAnchorEl(null);
        // const id = comment.id
        // try {
        //     await confirm({
        //         title: 'Are you sure?',
        //         description: 'This action is permanent!',
        //         confirmationText: 'Delete',
        //         cancellationText: 'Cancel',
        //         dialogProps: { maxWidth: 'sm' }
        //     });
        //     // await dispatch(deleteComment(id, postId));
        //     setPostSyncNeeded(true)
        // } catch (e) {
        //     console.error(e);
        // }
    };
    const handleEdit = () => {
        setOpen(false);
        // dispatch(editComment(commentArea, comment.id))
        setPostSyncNeeded(true)
    };

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
                        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            <MoreHorizIcon style={{fontSize: 30}}/> 
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => {
                                setOpen(true);
                                setAnchorEl(null);
                                // setDescriptionArea(comment.comment);
                            }}>Edit</MenuItem>
                            <MenuItem onClick={handleDelete} style={{ color: '#FF0000' }}>Delete</MenuItem>
                        </Menu>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            maxWidth='sm'
                            fullWidth
                            aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">
                                Edit Comment</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    type="email"
                                    value={descriptionArea}
                                    onChange={e => setDescriptionArea(e.target.value)}
                                    maxWidth='md'
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpen(false)} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleEdit} color="primary">
                                    Edit
                                </Button>
                            </DialogActions>
                        </Dialog>
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
                                onClick={handleLiked}/>
                            <ChatBubbleIcon
                                className="footer-buttons"
                                style={{ cursor: 'pointer' }}
                                color="secondary"
                                onClick={() => commentClicked ? setCommentClicked(false) : setCommentClicked(true)}
                                />
                        </div>
                        <div className="footer-right-side">
                            <div className="likes-count-tag">
                                <p>{likeCount ? likeCount + ' Likes' : null}</p>
                            </div>
                            <div className="comments-count-tag">

                            </div>
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