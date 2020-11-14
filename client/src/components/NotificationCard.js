import React, { useEffect, useState } from 'react';
import ProfilePic from './ProfilePic';
import Fullname from './Fullname';
import { formatDistanceToNowStrict } from 'date-fns';
import '../css/notification.css';
import { Button, makeStyles } from '@material-ui/core';
import { updateFriend, updateNotification } from '../store/user';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    button: {
        background: "linear-gradient(43deg, rgba(51,221,135,1) 0%, rgba(68,226,141,1) 72%, rgba(100,237,152,1) 87%, rgba(156,255,172,1) 100%)",
        color: "#fff",
        marginLeft: 10,
    }
}));

const NotificationType = ({ type, postId}) => {
    const history = useHistory()
    if (type === 'comment'){
        return <div className="notification-text">
            <p>commented on your <span className="post-link" onClick={() => history.push(`/post/${postId}`)}>post</span></p>
        </div>
    } else if (type === 'like'){
       return  <div className="notification-text">
           <p>liked your <span className="post-link" onClick={() => history.push(`/post/${postId}`)}>post</span></p>
        </div>
    }
    return <div className="notification-text">
        <p>added you as a friend</p>
    </div>
}
const AddNotificationButton = ({ text, disabled, color="secondary", onClick=null, btnClass=null}) => {
    return <div className="add-buttons-container" >
                <Button
                    variant="contained"
                    className={`${btnClass} add-button`}
                    disableElevation
                    color={color}
                    disabled={disabled}
                    onClick={onClick}
                >{text}</Button>
            </div>
}

export default function NotificationCard({notification}) {
    const posted = formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true });
    const [buttonClicked, setButtonClicked] = useState(false);
    const [readStatusClass, setReadStatusClass] = useState("unread-circle");
    const [friendShipStatus, setFriendShipStatus] = useState(0);
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(()=>{
        const data = {
            "status": friendShipStatus,
            "since": new Date,
            "friendId": notification.friendId
        };
        if (buttonClicked){
            dispatch(updateFriend(data, notification.userId));
        };
    }, [buttonClicked]);

    const handleRead = () => {
        const data = {
            "notificationId": notification.id,
            "status": 2
        };
        setReadStatusClass(() => readStatusClass + " hidden" );

        dispatch(updateNotification(data, notification.userId));
    };

    return (
        <>
            <div className="notification-body-container">
                <div className="notification-left-container">
                    <ProfilePic user={notification.friend} />
                </div>
                <div className="notification-middle-container">
                    <div className="notification-text-container">
                        <Fullname user={notification.friend} />
                        <NotificationType type={notification.type.type} postId={notification.postId}/>
                    </div>
                    <div className="time-container">
                        <p className="post-timestamp">{posted}</p>
                    </div>
                </div>
                <div className="notification-right-container">
                    {notification.typeId === 3 && notification.relationship.status === 2
                    ?   <AddNotificationButton 
                            text={"Friend request accepted"}
                            disabled={true}
                            btnClass={null} />

                    : notification.typeId === 3 && !notification.relationship.status
                    ?   <AddNotificationButton 
                            text={"Friend request Denied"}
                            disabled={true}
                            btnClass={null} />
                
                    : notification.typeId === 3 && !buttonClicked
                    ?   <div className="buttons-container" >
                            <AddNotificationButton 
                                text={"Accept"}
                                disabled={false}
                                color="primary"
                                btnClass={classes.button}
                                onClick={()=>{
                                    setFriendShipStatus(2);
                                    setButtonClicked(true);
                                }} />
                            <AddNotificationButton 
                                text={"Decline"}
                                disabled={false}
                                onClick={() => setButtonClicked(true)} />
                        </div>
                        : notification.typeId === 3 && buttonClicked
                        ?   (friendShipStatus === 0 
                            ? <AddNotificationButton 
                                text={"Friend request declined"}
                                disabled={true} 
                                btnClass={null} />
                            : <AddNotificationButton 
                                text={"Friend request accepted"}
                                disabled={true} 
                                btnClass={null} />)
                        : null}
                </div>
                <div className="read-indicator-container">
                    {notification.status === 1
                        ? <div className={readStatusClass} onClick={handleRead} />
                        : null}
                </div>
            </div>
        </>
    )
}