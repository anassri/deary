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
import { formatDistanceToNowStrict } from 'date-fns';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
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
import { addLike, deleteLike, deletePost } from '../store/post';
import { useDispatch } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';
import { createNotification, loadUserPosts } from '../store/user';
import { loadPosts as friendsPosts } from '../store/post';
import Fullname from './Fullname';
import ProfilePic from './ProfilePic';


const useStyle = makeStyles({
    paper:{
        // width: 780,
        marginBottom: 20,
        // marginRight: 20
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

export default function PostCard({user, post}){
    const [likeClicked, setLikeClicked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [commentClicked, setCommentClicked] = useState(false);
    const dispatch = useDispatch()
    const classes = useStyle()
    // console.log(post.created_at);
    const posted = formatDistanceToNowStrict(new Date(post.created_at), { addSuffix: true });
    const [sync, setSync] = useState(false);
    const [descriptionArea, setDescriptionArea] = useState('')
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const confirm = useConfirm();

    useEffect(()=>{
        setLikeCount(post.likes.length)
        setCommentCount(post.comments.length)
        post.likes.map(like => {
            if (like.user_id === user.id) setLikeClicked(true);
        });
    }, [post.comments])

    useEffect(() => {
        if(sync){
            setSync(false);
            dispatch(loadUserPosts(user.id))
            dispatch(friendsPosts(user.id))
        }
    }, [sync])

    const handleLiked = async () =>{
        if (likeClicked){
            setLikeClicked(false);
            setLikeCount((previousCount) => previousCount-1)
            await dispatch(deleteLike(post.id, user.id));
        } else {
            if(user.id !== post.owner.id) {
                const notification = {
                "friendId": post.owner.id,
                "typeId": 2,
                "postId": post.id,
                "createdAt": new Date(),
                }
                dispatch(createNotification(notification, user.id))
            }
            setLikeClicked(true);
            setLikeCount((previousCount) => previousCount+1)
            await dispatch(addLike(post.id, user.id));
        }
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = async () => {
        setAnchorEl(null);
        const id = post.id
        try {
            await confirm({
                title: 'Are you sure?',
                description: 'This action is permanent!',
                confirmationText: 'Delete',
                cancellationText: 'Cancel',
                dialogProps: { maxWidth: 'sm' }});
            await dispatch(deletePost(id));
            setSync(true)
        } catch (e) {
            console.error(e);
        }
    };
    const handleEdit = () => {
        setOpen(false);
        // dispatch(editComment(commentArea, comment.id))
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
                        <div className="photo-container" style={{ cursor: 'pointer' }}>
                            <ProfilePic user={post.owner} />
                        </div>
                        <div className="name-time-container">
                            <Fullname user={post.owner}/>
                            <div className="time-container">
                                <p className="post-timestamp">{posted}</p>
                            </div>
                        </div>
                        <div className="middle-side-container">
                            {post.taggedFriends.length
                                ? <><p className="filler-word">with</p> {post.taggedFriends.map(friend => 
                                        post.taggedFriends[post.taggedFriends.length-1] === friend
                                        ? <Fullname key={friend.id} user={friend} />
                                        : <><Fullname key={friend.id} user={friend} /> <p className="fullname coma">,</p></>
                                        )}</>
                            : null}
                            {post.location
                                ? <><p className="filler-word">in</p> <p className="fullname">{post.location.location}</p></>
                            : null}
                        </div>
                    </div>
                    
                    {user.id === post.owner.id
                    ?   <div className="right-side-container">
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
                    : null}
                    
                </div>
                <div className="body-container-post">
                    <div className="body-description-container">
                        <div className="event-type-container">
                            {eventsIcons[post.type.type]}
                        </div>
                        <p className="icon-tag">{post.type.type.toUpperCase()}</p>
                        <p className="description">{post.description}</p>
                    </div>
                    {post.photo 
                    ?   <div className="body-photo-container">
                            <img
                                src={post.photo.path}
                                alt="cover placeholder"
                                className="body-photo"
                            />
                        </div> 
                    : null}
                    
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
                            {likeCount === 1
                            ?   <div className="likes-count-tag">
                                    <p>{likeCount} Like </p>
                                </div>  
                            : likeCount > 1
                            ? <div className="likes-count-tag">
                                    <p>{likeCount} Likes </p>
                                </div>
                            : null  }
    
                            {commentCount === 1
                                ? <div className="comments-count-tag">
                                    <p 
                                        onClick={() => commentClicked ? setCommentClicked(false) : setCommentClicked(true)}
                                        style={{cursor: 'pointer'}}
                                        >{commentCount} Comment </p>
                                </div>  
                            : commentCount > 1
                            ? <div className="comments-count-tag">
                                        <p 
                                            onClick={() => commentClicked ? setCommentClicked(false) : setCommentClicked(true)} 
                                            style={{ cursor: 'pointer' }}
                                            >{commentCount} Comments </p>
                                </div>
                            : null  }
                            
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