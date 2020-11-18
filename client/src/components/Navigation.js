import React, { useState } from 'react';
import { loadUsers} from '../store/user';
import logo from '../images/logo.svg';
import '../css/navigation.css'
import { makeStyles } from '@material-ui/core/styles';
import { InputBase, Button, InputAdornment, IconButton} from '@material-ui/core/';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import profilePicturePlaceholder from '../images/profile-placeholder.png'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { logout } from '../store/auth';

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        backgroundColor: '#EFEFEF',
        width: '100%',
        height: 52,
        borderRadius: 40,

    },
    button: {
        borderRadius: 40,
    },
    iconButton:{
        height:45,
        width: 45,
        marginRight: 8,
    },
    icon:{
        marginLeft: 17,
        marginRight: 17,
        // fontSize: 60
    }
}));

export default function Navigation(){
    const classes = useStyles();
    const user = JSON.parse(window.localStorage.getItem('auth/USER'));
    const history = useHistory();
    const dispatch = useDispatch()
    const [search, setSearch] = useState('');
    const handleLogout = () => {
        history.push('/login')
        dispatch(logout());
    }
    const handleProfileClick = () => {
        history.push(`/profile/${user.id}`);
        
    }
    const handleLogoClick = () => {
        history.push('/');
    }
    const handleSearchButton = e => {
        dispatch(loadUsers(user.id, search));
        history.push(`/search/${user.id}q=${search}`);
    }
    return(
        <div className="navigation-container">
            <div className="top-part-nav">
                <div className="logo-container">
                    <img src={logo} alt='website logo' height='55' onClick={handleLogoClick} style={{cursor: 'pointer'}}/>
                </div>
                <div className="search-container">
                    <div className={classes.search}>
                        <InputBase
                            placeholder="Search Deary…"
                            className={classes.inputRoot}
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyDown={e => e.keyCode === 13 ? handleSearchButton() : null }
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon className={classes.icon}/>
                                </InputAdornment>
                            }
                            endAdornment={search ?
                                <InputAdornment position="end">
                                    <IconButton
                                        variant="contained"
                                        color="default"
                                        type="file"
                                        className={classes.iconButton}
                                        onClick={handleSearchButton}
                                    >
                                        <SendIcon className={classes.icon}/>
                                    </IconButton>
                                </InputAdornment> : null
                            }
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="profile-link-container">
                    <Button className={classes.button} onClick={handleProfileClick}>
                        <img 
                            src={user.profilePicture ? user.profilePicture : profilePicturePlaceholder}
                            alt="profile placeholder" 
                            className="thumb-profile-picture" 
                            height='36' 
                            width='36' 
                            />
                        <div className="user-profile-name">{user.firstName}</div>
                    </Button>
                </div>
            </div>
            <div className="mobile-nav-bar">
                <div className="nav-icons" 
                    onClick={() => history.push('/')}
                    >
                    <HomeIcon />
                    <p>Home</p>
                </div>
                <div className="nav-icons" 
                    onClick={() => history.push(`/notifications/${user.id}`)}
                    >
                    <NotificationsIcon />
                    <p>Notifications</p>
                </div>
                <div className="nav-icons" 
                    onClick={() => history.push(`/profile/${user.id}`)}
                    >
                    <PersonIcon />
                    <p>Profile</p>
                </div>
                <div className="nav-icons" 
                    onClick={handleLogout}
                    >
                    <ExitToAppIcon />
                    <p>Sign out</p>
                </div>
                
            </div>
        </div>
    )
}