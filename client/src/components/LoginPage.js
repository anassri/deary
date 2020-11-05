import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {loadUser, login} from '../store/auth';
import '../css/auth.css'
import logo from '../images/logo.svg';
export default function LoginPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.user.id);

    const history = useHistory();

    useEffect(()=>{
        dispatch(loadUser());
    },[]);

    if (userId) history.push('/');
    
    const handleClick = () =>{
        const res = dispatch(login(email,password));
        if (res.status === 200) history.push('/');
    }
    return (
        <>
            <div>
                <input 
                type="text" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                label="Email" 
                placeholder="Email"
                className="text-field"/>
            </div>
            <div>
                <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                label="Password"
                placeholder="Password"
                className="text-field" />
            </div>
            <div>
                <button className="auth-button" onClick={handleClick}>Log in</button>
            </div>  
            <div className="login-signup-links-container">
                <p>Need an account? </p><a href="/signup" className="link-text">Sign up</a>
            </div>
        </>
    )
} 