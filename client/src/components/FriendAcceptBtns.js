import React, { useEffect, useState } from 'react';
import '../css/search.css';
import { Button } from '@material-ui/core/';
import { useDispatch } from 'react-redux';
import { updateFriend } from '../store/user';

export default function FriendAcceptBtns({userId, friendId}){
    const [buttonClicked, setButtonClicked] = useState(false);
    const [friendShipStatus, setFriendShipStatus] = useState(0);
    const dispatch = useDispatch()
    useEffect(() => {
        const data = {
            "status": friendShipStatus,
            "since": new Date (),
            "friendId": friendId,
            "actionUserId": userId,
        };
        if (buttonClicked) {
            dispatch(updateFriend(data, userId));
        };
    }, [buttonClicked]);
    return (
        <>
            { buttonClicked
            ?   (friendShipStatus === 3 
                    ? <Button
                        variant="contained"
                        className={`add-button`}
                        disabled
                        >Friend request declined</Button> 
                    : <Button
                        variant="contained"
                        className={`add-button`}
                        disabled
                        >Friend request accepted</Button>)
            :   <div className="buttons-container" >
                    <Button
                        variant="contained"
                        className={`add-button`}
                        color="primary"
                        disableElevation
                        onClick={() => {
                            setFriendShipStatus(2);
                            setButtonClicked(true);
                        }}
                    >Accept</Button>
                    <Button
                        variant="contained"
                        className={`add-button`}
                        color='secondary'
                        disableElevation
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                            setFriendShipStatus(3);
                            setButtonClicked(true);
                        }} >
                    Decline</Button>
                </div>
            }
        </>
    )
}