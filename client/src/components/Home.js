import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './Navigation';
import PostCard from './PostCard';
import '../css/home.css';
import { loadPosts } from '../store/post';
import { loadFriends } from '../store/user';
import { Button } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import CirclesIcon from '../images/circles.svg';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/styles';
import Friends from './Friends';
import CreatePost from './CreatePost';
import { useHistory } from 'react-router-dom';
const useStyles = makeStyles({
    icons: {
        color: '#666',
    }
})
export default function Home(){
    const user = useSelector(state => state.auth.user)
    const posts = useSelector(state => state.post.posts)
    const friends = useSelector(state => state.user.friends)
    const sortedPosts = posts.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    console.log(sortedPosts)
    console.log(posts)
    const classes = useStyles();
    const dispatch = useDispatch()
    const history = useHistory();
    useEffect(()=>{
        dispatch(loadPosts(user.id));
        dispatch(loadFriends(user.id))
    }, [])

    // if (!user && !posts) return null;
    return (
        <>
            <Navigation />
            <div className="home-body-container">
                <div className="left-nav-container">
                    <Button className={classes.icons}
                        size="large"
                        startIcon={<HomeIcon />}
                        onClick={()=> history.push('/')}
                        >
                            Home</Button>
                    {/* <Button className={classes.icons}
                        size="large"
                        startIcon={<img
                            src={CirclesIcon}
                            alt="circles icon"
                            height="15"
                            className="nav-icon"
                        />}>
                            Circles</Button>
                    <Button className={classes.icons}
                        size="large"
                        startIcon={<ChatIcon />}>
                            Messages</Button>
                    <Button className={classes.icons}
                        size="large"
                        startIcon={<NotificationsIcon />}>
                            Notifications</Button>
                    <Button className={classes.icons}
                        size="large"
                        startIcon={<BookmarkIcon />}>
                            Bookmarks</Button> */}
                    <Button className={classes.icons}
                        size="large"
                        startIcon={<PersonIcon />}
                        onClick={()=> history.push(`/profile/${user.id}`)}
                        >
                            Profile</Button>
                </div>
                <div className="body-container">
                    <div className="posts-body-container">
                    <CreatePost />
                        {sortedPosts.map(post => <PostCard key={post.id} user={user} post={post}/>)}
                    </div>
                </div>
                <div className="right-nav-container">
                    <div className="friends-container-title">
                        Friends
                    </div>
                    <Friends friends={friends}/>
                </div>
            </div>
        </>
    )
}