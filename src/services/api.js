import axios from "axios";

const api = axios.create({
    baseURL: 'https://shopco-1.vercel.app'
})

export default api
