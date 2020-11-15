import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, signup } from '../store/auth';
import '../css/auth.css'
import Alert from '@material-ui/lab/Alert';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [errors, setErrors] = useState('');

    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.user.id);
    const serverErrors = useSelector(state => state.auth.errors);

    const history = useHistory();

    useEffect(() => {
        if (serverErrors !== undefined)
            setErrors([serverErrors]);
    }, [serverErrors])

    useEffect(() => {
        dispatch(loadUser());
    },[]);

    if (userId) history.push('/');

    const validateForm = () => {
        const intErrors = []
        const name = fullname.split(' ')
        if (!name[1]) intErrors.push('Please enter your full name.')
        if (email.length === 0) intErrors.push('Email is required.');
        if (password.length === 0) intErrors.push('Password is required.');
        if (confirmPassword.length === 0) intErrors.push('Confirm password is required.');
        if (intErrors.length === 0) return true;
        setErrors([...intErrors]);
        return false;
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const formIsValid = validateForm();
        if (formIsValid) {
            const name = fullname.split(' ')
            const firstName = name[0];
            const lastName = name.splice(1).join(' ');
           dispatch(signup(firstName, lastName, email, password));
        }
    }
    return (
        <form onSubmit={handleClick}>  
            <div className="errors">
                {errors.length
                    ? <Alert variant="filled" severity='error'>
                        <ul>
                            {errors.map((error, i) => <li key={i}>{error}</li>)}
                        </ul>
                    </Alert>
                    : null}
            </div>
            <div>
                <input
                    type="text"
                    value={fullname}
                    onChange={e => setFullname(e.target.value)}
                    label="fullname"
                    className="text-field"
                    placeholder="Full Name" />
            </div>
            <div>
                <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    label="Email"
                    className="text-field"
                    placeholder="Email" />
            </div>
            <div>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    label="Password"
                    className="text-field"
                    placeholder="Password" />
            </div>
            <div>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    label="Confirm Password"
                    className="text-field"
                    placeholder="Confirm Password" />
            </div>
            <div>
                <button  className="auth-button" onSubmit={handleClick}>Sign up</button>
            </div>
            <div className="login-signup-links-container">
                <p>Already have an account? </p><a href="/login" className="link-text"> Log in</a>
            </div>

        </form >
    )
} 