import React, { useState, useRef, useEffect, useContext } from 'react';

import { BrowserRouter as Router, Switch, Route, Link, HashRouter } from 'react-router-dom';
import App from './App';
import CustomerLostPowerScreen from './CustomerLostPowerScreen';
import Login from './LoginScreen';
import MainMultiTramScreen from './MainMultilTramScreen';
import SearchKhachHangScreen from './SearchKhachHangScreen';
import SignInScreen from './SignInScreen';
// import AppManyTramScreen from './AppManyTramScreen';

export const InitPageContext = React.createContext();


export default function MainScreen() {
  const [maDonVi, setMaDonVi] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const functionInfo = (m, u, p, r, i) => {
    setMaDonVi(m);
    setUsername(u);
    setPassword(p);
    setRole(r);
    setUserId(i);
  }
  return (
    <div style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <InitPageContext.Provider value={{ maDonVi: maDonVi, username: username, password: password, role: role, userId: userId, setInfo: functionInfo }} >
        <Router>
          <Switch>
            <Route path="/Login">
              <Login />
            </Route>
            <Route path="/App">
              <App />
            </Route>
            <Route path="/Multi">
              <MainMultiTramScreen />
            </Route>
            <Route path="/Search">
              <SearchKhachHangScreen />
            </Route>
            <Route path="/CustomerLostPower">
              <CustomerLostPowerScreen/>
            </Route>
            <Route path="/">
              <SignInScreen />
            </Route>
            {/* <Route path="/AppManyTram">
              <AppManyTramScreen />
            </Route> */}
          </Switch>
        </Router>
      </InitPageContext.Provider>
    </div>
  );
}

