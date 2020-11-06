import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route,Redirect, useLocation } from 'react-router-dom';
import AuthContainer from './components/AuthContainer';
import Home from './components/Home';
import Search from './components/Search';
import Profile from './components/Profile';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';

import { logout } from './store/auth';
import { restoreCSRF } from './store/csrf';

const PrivateRoute = ({ component: Component, ...rest }) => {
    // const dispatch = useDispatch();
    // const location = useLocation();
    // useEffect(() => {
    //     dispatch(setLocation(location.pathname));
    // }, [location.pathname])
    return <Route {...rest} render={(props) => (
        rest.needLogin === true
            ? <Redirect to='/login' />
            : <Component {...props} />
    )} />
}

function App() {
    const dispatch = useDispatch();
    const needLogin = useSelector(state => !state.auth.user.id);
    const handleLogout = () =>{
        dispatch(logout());
    }
    useEffect(()=>{
        dispatch(restoreCSRF());
    }, [])
  return (
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Switch>
                <Route path="/login" component={AuthContainer}/>
                <Route path="/signup" component={AuthContainer}/>
                <PrivateRoute path="/search/:idq=:value" needLogin={needLogin} component={Search} />
                <PrivateRoute path="/profile/:id" needLogin={needLogin} component={Profile} />
                <PrivateRoute path="/" needLogin={needLogin} component={Home} />
            </Switch>
        </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
