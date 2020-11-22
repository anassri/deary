import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadPost } from '../store/user';
import { loadFriends } from '../store/user';
import Friends from './Friends';
import LeftNavigation from './LeftNavigation';
import Navigation from './Navigation';
import PostCard from './PostCard';

export default function Post(){
    const user = useSelector(state => state.auth.user)
    const friends = useSelector(state => state.user.friends)
    const post = useSelector(state => state.user.post)
    const {id} = useParams();

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadPost(id));
        dispatch(loadFriends(user.id))
    }, [])
    
    if (!post) return null;

    return (
        <>
            <Navigation />
            <div className="home-body-container">
                <div className="left-nav-container">
                    <LeftNavigation user={user} />
                </div>
                <div className="body-container">
                    <div className="post-body-container">
                        <PostCard user={user} post={post} />
                    </div>
                </div>
                <div className="right-nav-container">
                    <Friends friends={friends} />
                </div>
            </div>
        </>
    )
}