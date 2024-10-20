import { useContext } from "react";
import user from "../../store/user";
import { UserContext } from "../..";

export class UserService {
    private _user = useContext(UserContext)

    constructor () {
    }
    
    
    public async login (params:any) {
        let dataUser = { username: "Петров Петр Иванович", email: 'ttt@yandex.ru', id: 1} // отправка сообщений на сервер

        this._user!.login(dataUser.username, dataUser.email, dataUser.id)
    } 
}