import axios from "axios";

const api = axios.create({
    // baseURL: 'http://localhost:3333'r
    baseURL: 'http://192.168.1.100:3333'
})

export { api };