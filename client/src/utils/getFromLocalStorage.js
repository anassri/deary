const TOKEN = 'auth/TOKEN';
const USER = 'auth/USER';

export default function getFromLocalStorage() {
    const user = JSON.parse(window.localStorage.getItem(USER));
    const token = window.localStorage.getItem(TOKEN);
    return { user, token };
}
