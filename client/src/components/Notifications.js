import React, {useEffect} from 'react';
import Navigation from './Navigation';
import LeftNavigation from './LeftNavigation';
import Friends from './Friends';
import { useDispatch, useSelector } from 'react-redux';
import { loadFriends, loadNotifications } from '../store/user';
import { makeStyles, Paper } from '@material-ui/core';
import '../css/notification.css';
import NotificationCard from './NotificationCard';

const useStyle = makeStyles({
    paper: {
        width: 780,
        marginTop: 20,
        marginRight: 40
    },
    inputRoot: {
        backgroundColor: '#EFEFEF',
        width: 580,
        height: 52,
        borderRadius: 40,
        padding: 20,
    },
    icons: {
        fontSize: 60,
        color: '#33DD87',
    }

})

export default function Notifications(){
    const user = useSelector(state => state.auth.user);
    const friends = useSelector(state => state.user.friends);
    const notifications = useSelector(state => state.user.notifications);
    const sortedPosts = notifications.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    const classes = useStyle();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadFriends(user.id))
        dispatch(loadNotifications(user.id))
    }, [])

    return (
        <>
            <Navigation />
            <div className="home-body-container">
                <div className="left-nav-container">
                    <LeftNavigation user={user} />
                </div>
                <div className="body-container">
                    <Paper className={classes.paper}>
                        {sortedPosts.map(notification => 
                        <NotificationCard key={notification.id} notification={notification}
                        />)}
                    </Paper>
                </div>
                <div className="right-nav-container">
                    <Friends friends={friends} />
                </div>
            </div>
        </>
    );
}