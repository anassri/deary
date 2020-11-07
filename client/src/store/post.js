import getFromLocalStorage from '../utils/getFromLocalStorage';

const SET_POSTS = 'post/SET_POSTS';

const setPosts = posts => ({
    type: SET_POSTS,
    posts,
});

export const loadPosts = (id) => async dispatch => {
    const { token } = getFromLocalStorage();
    if (!token) return;
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


export const addComment = (data, id) => async (dispatch, getState) => {
    const { token } = getFromLocalStorage();
    if (!token) return;
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
    } catch (e) {
        console.error(e);
        return e;
    }
}
export const editComment = (data, id) => async (dispatch, getState) => {
    const { token } = getFromLocalStorage();
    if (!token) return;
    try {
        const res = await fetch(`/api/comments/${id}/edit`, {
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
export const deleteComment = (id, postId) => async (dispatch, getState) => {
    const { token } = getFromLocalStorage();
    if (!token) return;
    try {
        const res = await fetch(`/api/comments/${id}/delete`, {
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

export default function postReducer(state = { posts: [], comments: [] }, action) {
    switch (action.type) {
        case SET_POSTS:
            return { ...state, posts: action.posts };
         default:
            return state;
    }
}