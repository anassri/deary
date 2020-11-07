import setInLocalStorage from '../utils/setInLocalStorage';
import getFromLocalStorage from '../utils/getFromLocalStorage';
import deleteFromLocalStorage from '../utils/deleteFromLocalStorage';

const SET_USER = 'auth/SET_USER';
const SET_TOKEN = 'auth/SET_TOKEN';
const REMOVE_AUTH = 'auth/REMOVE_AUTH';

const setUser = user => ({
    type: SET_USER,
    user,
});

const setToken = token => ({
    type: SET_TOKEN,
    token,
});

const removeAuth = () => ({ type: REMOVE_AUTH });

const handleReceivedData = async (res, dispatch) => {
    if (res.ok) {
        const { token, user } = await res.json()
        setInLocalStorage(token, user);
        dispatch(setToken(token));
        dispatch(setUser(user));
        return { status: 200 };
    } else return { status: 400, message: (await res.json()).msg };
}

export const login = (email, password) => async (dispatch, getState) => {
    try{
        // const res = await getState.csrf.fetchWithCSRF('/login', {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getState().csrf.token },
            body: JSON.stringify({ email, password }),   
        });
        handleReceivedData(res, dispatch, getState);
    } catch (e) {
        console.error(e);
        return e;
    }
}

export const loadUser = () => async dispatch => {
    const { user, token } = getFromLocalStorage();
    if (!user || !token) return;

    const res = await fetch('/verify_token', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    // Res status will be 200 if token fresh or >400 if token revoked or expired
    if (res.ok) {
        dispatch(setUser(user));
        dispatch(setToken(token));
    } else {
        deleteFromLocalStorage();
        dispatch(removeAuth());
    }
};

export const logout = () => async (dispatch, getState) => {
    const {
        auth: { token },
    } = getState();

    const res = await fetch('/logout', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
        deleteFromLocalStorage();
        dispatch(removeAuth());
    }
};
export const signup = (firstName, lastName, email, password) => async (dispatch, getState) => {
    try {
        const res = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getState().csrf.token },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });
        // TODO: Refactor
        if (res.ok) {
            const { token, user } = await res.json();
            setInLocalStorage(token, user);
            dispatch(setToken(token));
            dispatch(setUser(user));
            return true;
        }

        if (res.status === 500) throw { status: 500, msg: 'User with that email address already exists' };
        else throw { status: 400, msg: (await res.json()).msg };
    } catch (e) {
        console.error(e);
        return e;
    }
};

export default function authReducer(state = {user:{}}, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.user };
        case SET_TOKEN:
            return { ...state, token: action.token };
        case REMOVE_AUTH:
            return {};
        default:
            return state;
    }
}