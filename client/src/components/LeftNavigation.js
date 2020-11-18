import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useDispatch } from 'react-redux';
import { logout } from '../store/auth';

const useStyles = makeStyles({
    icons: {
        color: '#666',
        textTransform: 'none',
    },
    navbar:{
        width: '100%',    
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
            <div className="left-navigation-desktop">
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
            </div>
        </>
    );
}