const TOKEN = 'auth/TOKEN';
const USER = 'auth/USER';

export default function deleteFromLocalStorage() {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
}
