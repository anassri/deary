import React, { useEffect, useState } from 'react';
import {ProfilePic, Fullname} from './PostCard'
import '../css/post.css';
import { formatDistanceToNowStrict, parse } from 'date-fns';
import { addComment, loadComments } from '../store/post';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, InputBase, InputAdornment, IconButton } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

import SendIcon from '@material-ui/icons/Send';

const useStyle = makeStyles({
    paper: {
        width: 680,
        marginBottom: 20,
        marginRight: 20
    },
    inputRoot: {
        backgroundColor: '#EFEFEF',
        width: 670,
        height: 52,
        borderRadius: 40,
        padding: 20,
    },
    icons: {
        fontSize: 60,
        color: '#33DD87',
    }

})
export default function Comments({ owner, post }) {
    const comments = useSelector(state => state.post.comments)
    const classes = useStyle()
    const [comment, setComment] = useState('');
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(loadComments(post.id))
    },[])
    const handleComment = () => {
        const id = owner.id;
        const postId = post.id;
        const data = {
            comment,
            postId
        }
        setComment('')
        dispatch(addComment(data, id))
    }
    return (
        <>
            <div className="divider" />
            <div className="comment-section">
                <div className="comment-input-section">
                    <ProfilePic user={owner} size={40} />
                    <div className="input-container">
                        <div className={classes.comment}>
                            <InputBase
                                placeholder="Write a comment..."
                                className={classes.inputRoot}
                                inputProps={{ 'aria-label': 'search' }}
                                value={comment}
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
                {comments.map(comment => <DisplayComments key={comment.id} comment={comment} />)}

            </div>
        </>
    )
}
const DisplayComments = ({ comment }) => {
    const posted = formatDistanceToNowStrict(new Date(comment.created_at), { addSuffix: true });
    // console.log(parse(comment.created_at,
    //     'MM/DD/YYYY',
    //     new Date()));
    // console.log(comment.created_at);
    // console.log(new Date(comment.created_at));
    // console.log(posted);
    const [likeClicked, setLikeClicked] = useState(false);
    return (
        <div className="comment-display-section">
            <ProfilePic user={comment.owner} size={40} />
            <div className="comment-area">
                <div className="top-comment-side">
                    <div className="left-comment-side">
                        <Fullname user={comment.owner} />
                        <div className="comment-container">
                            <p className="comment">{comment.comment}</p>
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
                <div className="bottom-comment-side">
                    <p className="comment-timestamp">{posted}</p>
                </div>
            </div>

        </div>
    )
}