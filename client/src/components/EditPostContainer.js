import React, { useEffect, useState } from 'react';
import { TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@material-ui/core/';
import CloseIcon from '@material-ui/icons/Close';
import { editPost} from '../store/post';
import { useDispatch } from 'react-redux';
import { loadUserPosts } from '../store/user';
import { loadPosts as friendsPosts } from '../store/post';

export default function EditPostContainer({ post, open, setOpen, userId}){
    const [descriptionArea, setDescriptionArea] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedFriendsIds, setSelectedFriendsIds] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [startDispatch, setStartDispatch] = useState(false);
    const [sync, setSync] = useState(false);
    const dispatch = useDispatch();

    useEffect(()=>{
        setDescriptionArea(post.description);
        if(post.location) setSelectedLocation(post.location.location);
        if(post.taggedFriends) setSelectedFriends([...post.taggedFriends]);
    }, [])

    useEffect(()=>{
        if(startDispatch){
            const data = new FormData();
            if (selectedFriendsIds.length) data.append("tagged_friends", selectedFriendsIds);
            if (selectedLocation) data.append("location", selectedLocation);
            data.append("description", descriptionArea);
            setSync(true);
            setStartDispatch(false);
            dispatch(editPost(data, post.id))
        }
    }, [startDispatch])
    
    useEffect(()=>{
        if(sync){
            setSync(false);
            dispatch(loadUserPosts(userId));
            dispatch(friendsPosts(userId));
        }
    }, [sync])

    const handleEdit = () => {
        setOpen(false);
        selectedFriends.map(friend => setSelectedFriendsIds([...selectedFriendsIds, friend.id]));
        setStartDispatch(true);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth='sm'
                fullWidth
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Edit Post</DialogTitle>
                <DialogContent>
                <div className="tags-container">
                    {selectedFriends.length
                        ? selectedFriends.map((friend, i) => <div key={i} className="friend-text-container">
                            <p className="friend-text">with <span style={{ fontWeight: 'bold' }}>{friend.firstName + " " + friend.lastName} </span></p>
                            <IconButton
                                style={{ color: '#666' }}
                                size="small"
                                className="icon-button"
                                onClick={() => selectedFriends.length === 1
                                    ? setSelectedFriends([])
                                    : setSelectedFriends([...selectedFriends.slice(0, selectedFriends.length - 1)])
                                }>
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                        )
                        : null}
                    {selectedLocation
                        ? <div className="location-text-container">
                            <p className="location-text">in <span style={{ fontWeight: 'bold' }}>{selectedLocation}</span></p>
                            <IconButton
                                style={{ color: '#666' }}
                                size="small"
                                className="icon-button"
                                onClick={() => setSelectedLocation('')}>
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                        : null}

                </div>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    type="text"
                    value={descriptionArea}
                    onChange={e => setDescriptionArea(e.target.value)}
                    width='md'
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
        </>

    )
}