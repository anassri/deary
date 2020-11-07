const SET_CSRF = 'csrf/SET_CSRF';

const setCsrf = csrf => ({
    type: SET_CSRF,
    csrf,
});


export const restoreCSRF = () => async dispatch => {
    const response = await fetch('/api/csrf/restore', {
        method: 'GET',
        credentials: 'include'
    });
    if (response.ok) {
        const authData = await response.json();
        dispatch(setCsrf(authData.csrf_token));
    }
}

export default function csrfReducer(state = {  }, action) {
    switch (action.type) {
        case SET_CSRF:
            return { ...state, token: action.csrf };
        default:
            return state;
    }
}