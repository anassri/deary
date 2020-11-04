import React from 'react';
import logo from '../images/logo.svg';
import '../css/navigation.css'
import { makeStyles } from '@material-ui/core/styles';
import { InputBase, Button, InputAdornment} from '@material-ui/core/';
import SearchIcon from '@material-ui/icons/Search';
import profilePicture from '../images/profile-placeholder.png'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
const useStyles = makeStyles((theme) => ({
    inputRoot: {
        backgroundColor: '#EFEFEF',
        width: 840,
        height: 52,
        borderRadius: 40,

    },
    button: {
        borderRadius: 40,
    },
    icon:{
        paddingLeft: 17,
    }
}));

export default function Navigation(){
    const classes = useStyles();
    const user = useSelector(state => state.auth.user);
    const history = useHistory();

    const handleProfileClick = () => {
        history.push(`/profile/${user.id}`);
    }
    const handleLogoClick = () => {
        history.push('/');
    }
    return(
        <div className="navigation-container">
            <div className="logo-container">
                <img src={logo} alt='website logo' height='55' onClick={handleLogoClick} style={{cursor: 'pointer'}}/>
            </div>
            <div className="search-container">
                <div className={classes.search}>
                    <InputBase
                        placeholder="Search Deary…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon className={classes.icon}/>
                            </InputAdornment>
                        }
                    />
                </div>
            </div>
            <div className="profile-link-container">
                <Button className={classes.button} onClick={handleProfileClick}>
                    <img 
                        src={profilePicture} 
                        alt="profile placeholder" 
                        className="thumb-profile-picture" 
                        height='36' 
                        style={{paddingRight: 10}}
                        />
                    {user.firstName}
                </Button>
            </div>
        </div>
    )
}