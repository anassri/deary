import React from 'react';
import '../css/post.css';
import { useHistory } from 'react-router';


export default function Fullname({ user }) {
    const firstname = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
    const lastname = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)
    const history = useHistory()

    return (
        // <div className="name-container">
        <p className="fullname"
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/profile/${user.id}`)}>
            {firstname + " " + lastname} </p>
        // </div>
    )
}