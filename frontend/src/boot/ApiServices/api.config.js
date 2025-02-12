import axios from 'axios';

// const url = 'http://localhost:3000/';
const url = 'http://47.236.145.45/';
const api = axios.create({
    baseURL: `${url}api/` 
});

api.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token');
        console.log('token:', token);
        try {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.error('Error parsing token:', e);
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.clear();
                    alert('Sesión expirada o invalida. Por favor, inicie sesión nuevamente.');
                    window.location.replace('/#/login');
                    break;
                default:
                    alert(`Error: ${error.response.statusText}`);
            }
        }
        return Promise.reject(error);
    }
);

export { api, url };