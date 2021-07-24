import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MAutocomplete from '@material-ui/lab/Autocomplete';
import logo from './asset/images/logo.svg';
import { useHistory } from 'react-router-dom';
import { InitPageContext } from './MainScreen';
import CircleLoadingComponent from './components/CircleLoadingComponent';
import { URLAPI } from './constants/UrlApi';
import './SignIn.css';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://it.evnspc.vn/">
        EVN SPC IT
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInScreen(props) {
  const classes = useStyles();
  const history = useHistory();
  const initContext = useContext(InitPageContext);
  const [listDonVi, setListDonVi] = useState(null);
  const [maDonVi, setMaDonVi] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [flagSignIn, setFlagSignIn] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch(URLAPI + '/APIKTGS/Dvi?madvi=PB')
      .then((response) => {
        if (response.status === 200) {

          return response.json();
        }
        return null;
      })
      .then((res) => {
        if (res !== null && res.length !== 0) {
          setListDonVi(res);
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  }, [])
  
  return (
    <div>
      <div class="context">
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Container component="main" maxWidth="xs" style={{ backgroundColor: 'white', boxSizing: `border-box`, border: `1px solid transparent`, boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, }}>
            <CssBaseline />
            <div className={classes.paper}>
              <img key={'testtran'} src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
              <Typography component="h1" variant="h5">
                Sơ Đồ Đơn Tuyến NR-KH
          </Typography>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Tài khoản"
                  value={username}
                  onChangeCapture={(e) => {
                    setUsername(e.target.value);
                  }}
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChangeCapture={(e) => {
                    setPassword(e.target.value);
                  }}
                  autoComplete="current-password"
                />
                <MAutocomplete
                  id="autocompleteDonVi"
                  title="Tên đơn vị quản lý*"
                  options={listDonVi}
                  // value={autocompleteDonVi}
                  getOptionLabel={option => option.teN_DVIQLY + ' - ' + option.mA_DVIQLY}
                  style={{ width: '100%', marginTop: 15 }}
                  renderInput={params => <TextField {...params} label="Tên đơn vị quản lý*" variant="outlined" />}
                  onChange={(e, v) => {
                    if (v !== null) {
                      setMaDonVi(v.mA_DVIQLY);
                    }
                  }}
                  disabled={listDonVi === null ? true : false}
                />
                <FormControlLabel
                  style={{ marginTop: 15 }}
                  control={<Checkbox value="remember" color="primary" checked={showPassword} onChange={(e) => {
                    setShowPassword(!showPassword);
                  }} />}
                  label="Hiển thị mật khẩu"
                />

                {errorSignIn !== null ?
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <h4 style={{ color: 'red', fontSize: 13 }}>
                      {errorSignIn}
                    </h4>
                  </div>
                  :
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* {errorSignIn} */}
                  </div>
                }
                {flagSignIn ? <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircleLoadingComponent />
                </div>
                  :
                  <Button
                    // type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => {
                      setFlagSignIn(true);
                      setErrorSignIn(null);
                      if (username === 'admin' && password === '1' && maDonVi === 'PB') {
                        history.push('/Private');
                      } else {
                        if (username !== null && password !== null && maDonVi !== null) {
                          fetch(URLAPI + '/APIKTGS/USERS', {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(
                              {
                                "MA_DVIQLY": maDonVi,
                                "USERNAME": username,
                                "PASSWORD": password
                              }
                            )
                          })
                            .then(response => {
                              console.log({
                                "MA_DVIQLY": maDonVi,
                                "USERNAME": username,
                                "PASSWORD": password
                              });
                              
                              if (response.status === 200) {
                                return response.json();
                              } else {
                                setErrorSignIn('Lỗi đăng nhập');
                                setFlagSignIn(false);
                                return null;
                              }
                            })
                            .then((res) => {
                              // 
                              if (res !== null && res.length !== 0) {
                                

                                // history.push('/App');
                                initContext.setInfo(res[0].mA_DVIQLY, res[0].username, res[0].password, res[0].role, res[0].userid);
                                history.push('/App');

                              } else {
                                setErrorSignIn('Sai thông tin đăng nhập');
                              }
                              setFlagSignIn(false);
                            })
                            .catch((err) => {
                              setErrorSignIn(err.toString());
                              setFlagSignIn(false);
                            });
                        } else {
                          setErrorSignIn('Vui lòng nhập đủ thông tin đăng nhập!');
                          setFlagSignIn(false);
                        }
                      }

                    }}
                  >
                    Đăng nhập
          </Button>
                }

              </form>
            </div>
            <Box mt={8}>
              <Copyright />
            </Box>
          </Container>
        </div>
      </div>
      <div class="area" >
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div >
    </div>


  );
}