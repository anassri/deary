import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, signup } from '../store/auth';
import '../css/auth.css'

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [errors, setErrors] = useState('');

    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.user.id);

    const history = useHistory();

    useEffect(() => {
        dispatch(loadUser());
    },[]);

    if (userId) history.push('/');

    const handleClick = async () => {
        const name = fullname.split(' ')
        if (!name[1]) return setErrors('Please enter your full name.')
        const firstName = name[0];
        const lastName = name.splice(1).join(' ');
        const res = await dispatch(signup(firstName, lastName, email, password));
        if (res.status === 200) history.push('/');
    }
    return (
        <>  
            <div>
                {errors ? <p>{errors}</p> : null}
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
                <button  className="auth-button" onClick={handleClick}>Sign up</button>
            </div>
            <div className="login-signup-links-container">
                <p>Already have an account? </p><a href="/login" className="link-text"> Log in</a>
            </div>

        </>
    )
} 