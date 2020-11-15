import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import CirclesIcon from '../images/circles.svg';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useDispatch } from 'react-redux';
import { logout } from '../store/auth';

const useStyles = makeStyles({
    icons: {
        color: '#666',
        textTransform: 'none',
    }
})

export default function LeftNavigation({user}) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const handleLogout = () => {
        history.push('/login')
        dispatch(logout());
    }
    return (
        <>
            <Button className={classes.icons}
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => history.push('/')}
            >
                Home</Button>
            <Button className={classes.icons}
                size="large"
                startIcon={<NotificationsIcon />}
                onClick={() => history.push(`/notifications/${user.id}`)}>
                Notifications</Button>
            {/* <Button className={classes.icons}
                        size="large"
                        startIcon={<img
                            src={CirclesIcon}
                            alt="circles icon"
                            height="15"
                            className="nav-icon"
                        />}>
                            Circles</Button>
                    <Button className={classes.icons}
                        size="large"
                        startIcon={<ChatIcon />}>
                            Messages</Button>
                    <Button className={classes.icons}
                        size="large"
                        startIcon={<BookmarkIcon />}>
                            Bookmarks</Button> */}
            <Button className={classes.icons}
                size="large"
                startIcon={<PersonIcon />}
                onClick={() => history.push(`/profile/${user.id}`)}
            >
                Profile</Button>
            <Button className={classes.icons}
                size="large"
                startIcon={<ExitToAppIcon />}
                onClick={handleLogout}
            >
                Sign out</Button>
        </>
    );
}