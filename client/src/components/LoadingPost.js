import React from 'react';
import '../css/post.css';
import { Paper, 
    makeStyles,} from '@material-ui/core/';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyle = makeStyles({
    paper:{
        width: 780,
        marginBottom: 20,
    },
    inputRoot: {
        backgroundColor: '#EFEFEF',
        width: 580,
        height: 52,
        borderRadius: 40,
        padding: 20,
    },
    icons:{
        fontSize: 60,
        color: '#33DD87',
    }

})

export default function LoadingPost(){
    const classes = useStyle();
    return (
        <div className={classes.paper}>
            <Paper className="paper-card">
                <div className="header-container">
                    <div className="left-side-container">
                        <div className="photo-container" >
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                        </div>
                        <div className="name-time-container">
                            <Skeleton animation="wave" width="665px" />
                        </div>
                        
                    </div>
                </div>
                <div className="body-container-post">
                    <Skeleton width="100%" height={300} style={{transform: 'scale(1, 1)', margin: '10px 0'}}/>
                </div>
                <div className="footer-container">
                    <div className="button-section">
                        <div className="footer-left-side" style={{display: "flex"}}>
                            <Skeleton width="50px" height={20}/>   
                            
                            <Skeleton width="50px" height={20} style={{marginLeft: 20}}/>   
                        </div>
                    </div>
                </div>
            </Paper>
        </div>
    )

}