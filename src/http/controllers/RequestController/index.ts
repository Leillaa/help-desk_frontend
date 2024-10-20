import { $authHost } from "../..";
import { IRequest } from "../../../lib/types/interfaces";

const getAllByUserId
    : (id:number) 
    => any 
    = async (id)   => {
        // http://127.0.0.1:8000
    let form = new FormData()
    form.append('id' , id + '')
    const {data} = await $authHost.get('/api/applications_list/', {
        headers: { 
            'Content-Type': 'text/html',
            'Authorization' : localStorage.getItem('token') },
        method: 'get',
    }); // + id);
    // const {data} = await $authHost.get('/app/applications_list/' ); // + id);
    return data; 
}

const getOneById
    : (id:number) 
    => any 
    = async (id)   => {
    const {data} = await $authHost.get('/api/application_details/' + id + '/');
    return data; 
}

const getCommentsById
    : (id:number) 
    => any 
    = async (id)   => {
    const {data} = await $authHost.get('/api/comment_list/' + id + '/');
    return data; 
}


const createComment
    : (id: number, form:FormData) 
    => any 
    = async (id, form)   => {
    const {data} = await $authHost.post('/api/comment_create/' + id + '/', form);
    return data; 
}

const createOne
    : (form: FormData) 
    => any 
    = async (form)   => {
    const {data} = await $authHost.post('/api/create_application/', form);
    return data; 
}

const closeRequest
    : (id: number)
    => any
    = async (id)   => {
    const {data} = await $authHost.post('/api/status_close/' + id + '/');
    return data;
}

export {
    getAllByUserId,
    getOneById,
    getCommentsById,
    createComment,
    closeRequest,
    createOne
}