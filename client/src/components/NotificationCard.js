import React from 'react';
import ProfilePic from './ProfilePic';
import Fullname from './Fullname';
import { formatDistanceToNowStrict } from 'date-fns';
import '../css/notification.css';
import { Button, makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    button: {
        background: "linear-gradient(43deg, rgba(51,221,135,1) 0%, rgba(68,226,141,1) 72%, rgba(100,237,152,1) 87%, rgba(156,255,172,1) 100%)",
        color: "#fff",
    }
}));

const NotificationType = ({type}) => {
    if (type === 'comment'){
        return <div className="notification-text">
            <p>commented on your <span style={{fontWeight: 'bold'}}>post</span></p>
        </div>
    } else if (type === 'like'){
       return  <div className="notification-text">
            <p>liked your <span style={{ fontWeight: 'bold' }}>post</span></p>
        </div>
    }
    return <div className="notification-text">
        <p>added you as a friend</p>
    </div>
}

export default function NotificationCard({notification}) {
    const posted = formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true });
    const classes = useStyles();

    return (
        <>
            <div className="notification-body-container">
                <div className="read-indicator-container">
                    {notification.status === 1
                    ? <div className="unread-circle" />
                    : null}
                </div>
                <div className="notification-left-container">
                    <ProfilePic user={notification.friend} />
                </div>
                <div className="notification-middle-container">
                    <div className="notification-text-container">
                        <Fullname user={notification.friend} />
                        <NotificationType type={notification.type.type} />
                    </div>
                    <div className="time-container">
                        <p className="post-timestamp">{posted}</p>
                    </div>
                </div>
                <div className="notification-right-container">
                    {notification.typeId === 3
                    ?   <>
                            <Button
                                variant="contained"
                                className={`${classes.button} add-button`}
                                disableElevation
                            >Accept</Button>
                            <Button
                                variant="contained"
                                color='secondary'
                                className={`add-button`}
                                disableElevation
                            >Decline</Button>
                        </>
                    : null}
                </div>
            </div>
        </>
    )
}