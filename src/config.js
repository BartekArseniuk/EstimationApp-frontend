import axios from 'axios';

function getAuthToken() {
    return localStorage.getItem('AuthToken');
}

const apiService = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
    }
});

export default apiService;