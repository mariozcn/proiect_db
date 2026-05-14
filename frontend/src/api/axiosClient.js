import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8081/api/hospital',
});

export default axiosClient;