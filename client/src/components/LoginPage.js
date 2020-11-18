import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {login} from '../store/auth';
import '../css/auth.css'
import Alert from '@material-ui/lab/Alert';

export default function LoginPage () {
    const [email, setEmail] = useState('ammar@gmail.com');
    const [password, setPassword] = useState('password');
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.user.id);
    const serverErrors = useSelector(state => state.auth.errors);

    const history = useHistory();
    useEffect(()=>{
        if(serverErrors!==undefined)
            setErrors([serverErrors]);
    }, [serverErrors])

    if (userId) history.push('/');
    

    const validateForm = () => {
        const intErrors = []
        if (email.length === 0) intErrors.push('Email is required.');
        if (password.length === 0) intErrors.push('Password is required.');
        if (intErrors.length === 0) return true;
        setErrors([...intErrors]);
        return false;
    };

    const handleClick = async (e) =>{
        e.preventDefault();
        const formIsValid = validateForm();
        if (formIsValid) 
            dispatch(login(email, password));
    }
    return (
        <>
        <form onSubmit={handleClick}>
            <div className="errors">
                {errors.length 
                ? <Alert variant="filled" severity='error'>
                        <ul>
                            {errors.map((error, i)=><li key={i}>{error}</li>)}
                        </ul>
                    </Alert>
                : null}
            </div>
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
                <button className="auth-button" type='submit'>Log in</button>
            </div>  
            <div className="login-signup-links-container">
                <p>Need an account? </p><a href="/signup" className="link-text">Sign up</a>
            </div>
        </form>
        </>
    )
} 