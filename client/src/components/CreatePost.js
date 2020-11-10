import React from 'react';
import '../css/create-post.css'
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles({
    icon:{
        color: 'white',
        fontSize: 50,
    }
})
export default function CreatePost(){
    const classes = useStyle();
    return (
        <div className="create-post-container">
            <div className="expand-create-button-container">
                <div className="create-button-icon">
                    <AddIcon className={classes.icon}/>
                </div>
                <div className="create-button-label">
                    <p>Share a moment from your life.</p>
                </div>
            </div>
        </div>

    );
}