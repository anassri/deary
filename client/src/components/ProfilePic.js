import React from 'react';
import { useHistory } from 'react-router';
import profilePicturePlaceholder from '../images/profile-placeholder.png'

export default function ProfilePic({ user, size = 60 }) {
    const history = useHistory()

    return (
        <>
            {user.profilePicture
                ? <img
                    src={user.profilePicture}
                    alt="profile placeholder"
                    className="thumbnail-image"
                    height={size}
                    width={size}
                    onClick={() => history.push(`/profile/${user.id}`)}
                />
                : <img
                    src={profilePicturePlaceholder}
                    alt="profile placeholder"
                    className="thumbnail-image"
                    height={size}
                    width={size}
                    onClick={() => history.push(`/profile/${user.id}`)}
                />}
        </>
    )
}