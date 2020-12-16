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
import '../css/footer.css'

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
        <div className="left-navigatoin-container">
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
            <div className="about-me-container">
                <h3 className="about-me-title"> About the developer</h3>
                <p className="about-me">
                    My name is Ammar Nassri, and I’m a full-stack developer, UI/UX designer, and animator. Currently living in Atlanta, GA. I love turning problems into impeccable user experience with valuable content.
                </p>
                <div className="links-container">
                    <a href="https://ammarnassri.com/" target="_blank" rel="noreferrer" className="social-link"><i className="social-media fas fa-link"></i></a>
                    <a href="https://github.com/anassri" target="_blank" rel="noreferrer" className="social-link"><i className="social-media fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/in/anassri/" target="_blank" rel="noreferrer" className="social-link"> <i className="social-media fab fa-linkedin-in"></i></a>
                    <a href="https://angel.co/u/ammar-nassri" target="_blank" rel="noreferrer" className="social-link"> <i className="social-media fab fa-angellist"></i></a>
                </div>
            </div>
        </div>
    );
}