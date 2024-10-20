import React, { createContext, useContext, useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
// import Index from './pages/Index';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './routers/AppRouter/AppRouter';
import Header from './components/Header';
import { styleVars } from './lib/constants/styles';
import { UserContext } from '.';
import * as UserController from './http/controllers/UserController'
import { ExecException } from 'child_process';
import { Spinner } from 'react-bootstrap';




function App() {
  const customTheme = styleVars;
  const user = useContext(UserContext)

  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(()=>{
      UserController.check().then( (data :any) => {
        user!.setIsAuth(true)
      }).finally(()=> setIsLoading(false))
        .catch((e : ExecException)=>{
          user!.setIsAuth(false)
        })
  }, [])

  if (isLoading) {
    return <Spinner animation={'grow'} />
  }

  return (
    <div >
      {/* <Header customTheme={customTheme}/> */}
      <RouterProvider router={AppRouter()}/>
    </div>
  );
}

export default App;
