import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route,Redirect, NavLink, useHistory } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

import UserList from './components/UsersList';
import { logout } from './store/auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
    // const dispatch = useDispatch();
    // const location = useLocation();
    // useEffect(() => {
    //     dispatch(setLocation(location.pathname));
    // }, [location.pathname])
    const history = useHistory();
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
        <nav>
            <ul>
                <li><NavLink to="/" activeclass="active">Home</NavLink></li>
                <li><NavLink to="/users" activeclass="active">Users</NavLink></li>
                <li><NavLink to="/login" activeclass="active">Login</NavLink></li>
                <li><NavLink to="/signup" activeclass="active">Signup</NavLink></li>
                <li><button onClick={handleLogout} activeclass="active">Logout</button></li>

            </ul>
        </nav>
        <Switch>
            <Route path="/users">
                <UserList />
            </Route>
            <Route path="/login" component={LoginPage}/>
            <Route path="/signup" component={SignupPage}/>

            <Route path="/">
                <h1>My Home Page</h1>
            </Route>
        </Switch>
    </BrowserRouter>
  );
}

export default App;
