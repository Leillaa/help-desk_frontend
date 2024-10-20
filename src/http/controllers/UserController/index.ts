import { jwtDecode } from "jwt-decode";
import { $authHost, $host } from "../..";
import User from "../../../store/user";

const authorization
    : (form: {login: string, password: string}) 
    => any 
    = async (form)   => {
    const {data} = await $host.post('/api/login/', form, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    await localStorage.setItem('token' , data.token)
    return { id: data.user_id}
}

const registration 
    : (form: { 
        username: string, 
        email:string, 
        password: string}) 
    => any 
    = async (form)   => {
    const {data} = await $host.post('/api/register/', form);
    await localStorage.setItem('token' , data.token)
    return { id: data.user_id}
}

const getById 
    : (id:number) 
    => any 
    = async (id)   => {
    const {data} = await $authHost.get('/api/.../' + id);
    return data; 
}

const check : () => any
    = async () => {
    const {data} = await $authHost.post('/api/check/');
    return { id: data.user_id}
    // return jwtDecode(data.token);
} 

export  {
    authorization,
    registration,
    getById,
    check
}