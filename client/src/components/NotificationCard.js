import React, { useState } from 'react';
import ProfilePic from './ProfilePic';
import Fullname from './Fullname';
import { formatDistanceToNowStrict } from 'date-fns';
import '../css/notification.css';
import { Button, makeStyles } from '@material-ui/core';
import { updateNotification } from '../store/user';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import FriendAcceptBtns from './FriendAcceptBtns';

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
    const [readStatusClass, setReadStatusClass] = useState("unread-circle");
    // const [friendShipStatus, setFriendShipStatus] = useState(0);
    const {id} = useParams();
    
    const dispatch = useDispatch();
 
    const handleRead = () => {
        const data = {
            "notificationId": notification.id,
            "status": 2
        };
        setReadStatusClass(() => readStatusClass + " hidden" );

        dispatch(updateNotification(data, notification.userId));
    };
    let status = null;
    let actionUser = null;
    const userId = parseInt(id);
    if (notification.relationship) {
        status = notification.relationship.status;
        actionUser = notification.relationship.action_user_id;
    }
    

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
                    {notification.typeId === 3 && actionUser === userId && status === 2
                    ?   <AddNotificationButton 
                            text={"Friend request accepted"}
                            disabled={true}
                            btnClass={null} />

                    : notification.typeId === 3 && actionUser === userId && status === 3
                    ?   <AddNotificationButton 
                            text={"Friend request Declined"}
                            disabled={true}
                            btnClass={null} />
                
                    : notification.typeId === 3 && status === 1 
                    ? <FriendAcceptBtns userId={notification.userId } friendId={notification.friendId} />
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