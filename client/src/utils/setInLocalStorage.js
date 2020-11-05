const TOKEN = 'auth/TOKEN';
const USER = 'auth/USER';

export default function setInLocalStorage(token, user) {
    if(token) window.localStorage.setItem(TOKEN, token);
    window.localStorage.setItem(USER, JSON.stringify(user));
}
