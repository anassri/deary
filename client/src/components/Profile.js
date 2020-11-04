import React from 'react';
import { useSelector } from 'react-redux';
import '../css/profile.css'
import coverPicture from '../images/cover-placeholder.jpg'
import profilePicture from '../images/profile-placeholder.png'

export default function Profile(){
    const user = useSelector(state => state.auth.user);

    return (
        <div className="profile-container">
            <div className="top-picture-section-container">
                <div className="cover-picture-container">
                    <img
                        src={coverPicture}
                        alt="cover placeholder"
                        className="cover-picture"
                        height="350"
                        width="940"
                    />
                </div>
                <div className="profile-picture-container">
                    <img
                        src={profilePicture}
                        alt="profile placeholder"
                        className="profile-picture"
                        height="175"
                        width="175"
                    />
                </div>
            </div>
            <div className="basic-info-container">
                <div className="name-header">
                    <h1>{user.firstName+' '+user.lastName}</h1>
                </div>

            </div>
        </div>
    )
}