import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {ProfilePic, Fullname} from './PostCard';
import { loadFriends} from '../store/user';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core/';
const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: 40,
        alignItems: 'center',
        fontSize: 10
    },
    icon: {
        marginLeft: 17,
        marginRight: 17,
    }
}));

export default function Friends({friends}){
    const classes = useStyles();
    return (
        <>
            {friends.map(friend => 
                <Button className={classes.button} >
                    <ProfilePic user={friend} size={30}/>
                    <Fullname user={friend}/>
                </Button>
            )}
        </>
    )
}
