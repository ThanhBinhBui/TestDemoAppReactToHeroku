import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ImageLoading from './asset/loading.svg';
import { InitPageContext } from './MainScreen';
import { URLAPI, URLAPI4001 } from './constants/UrlApi';
import jwtDecode from 'jwt-decode';
import jwt from 'jsonwebtoken';

export default function LoginScreen(props) {
  const initContext = useContext(InitPageContext);
  const history = useHistory();
  const handleUrlParam = (v) => {
    let tmp = [];
    for (let i = 0; i < v.length; i++) {
      if (v[i] === '=' || v[i] === '&') {
        tmp.push(i);
      }
    }
    return {
      maDonVi: v.slice(tmp[0] + 1, tmp[1]),
      username: v.slice(tmp[2] + 1, tmp[3]),
      password: v.slice(tmp[4] + 1, v.length)
    }
  }

  const handleUrlToken = (v) => {
    let tmp = [];
    for (let i = 0; i < v.length; i++) {
      if (v[i] === '=' || v[i] === '&') {
        tmp.push(i);
      }
    }
    return v.slice(tmp[0] + 1, tmp[1]);
  }

  useEffect(() => {
    try {
      const queryString = window.location.search;
      const token = handleUrlToken(queryString);
      const userToken = jwtDecode(token);
      const secretKey = "oeRaYY7Wo24sDqKSX3IM9ASGmdGPmkTd9jo1QTy4b7P9Ze5_9hKolVX8xNrQDcNRfVEdTZNOuOyqEGhXEbdJI-ZQ19k_o9MI0y3eZN2lp9jow55FfXMiINEdt1XR85VipRLSOkT6kSpzs2x-jbLDiz9iFVzkd81YKxMgPA7VfZeQUm4n-mOmnWMaVX30zGFU4L3oPBctYKkl4dYfqYWqRNfrgPJVi5DGFjywgxx0ASEiJHtV72paI3fDR2XwlSkyhhmY-ICjCRmsJN4fX1pdoL8a18-aQrvyu4j0Os6dVPYIoPvvY0SAZtWYKHfM15g7A3HD4cVREf9cUsprCRK93wF";
      const verifyToken = jwt.verify(token, secretKey);
      debugger;
      if (verifyToken.aud === 'SPC.NRKH') {
      // if (verifyToken.aud === 'EVB.BI') {
        fetch(URLAPI4001 + '/Api/SangTaiChuyenLuoi/loginByNSID?id='+verifyToken.employid)
          .then(response => {
            if (response.status === 200) {
              return response.json();
            }
            return null;
          })
          .then((res) => {
            debugger;
            if (res !== null && res.length !== 0) {

              // history.push('/App');
              initContext.setInfo(res[0].mA_DVIQLY, res[0].username, res[0].password, res[0].role, res[0].userid);
              history.push('/App');

            } else {
              alert('Error param in url');
            }
          })
          .catch((error) => {
            alert("Error: " + error.toString());
            //console.log('Error param in url');
          });
      }

    } catch (err) {
      console.log(err);
    }

    // initContext.setInfo(parameter.maDonVi, parameter.username, parameter.password);
    // fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits').then(response=>console.log(response)); 

  }, [])

  return (
    <div style={{ display: 'flex', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F2F3' }}>
      <img src={ImageLoading} />
    </div>
  );
}

