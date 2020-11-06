import React, { useState } from 'react';
import '../css/post.css';
import { Paper, Button, makeStyles, InputBase, InputAdornment, IconButton } from '@material-ui/core/';
import { useHistory } from 'react-router';
import { formatDistanceToNowStrict } from 'date-fns';
import profilePicturePlaceholder from '../images/profile-placeholder.png'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import coverPicturePlaceholder from '../images/cover-placeholder.jpg'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import SendIcon from '@material-ui/icons/Send';

const useStyle = makeStyles({
    paper:{
        width: 840,
        marginTop: 20,
    },
    inputRoot: {
        backgroundColor: '#EFEFEF',
        width: 735,
        height: 52,
        borderRadius: 40,
        padding: 20,
    },

})

const CommentSection = ({user}) =>{
    const classes = useStyle()
    const [comment, setComment] = useState('');

    const handleComment = () =>{

    }
    return(
        <>
            <div className="divider" />
            <div className="comment-section">
                <div className="comment-input-section">
                    <ProfilePic user={user} size={40}/>
                    <div className="input-container">
                        <div className={classes.comment}>
                            <InputBase
                                placeholder="Write a comment..."
                                className={classes.inputRoot}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={e => setComment(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            variant="contained"
                                            color="default"
                                            type="file"
                                            onClick={handleComment}
                                        >
                                            <SendIcon className={classes.icon} />
                                        </IconButton>
                                    </InputAdornment>}
                            />
                        </div>
                    </div>
                </div>
                <DisplayComments user={user} />
                <DisplayComments user={user} />
            </div>
        </>
    )
}
const DisplayComments =({user}) => {
    const [likeClicked, setLikeClicked] = useState(false);
    return (
        <div className="comment-display-section">
            <ProfilePic user={user} size={40} />
            <div className="comment-area">
                <div className="left-comment-side">
                    <Fullname user={user} />
                    <div className="comment-container">
                        <p className="comment">some comment i wrote as a place holder </p>
                    </div>
                </div>
                <div className="right-comment-side">
                    <ThumbUpAltIcon
                        className="comment-like-button"
                        style={{ cursor: 'pointer' }}
                        color={likeClicked ? "primary" : "secondary"}
                        onClick={() => likeClicked ? setLikeClicked(false) : setLikeClicked(true)} />
                </div>
            </div>

        </div>
    )
}
const Fullname = ({user}) => {
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
const ProfilePic = ({user, size=60})=>{
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
export default function PostCard({user}){
    const [likeClicked, setLikeClicked] = useState(false);
    const [commentClicked, setCommentClicked] = useState(false);
    const classes = useStyle()
    const history = useHistory()
    const posted = formatDistanceToNowStrict(new Date(user.createdAt), { addSuffix: true });
    return (
        <div className={classes.paper}>
            <Paper className="paper-card">
                <div className="header-container">
                    <div className="left-side-container">
                        <ProfilePic user={user} />
                        <div className="name-time-container">
                            <Fullname user={user}/>
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
                        <p className="description">some text to test the caption section of the post, this is where all the text is gonna go. looks pretty nice so far.</p>
                    </div>
                    <div className="body-photo-container">
                        <img
                            src={user.coverPicture ? user.coverPicture : coverPicturePlaceholder}
                            alt="cover placeholder"
                            className="cover-picture-post"
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
                                onClick={() => commentClicked ? setCommentClicked(false) : setCommentClicked(true)}/>
                        </div>
                        <div className="footer-right-side">
                            <ChatBubbleIcon />
                        </div>
                    </div>
                    <div>
                        {commentClicked 
                            ? <CommentSection user={user} />
                            : null
                        }
                    </div>
                </div>
            </Paper>
        </div>
    )

}