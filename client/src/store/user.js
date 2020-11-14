import getFromLocalStorage from '../utils/getFromLocalStorage';
import setInLocalStorage from '../utils/setInLocalStorage';

const SET_NOTIFICATIONS = 'user/SET_NOTIFICATIONS';
const SET_FRIENDS = 'user/SET_FRIENDS';
const SET_POSTS = 'user/SET_POSTS';
const SET_USERS = 'user/SET_USERS';
const SET_USER = 'user/SET_USER';
const SET_RELATIONSHIPS = 'user/SET_RELATIONSHIPS';

const setNotifications = notifications => ({
    type: SET_NOTIFICATIONS,
    notifications,
});
const setFriends = friends => ({
    type: SET_FRIENDS,
    friends,
});
const setPosts = posts => ({
    type: SET_POSTS,
    posts,
});
const setUsers = users => ({
    type: SET_USERS,
    users,
});
const setUser = user => ({
    type: SET_USER,
    user,
});
const setRelationships = relationships => ({
    type: SET_RELATIONSHIPS,
    relationships,
});
const getToken = () => {
    const { token } = getFromLocalStorage();
    if (!token) return;
    return token;
}
export const loadNotifications = (id) => async dispatch => {
    const token = getToken();
    try {
        const res = await fetch(`/api/users/${id}/notifications`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if(res.ok){
            const {data} = await res.json();
            dispatch(setNotifications(data));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const loadFriends = (id) => async dispatch => {
    const token = getToken();
    try {
        const res = await fetch(`/api/friends/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if(res.ok){
            const {data} = await res.json();
            dispatch(setFriends(data));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const loadPosts = (id) => async dispatch => {
    const token = getToken();
    try {
        const res = await fetch(`/api/users/${id}/profile`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if(res.ok){
            const {data} = await res.json();
            dispatch(setPosts(data));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const loadUsers = (id, value) => async dispatch => {
    const token = getToken();

    try {
        const res = await fetch(`/api/users/${id}q=${value}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if(res.ok){
            const {data, friends} = await res.json();
            dispatch(setUsers(data));
            dispatch(setRelationships(friends));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const loadUser = (id) => async dispatch => {
    const token = getToken();
    try {
        const res = await fetch(`/api/users/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if(res.ok){
            const {data} = await res.json();
            dispatch(setUser(data));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const addFriend = (id, userId) => async (dispatch, getState) => {
    const token = getToken();
    console.log(id, userId);
    try {
        const res = await fetch(`/api/users/${id}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                        Authorization: `Bearer ${token}`,
                        'X-CSRFToken': getState().csrf.token },
            body: JSON.stringify(userId)
        });
        if (res.ok) {
            const { friends } = await res.json();
            dispatch(setRelationships(friends));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}

export const editUser = (data, id) => async (dispatch, getState) => {
    const token = getToken();
    try {
        console.log(data)
        const res = await fetch(`/api/users/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                        Authorization: `Bearer ${token}`, 
                        'X-CSRFToken': getState().csrf.token },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            const data = await res.json();
            console.log(data)
            dispatch(setUser(data));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}
const updateUser = async (path, data, dispatch, getState) =>{
    const token = getToken();
    try {
        console.log(data)
        const res = await fetch(path, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 
            'X-CSRFToken': getState().csrf.token },
            body: data
        });
        if (res.ok) {
            const data = await res.json();
            dispatch(setUser(data));
            setInLocalStorage(token, data);
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const editCover = (data, id) => async (dispatch, getState) => {
    updateUser(`/api/users/${id}/cover`, data, dispatch, getState);
}
export const editPhoto = (data, id) => async (dispatch, getState) => {
    updateUser(`/api/users/${id}/photo`, data, dispatch, getState);
}

export default function userReducer(state = { user: {}, relationships: [], posts: [], friends: [], notifications: []}, action) {
    switch (action.type) {
        case SET_NOTIFICATIONS:
            return { ...state, notifications: action.notifications };
        case SET_FRIENDS:
            return { ...state, friends: action.friends };
        case SET_POSTS:
            return { ...state, posts: action.posts };
        case SET_USERS:
            return { ...state, users: action.users };
        case SET_USER:
            return { ...state, ...action.user };
        case SET_RELATIONSHIPS:
            return { ...state, relationships: action.relationships };
        default:
            return state;
    }
}