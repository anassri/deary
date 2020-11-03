import React from 'react';


function User(props) {
    return (
        <>
            <strong>Name:</strong> {props.user.firstName} {props.user.lastName}<br />
            <strong>Email:</strong> {props.user.email}<br />
            <hr />
        </>
    );
}
export default User;