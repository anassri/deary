import getFromLocalStorage from '../utils/getFromLocalStorage';

const SET_POSTS = 'post/SET_POSTS';

const setPosts = posts => ({
    type: SET_POSTS,
    posts,
});
const getToken = () => {
    const { token } = getFromLocalStorage();
    if (!token) return;
    return token;
}
export const loadPosts = (id) => async dispatch => {
    const token = getToken();
    try {
        const res = await fetch(`/api/posts/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const { data } = await res.json();
            dispatch(setPosts(data));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const createPost = (data) => async (dispatch, getState) => {
    const token = getToken();
    try {
        await fetch("/api/posts/", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRFToken': getState().csrf.token
            },
            body: data
        });
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const editPost = (data, id) => async (dispatch, getState) => {
    const token = getToken();
    try {
        await fetch(`/api/posts/${id}/edit`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRFToken': getState().csrf.token
            },
            body: data
        });
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const deletePost = (id) => async (dispatch) => {
    const token = getToken();
    try {
        await fetch(`/api/posts/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return e;
    }
}

export const addComment = (data, id) => async (dispatch, getState) => {
    const token = getToken();
    try {
        const res = await fetch(`/api/comments/${id}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRFToken': getState().csrf.token
            },
            body: JSON.stringify(data)
        });
        if(res.ok){
            const data = res.json();
            return data;
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}

export const addLike = (data, id) => async (dispatch, getState) => {
    const token = getToken();
    try {
        await fetch(`/api/likes/${id}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRFToken': getState().csrf.token
            },
            body: JSON.stringify(data)
        });
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const deleteLike = (data, id) => async (dispatch, getState) => {
    const token = getToken();
    try {
        await fetch(`/api/likes/${id}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRFToken': getState().csrf.token
            },
            body: JSON.stringify(data)
        });
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const editComment = (data, id) => async (dispatch, getState) => {
    const token = getToken();
    try {
        await fetch(`/api/comments/${id}/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRFToken': getState().csrf.token
            },
            body: JSON.stringify(data)
        });
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const deleteComment = (id) => async (dispatch, getState) => {
    const token = getToken();
    try {
        await fetch(`/api/comments/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRFToken': getState().csrf.token
            }
        });
    } catch (e) {
        console.error(e);
        return e;
    }
}

export default function postReducer(state = { posts: []}, action) {
    switch (action.type) {
        case SET_POSTS:
            return { ...state, posts: action.posts };
         default:
            return state;
    }
}