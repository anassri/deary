import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {loadUser, login} from '../store/auth';
export default function LoginPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const history = useHistory();

    useEffect(()=>{
        dispatch(loadUser());
    },[]);
    console.log(user);
    if (user) history.push('/');
    
    const handleClick = async () =>{
        const res = await dispatch(login(email,password));
        if (res.status === 200) history.push('/');
    }
    return (
        <>
            <input 
                type="text" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                label="Email" 
                placeholder="Email"/>
            <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                label="Password"
                placeholder="Password" />
            <button onClick={handleClick}>Login</button>

        </>
    )
} 