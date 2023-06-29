import axios from "axios";

const api = axios.create({
    // baseURL: 'http://localhost:3333'
    baseURL: 'https://api-portfolio-v3zq.onrender.com'
})

export { api };