import getFromLocalStorage from '../utils/getFromLocalStorage';

const SET_USERS = 'user/SET_USERS';
const SET_USER = 'user/SET_USER';
const SET_RELATIONSHIPS = 'user/SET_RELATIONSHIPS';

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

export const loadUsers = (id, value) => async dispatch => {
    const { token } = getFromLocalStorage();
    if (!token) return;

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
    const { token } = getFromLocalStorage();
    if (!token) return;
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
export const addFriend = (id, userId) => async dispatch => {
    const { token } = getFromLocalStorage();
    if (!token) return;
    console.log(id, userId);
    try {
        const res = await fetch(`/api/users/${id}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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

export const editUser = (data, id) => async dispatch => {
    const { token } = getFromLocalStorage();
    if (!token) return;
    try {
        console.log(data)
        const res = await fetch(`/api/users/${id}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: data
        });
        if (res.ok) {
            const { data } = await res.json();
            dispatch(setUser(data));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}

export default function authReducer(state = { user: {}, relationships: []}, action) {
    switch (action.type) {
        case SET_USERS:
            return { ...state, users: action.users };
        case SET_USER:
            return { ...state, user: action.user };
        case SET_RELATIONSHIPS:
            return { ...state, relationships: action.relationships };
        default:
            return state;
    }
}