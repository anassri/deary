import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './Navigation';
import PostCard from './PostCard';
import '../css/home.css';
import { loadPosts } from '../store/post';

export default function Home(){
    const user = useSelector(state => state.auth.user)
    const posts = useSelector(state => state.post.posts)
    const sortedPosts = posts.sort((a, b) => (a.id > b.id ? 1 : -1));
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(loadPosts(user.id));
    }, [])

    return (
        <>
            <Navigation />
            <div className="body-container">
                {sortedPosts.map(post => <PostCard key={post.id} user={user} post={post}/>)}
            </div>
            <h1>Welcome Home!</h1>
        </>
    )
}