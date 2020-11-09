import React, { useEffect } from 'react';
import {ProfilePic, Fullname} from './PostCard';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core/';
import '../css/friends.css';

const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: 40,
        fontSize: 10,
        textTransform: 'none',
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
                    <div className="button-content-container">
                        <div className="profile-picture-friends">
                            <ProfilePic user={friend} size={30}/>
                        </div>
                        <div className="fullname friends">
                            <Fullname user={friend}/>
                        </div>
                    </div>
                </Button>
            )}
        </>
    )
}
