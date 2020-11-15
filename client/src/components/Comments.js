import React, {  useEffect, useState } from 'react';
import ProfilePic from './ProfilePic';
import '../css/post.css';
import { formatDistanceToNowStrict } from 'date-fns';
import { addComment, deleteComment, loadPosts, editComment } from '../store/post';
import { useDispatch, useSelector } from 'react-redux';
import { 
    makeStyles, 
    InputBase, 
    InputAdornment, 
    IconButton, 
    MenuItem, 
    Menu, 
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
     } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
import { useConfirm } from 'material-ui-confirm';
import Fullname from './Fullname';
import { createNotification } from '../store/user';

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
    const classes = useStyle()
    const [comments, setComments] = useState([]);
    useEffect(() => {
        setComments([...post.comments]);
    }, [post, post.comments])

    const [comment, setComment] = useState('');
    const dispatch = useDispatch()
    const handleComment = () => {
        const id = owner.id;
        const postId = post.id;
        const data = {
            comment,
            "created_at" : new Date(),
            postId
        }
        const commentObj = {
            comment,
            "created_at" : new Date(),
            owner,
        }
        const notification = {
            "friendId": post.owner.id,
            "typeId": 1,
            "postId": post.id,
            "createdAt": new Date(),
        }
        dispatch(createNotification(notification, id))
        setComment('')
        setComments([...comments, commentObj])
        dispatch(addComment(data, id))
    }
    return (
        <>
            <div className="divider" />
            <div className="comment-section">
                <div className="comment-input-section">
                    <div className="photo-container" style={{ cursor: 'pointer' }}>
                        <ProfilePic user={owner} size={40} />
                    </div>
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
                {comments.slice(0).reverse().map(comment => <DisplayComments key={comment.id} comment={comment} postId={post.id}/>)}

            </div>
        </>
    )
}
const DisplayComments = ({ comment, postId }) => {
    const user = useSelector(state => state.auth.user)
    const [likeClicked, setLikeClicked] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const confirm = useConfirm();
    const dispatch = useDispatch();
    const [postSyncNeeded, setPostSyncNeeded] = useState(false);
    const [open, setOpen] = useState(false);
    const [commentArea, setCommentArea] = useState('')
    const posted = formatDistanceToNowStrict(new Date(comment.created_at), { addSuffix: true });

    useEffect(()=>{
        if(postSyncNeeded){
            dispatch(loadPosts(user.id))
            setPostSyncNeeded(false);
        }
    }, [postSyncNeeded])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = async () => {
        setAnchorEl(null);
        const id = comment.id
        try {
            await confirm({
                title: 'Are you sure?',
                description: 'This action is permanent!',
                confirmationText: 'Delete',
                cancellationText: 'Cancel',
                dialogProps: { maxWidth: 'sm' } });
            await dispatch(deleteComment(id, postId));
            setPostSyncNeeded(true)
        } catch (e) {
            console.error(e);
        }
    };
    const handleEdit = () => {
        setOpen(false);
        dispatch(editComment(commentArea, comment.id))
        setPostSyncNeeded(true)
    };
    return (
        <div className="comment-display-section">
            <div className="photo-container" style={{ cursor: 'pointer' }}>
                <ProfilePic user={comment.owner} size={40} />
            </div>
            <div className="comment-area">
                <div className="top-comment-side">
                    <div className="bg-area">
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
                    <div className="comment-menu-container">
                        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            <MoreVertIcon />
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
                                setCommentArea(comment.comment);}}>Edit</MenuItem>
                            <MenuItem onClick={handleDelete} style={{ color: '#FF0000'}}>Delete</MenuItem>
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
                                    value={commentArea}
                                    onChange={e => setCommentArea(e.target.value)}
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
                <div className="bottom-comment-side">
                    <p className="comment-timestamp">{posted}</p>
                </div>
            </div>

        </div>
    )
}