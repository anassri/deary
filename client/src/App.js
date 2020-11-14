import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route,Redirect, useLocation } from 'react-router-dom';
import AuthContainer from './components/AuthContainer';
import Home from './components/Home';
import Search from './components/Search';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ConfirmProvider } from 'material-ui-confirm';
import { logout, loadUser } from './store/auth';
import { restoreCSRF } from './store/csrf';
import Post from './components/Post';
import CircularProgress from '@material-ui/core/CircularProgress';
import './css/home.css';


const PrivateRoute = ({ component: Component, ...rest }) => {
    return <Route {...rest} render={(props) => (
        rest.needLogin
            ? <Redirect to='/login' />
            : <Component {...props} />
    )} />
}

function App() {
    const dispatch = useDispatch();
    const needLogin = useSelector(state => !state.auth.user.id);
    const [loading, setLoading] = useState(true);
    const csrf = useSelector(state => state.csrf.token)
    const handleLogout = () =>{
        dispatch(logout());
    }
    useEffect(()=>{
        dispatch(restoreCSRF());
        dispatch(loadUser());

    }, []);
    useEffect(()=>{
        let timeout;
        if(csrf){
            timeout = setTimeout(()=>{
                setLoading(false);
            }, 500)
        }
        return () => clearTimeout(timeout);
    }, [csrf])
  return (
        <>
          {loading && <div className="loading-screen"><CircularProgress /></div>}
          {!loading &&
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <ConfirmProvider>
                            <CssBaseline />
                            <Switch>
                                <Route path="/login" component={AuthContainer}/>
                                <Route path="/signup" component={AuthContainer}/>
                                <PrivateRoute path="/search/:idq=:value" needLogin={needLogin} component={Search} />
                                <PrivateRoute path="/profile/:id" needLogin={needLogin} component={Profile} />
                                <PrivateRoute path="/notifications/:id" needLogin={needLogin} component={Notifications} />
                                <PrivateRoute path="/post/:id" needLogin={needLogin} component={Post} />
                                <PrivateRoute path="/" needLogin={needLogin} component={Home} />
                            </Switch>
                        </ConfirmProvider>
                    </ThemeProvider>
                </BrowserRouter>
        }   
        </>
    );
}

export default App;
