import React from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import '../css/auth.css'
import logo from '../images/logo.svg';
import { useLocation } from 'react-router';
import SearchIcon from '@material-ui/icons/Search';
import GroupIcon from '@material-ui/icons/Group';
import ChatIcon from '@material-ui/icons/Chat';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(()=>({
    iconButton: {
        height: 45,
            width: 45,
                marginRight: 8,
    },
    icon: {
        marginRight: 15,
        fontSize: 35,
    }
}))
export default function AuthContainer() {
    const location = useLocation();
    const classes = useStyle();
    return (
        <div className="auth-container">
            <div className="graphics-container">
                <div className="graphics-points-container">
                    <div className="bullet-point">
                        <SearchIcon className={classes.icon}/>
                        <h3>Find people you’ve lost touch with.</h3>
                    </div>
                    <div className="bullet-point">
                        <GroupIcon className={classes.icon}/>
                        <h3>Hear what your friends are up to.</h3>
                    </div>
                    <div className="bullet-point">
                        <ChatIcon className={classes.icon}/>
                        <h3>Start conversations.</h3>
                    </div>
                </div>
            </div>
            <div className="form-area-container">
                <div className="top-container">
                    <div className="logo-container">
                        <img src={logo} alt='website logo' height='109' />
                    </div>
                    <div className="slogan-container">
                        <h2>Keep in touch with the
                            people you care about</h2>
                    </div>
                </div>
                <div className="form-container">
                    {location.pathname==="/login" 
                        ? <LoginPage />
                        : <SignupPage />}
                    
                </div>
            </div>
        </div>
    )
} 