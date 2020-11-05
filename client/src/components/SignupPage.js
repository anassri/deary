import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, signup } from '../store/auth';
export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [errors, setErrors] = useState('');

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const history = useHistory();

    useEffect(() => {
        dispatch(loadUser());
    }, []);

    if (user) history.push('/');

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
            {errors ? <p>{errors}</p> : null}
            <input
                type="text"
                value={fullname}
                onChange={e => setFullname(e.target.value)}
                label="fullname"
                placeholder="Full Name" />
            <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                label="Email"
                placeholder="Email" />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                label="Password"
                placeholder="Password" />
            <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                placeholder="Confirm Password" />
            <button onClick={handleClick}>Signup</button>

        </>
    )
} 