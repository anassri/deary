import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './Navigation';
import PostCard from './PostCard';
import '../css/home.css';
import { loadPosts } from '../store/post';
import { loadFriends } from '../store/user';
import { makeStyles } from '@material-ui/styles';
import Friends from './Friends';
import CreatePost from './CreatePost';
import LeftNavigation from './LeftNavigation';

export default function Home(){
    const user = useSelector(state => state.auth.user)
    const posts = useSelector(state => state.post.posts)
    const friends = useSelector(state => state.user.friends)
    const sortedPosts = posts.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
   
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(loadPosts(user.id));
        dispatch(loadFriends(user.id))
    }, [])

    return (
        <>
            <Navigation />
            <div className="home-body-container">
                <div className="left-nav-container">
                    <LeftNavigation user={user}/>
                </div>
                <div className="body-container">
                    <div className="posts-body-container">
                    <CreatePost />
                        {sortedPosts.map((post, i) => <PostCard key={i} user={user} post={post}/>)}
                    </div>
                </div>
                <div className="right-nav-container">
                    <Friends friends={friends} />
                </div>
            </div>
        </>
    )
}