import axios from "axios";

const apiClient = axios.create({
    baseURL: 'https://localhost:7282/api', // Use your .NET API's HTTPS URL
    withCredentials: true, // This is essential for sending cookies
});

export default apiClient;