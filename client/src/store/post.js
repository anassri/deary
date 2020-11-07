import getFromLocalStorage from '../utils/getFromLocalStorage';

const SET_POSTS = 'post/SET_POSTS';
const SET_COMMENTS = 'post/SET_COMMENTS';

const setPosts = posts => ({
    type: SET_POSTS,
    posts,
});
const setComments = comments => ({
    type: SET_COMMENTS,
    comments,
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
export const loadComments = (id) => async dispatch => {
    const { token } = getFromLocalStorage();
    if (!token) return;
    try {
        const res = await fetch(`/api/comments/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const { data } = await res.json();
            dispatch(setComments(data));
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
        if (res.ok) {
            const { data } = await res.json();
            dispatch(setComments(data));
        }
    } catch (e) {
        console.error(e);
        return e;
    }
}

export default function postReducer(state = { posts: [], comments: [] }, action) {
    switch (action.type) {
        case SET_POSTS:
            return { ...state, posts: action.posts };
        case SET_COMMENTS:
            return { ...state, comments: action.comments };
         default:
            return state;
    }
}