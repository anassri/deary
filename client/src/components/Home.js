import React from 'react';
import { useSelector } from 'react-redux';
import Navigation from './Navigation';
import PostCard from './PostCard';
import '../css/home.css'
export default function Home(){
    const user = useSelector(state => state.auth.user)

    return (
        <>
            <Navigation />
            <div className="body-container">
                <PostCard user={user}/>
            </div>
            <h1>Welcome Home!</h1>
        </>
    )
}