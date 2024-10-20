// import axios from 'axios'
import axios, { AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

axios.defaults.baseURL = process.env.BASE_API_URL;

// для запросов без авторизации
const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})



// Для авторизованных запросов с headerauthorisation с токенами
const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
    
})

// ??????????????????????????????? Проверить входные параметры
const authInterceptor = async (config : InternalAxiosRequestConfig<AxiosRequestHeaders> ) => {
    config.headers.authorization = localStorage.getItem('token')
    // config.headers.authorization = `Bearer ${localStorage.getItem(process.env.TOKEN_NAME || '')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}
