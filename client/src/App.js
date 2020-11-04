import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route,Redirect, NavLink } from 'react-router-dom';
import AuthContainer from './components/AuthContainer';
import Home from './components/Home';
import Navigation from './components/Navigation';
import Profile from './components/Profile';

import { logout } from './store/auth';

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
  return (
    <BrowserRouter>
        <Navigation />
        <Switch>
            <Route path="/login" component={AuthContainer}/>
            <Route path="/signup" component={AuthContainer}/>
            <PrivateRoute path="/profile/:id" needLogin={needLogin} component={Profile} />
            <PrivateRoute path="/" needLogin={needLogin} component={Home} />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
