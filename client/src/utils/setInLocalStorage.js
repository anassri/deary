const TOKEN = 'auth/TOKEN';
const USER = 'auth/USER';

export default function setInLocalStorage(token, user) {
    window.localStorage.setItem(TOKEN, token);
    window.localStorage.setItem(USER, JSON.stringify(user));
}
