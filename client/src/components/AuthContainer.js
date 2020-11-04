import React from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import '../css/auth.css'
import logo from '../images/logo.svg';
import { useLocation } from 'react-router';

export default function AuthContainer() {
    const location = useLocation()
    console.log(location.pathname)
    return (
        <div className="auth-container">
            <div className="graphics-container">
                <div className="graphics-points-container">

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