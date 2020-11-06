let fetchWithCSRF = null

async function restoreCSRF() {
    const response = await fetch('/api/csrf/restore', {
        method: 'GET',
        credentials: 'include'
    });
    if (response.ok) {
        const authData = await response.json();
        fetchWithCSRF = () => {
            return (resource, init) => {
                if (init.headers) {
                    init.headers['X-CSRFToken'] = authData.csrf_token;
                } else {
                    init.headers = {
                        'X-CSRFToken': authData.csrf_token
                    }
                }
                return fetch(resource, init);
            }
        };
    }
}

restoreCSRF();

export default fetchWithCSRF;