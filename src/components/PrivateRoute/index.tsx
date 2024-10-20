import { Navigate, Outlet, useOutlet } from "react-router-dom";
import { observer } from 'mobx-react-lite'

import Error404 from "../../pages/Error404";
import { useContext } from "react";
import { UserContext } from "../..";


const PrivateRoute = observer(({...props}:any) => {
    const {
        customTheme,
        roles
    } = props
    const user = useContext(UserContext)

    
    if (user!.getIsAuthProcess) {
        return <div>Checking auth...</div>;
    }
    let isAccess :boolean = false
    for (let i in roles) {

        if (roles[i] == user!.getRole) {
            isAccess = true
            break
        }
    };

    if (! isAccess) return <Error404 customTheme={customTheme} />

    if (user!.getIsAuth) {
        return <Outlet context = {[props]} />
    } else {
        return <Navigate to="/" />;
    }
})

export default PrivateRoute