import React, { useState, useRef, useEffect, useContext } from 'react';
import logo from './asset/images/logo.svg';
import './App.css';
import { Container, Row, Col, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import MAutocomplete from '@material-ui/lab/Autocomplete';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import listLocation21PC from './data/DanhSachToaDo21PC';
import Map from './components/MapComponent';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
// import SimpleTooltip from './components/SimpleTooltips';
//import dataDonVi from './data/DanhSachDonVi';
import ChangLocationByTypingComponent from './components/ChangLocationByTypingComponent';
import ViewInfoKhachHangComponent from './components/ViewInfoKhachHangComponent';
import ViewInfoTruComponent from './components/ViewInfoTruComponent';
import ViewInfoLineComponent from './components/ViewInfoLineComponent';
import { InitPageContext } from './MainScreen';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import Download from './components/exportExcelFileComponent';
import { GiReturnArrow } from 'react-icons/gi';
import { FaFileExcel, FaCloudDownloadAlt } from 'react-icons/fa';
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiOutlineFall, AiFillAmazonCircle } from 'react-icons/ai';
import ThongKeTrangThaiTramCC from './components/ExportExcelComponents/ThongKeTrangThaiTramCC';
import ThongKeKhachHangSaiMaTram from './components/ExportExcelComponents/ThongKeKhachHangSaiMaTram';
import ThongKeTrangThaiKhachHangTheoToaDo from './components/ExportExcelComponents/ThongKeTrangThaiKhachHangTheoToaDo';
import ThongKeTrangThaiToaDo from './components/ExportExcelComponents/ThongKeTrangThaiToaDo';
import ThongKeDanhSachTramTheoToaDo from './components/ExportExcelComponents/ThongKeDanhSachTramTheoToaDo';
import ThongKeTCCByCTYAndTCTComponent from './components/ModalComponent/ThongKeTCCByCTYAndTCTComponent';
import Toggle from 'react-toggle';
// import XLSX from 'xlsx';
import ImportExcelComponent from './components/ImportExcelComponents/ImportExcelComponent';
import { Redirect, useHistory } from 'react-router-dom';
import ThongKeTrangThaiTramCCByUnit from './components/ExportExcelComponents/ThongKeTrangThaiTramCCByUnit';
import ThongKeTaoDoTramComponent from './components/ModalComponent/ThongKeToaDoTramComponent';
import { ContextualMenu } from 'office-ui-fabric-react';
import AddRoleDrawerComponent from './components/ModalComponent/AddRoleDrawerComponent';
import CircleLoadingComponent from './components/CircleLoadingComponent';

import DanhSachKhachHang from './data/DanhSachKhachHang';
import DongBoToaDoKHFromGCSComponent from './components/MapComponents/DongBoToaDoKHFromGCSComponent';
import { URLAPI, URLAPI4001 } from './constants/UrlApi';
import BackUpTram from './components/ExportExcelComponents/BackUpTram';
import ThongKeTinhHinhVeTheoNgayComponent from './components/ModalComponent/ThongKeTinhHinhVeTheoNgayComponent';
import { FormControl } from '@material-ui/core';
import { DateTimePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import ListKhachHangNoLocation from './components/ExportExcelComponents/ListKhachHangNoLocation';
import RemoveLockTramComponent from './components/ModalComponent/RemoveLockTramComponent';

export const ListKhachHangContext = React.createContext();
export const ListTruContext = React.createContext();
export const ListLineContext = React.createContext();
export const OptionEffectObjectContext = React.createContext();
export const ObjectSelectedContext = React.createContext();
export const LoadingContext = React.createContext();
export const ListKhachHangNoLineContext = React.createContext();

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    // width:'100%',
    // height:'100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


function App() {

  const history = useHistory();
  const initContext = useContext(InitPageContext);
  const [tram, setTram] = useState(null);
  const [listKhachHang, setListKhachHang] = useState(null);
  const [listTru, setListTru] = useState(null);
  const [listLine, setListLine] = useState(null);
  const [listTram, setListTram] = useState(null);
  const [listDonVi, setListDonVi] = useState(null);
  const [listKhachHangNoLine, setListKhachHangNoLine] = useState(null);
  const [listKhachHangHasLine, setListKhachHangHasLine] = useState(null);
  const [listKhachHangCanhBao, setListKhachHangCanhBao] = useState(null);
  const [listKhachHangCanhBaoByDonVi, setListKhachHangCanhBaoByDonVi] = useState(null);
  const [optionEffectObject, setOptionEffectObject] = useState(null);
  const [objectSelected, setObjectSelected] = useState({ type: "", object: null });
  const [showModalLoading, setShowModalLoading] = useState(false);
  const [flagAutoCompleteTram, setFlagAutoCompleteTram] = useState(true);
  const [flagAutoCompleteSearch, setFlagAutoCompleteSearch] = useState(true);
  const [openDanhSachCanhBaoModal, setOpenDanhSachCanhBaoModal] = useState(false);
  const [openDanhSachCanhBaoByDonViModal, setOpenDanhSachCanhBaoByDonViModal] = useState(false);
  const [openDanhSachNotLoactionModal, setOpenDanhSachNotLoactionModal] = useState(false);
  const [pointCenter, setPointCenter] = useState({
    lat: 10.31256645,
    lng: 105.74921263
  });
  const [autocompleteDonVi, setAutocompleteDonVi] = useState(null);
  const [autocompleteTram, setAutocompleteTram] = useState(null);
  const [autocompleteTenKH, setAutocompleteTenKH] = useState(null);
  const [autocompleteDiaChi, setAutocompleteDiaChi] = useState(null);
  const [locationSearchBox, setLocationSearchBox] = useState(null);
  const [resultLocationSearchBox, setResultLocationSearchBox] = useState(null);
  const [resultLocationTypingBox, setResultLocationTypingBox] = useState(null);
  const [defaultPointCenter, setDefaultPointCenter] = useState(null);
  const [maDonViSelected, setMaDonViSelected] = useState(null);
  const [maTramSelected, setMaTramSelected] = useState(null);
  const [tenTramSelected, setTenTramSelected] = useState(null);
  const [khachHangKhongCoDuLieu, setKhachHangKhongCoDuLieu] = useState(null);
  const [textSearchKhachHangKhongCoDuLieu, setTextSearchKhachHangKhongCoDuLieu] = useState(null);
  const [locationDirectionCurrent, setLocationDirectionCurrent] = useState(null);
  const [statusTram, setStatusTram] = useState(null);
  const [showLeftNavigator, setShowLeftNavigator] = useState(true);
  const [openBieu1Modal, setOpenBieu1Modal] = useState(false);
  const [openBieu2Modal, setOpenBieu2Modal] = useState(false);
  const [openBieu3Modal, setOpenBieu3Modal] = useState(false);
  const [openBieu4Modal, setOpenBieu4Modal] = useState(false);
  const [openBieu5Modal, setOpenBieu5Modal] = useState(false);
  const [openBieu6Modal, setOpenBieu6Modal] = useState(false);
  const [openBieu7Modal, setOpenBieu7Modal] = useState(false);
  const [openBieu8Modal, setOpenBieu8Modal] = useState(false);
  const [dataBieu1Modal, setDataBieu1Modal] = useState(null);
  const [dataBieu2Modal, setDataBieu2Modal] = useState(null);
  const [dataBieu3Modal, setDataBieu3Modal] = useState(null);
  const [dataBieu4Modal, setDataBieu4Modal] = useState(null);
  const [dataBieu5Modal, setDataBieu5Modal] = useState(null);
  const [dataBieu6Modal, setDataBieu6Modal] = useState(null);
  const [dataBieu8Modal, setDataBieu8Modal] = useState(null);
  // const [dataBieu7Modal, setDataBieu7Modal] = useState(null);
  const [addTruTH, setAddTruTH] = useState(false);
  const [addTruHTVuong, setAddTruHTVuong] = useState(false);
  const [addTruHTTron, setAddTruHTTron] = useState(false);
  const [typeTruAdd, setTypeTruAdd] = useState(null);
  const [addTuDien, setAddTuDien] = useState(false);
  const [openDanhSachKhachHangMoiModal, setOpenDanhSachKhachHangMoiModal] = useState(false);
  const [listKhachHangMoi, setListKhachHangMoi] = useState(null);

  const [showCanhBao, setShowCanhBao] = useState(false);
  const [showCanhBaoByDonVi, setShowCanhBaoByDonVi] = useState(false);
  const [showCanhBaoKhachHangMoi, setShowCanhBaoKhachHangMoi] = useState(false);
  const [showCanhBaoKhachHangKhongToaDo, setShowCanhBaoKhachHangKhongToaDo] = useState(false);

  const [sizeTruTrungThe, setSizeTruTrungThe] = useState(2);
  const [sizeTruHaThe, setSizeTruHaThe] = useState(2);
  const [sizeTram, setSizeTram] = useState(2);
  const [sizeKhachHang, setSizeKhachHang] = useState(2);
  const [sizeLine, setSizeLine] = useState(2);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [flagOnlyView, setFlagOnlyView] = useState(false);
  const [sizeTramAll, setSizeTramAll] = useState(2);
  const [showLabelTramAll, setShowLabelTramAll] = useState('An');
  const [openAddRoleModal, setOpenAddRoleModal] = useState(false);
  const [openRemoveLockTram, setOpenRemoveLockTram] = useState(false);
  const [openBackupModal, setOpenBackupModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [tramChangeManyObject, setTramChangeManyObject] = useState(null);
  const functionSetCurrentLocation = (v) => setCurrentLocation(v);
  const [flagShowLableKH, setFlagShowLableKH] = useState(false);
  const [fromDateBieu8, setFromDateBieu8] = useState(new Date());
  const [toDateBieu8, setToDateBieu8] = useState(new Date());
  const [statusTramBieu8, setStatusTramBieu8] = useState("0");
  const [searchMaKhachHang, setSearchMaKhachHang] = useState(null);
  const [searchObjectKhachHang, setSearchObjectKhachHang] = useState(null);
  const classes = useStyles();

  const functionSetLocationDirectionCurrent = v => {
    setLocationDirectionCurrent(v);
  }
  // const make_cols = refstr => {
  //   let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
  //   for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
  //   return o;
  // };

  const PrettoSlider = withStyles({
    root: {
      color: '#52af77',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);


  const clearToggleCanhBao = () => {
    setShowCanhBao(false);
    setShowCanhBaoByDonVi(false);
    setShowCanhBaoKhachHangMoi(false);
    setShowCanhBaoKhachHangKhongToaDo(false);
    setOpenDanhSachNotLoactionModal(false);
    setOpenDanhSachKhachHangMoiModal(false);
    setOpenDanhSachCanhBaoModal(false);
    setOpenDanhSachCanhBaoByDonViModal(false);
  }

  const clearToggle = () => {
    setAddTruTH(false);
    setAddTruHTVuong(false);
    setAddTruHTTron(false);
    setAddTuDien(false);
  }

  const reloadLine = (maDonVi, maTram) => {
    fetch(URLAPI + '/APIKTGS/Drawing/getLine?madvi=' + maDonVi + '&ma_tram=' + maTram)
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        setListLine(responseJson);
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      })
  }
  const reloadPage = (maDonVi, maTram) => {
    if (maDonVi !== null && maTram !== null) {
      setShowModalLoading(true);
      fetch(URLAPI + '/APIKTGS/KHANG?madvi=' + maDonVi + '&ma_tram=' + maTram)
        .then((response) => {

          return response.json();
        })
        .then((responseJson) => {
          setListKhachHang(responseJson);
          setShowModalLoading(false);
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        });

      fetch(URLAPI + '/APIKTGS/Drawing/getPoint?madvi=' + maDonVi + '&ma_tram=' + maTram)
        .then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          setListTru(responseJson);
          if (responseJson !== null) {
            let listTmp = [];
            responseJson.map((item) => {
              if (item.dS_DIEMDO !== null) {
                listTmp = [...listTmp, ...item.dS_DIEMDO];
              }
            });
            setListKhachHangHasLine(listTmp);
          }

          //return responseJson.movies;
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        })
      fetch(URLAPI + '/APIKTGS/Drawing/getLine?madvi=' + maDonVi + '&ma_tram=' + maTram)
        .then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          setListLine(responseJson);
          //return responseJson.movies;
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        })
    }
  }

  const functionSetListKhachHangNoLine = (v) => {
    setListKhachHangNoLine(v);
  }

  const functionSetTram = (v) => {
    setTram(v);
  }
  const functionSetOptionEffectObject = (v) => {
    setOptionEffectObject(v);
  }
  const functionSetObjectSelected = (v) => {
    setObjectSelected(v);
  }
  const functionSetPointCenter = (obj) => {
    setPointCenter(obj);
  }
  const functionSetResultLocationTypingBox = (v) => {
    setResultLocationTypingBox(v);
  }
  const functionSetResultLocationSearchBox = (v) => {
    setResultLocationSearchBox(v);
  }
  const functionSetListTru = (v) => {
    setListTru(v);
  }
  const functionSetListKhachhang = (v) => {
    setListKhachHang(v);
  }
  const functionSetListLine = (v) => {
    setListLine(v);
  }
  const functionSetListKhachHangHasLine = (v) => {
    setListKhachHangHasLine(v);
  }
  const getLocationByMaDonVi = () => {
    if (autocompleteDonVi.mA_DVIQLY.length === 6) {
      for (let j = 0; j < listLocation21PC.length; j++) {
        if (listLocation21PC[j].maDonVi === autocompleteDonVi.mA_DVIQLY.slice(0, 4)) {
          setPointCenter({ lat: Number(listLocation21PC[j].lat), lng: Number(listLocation21PC[j].lng) });
          setDefaultPointCenter({ lat: Number(listLocation21PC[j].lat), lng: Number(listLocation21PC[j].lng) });

          break;
        }

      }
    } else if (autocompleteDonVi.mA_DVIQLY.length === 4) {
      for (let j = 0; j < listLocation21PC.length; j++) {
        if (listLocation21PC[j].maDonVi === autocompleteDonVi.mA_DVIQLY) {
          setPointCenter({ lat: Number(listLocation21PC[j].lat), lng: Number(listLocation21PC[j].lng) });
          setDefaultPointCenter({ lat: Number(listLocation21PC[j].lat), lng: Number(listLocation21PC[j].lng) });
          break;
        }
      }
    } else {
      setPointCenter({ lat: 10.7936152, lng: 106.6317284 });
      setDefaultPointCenter({ lat: 10.7936152, lng: 106.6317284 });
    }
  }
  const getAmountListKhachNotLocation = () => {
    let result = 0;
    listKhachHang.map(item => {
      if (item.toA_DO === null) {
        result++;
      } else if ((item.toA_DO.longitude === "0" && item.toA_DO.latitude === "0") || (item.toA_DO.longitude === "" && item.toA_DO.latitude === "")) {
        result++;
      }
    });

    return result;

  }
  const functionSetShowModalLoading = (v) => {
    setShowModalLoading(v);
  }

  const getData = (maDonVi, maTram) => {
    fetch(URLAPI + '/APIKTGS/KHANG?madvi=' + maDonVi + '&ma_tram=' + maTram)
      .then((response) => {

        return response.json();
      })
      .then((responseJson) => {

        fetch(URLAPI + '/APIKTGS/KHANG/checkKHANG?madvi=' + maDonVi + '&ma_tram=' + maTram)
          .then((response) => {

            return response.json();
          })
          .then((responseJson1) => {
            if (responseJson1.length !== 0) {
              setListKhachHangCanhBao(responseJson1);
              setOpenDanhSachCanhBaoModal(true);
            } else {
              if (responseJson !== null) {
                let tmp = 0;

                responseJson.map((kh, i) => {
                  if (kh.toA_DO === null) {
                    tmp++;

                  } else if (kh.toA_DO.longitude === null && kh.toA_DO.latitude === null) {
                    tmp++;
                  } else if (kh.toA_DO.latitude === null) {
                    tmp++;
                  } else if (kh.toA_DO.longitude === null) {
                    tmp++;
                  } else if (kh.toA_DO.longitude === "0" && kh.toA_DO.latitude === "0") {
                    tmp++;
                  } else if (kh.toA_DO.latitude === "0") {
                    tmp++;
                  } else if (kh.toA_DO.longitude === "0") {
                    tmp++;
                  } else if (kh.toA_DO.longitude === "" && kh.toA_DO.latitude === "") {
                    tmp++;
                  } else if (kh.toA_DO.latitude === "") {
                    tmp++;
                  } else if (kh.toA_DO.longitude === "") {
                    tmp++;
                  }
                  if (tmp !== 0) {
                    setOpenDanhSachNotLoactionModal(true);
                    setKhachHangKhongCoDuLieu(true);
                  }
                })
              }
            }
            //return responseJson.movies;                
          })
          .catch((error) => {
            console.error(error);
            alert(error);
          });
        setListKhachHang(responseJson);
        // setListKhachHang(DanhSachKhachHang);
        setShowModalLoading(false);
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });

    fetch(URLAPI + '/APIKTGS/Drawing/getPoint?madvi=' + maDonVi + '&ma_tram=' + maTram)
      .then((response) => {

        return response.json();
      })
      .then((responseJson) => {
        setListTru(responseJson);
        if (responseJson !== null) {
          let listTmp = [];
          responseJson.map((item) => {
            if (item.dS_DIEMDO !== null) {
              listTmp = [...listTmp, ...item.dS_DIEMDO];
            }
          });

          setListKhachHangHasLine(listTmp);
        }

        //return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      })
    fetch(URLAPI + '/APIKTGS/Drawing/getLine?madvi=' + maDonVi + '&ma_tram=' + maTram)
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        setListLine(null);
        setListLine(responseJson);

        //return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      })
  }
  const linkSelectTram = (v) => {
    if (listTram !== null) {
      let tmpListTram = listTram.filter(i => i.mA_TRAM === v);
      setTram(tmpListTram[0]);
      getData(tmpListTram[0].mA_DVIQLY, tmpListTram[0].mA_TRAM);
      if (tmpListTram[0].toado === null || tmpListTram[0].toado.longitude === '' || tmpListTram[0].toado.latitude === '' || tmpListTram[0].toado.longitude === '' || tmpListTram[0].toado.latitude === '') {
        fetch(URLAPI + '/APIKTGS/TRAM/GETTOADOTRAM?MADVI=' + v.mA_DVIQLY + '&MATRAM=' + v.mA_TRAM)
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              setTram(null);
            }
            return null;
          })
          .then((res) => {
            if (res !== null) {
              setTram({
                "mA_DVIQLY": tmpListTram[0].mA_DVIQLY,
                "mA_TRAM": tmpListTram[0].mA_TRAM,
                "teN_TRAM": tmpListTram[0].teN_TRAM,
                "toado": {
                  "longitude": res.longitude,
                  "latitude": res.latitude
                }
              })
            }
          })
          .catch((error) => {
            console.error(error);
            alert(error);
          });
      } else {
        setPointCenter({ lng: Number(tmpListTram[0].toado.longitude), lat: Number(tmpListTram[0].toado.latitude) });
        setDefaultPointCenter({ lng: Number(tmpListTram[0].toado.longitude), lat: Number(tmpListTram[0].toado.latitude) });
      }
    }
  }
  //let maDonVi = null;
  useEffect(() => {
    setShowModalLoading(true);
    let maDonVi = initContext.maDonVi;

    fetch(URLAPI + '/APIKTGS/Dvi?madvi=' + maDonVi)
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        setListDonVi(responseJson);
        setShowModalLoading(false);
        if (maDonVi !== null) {
          if (maDonVi.length === 2) {
            setAutocompleteDonVi(responseJson[0]);
            setFlagOnlyView(true);
          } else if (maDonVi.length === 4) {
            setFlagOnlyView(true)
            setAutocompleteDonVi(responseJson[0]);
          } else if (maDonVi.length === 6) {
            fetch(URLAPI + '/APIKTGS/Tram?madvi=' + maDonVi)
              .then((response) => {
                setFlagAutoCompleteTram(false);
                return response.json();
              })
              .then((responseJson) => {
                setListTram(responseJson);
                setShowModalLoading(false);
                setFlagAutoCompleteTram(false);
              })
              .catch((error) => {
                console.error(error);
                alert(error);
              });
            setAutocompleteDonVi(responseJson[0]);
            fetch(URLAPI + '/APIKTGS/KHANG/checkKHANG?madvi=' + maDonVi)
              .then(response => {
                if (response.status === 200) {
                  return response.json();
                }
                return null;
              })
              .then(res => {
                if (res !== null && res.length !== 0) {
                  setListKhachHangCanhBaoByDonVi(res);
                  setOpenDanhSachCanhBaoByDonViModal(true);
                }
              })
          }
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
    setMaDonViSelected(maDonVi);
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    if (month === 1) {
      month += 1;
    }
    fetch(URLAPI + '/APIKTGS/KHANG/getKhangMoi?MADVI=' + maDonVi + '&TUNGAY=01/' + month + '/' + year + '&DENNGAY=01/01/' + (year + 1))
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((res) => {

        if (res !== null && res.length !== 0) {
          setOpenDanhSachKhachHangMoiModal(true);
          setListKhachHangMoi(res);
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  }, [])
  console.log('App');
  console.log(listKhachHang);
  if (initContext.maDonVi === null && initContext.username === null) {
    history.replace('/');
    return <Redirect to='/' />
  } else {
    return (
      <Container fluid={true} style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Row style={{ height: '100vh', width: '100vh', backgroundColor: 'blue' }} style={{ marginLeft: 0, marginRight: 0 }}>
          {/* {showLeftNavigator ? */}
          {/* <> */}
          <Col xs="12" sm="12" md="5" lg="4" xl="3" style={{
            padding: 0, margin: 0, boxShadow: 'rgba(0, 0, 0, 0.3) 3px 10px 16px'
          }}>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
              <div style={{ display: 'flex', width: '100%', height: 100, flexDirection: 'row', backgroundColor: "#485DF9" }}>
                {/* <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TiThMenu size={32} color="black" onClick={() => setShowNavBar(false)} />
                  </div> */}
                <div style={{ display: 'flex', flex: 5, justifyContent: 'center', alignItems: 'center' }}>
                  <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'yellow', margin: 'auto' }}>S?? ????? ????n tuy???n NR -KH</h2>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
                </div>
              </div>
              {/* <Download/> */}
              {/* <SimpleTooltip/> */}
              {optionEffectObject === null ?
                <div>
                  {/* <div style={{ marginLeft: 20, marginRight: 20, borderColor: 'gray', 'border': '1px solid' }}></div> */}
                  <div style={{ display: 'flex', width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>T??m ki???m tr???m</h4>
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <MAutocomplete
                      id="autocompleteDonVi"
                      title="T??n ????n V??? Qu???n L??"
                      options={listDonVi}
                      value={autocompleteDonVi}
                      getOptionLabel={option => option.teN_DVIQLY}
                      style={{ width: 300 }}
                      renderInput={params => <TextField {...params} label="T??n ????n V??? Qu???n L??" variant="outlined" />}

                      onChange={(e, v) => {
                        setAutocompleteDonVi(v);
                        if (v != null) {
                          setMaDonViSelected(v.mA_DVIQLY);
                          setAutocompleteTram(null);
                          setAutocompleteTenKH(null);
                          setAutocompleteDiaChi(null);
                          setFlagAutoCompleteTram(true);
                          setShowModalLoading(true);
                          fetch(URLAPI + '/APIKTGS/Tram?madvi=' + v.mA_DVIQLY)
                            .then((response) => {
                              setFlagAutoCompleteTram(false);
                              //document.getElementById("clearOnDonVi").click();
                              return response.json();
                            })
                            .then((responseJson) => {
                              setListTram(responseJson);
                              setShowModalLoading(false);
                              fetch(URLAPI + '/APIKTGS/KHANG/checkKHANG?madvi=' + v.mA_DVIQLY)
                                .then(response => {
                                  if (response.status === 200) {
                                    return response.json();
                                  }
                                  return null;
                                })
                                .then(res => {
                                  if (res !== null && res.length !== 0) {
                                    setListKhachHangCanhBaoByDonVi(res);
                                    setOpenDanhSachCanhBaoByDonViModal(true);
                                  }
                                })
                              //return responseJson.movies;                
                            })
                            .catch((error) => {
                              console.error(error);
                              alert(error);
                            })
                        }
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                      T???ng s??? tr???m: {listTram === null ? "0" : listTram.length}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <MAutocomplete
                      id="autocompleteTram1"
                      title="T??n Tr???m"
                      value={autocompleteTram}
                      options={listTram}
                      getOptionLabel={option => option.mA_TRAM + " -- " + option.teN_TRAM}
                      style={{ width: 300 }}
                      renderInput={params => <TextField {...params} label="M?? -- T??n Tr???m" variant="outlined" />}
                      disabled={flagAutoCompleteTram}
                      onChange={(e, v) => {

                        setAutocompleteTram(v);
                        debugger;
                        if (v != null) {
                          if (v.toado !== null) {
                            if (v.toado.longitude === '' || v.toado.latitude === '') {
                              fetch(URLAPI + '/APIKTGS/TRAM/GETTOADOTRAM?MADVI=' + v.mA_DVIQLY + '&MATRAM=' + v.mA_TRAM)
                                .then((response) => {
                                  if (response.status === 200) {
                                    return response.json();
                                  } else {
                                    setTram(null);
                                  }
                                  return null;
                                })
                                .then((res) => {
                                  if (res !== null) {

                                    setTram({
                                      "mA_DVIQLY": v.mA_DVIQLY,
                                      "mA_TRAM": v.mA_TRAM,
                                      "teN_TRAM": v.teN_TRAM,
                                      "toado": {
                                        "longitude": res.longitude,
                                        "latitude": res.latitude
                                      }
                                    })
                                  }
                                })
                                .catch((error) => {
                                  console.error(error);
                                  alert(error);
                                });
                            } else {
                              setPointCenter({ lng: Number(v.toado.longitude), lat: Number(v.toado.latitude) });
                              setDefaultPointCenter({ lng: Number(v.toado.longitude), lat: Number(v.toado.latitude) });
                              setTram(v);
                            }
                          }
                          if (flagOnlyView) {
                            getData(v.mA_DVIQLY, v.mA_TRAM);
                            setMaTramSelected(v.mA_TRAM);
                            setTenTramSelected(v.teN_TRAM);
                            setFlagAutoCompleteSearch(false);
                          } else {

                            fetch(URLAPI + '/APIKTGS/Log?MADVI=' + maDonViSelected + '&MATRAM=' + v.mA_TRAM)
                              .then(response => {
                                if (response.status === 200) {
                                  return response.json();
                                }
                                return null;
                              })
                              .then(responseJson => {
                                if (responseJson !== null) {
                                  if (responseJson.length === 0) {
                                    fetch(URLAPI + '/APIKTGS/Log/saveLog', {
                                      method: 'POST',
                                      headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',

                                      },
                                      body: JSON.stringify({
                                        "MA_DVIQLY": maDonViSelected,
                                        "MA_TRAM": v.mA_TRAM,
                                        "TRANG_THAI": "0",
                                        "HANH_DONG": "KHOI TAO",
                                        "USER": initContext.username
                                      })
                                    })
                                      .then(response => {
                                        if (response.status === 200) {
                                          return response.json();
                                        }
                                        return null;
                                      })
                                      .then(responseJson => {
                                        if (responseJson !== null) {
                                          setStatusTram(responseJson.tranG_THAI);
                                          setMaTramSelected(v.mA_TRAM);
                                          setTenTramSelected(v.teN_TRAM);
                                          setAutocompleteTenKH(null);
                                          setAutocompleteDiaChi(null);
                                          setFlagAutoCompleteSearch(false);
                                          setShowModalLoading(true);
                                          getData(v.mA_DVIQLY, v.mA_TRAM);
                                        }
                                      })
                                  } else if (responseJson[0].tranG_THAI === '0') {
                                    setStatusTram(responseJson.tranG_THAI);
                                    setMaTramSelected(v.mA_TRAM);
                                    setTenTramSelected(v.teN_TRAM);
                                    setAutocompleteTenKH(null);
                                    setAutocompleteDiaChi(null);
                                    setFlagAutoCompleteSearch(false);
                                    setShowModalLoading(true);
                                    getData(v.mA_DVIQLY, v.mA_TRAM);
                                  } else if (responseJson[0].tranG_THAI === '2' || responseJson[0].user === initContext.username) {
                                    setStatusTram(responseJson[0].tranG_THAI);
                                    if (v.toado !== null) {
                                      if (v.toado.longitude === '' || v.toado.latitude === '') {
                                        fetch(URLAPI + '/APIKTGS/TRAM/GETTOADOTRAM?MADVI=' + v.mA_DVIQLY + '&MATRAM=' + v.mA_TRAM)
                                          .then((response) => {
                                            if (response.status === 200) {
                                              return response.json();
                                            } else {
                                              setTram(null);
                                            }
                                            return null;
                                          })
                                          .then((res) => {
                                            if (res !== null) {
                                              setTram({
                                                "mA_DVIQLY": v.mA_DVIQLY,
                                                "mA_TRAM": v.mA_TRAM,
                                                "teN_TRAM": v.teN_TRAM,
                                                "toado": {
                                                  "longitude": res.longitude,
                                                  "latitude": res.latitude
                                                }
                                              })
                                            }

                                          })
                                          .catch((error) => {
                                            console.error(error);
                                            alert(error);
                                          });
                                      } else {
                                        setPointCenter({ lng: Number(v.toado.longitude), lat: Number(v.toado.latitude) });
                                        setDefaultPointCenter({ lng: Number(v.toado.longitude), lat: Number(v.toado.latitude) });
                                        setTram(v);
                                      }
                                    }
                                    setMaTramSelected(v.mA_TRAM);
                                    setTenTramSelected(v.teN_TRAM);
                                    setAutocompleteTenKH(null);
                                    setAutocompleteDiaChi(null);
                                    setFlagAutoCompleteSearch(false);
                                    setShowModalLoading(true);
                                    getData(v.mA_DVIQLY, v.mA_TRAM);
                                  } else {
                                    alert('B???ng v??? tr???m hi???n t???i ??ang ???????c s??? d???ng b???i 1 user kh??c (' + responseJson[0].user + ') !');
                                    setMaTramSelected(null);
                                    setTenTramSelected(null);
                                  }
                                }
                              })
                              .catch((error) => {
                                console.error(error);
                                alert(error);
                              });
                          }
                        }
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                      T???ng s??? kh??ch h??ng: {listKhachHang === null ? "0" : listKhachHang.length}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>T??m ki???m kh??ch h??ng</h4>
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <MAutocomplete
                      id="autocompleteTenKH"
                      title="Th??ng Tin Kh??ch H??ng"
                      value={autocompleteTenKH}
                      options={listKhachHang !== null ? listKhachHang.filter((item) => {
                        if (item.toA_DO !== null) {
                          if ((item.toA_DO.latitude === '0' && item.toA_DO.longitude === '0') || (item.toA_DO.latitude === '' && item.toA_DO.longitude === '')) {

                          } else {
                            return item;
                          }
                        } else {

                        }
                      }) : null}
                      getOptionLabel={option => option.mA_KHANG + ' -- ' + option.teN_KHANG}
                      style={{ width: 300 }}
                      renderInput={params => <TextField {...params} label="M?? -- T??n Kh??ch H??ng" variant="outlined" />}
                      disabled={flagAutoCompleteSearch}
                      onChange={(e, v) => {
                        setAutocompleteTenKH(v);
                        //setShowModalLoading(true);
                        if (v != null) {

                          setObjectSelected({ type: 'KhachHang', object: v });
                          if (v.toA_DO !== null) {
                            if (v.toA_DO.latitude !== '0' && v.toA_DO.longitude !== '0') {
                              setPointCenter({ lat: Number(v.toA_DO.latitude), lng: Number(v.toA_DO.longitude) });
                            }
                          }

                          setAutocompleteDiaChi(null);
                          setAutocompleteTenKH(null);
                        }
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <MAutocomplete
                      id="autocompleteDiaChi"
                      title="Th??ng Tin ?????a Ch??? C???a Kh??ch H??ng"
                      value={autocompleteDiaChi}
                      options={listKhachHang !== null ? listKhachHang.filter((item) => {
                        if (item.toA_DO !== null) {
                          if (item.toA_DO.latitude === '0' && item.toA_DO.longitude === '0') {

                          } else {
                            return item;
                          }
                        } else {

                        }
                      }) : null}
                      getOptionLabel={option => option.sO_TBI + ' -- ' + option.sO_NHA + ' ' + option.duonG_PHO}
                      style={{ width: 300 }}
                      renderInput={params => <TextField {...params} label="S??? No -- ?????a Ch??? C???a Kh??ch H??ng" variant="outlined" />}
                      disabled={flagAutoCompleteSearch}
                      onChange={(e, v) => {
                        //setShowModalLoading(true);
                        setAutocompleteDiaChi(v);
                        if (v != null) {
                          if (v.toA_DO !== null) {
                            if (v.toA_DO.latitude !== '0' && v.toA_DO.longitude !== '0') {
                              setPointCenter({ lat: Number(v.toA_DO.latitude), lng: Number(v.toA_DO.longitude) });
                            }
                          }
                          setObjectSelected({ type: 'KhachHang', object: v });
                          setAutocompleteDiaChi(null);
                          setAutocompleteTenKH(null);
                        }
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      setOpenSearchModal(true);

                    }}>T??m Kh??ch H??ng</Button>
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      history.push('/Multi');
                    }}>Xem Nhi???u B???n V???</Button>

                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      history.push('/CustomerLostPower');
                    }}>Xem Kh??ch H??ng M???t ??i???n </Button>

                  </div>
                </div>
                :
                null
              }
              <div style={optionEffectObject === 'ChangeLocationByAddressObject' ? { display: 'flex', flexDirection: 'column', width: '100%', height: 150, } : { display: 'none', flexDirection: 'column', width: '100%', height: 150, }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Thay ?????i v??? tr?? theo ?????a ch???</h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <LoadScript
                    id='script-loader'
                    // googleMapsApiKey="AIzaSyABKtV7hdby18BdouqRGWRPR-3-FPdg7bQ"
                    googleMapsApiKey="AIzaSyCFcCLWqtVrENo1ZLZ8CIdmnuRN0aXl_aw"
                    libraries={["places", "geometry"]}
                  >
                    <Autocomplete
                      onLoad={(e) => setLocationSearchBox(e)}
                      onPlaceChanged={() => {
                        if (locationSearchBox != null) {
                          setPointCenter({
                            lat: locationSearchBox.getPlace().geometry.location.lat(),
                            lng: locationSearchBox.getPlace().geometry.location.lng()
                          })
                          setResultLocationSearchBox({
                            lat: locationSearchBox.getPlace().geometry.location.lat(),
                            lng: locationSearchBox.getPlace().geometry.location.lng()
                          })
                        } else {
                        }
                      }}
                    >
                      <Input
                        id="inputSearchBoxChangeLocationByAddress"
                        type="text"
                        placeholder="Nh???p ?????a ch??? c???n t??m..."
                        style={{ width: '300px' }}
                      />
                    </Autocomplete>
                  </LoadScript>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonLuuChangeLocationByAddressObject").click();
                    }}>L??u th??ng tin</Button>
                  </div>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonHuyChangeLocationByAddressObject").click();
                    }}>H???y</Button>
                  </div>
                </div>
              </div>
              <div style={optionEffectObject === 'ChangeLocationByTypingObject' ? { display: 'flex', flexDirection: 'column', width: '100%', height: 350 } : { display: 'none', flexDirection: 'column', width: '100%', height: 350 }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Thay ?????i v??? tr?? theo t???a d???</h4>
                </div>
                <ChangLocationByTypingComponent
                  functionSetPointCenter={functionSetPointCenter}
                  functionSetResultLocationTypingBox={functionSetResultLocationTypingBox}
                  objectSelected={objectSelected}
                />
              </div>
              <div style={(optionEffectObject === 'ViewInfoObject' && objectSelected.object != null) ? { display: 'flex', flexDirection: 'column', width: '100%', height: 575, } : { display: 'none', flexDirection: 'column', width: '100%', height: 575 }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                    {objectSelected.type === 'Tru' ? "Th??ng tin tr??? " + objectSelected.object.namE_E : null}
                    {objectSelected.type === 'KhachHang' ? "Th??ng tin kh??ch h??ng " + objectSelected.object.mA_DDO : null}
                    {objectSelected.type === 'Line' ? "Th??ng tin ???????ng day " + objectSelected.object.namE_E : null}
                  </h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 525, justifyContent: 'center', alignItems: 'center' }}>
                  {(objectSelected.type === 'KhachHang' && objectSelected.object !== null) ?
                    objectSelected.object.toA_DO !== null ?
                      <ViewInfoKhachHangComponent objectSelected={objectSelected} />
                      :
                      null
                    :
                    (objectSelected.type === 'Tru' && objectSelected.object !== null) ?
                      <ViewInfoTruComponent objectSelected={objectSelected} />
                      :
                      (objectSelected.type === 'Line' && objectSelected.object !== null) ?
                        <ViewInfoLineComponent objectSelected={objectSelected} />
                        :
                        null
                  }
                </div>


                {/* <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonLuuChangeLocationByAddressObject").click();
                    }}>L??u th??ng tin</Button>
                  </div>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonHuyChangeLocationByAddressObject").click();
                    }}>H???y</Button>
                  </div>
                </div> */}
              </div>
              <div style={(optionEffectObject === 'AddTru') ? { display: 'flex', flexDirection: 'column', width: '100%', height: 100, } : { display: 'none', flexDirection: 'column', width: '100%', height: 100 }}>              <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                  Th??m tr???
                  </h4>
              </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonLuuAddTru").click();
                    }}>L??u th??ng tin</Button>
                  </div>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonHuyAddTru").click();
                    }}>H???y</Button>
                  </div>
                </div>
              </div>
              <div style={(optionEffectObject === 'AddLine') ? { display: 'flex', flexDirection: 'column', width: '100%', height: 100, } : { display: 'none', flexDirection: 'column', width: '100%', height: 100 }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                    Th??m ???????ng d??y
                  </h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonLuuAddLine").click();
                    }}>L??u th??ng tin</Button>
                  </div>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonHuyAddLine").click();
                    }}>H???y</Button>
                  </div>
                </div>
              </div>
              <div style={(optionEffectObject === 'AddTram') ? { display: 'flex', flexDirection: 'column', width: '100%', height: 100, } : { display: 'none', flexDirection: 'column', width: '100%', height: 100 }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                    Th??m tr???m
                  </h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonLuuAddLine").click();
                    }}>L??u th??ng tin</Button>
                  </div>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      document.getElementById("buttonHuyAddLine").click();
                    }}>H???y</Button>
                  </div>
                </div>
              </div>
              <div style={(optionEffectObject === 'ChangeLocationByClickObject') ? { display: 'flex', flexDirection: 'column', width: '100%', height: 410, } : { display: 'none', flexDirection: 'column', width: '100%', height: 410 }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                    Danh s??ch kh kh??ng c?? t???a ?????
                  </h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
                  <Input valid={textSearchKhachHangKhongCoDuLieu === null ? false : true} invalid={textSearchKhachHangKhongCoDuLieu === null ? true : false}
                    onChange={(v) => {
                      setTextSearchKhachHangKhongCoDuLieu(v.target.value);
                    }} />
                </div>

                <div style={{ display: 'flex', width: '100%', height: 500, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  {listKhachHang !== null ?
                    <div id="aaa" style={{ height: 300, paddingRight: 10, paddingLeft: 10, overflowY: 'auto', overflowX: 'auto' }}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Danh S???</th>
                            <th>T??n Kh??ch H??ng</th>
                            <th>?????a Ch???</th>
                            <th>M?? ??i???m ??o</th>
                            <th>S??? C??ng T??</th>
                            <th>V??? Tr?? Treo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listKhachHang.sort((a, b) => a.doanH_SO > b.doanH_SO ? 1 : -1).map((kh) => {
                            if (kh.toA_DO !== null) {
                              if ((kh.toA_DO.longitude === "0" && kh.toA_DO.latitude === "0") || (kh.toA_DO.longitude === "" && kh.toA_DO.latitude === "")) {
                                if (textSearchKhachHangKhongCoDuLieu === null) {
                                  return <tr onClick={() => {
                                    setObjectSelected({ type: 'KhachHang', object: kh });
                                  }}
                                    bgcolor={objectSelected.object !== null ?
                                      kh.mA_KHANG === objectSelected.object.mA_KHANG ? "#48DCFF" :
                                        null
                                      :
                                      null
                                    }
                                  >
                                    <td>{kh.doanH_SO}</td>
                                    <td>{kh.teN_KHANG}</td>
                                    <td>{kh.sO_NHA + ' ' + kh.duonG_PHO}</td>
                                    <td>{kh.mA_DDO}</td>
                                    <td>{kh.sO_TBI}</td>
                                    <td>{kh.vtrI_TREO}</td>
                                  </tr>

                                } else if (kh.mA_DDO.includes(textSearchKhachHangKhongCoDuLieu) ||
                                  kh.teN_KHANG.includes(textSearchKhachHangKhongCoDuLieu) ||
                                  kh.sO_NHA.includes(textSearchKhachHangKhongCoDuLieu) ||
                                  kh.mA_KHANG.includes(textSearchKhachHangKhongCoDuLieu) ||
                                  kh.duonG_PHO.includes(textSearchKhachHangKhongCoDuLieu) ||
                                  kh.mA_HDONG.includes(textSearchKhachHangKhongCoDuLieu) ||
                                  kh.doanH_SO.includes(textSearchKhachHangKhongCoDuLieu)
                                ) {

                                  return <tr onClick={() => {
                                    setObjectSelected({ type: 'KhachHang', object: kh });
                                  }}
                                    bgcolor={objectSelected.object !== null ?
                                      kh.mA_KHANG === objectSelected.object.mA_KHANG ? "#48DCFF" :
                                        null
                                      :
                                      null
                                    }
                                  >
                                    <td>{kh.doanH_SO}</td>
                                    <td>{kh.teN_KHANG}</td>
                                    <td>{kh.sO_NHA + ' ' + kh.duonG_PHO}</td>
                                    <td>{kh.mA_DDO}</td>
                                    <td>{kh.sO_TBI}</td>
                                    <td>{kh.vtrI_TREO}</td>
                                  </tr>
                                }
                              }
                            } else {
                              if (textSearchKhachHangKhongCoDuLieu === null) {
                                return <tr onClick={() => {
                                  setObjectSelected({ type: 'KhachHang', object: kh });
                                }}
                                  bgcolor={objectSelected.object !== null ?
                                    kh.mA_KHANG === objectSelected.object.mA_KHANG ? "#48DCFF" :
                                      null
                                    :
                                    null
                                  }
                                >
                                  <td>{kh.doanH_SO}</td>
                                  <td>{kh.teN_KHANG}</td>
                                  <td>{kh.sO_NHA + ' ' + kh.duonG_PHO}</td>
                                  <td>{kh.mA_DDO}</td>
                                  <td>{kh.sO_TBI}</td>
                                  <td>{kh.vtrI_TREO}</td>
                                </tr>

                              } else if (kh.mA_DDO.includes(textSearchKhachHangKhongCoDuLieu) ||
                                kh.teN_KHANG.includes(textSearchKhachHangKhongCoDuLieu) ||
                                kh.sO_NHA.includes(textSearchKhachHangKhongCoDuLieu) ||
                                kh.mA_KHANG.includes(textSearchKhachHangKhongCoDuLieu) ||
                                kh.duonG_PHO.includes(textSearchKhachHangKhongCoDuLieu) ||
                                kh.mA_HDONG.includes(textSearchKhachHangKhongCoDuLieu) ||
                                kh.doanH_SO.includes(textSearchKhachHangKhongCoDuLieu)
                              ) {
                                return <tr onClick={() => {
                                  setObjectSelected({ type: 'KhachHang', object: kh });
                                }}
                                  bgcolor={objectSelected.object !== null ?
                                    kh.mA_KHANG === objectSelected.object.mA_KHANG ? "#48DCFF" :
                                      null
                                    :
                                    null
                                  }
                                >
                                  <td>{kh.doanH_SO}</td>
                                  <td>{kh.teN_KHANG}</td>
                                  <td>{kh.sO_NHA + ' ' + kh.duonG_PHO}</td>
                                  <td>{kh.mA_DDO}</td>
                                  <td>{kh.sO_TBI}</td>
                                  <td>{kh.vtrI_TREO}</td>
                                </tr>

                              }
                            }
                          })}


                        </tbody>
                      </Table>
                    </div>

                    :
                    <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                        Kh??ng c?? d??? li???u kh??ch h??ng kh??ng c?? t???a ?????!
                      </h4>
                    </div>
                  }
                </div>
                {listKhachHang !== null ?
                  <>
                    <div style={{ display: 'flex', width: '100%', height: 25, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                        T???ng s??? kh??ch h??ng: {listKhachHang !== null ? listKhachHang.length : '0'}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: 25, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                        T???ng s??? kh??ch h??ng kh??ng c?? t???a ?????: {listKhachHang !== null ? getAmountListKhachNotLocation() : '0'}
                      </h4>
                    </div>
                  </>
                  :
                  null}
              </div>
              <div style={(optionEffectObject === 'ShowListKhachHangFull') ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                    Danh s??ch kh??ch h??ng
                  </h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 500, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  {listKhachHang !== null && listKhachHangNoLine !== null ?
                    <div style={{ height: '100%', display: 'flex', width: '100%', flex: 1, flexDirection: 'column' }}>
                      {/* <div style={{ height: 400, paddingRight: 10, paddingLeft: 10, overflowY: 'auto', overflowX: 'auto' }}> */}
                      <div style={{ height: '400px', overflow: 'auto' }} className="table-resposive">
                        <Table responsive style={{ width: '100%', height: '90%' }}>
                          <thead>
                            <tr style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', }}>
                              <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', }}>T??n Kh??ch H??ng</th>
                              <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', }}>?????a Ch???</th>
                              <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', }}>M?? ??i???m ??o</th>
                              <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', }}>S??? C??ng T??</th>
                              <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', }}>V??? Tr?? Treo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listKhachHang.map((kh) => {
                              return <tr onClick={() => {
                                setObjectSelected({ type: 'KhachHang', object: kh });
                              }}
                                bgcolor={objectSelected.object !== null ?
                                  kh.mA_KHANG === objectSelected.object.mA_KHANG ? "#48DCFF" :
                                    listKhachHangNoLine.includes(kh.mA_DDO) ? "#FF3D5B" : "#F2F7F9"
                                  :
                                  listKhachHangNoLine.includes(kh.mA_DDO) ? "#FF3D5B" : "#F2F7F9"
                                }
                              >
                                <td>{kh.teN_KHANG}</td>
                                <td>{kh.sO_NHA + ' ' + kh.duonG_PHO}</td>
                                <td>{kh.mA_DDO}</td>
                                <td>{kh.sO_TBI}</td>
                                <td>{kh.vtrI_TREO}</td>
                              </tr>
                            })}
                          </tbody>
                        </Table>

                      </div>
                      <div style={{ display: 'flex', width: '100%', height: 25, justifyContent: 'center', alignItems: 'center' }}>
                        <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                          T???ng s??? kh??ch h??ng: {listKhachHang.length}
                        </h4>
                      </div>
                      <div style={{ display: 'flex', width: '100%', height: 25, justifyContent: 'center', alignItems: 'center' }}>
                        <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                          T???ng s??? k/h ch??a g???n v??o b???n v???: {listKhachHangNoLine.length}
                        </h4>
                      </div>
                      <div style={{ display: 'flex', width: '100%', height: 25, justifyContent: 'center', alignItems: 'center' }}>
                        <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                          T???ng s??? kh??ch h??ng kh??ng c?? t???a ?????: {getAmountListKhachNotLocation()}
                        </h4>
                      </div>
                    </div>
                    :
                    <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                        Kh??ng c?? d??? li???u kh??ch h??ng!
                      </h4>
                    </div>
                  }
                </div>
              </div>
              <div style={optionEffectObject === 'Direction' ? { display: 'flex', flexDirection: 'column', width: '100%', height: 150, } : { display: 'none', flexDirection: 'column', width: '100%', height: 150, }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>T??m ???????ng theo ?????a ch???</h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>

                  <LoadScript
                    id='script-loader'
                    // googleMapsApiKey="AIzaSyBddLOpOb8D7rMeWUvyQBkLPNKUaKPfXy4"
                    googleMapsApiKey="AIzaSyCFcCLWqtVrENo1ZLZ8CIdmnuRN0aXl_aw"
                    libraries={["places", "geometry"]}
                  >
                    <Autocomplete
                      onLoad={(e) => setLocationDirectionCurrent(e)}
                      //onLoad={(e) => setLocationSearchBox(e)}
                      onPlaceChanged={() => {
                        if (locationDirectionCurrent !== null) {

                        } else {
                        }
                      }}
                    >
                      <Input
                        id="inputStart"
                        type="text"
                        placeholder="Nh???p ?????a ch??? c???a b???n..."
                        style={{ width: '300px' }}
                      />
                    </Autocomplete>
                  </LoadScript>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      setObjectSelected({ type: "", object: null });
                      document.getElementById("buttonHuyTimDuong").click();
                    }}>H???y</Button>
                  </div>
                </div>
              </div>
              <div style={optionEffectObject === 'DirectionCurrentLocation' ? { display: 'flex', flexDirection: 'column', width: '100%', height: 150, } : { display: 'none', flexDirection: 'column', width: '100%', height: 150, }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>T??m ???????ng t??? v??? tr?? hi???n t???i</h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      navigator.geolocation.getCurrentPosition(showPosition => {
                        if (showPosition.coords.latitude !== null && showPosition.coords.longitude) {
                          setCurrentLocation({ lat: showPosition.coords.latitude, lng: showPosition.coords.longitude })

                        }
                      });
                    }}>L???y v??? tr?? hi???n t???i</Button>
                    <Button color="primary" style={{ marginLeft: 10 }} onClick={() => {
                      setObjectSelected({ type: "", object: null });
                      document.getElementById("buttonHuyTimDuong").click();
                    }}>H???y</Button>
                  </div>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  {currentLocation !== null ? ' Kinh ?????: ' + currentLocation.lng : ''}
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  {currentLocation !== null ? ' V?? ?????: ' + currentLocation.lat + '' : ''}
                </div>
              </div>
              <div style={optionEffectObject === 'Report' ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%', }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>B??o c??o</h4>
                </div>
                <div style={{ display: 'none' }}>
                  <ThongKeTrangThaiTramCC />
                  <ThongKeKhachHangSaiMaTram />
                  <ThongKeTrangThaiKhachHangTheoToaDo />
                  <ThongKeTrangThaiToaDo />
                  <ThongKeDanhSachTramTheoToaDo />
                  <ThongKeTrangThaiTramCCByUnit />
                  <ListKhachHangNoLocation />
                  <BackUpTram maTram={maTramSelected} />
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    if (maDonViSelected !== null) {
                      setShowModalLoading(true);
                      if (initContext !== null) {
                        const tmpMaDonVi = initContext.maDonVi === 'PB' ? 'PB' : initContext.maDonVi.slice(0, 4);
                        fetch(URLAPI4001 + '/Api/SangTaiChuyenLuoi/getBCTrangThaiTramByCTYAndTCT?maDonVi=' + tmpMaDonVi)
                          .then(response => {
                            if (response.status === 200) {
                              return response.json();
                            }
                            return null;
                          })
                          .then(res => {
                            if (res !== null) {
                              setShowModalLoading(false);
                              let tongTram = 0;
                              // let tongTramChuaVe=0;
                              let tongTramDangVe = 0;
                              let tongTramDaVe = 0;
                              res.map(item => {
                                if (item.TONGTRAM !== null && item.TONGTRAM !== '') {
                                  tongTram = tongTram + Number(item.TONGTRAM);
                                }
                                if (item.DANGVE !== null && item.DANGVE !== '') {
                                  tongTramDangVe = tongTramDangVe + Number(item.DANGVE);
                                }
                                if (item.DAVE !== null && item.DAVE !== '') {
                                  tongTramDaVe = tongTramDaVe + Number(item.DAVE);
                                }
                              })
                              // tongTramChuaVe=tongtram-tongTramDaVe-tongTramDangVe;
                              if (tmpMaDonVi === 'PB') {
                                let tongTramPK = 0;
                                // let tongTramChuaVePK=0;
                                let tongTramDangVePK = 0;
                                let tongTramDaVePK = 0;
                                res.map(item => {
                                  if (item.MADONVI.includes('PK')) {

                                    if (item.TONGTRAM !== null && item.TONGTRAM !== '') {
                                      tongTramPK = tongTramPK + Number(item.TONGTRAM);
                                    }
                                    if (item.DANGVePK !== null && item.DANGVePK !== '') {
                                      tongTramDangVePK = tongTramDangVePK + Number(item.DANGVE);
                                    }
                                    if (item.DAVePK !== null && item.DAVePK !== '') {
                                      tongTramDaVePK = tongTramDaVePK + Number(item.DAVE);
                                    }
                                  }
                                })
                                setDataBieu6Modal([...res.filter(i => !i.MADONVI.includes('PK')), {
                                  "MADONVI": "PK",
                                  "TONGTRAM": tongTramPK,
                                  "DANGVE": tongTramDangVePK,
                                  "DAVE": tongTramDaVePK
                                }, {
                                  "MADONVI": "T???NG",
                                  "TONGTRAM": tongTram,
                                  "DANGVE": tongTramDangVe,
                                  "DAVE": tongTramDaVe
                                }]);
                              } else {
                                setDataBieu6Modal([...res, {
                                  "MADONVI": "T???NG",
                                  "TONGTRAM": tongTram,
                                  "DANGVE": tongTramDangVe,
                                  "DAVE": tongTramDaVe
                                }]);
                              }
                              setOpenBieu6Modal(true);
                            }
                          })
                          .catch(error => console.log(error))
                      }

                    }

                  }
                  }>{'   '}Th???ng k?? t??nh h??nh tri???n khai b???n v???{'   '}</Button>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    if (maDonViSelected !== null) {
                      setShowModalLoading(true);

                      fetch(URLAPI + '/APIKTGS/Report/bcTTTramCC?madvi=' + maDonViSelected)
                        .then(response => {
                          if (response.status === 200) {
                            return response.json();
                          }
                          return null;
                        })
                        .then(res => {
                          if (res !== null) {
                            setShowModalLoading(false);
                            setDataBieu1Modal(res);
                            setOpenBieu1Modal(true);
                          }
                        })
                        .catch(error => console.log(error))
                    }

                  }
                  }>{'   '}Th???ng k?? t??nh h??nh tri???n khai b???n v??? chi ti???t {'   '}</Button>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    if (maDonViSelected !== null) {
                      setShowModalLoading(true);
                      fetch(URLAPI + '/APIKTGS/Report/bcDayKHTH?madvi=' + maDonViSelected)
                        .then(response => {
                          if (response.status === 200) {
                            return response.json();
                          }
                          return null;
                        })
                        .then(res => {
                          if (res !== null) {
                            setShowModalLoading(false);
                            setDataBieu2Modal(res);
                            setOpenBieu2Modal(true);
                          }
                        })
                        .catch(error => console.log(error))
                    }
                  }
                  }>
                    {'   '}Th???ng k?? kh??ch h??ng g???n v??o b???n v???{'   '}
                  </Button>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    if (maDonViSelected !== null) {
                      setOpenBieu8Modal(true);
                    }
                  }
                  }>
                    {'   '}Th???ng k?? t??nh h??nh tri???n khai b???n v??? theo ng??y{'   '}
                  </Button>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    if (maDonViSelected !== null) {
                      setShowModalLoading(true);
                      setOpenBieu7Modal(true);
                      setShowModalLoading(false);


                    }

                  }
                  }>{'   '}Danh s??ch tr???m ch??a c?? t???a ????? c???a ????n v???{'   '}</Button>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    if (maDonViSelected !== null) {
                      setShowModalLoading(true);
                      fetch(URLAPI + '/APIKTGS/Report/bcTTToadDo?MADVI=' + maDonViSelected)
                        .then(response => {
                          if (response.status === 200) {
                            return response.json();
                          }
                          return null;
                        })
                        .then(res => {
                          if (res !== null) {
                            setShowModalLoading(false);
                            setDataBieu3Modal(res);
                            setOpenBieu3Modal(true);
                          }
                        })
                        .catch(error => console.log(error))
                    }
                  }
                  }>
                    {'       '}Th???ng k?? t???a ????? kh??ch h??ng theo ????n v???{'       '}
                  </Button>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    if (maDonViSelected !== null) {
                      setShowModalLoading(true);
                      fetch(URLAPI + '/APIKTGS/Report/bcTramToadDo?MADVI=' + maDonViSelected)
                        .then(response => {
                          if (response.status === 200) {
                            return response.json();
                          }
                          return null;
                        })
                        .then(res => {
                          if (res !== null) {
                            setShowModalLoading(false);
                            setDataBieu4Modal(res);
                            setOpenBieu4Modal(true);
                          }
                        })
                        .catch(error => console.log(error))
                    }
                  }
                  }>
                    {'  '}Th???ng k?? danh s??ch tr???m theo t???a ????? {'  '}
                  </Button>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    if (maDonViSelected !== null && maTramSelected !== null) {
                      setShowModalLoading(true);
                      fetch(URLAPI + '/APIKTGS/Report/bcToadDoKH?MADVI=' + maDonViSelected + '&MATRAM=' + maTramSelected)
                        .then(response => {
                          if (response.status === 200) {
                            return response.json();
                          }
                          return null;
                        })
                        .then(res => {
                          if (res !== null) {
                            setShowModalLoading(false);
                            setDataBieu5Modal(res);
                            setOpenBieu5Modal(true);
                          }
                        })
                        .catch(error => console.log(error))
                    }
                  }
                  }>
                    {'  '}Th???ng k?? tr???ng th??i k/h theo t???a ????? {'  '}
                  </Button>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    var doc = new jsPDF('landscape', 'mm', 'a0');
                    html2canvas(document.getElementById("mapCol"), { allowTaint: false, useCORS: false }).then((canvas) => {
                      //html2canvas(document.getElementById("map"), { allowTaint: false, useCORS: false }).then((canvas) => {

                      //doc.addPage(1189 ,841 )
                      // doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 1024/4 , 657/4 );
                      doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 1189, 841);
                      //doc.autoPrint();
                      doc.save('BanVe.pdf');
                    })
                      .catch((error) => {
                        console.log("Error: " + error);
                      })
                  }}>
                    {'             '}In b???n v??? pdf {'             '}
                  </Button>
                </div>


              </div>
              <div style={optionEffectObject === 'StatusBanVe' ? { display: 'flex', flexDirection: 'column', width: '100%', height: 150, } : { display: 'none', flexDirection: 'column', width: '100%', height: 150, }}>
                <div style={{ display: 'flex', width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>
                    Tr???ng Th??i B???n V???:
                    </h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>

                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <RadioGroup aria-label="gender" name="radioGroupStatusTram" value={statusTram} onChange={(e) => {

                    if (maTramSelected !== null && maDonViSelected !== null && e.target.value !== null) {
                      const tmp = e.target.value;

                      if (e.target.value === '2') {
                        fetch(URLAPI4001 + '/Api/SangTaiChuyenLuoi/getCustomerNoLine', {
                          method: 'POST',
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            "MADONVI": maDonViSelected,
                            "MATRAM": maTramSelected
                          })
                        })
                          .then(response => {
                            if (response.status === 200) {
                              return response.json();
                            }
                            return null;
                          })
                          .then(responseJson => {
                            if (responseJson !== null && listKhachHang !== null) {

                              if (responseJson.length <= listKhachHang.length * 0.1) {

                                fetch(URLAPI + '/APIKTGS/Log/saveLog', {
                                  method: 'POST',
                                  headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',

                                  },
                                  body: JSON.stringify({
                                    "MA_DVIQLY": maDonViSelected,
                                    "MA_TRAM": maTramSelected,
                                    "TRANG_THAI": "2",
                                    "HANH_DONG": "KHOI TAO",
                                    "USER": initContext.username
                                  })
                                })
                                  .then(response => {

                                    if (response.status === 200) {
                                      setStatusTram("2");
                                      // alert('Thay ?????i tr???ng th??i th??nh c??ng');
                                      return response.json();
                                    }
                                    return null;
                                  })
                                  .catch(err => {
                                    alert(err.toString());
                                  })


                              } else {
                                alert('Vui l??ng n???i kh??ch h??ng v??o b???n v??? ????? ho??n th??nh b???n v???');
                              }
                            }
                          })
                          .catch(ex => {
                            alert(ex.toString());
                          })
                      } else {
                        fetch(URLAPI + '/APIKTGS/Log/saveLog', {
                          method: 'POST',
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',

                          },
                          body: JSON.stringify({
                            "MA_DVIQLY": maDonViSelected,
                            "MA_TRAM": maTramSelected,
                            "TRANG_THAI": tmp,
                            "HANH_DONG": "KHOI TAO",
                            "USER": initContext.username
                          })
                        })
                          .then(response => {

                            if (response.status === 200) {
                              setStatusTram(tmp);
                              return response.json();
                            }
                            return null;
                          })
                          .then(responseJson => {
                            if (responseJson !== null) {

                            }
                          })
                          .catch(err => {
                            alert(err.toString());
                          })
                      }
                    } else {
                      alert('Vui l??ng ch???n tr???m c???n thay ?????i tr???ng th??i!')
                    }

                  }}>
                    <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Ch??a v???" />
                    <FormControlLabel value={"1"} control={<Radio color="primary" />} label="??ang v???" />
                    <FormControlLabel value={"2"} control={<Radio color="primary" />} label="???? ho??n t???t b???n v???" />
                  </RadioGroup>
                </div>

              </div>
              <div style={optionEffectObject === 'UpdateCustomerLocationByLocation' ? { display: 'flex', flexDirection: 'column', width: '100%', height: 150, } : { display: 'none', flexDirection: 'column', width: '100%', height: 150, }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Thay ?????i t???a ????? kh??ch h??ng</h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }}>
                  <Button color="primary" onClick={() => {
                    if (maDonViSelected !== null && maTramSelected !== null) {
                      let tmp = window.confirm('B???n c?? ch???c mu???n c???p nh???t to??n b??? t???a ????? kh??ch h??ng c???a tr???m ' + maTramSelected + ' ?');
                      if (tmp) {
                        let str = window.prompt("Nh???p v??o t???a ????? (lng:'100',lat:'10'):");
                        if (str !== null) {

                          let arr = str.split("'");
                          let lng = arr[1];
                          let lat = arr[3];
                          if (lat !== null && lng !== null) {
                            fetch(URLAPI4001 + '/Api/SangTaiChuyenLuoi/setAllLocationInTram', {
                              method: 'POST',
                              headers: {
                                Accept: '*/*',
                                'Content-Type': 'application/json',
                                "Access-Control-Allow-Origin": "*"
                              },
                              body: JSON.stringify({
                                "MADONVI": maDonViSelected,
                                "MATRAM": maTramSelected,
                                "LAT": lat,
                                "LNG": lng,
                                "USERNAME": initContext.username
                              })
                            })
                              .then(response => {

                                if (response.status === 200) {
                                  reloadPage(maDonViSelected, maTramSelected);
                                  return response.json();
                                }
                                return null;
                              })
                              .then(res => {
                                if (res !== null) {
                                }
                              })
                              .catch(error => console.log(error))
                          }
                        }
                      }
                    }
                  }
                  }>
                    C???p nh???t t???a ????? to??n b??? kh??ch h??ng c???a Tr???m
                    </Button>
                </div>

                {/* <div style={{ display: 'flex', width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }}>
                      <Button color="primary" onClick={() => {
                        if (maDonViSelected !== null) {
                          fetch(URLAPI+'/APIKTGS/Report/bcSaiMaTramTH?MADVI=' + maDonViSelected)
                            .then(response => {
                              if (response.status === 200) {
                                return response.json();
                              }
                              return null;
                            })
                            .then(res => {
                              if (res !== null) {
                                setDataBieu2Modal(res);
                                setOpenBieu2Modal(true);
                              }
                            })
                            .catch(error => console.log(error))
                        }
                      }
                      }>
                        Th???ng k?? kh??ch h??ng sai m?? tr???m
                    </Button>
                    </div> */}


              </div>
              <div style={optionEffectObject === 'XacDinhKhoangCachKhiThemTruByType' || optionEffectObject === 'XacDinhKhoangCachKhiThemTruByTypeNoLine' ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%', }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Th??m tr??? theo t???ng lo???i</h4>
                </div>

                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>

                  <div style={{ display: 'flex', flex: 1, marginLeft: 70 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>

                      <Toggle
                        //defaultChecked={changeLocationByDrag}
                        onChange={(e) => {
                          if (!addTruTH) {
                            clearToggle();
                            setAddTruTH(true);
                            setTypeTruAdd('TruTH');
                          } else {
                            setAddTruTH(false);
                          }
                        }}
                        checked={addTruTH}
                      />
                    </div>
                    <div style={{ display: 'flex', marginLeft: 10 }}>
                      <h6>Tr??? trung th???</h6>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>

                  <div style={{ display: 'flex', flex: 1, marginLeft: 70 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

                      <Toggle
                        //defaultChecked={changeLocationByDrag}
                        onChange={(e) => {
                          if (!addTruHTTron) {
                            clearToggle();
                            setAddTruHTTron(true);
                            setTypeTruAdd('TruHTTron');
                          } else {
                            setAddTruHTTron(false);
                          }
                        }}
                        checked={addTruHTTron}
                      />
                    </div>
                    <div style={{ display: 'flex', marginLeft: 10 }}>
                      <h6>Tr??? h??? th??? tr??n</h6>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1, marginLeft: 70 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>
                      <Toggle
                        //defaultChecked={changeLocationByDrag}
                        onChange={(e) => {
                          if (!addTruHTVuong) {
                            clearToggle();
                            setAddTruHTVuong(true);
                            setTypeTruAdd('TruHTVuong');
                          } else {
                            setAddTruHTVuong(false);
                          }
                        }}
                        checked={addTruHTVuong}
                      />
                    </div>
                    <div style={{ display: 'flex', marginLeft: 10 }}>
                      <h6>Tr??? h??? th??? vu??ng</h6>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1, marginLeft: 70 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>
                      <Toggle
                        //defaultChecked={changeLocationByDrag}
                        onChange={(e) => {
                          if (!addTuDien) {
                            clearToggle();
                            setAddTuDien(true);
                            setTypeTruAdd('TuDien');
                          } else {
                            setAddTuDien(false);
                          }
                        }}
                        checked={addTuDien}
                      />
                    </div>
                    <div style={{ display: 'flex', marginLeft: 10 }}>
                      <h6>T??? ??i???n</h6>
                    </div>
                  </div>
                </div>

              </div>
              <div style={optionEffectObject === 'ShowAllAlert' ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%', }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>C???nh b??o</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                      <Toggle
                        //defaultChecked={changeLocationByDrag}
                        onChange={(e) => {
                          if (!showCanhBao) {
                            clearToggleCanhBao();
                            setOpenDanhSachCanhBaoModal(true);
                            setShowCanhBao(true);
                          } else {
                            setOpenDanhSachCanhBaoModal(false);
                            setShowCanhBao(false);
                          }
                        }}
                        checked={showCanhBao}
                      />
                    </div>
                    <div style={{ display: 'flex', marginLeft: 10 }}>
                      <h6>C???nh b??o bi???n ?????ng kh??ch h??ng ??? tr???m hi???n t???i</h6>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                      <Toggle
                        //defaultChecked={changeLocationByDrag}
                        onChange={(e) => {
                          if (!showCanhBaoByDonVi) {
                            clearToggleCanhBao();
                            setOpenDanhSachCanhBaoByDonViModal(true);
                            setShowCanhBaoByDonVi(true);
                          } else {
                            setOpenDanhSachCanhBaoByDonViModal(false);
                            setShowCanhBaoByDonVi(false);
                          }
                        }}
                        checked={showCanhBaoByDonVi}
                      />
                    </div>
                    <div style={{ display: 'flex', marginLeft: 10 }}>
                      <h6>C???nh b??o bi???n ?????ng kh??ch h??ng theo ????n v???</h6>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                      <Toggle
                        //defaultChecked={changeLocationByDrag}
                        onChange={(e) => {
                          if (!showCanhBaoKhachHangKhongToaDo) {
                            clearToggleCanhBao();
                            setOpenDanhSachNotLoactionModal(true);
                            setShowCanhBaoKhachHangKhongToaDo(true);
                          } else {
                            setOpenDanhSachNotLoactionModal(false);
                            setShowCanhBaoKhachHangKhongToaDo(false);
                          }
                        }}
                        checked={showCanhBaoKhachHangKhongToaDo}
                      />
                    </div>
                    <div style={{ display: 'flex', marginLeft: 10 }}>
                      <h6>C???nh b??o kh??ch h??ng kh??ng c?? t???a ????? c???a tr???m hi???n t???i</h6>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                      <Toggle
                        //defaultChecked={changeLocationByDrag}
                        onChange={(e) => {
                          if (!showCanhBaoKhachHangMoi) {
                            clearToggleCanhBao();
                            setOpenDanhSachKhachHangMoiModal(true);
                            setShowCanhBaoKhachHangMoi(true);
                          } else {
                            setOpenDanhSachKhachHangMoiModal(false);
                            setShowCanhBaoKhachHangMoi(false);
                          }
                        }}
                        checked={showCanhBaoKhachHangMoi}
                      />
                    </div>
                    <div style={{ display: 'flex', marginLeft: 10 }}>
                      <h6>C???nh b??o kh??ch h??ng m???i c???a ????n v???</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div style={optionEffectObject === 'ChangeSizeObject' ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%', }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Thay ?????i k??ch th?????c c??c ?????i t?????ng</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>K??ch th?????c tr??? h??? th???:</h4>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                      <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" max={3} min={0}
                        onDragEnd={(e) => {
                          ;
                          //setSizeTruHaThe(e.target);
                        }}
                        defaultValue={sizeTruHaThe}
                        value={sizeTruHaThe}
                        onChange={(e) => {
                          setSizeTruHaThe((e.clientX / 100 - 0.2).toFixed(1));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>K??ch th?????c tr??? trung th???:</h4>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                      <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" max={3} min={0} step={0.5}
                        onDragEnd={(e) => {
                          ;
                          //setSizeTruHaThe(e.target);
                        }}
                        defaultValue={sizeTruTrungThe}
                        value={sizeTruTrungThe}
                        onChange={(e) => {
                          setSizeTruTrungThe((e.clientX / 100 - 0.2).toFixed(1));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>K??ch th?????c tr???m:</h4>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                      <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" max={3} min={0}
                        onDragEnd={(e) => {
                          ;
                          //setSizeTruHaThe(e.target);
                        }}
                        defaultValue={sizeTram}
                        value={sizeTram}
                        onChange={(e) => {
                          setSizeTram((e.clientX / 100 - 0.2).toFixed(1));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>K??ch th?????c kh??ch h??ng:</h4>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                      <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" max={3} min={0}
                        onDragEnd={(e) => {
                          //setSizeTruHaThe(e.target);
                        }}
                        defaultValue={sizeKhachHang}
                        value={sizeKhachHang}
                        onChange={(e) => {
                          setSizeKhachHang((e.clientX / 100 - 0.2).toFixed(1));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>K??ch th?????c ???????ng d??y:</h4>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                      <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" max={3} min={0}
                        onDragEnd={(e) => {
                          //setSizeTruHaThe(e.target);
                        }}
                        defaultValue={sizeLine}
                        value={sizeLine}
                        onChange={(e) => {
                          setSizeLine((e.clientX / 100 - 0.2).toFixed(1));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div style={optionEffectObject === 'ShowAllTram' ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%', }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Thay ?????i k??ch th?????c tr???m</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>K??ch th?????c tr???m:</h4>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                      <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" max={3} min={0}
                        onDragEnd={(e) => {
                          ;
                          //setSizeTruHaThe(e.target);
                        }}
                        defaultValue={sizeTramAll}
                        value={sizeTramAll}
                        onChange={(e) => {

                          setSizeTramAll((e.clientX / 100 - 0.2).toFixed(1));

                        }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Hi???n th??? t??n tr???m:</h4>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                      <RadioGroup aria-label="gender" name="gender1" value={showLabelTramAll} onChange={(e) => { setShowLabelTramAll(e.target.value) }}>
                        <FormControlLabel value={'HienThi'} control={<Radio color="primary" />} label="Hi???n th??? t??n tr???m" />
                        <FormControlLabel value={'An'} control={<Radio color="primary" />} label="???n t??n tr???m" />
                      </RadioGroup>
                    </div>
                  </div>
                </div>


                <div >

                  {/* </FormControl> */}
                </div>

              </div>
              <div style={optionEffectObject === 'LoadTruTrungTheFromPMIS' ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%', }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>?????ng b??? tr??? trung th??? t??? PMIS</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1, width: '100%', paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ display: 'flex', width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }}>
                      <Button color="primary" onClick={() => {
                        document.getElementById('buttonLuuTruTrungTheFromPMIS').click();
                      }
                      }>
                        L??u th??ng tin
                    </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div style={optionEffectObject === 'ChangeManyObject' ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%', }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Chuy???n tr???m nhi???u ?????i t?????ng</h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                  {listTram !== null ?
                    <MAutocomplete
                      id="autocompleteTram"
                      title="T??n Tr???m"
                      value={tramChangeManyObject}
                      options={listTram}
                      getOptionLabel={option => option.mA_TRAM + " -- " + option.teN_TRAM}
                      style={{ width: 300 }}
                      renderInput={params => <TextField {...params} label="M?? -- T??n Tr???m" variant="outlined" />}
                      onChange={(e, v) => {
                        if (v != null) {
                          setTramChangeManyObject(v);
                        }
                      }}
                    />
                    :
                    null
                  }
                </div>
              </div>
              <div style={optionEffectObject === 'ImportExcel' ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%', }}>
                <ImportExcelComponent />
              </div>
              <div style={optionEffectObject === 'GetToaDoKHFromGCS' ? { display: 'flex', flexDirection: 'column', width: '100%', } : { display: 'none', flexDirection: 'column', width: '100%', }}>
                <DongBoToaDoKHFromGCSComponent maTramCurrent={maTramSelected} maDonViCurrent={maDonViSelected} setShowModalLoading={setShowModalLoading} />
              </div>
            </div>
          </Col>
          <Col xs="12" sm="12" md="7" lg="8" xl="9" style={{ padding: 0, margin: 0 }} id="mapCol">
            <LoadingContext.Provider value={showModalLoading}>
              <OptionEffectObjectContext.Provider value={{ value: optionEffectObject, setOptionEffectObject: functionSetOptionEffectObject }}>
                <ListKhachHangContext.Provider value={listKhachHang}>
                  <ListTruContext.Provider value={listTru}>
                    <ListLineContext.Provider value={listLine}>
                      <ObjectSelectedContext.Provider value={objectSelected}>
                        <ListKhachHangNoLineContext.Provider value={{ value: listKhachHangNoLine, setListKhachHangNoLine: functionSetListKhachHangNoLine }}>
                          <Map
                            pointCenter={pointCenter}
                            functionSetObjectSelected={functionSetObjectSelected}
                            functionSetPointCenter={functionSetPointCenter}
                            resultLocationSearchBox={resultLocationSearchBox}
                            resultLocationTypingBox={resultLocationTypingBox}
                            functionSetResultLocationSearchBox={functionSetResultLocationSearchBox}
                            functionSetResultLocationTypingBox={functionSetResultLocationTypingBox}
                            functionSetListTru={functionSetListTru}
                            functionSetListKhachhang={functionSetListKhachhang}
                            functionSetListLine={functionSetListLine}
                            defaultPointCenter={defaultPointCenter}
                            maDonViSelected={maDonViSelected}
                            maTramSelected={maTramSelected}
                            tram={tram}
                            setTram={functionSetTram}
                            listTram={listTram}
                            listKhachHangHasLine={listKhachHangHasLine}
                            setListKhachHangHasLine={functionSetListKhachHangHasLine}
                            locationDirectionCurrent={locationDirectionCurrent}
                            setLocationDirectionCurrent={functionSetLocationDirectionCurrent}
                            reloadPage={reloadPage}
                            reloadLine={reloadLine}
                            typeTruAdd={typeTruAdd}
                            sizeTruHaThe={sizeTruHaThe}
                            sizeTruTrungThe={sizeTruTrungThe}
                            sizeTram={sizeTram}
                            sizeKhachHang={sizeKhachHang}
                            sizeLine={sizeLine}
                            setShowModalLoading={functionSetShowModalLoading}
                            setCurrentLocation={functionSetCurrentLocation}
                            currentLocation={currentLocation}
                            flagOnlyView={flagOnlyView}
                            sizeTramAll={sizeTramAll}
                            showLabelTramAll={showLabelTramAll}
                            tramChangeManyObject={tramChangeManyObject}
                            setTramChangeManyObject={setTramChangeManyObject}
                            flagShowLableKH={flagShowLableKH}
                            searchObjectKhachHang={searchObjectKhachHang}
                            tenTramSelected={tenTramSelected}
                          />
                        </ListKhachHangNoLineContext.Provider>
                      </ObjectSelectedContext.Provider>
                    </ListLineContext.Provider>
                  </ListTruContext.Provider>
                </ListKhachHangContext.Provider>
              </OptionEffectObjectContext.Provider>
            </LoadingContext.Provider>
            {flagOnlyView ? <div
              onClick={() => {
                setFlagShowLableKH(!flagShowLableKH);
              }}
              title="T??n Kh??ch H??ng"
              style={{
                display: 'flex', position: 'absolute', bottom: 30, left: 10, width: 64, height: 64,
                //background: rgba(0, 0, 0, .3),
                backgroundColor: '#A8AAAA',
                borderRadius: 8,

                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <AiFillAmazonCircle size={60} color="#485DF9" />
            </div> :
              <>
                <div
                  onClick={() => {
                    document.getElementById("buttonRemoveObjectHasAdd").click();
                  }}
                  title="Thay ?????i h?????ng v???"
                  style={{
                    display: 'flex', position: 'absolute', bottom: 30, left: 10, width: 64, height: 64,
                    //background: rgba(0, 0, 0, .3),
                    backgroundColor: '#A8AAAA',
                    borderRadius: 8,

                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <AiOutlineFall size={60} color="#485DF9" />
                </div>
                <div
                  onClick={() => {
                    document.getElementById("buttonUndo").click();
                  }}
                  title="Ph???c h???i thao t??c"
                  style={{
                    display: 'flex', position: 'absolute', bottom: 30, left: 84, width: 64, height: 64,
                    //background: rgba(0, 0, 0, .3),
                    backgroundColor: '#A8AAAA',
                    borderRadius: 8,

                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <GiReturnArrow size={60} color="#485DF9" />
                </div>

                <div
                  onClick={() => {
                    setFlagShowLableKH(!flagShowLableKH);
                  }}
                  title="T??n Kh??ch H??ng"
                  style={{
                    display: 'flex', position: 'absolute', bottom: 30, left: 84 + 74, width: 64, height: 64,
                    //background: rgba(0, 0, 0, .3),
                    backgroundColor: '#A8AAAA',
                    borderRadius: 8,

                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <AiFillAmazonCircle size={60} color="#485DF9" />
                </div>

                <div
                  onClick={() => {
                    setOpenBackupModal(true);
                  }}
                  title="Backup"
                  style={{
                    display: 'flex', position: 'absolute', bottom: 30, left: 84 + 74 + 74, width: 64, height: 64,
                    //background: rgba(0, 0, 0, .3),
                    backgroundColor: '#A8AAAA',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <FaCloudDownloadAlt size={60} color="#485DF9" />
                </div>

              </>

            }
            <div style={{ display: 'none' }}>
              <Button id="buttonOpenAddRoleDrawer" onClick={() => {
                setOpenAddRoleModal(true);
              }}>

              </Button>
              <Button id="buttonCloseAddRoleDrawer" onClick={() => {
                setOpenAddRoleModal(false);
              }}>

              </Button>
              <Button id="buttonOpenRemoveLockTram" onClick={() => {
                setOpenRemoveLockTram(true);
              }}>

              </Button>
              <Button id="buttonCloseRemoveLockTram" onClick={() => {
                setOpenRemoveLockTram(false);
              }}>

              </Button>
            </div>
          </Col>
        </Row >
        <Modal size='lg' isOpen={openDanhSachCanhBaoModal}>
          <ModalHeader>
            Th??ng B??o!!!
           </ModalHeader>
          <ModalBody>
            Danh s??ch h??ng thay ?????i do sang t???i chuy???n l?????i x???y ra:
            <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>#</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? ????n V??? Qu???n L??</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? ??i???m ??o</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Ghi Ch??</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? Tr???m C??</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? Tr???m M???i</th>
                  </tr>
                </thead>
                <tbody>
                  {listKhachHangCanhBao !== null ? listKhachHangCanhBao.map((kh, i) => {
                    return <tr>
                      <th scope="row">{i + 1}</th>
                      <td>{kh.mA_DVIQLY}</td>
                      <td>{kh.mA_DDO}</td>
                      <td>{kh.ghI_CHU === "MISSING" ? '??i???m ??o ???? ???????c sang t???i qua tr???m kh??c, m?? tr???m m???i l??: ' + kh.mA_TRAM_MOI : '??i???m ??o m???i ???????c chuy???n sang tr???m kh??c, m?? tr???m c?? l??: ' + kh.mA_TRAM_CU}</td>
                      <td>{kh.mA_TRAM_CU}</td>
                      <td>{kh.mA_TRAM_MOI}</td>
                    </tr>
                  }) : <tr>
                    <td colSpan='6'>
                      Kh??ng c?? d??? li???u
                  </td>
                  </tr>}
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>

            <Button variant="primary"
              onClick={() => {
                setOpenDanhSachCanhBaoModal(false);
                let tmp = 0;
                if (listKhachHang !== null) {
                  listKhachHang.map((kh, i) => {
                    if (kh.toA_DO === null) {
                      tmp++;
                    } else if (kh.toA_DO.longitude === null && kh.toA_DO.latitude === null) {
                      tmp++;
                    } else if (kh.toA_DO.longitude === "0" && kh.toA_DO.latitude === "0") {
                      tmp++;
                    } else if (kh.toA_DO.latitude === null) {
                      tmp++;
                    } else if (kh.toA_DO.longitude === null) {
                      tmp++;
                    } else if (kh.toA_DO.latitude === "0") {
                      tmp++;
                    } else if (kh.toA_DO.longitude === "0") {
                      tmp++;
                    } else if (kh.toA_DO.longitude === "" && kh.toA_DO.latitude === "") {
                      tmp++;
                    } else if (kh.toA_DO.latitude === "") {
                      tmp++;
                    } else if (kh.toA_DO.longitude === "") {
                      tmp++;
                    }
                    if (tmp !== 0) {
                      setOpenDanhSachNotLoactionModal(true);
                    }
                  })
                }

              }}

            >
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openDanhSachCanhBaoByDonViModal}>
          <ModalHeader>
            Th??ng B??o!!!
           </ModalHeader>
          <ModalBody>
            Danh s??ch h??ng thay ?????i do sang t???i chuy???n l?????i x???y ra:
            <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>#</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? ????n V??? Qu???n L??</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? ??i???m ??o</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Ghi Ch??</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? Tr???m C??</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? Tr???m M???i</th>
                  </tr>
                </thead>
                <tbody>
                  {listKhachHangCanhBaoByDonVi !== null ? listKhachHangCanhBaoByDonVi.map((kh, i) => {
                    return <tr>
                      <th scope="row">{i + 1}</th>
                      <td>{kh.mA_DVIQLY}</td>
                      <td>{kh.mA_DDO}</td>
                      <td>{kh.ghI_CHU === "MISSING" ? '??i???m ??o ???? ???????c sang t???i qua tr???m kh??c, m?? tr???m m???i l??: ' + kh.mA_TRAM_MOI : '??i???m ??o m???i ???????c chuy???n sang tr???m n??y, m?? tr???m c?? l??: ' + kh.mA_TRAM_CU}</td>
                      <td>'{kh.mA_TRAM_CU}</td>
                      <td>'{kh.mA_TRAM_MOI}</td>
                    </tr>
                  }) : <tr>
                    <td colSpan='6'>
                      Kh??ng c?? d??? li???u
                  </td>
                  </tr>}
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="primary"
              onClick={() => {
                setOpenDanhSachCanhBaoByDonViModal(false);

              }}

            >
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openDanhSachKhachHangMoiModal}>
          <ModalHeader>
            Th??ng B??o!!!
           </ModalHeader>
          <ModalBody>
            Danh s??ch h??ng m???i:
            <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>#</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? ????n V???</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? Tr???m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? Kh??ch H??ng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>T??n Kh??ch H??ng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Ng??y Th??m</th>
                  </tr>
                </thead>
                <tbody>
                  {listKhachHangMoi !== null ? listKhachHangMoi.map((kh, i) => {
                    return <tr>
                      <th scope="row">{i + 1}</th>
                      <td>{kh.mA_DVIQLY}</td>
                      <td style={{ "mso-number-format": "'\@'" }}>{kh.mA_TRAM}</td>
                      <td>{kh.mA_KHANG}</td>
                      <td>{kh.teN_KHANG}</td>
                      <td>{kh.ngaY_THEM}</td>
                    </tr>
                  }) : <tr>
                    <td colSpan='6'>
                      Kh??ng c?? d??? li???u
                  </td>
                  </tr>}
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>

            <Button variant="primary"
              onClick={() => {
                setOpenDanhSachKhachHangMoiModal(false);
              }}

            >
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openDanhSachNotLoactionModal} >
          <ModalHeader>
            Th??ng B??o!!!
          </ModalHeader>
          <ModalBody>
            Danh s??ch c??c kh??ch h??ng kh??ng c?? t???a ?????, c???n c???p nh???t b??n ch????ng tr??nh ghi ch??? s??? mobile
            <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="listKhachHangNoLocation">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? ????n V??? Qu???n L??</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? ??i???m ??o</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Kinh ?????</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>V?? ?????</th>
                  </tr>
                </thead>
                <tbody>
                  {listKhachHang !== null ? listKhachHang.map((kh, i) => {
                    if (kh.toA_DO === null) {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>Kh??ng c?? t???a ?????</td>
                        <td>Kh??ng c?? t???a ?????</td>
                      </tr>
                    } else if (kh.toA_DO.longitude === null && kh.toA_DO.latitude == null) {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>Kh??ng c?? t???a ?????</td>
                        <td>Kh??ng c?? t???a ?????</td>
                      </tr>
                    } else if (kh.toA_DO.longitude === "0" && kh.toA_DO.latitude === "0") {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                    } else if (kh.toA_DO.longitude === "" && kh.toA_DO.latitude === "") {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    } else if (kh.toA_DO.longitude === "") {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td></td>
                        <td>{kh.toA_DO.latitude}</td>
                      </tr>
                    } else if (kh.toA_DO.latitude === "") {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>{kh.toA_DO.longitude}</td>
                        <td></td>
                      </tr>
                    } else if (kh.toA_DO.longitude == null) {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>Kh??ng c?? t???a ?????</td>
                        <td>{kh.toA_DO.latitude}</td>
                      </tr>
                    } else if (kh.toA_DO.latitude == null) {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>{kh.toA_DO.longitude}</td>
                        <td>Kh??ng c?? t???a ?????</td>
                      </tr>
                    } else if (kh.toA_DO.longitude == "0") {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>0</td>
                        <td>{kh.toA_DO.latitude}</td>
                      </tr>
                    } else if (kh.toA_DO.latitude == "0") {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>{kh.toA_DO.longitude}</td>
                        <td>0</td>
                      </tr>
                    }
                    // else{
                    //   return <tr>
                    //     <td>{kh.mA_DVIQLY}</td>
                    //     <td>{kh.mA_DDO}</td>
                    //     <td>{kh.toA_DO.longitude}</td>
                    //     <td>{kh.toA_DO.latitude}</td>
                    //   </tr>
                    // }
                  }) :
                    <tr>
                      <td colSpan='4'>
                        Kh??ng c?? d??? li???u
                      </td>
                    </tr>
                  }
                </tbody>
              </Table>

            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileListKhachHangNoLocation").click();
            }
            }>
              Xu???t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenDanhSachNotLoactionModal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu1Modal} >
          <ModalHeader>
            Th???ng k?? tr???ng th??i tr???m c??ng c???ng
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeTramCC">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">????n v???</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">????n v???</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', height: 72 }} colSpan="3">S??? l?????ng b???n v??? tr???m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">T???ng</th>
                  </tr>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': '72px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >???? V???</th>
                    <th style={{ 'position': 'sticky', 'top': '72px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >??ang v???</th>
                    <th style={{ 'position': 'sticky', 'top': '72px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Ch??a V???</th>
                  </tr>
                </thead>
                <tbody id="tbodyBieu1">
                  {dataBieu1Modal !== null ?
                    <tr>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}></td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}>T???ng</td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}></td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}>{dataBieu1Modal.filter(item => item.vE_SODO === '2').length}</td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}>{dataBieu1Modal.filter(item => item.vE_SODO === '1').length}</td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}>{dataBieu1Modal.length - dataBieu1Modal.filter(item => item.vE_SODO === '2').length - dataBieu1Modal.filter(item => item.vE_SODO === '1').length}</td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}>{dataBieu1Modal.length}</td>
                    </tr>
                    :
                    <tr>
                      <td>
                        Kh??ng c?? d??? li???u
                      </td>
                    </tr>
                  }
                  {dataBieu1Modal !== null ? dataBieu1Modal.sort((x, y) => x.vE_SODO < y.vE_SODO ? 1 : -1).map((item, index) =>
                    <tr onClick={() => {
                      linkSelectTram(item.mA_TRAM);
                      setOpenBieu1Modal(false);
                    }}>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}>{index + 1}</td>
                      <td style={{ color: 'blue', 'border': '1px solid white', 'border-color': '#000000', "mso-number-format": "'\@'" }} > {"'" + item.mA_TRAM}</td>
                      <td style={{ color: 'blue', 'border': '1px solid white', 'border-color': '#000000' }}>{item.teN_TRAM}</td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}>{item.vE_SODO === '2' ? 'x' : ''}</td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}>{item.vE_SODO === '1' ? 'x' : ''}</td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}>{item.vE_SODO === '0' || item.vE_SODO === '0' ? 'x' : ''}</td>
                      <td style={{ 'border': '1px solid white', 'border-color': '#000000' }}></td>
                    </tr>
                  )
                    :
                    <CircleLoadingComponent />
                  }
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileThongKeTramCC").click();
            }
            }>
              Xu???t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu1Modal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu2Modal} >
          <ModalHeader>
            Th???ng k?? kh??ch h??ng ch??a g???n v??o b???n v???
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeKhachHangSaiMaTram">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>T??n tr???m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>T???ng s??? kh??ch h??ng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>T???ng s??? kh??ch h??ng ch??a g???n v??o b???n v???</th>
                  </tr>
                </thead>
                <tbody id="tbodyBieu2">
                  {
                    dataBieu2Modal !== null ?
                      dataBieu2Modal.map((item, index) =>
                        <tr>
                          <td >{index + 1}</td>
                          <td >{item.teN_TRAM}</td>
                          <td >{item.sO_KH}</td>
                          <td >{item.sO_KH - (Number(item.sO_DAY_KH) + Number(item.sO_DAY_KH_TRU) + Number(item.sO_DAY_KH_TRAM))}</td>
                        </tr>
                      )
                      :
                      <tr>
                        <td>
                          Kh??ng c?? d??? li???u
                      </td>
                      </tr>
                  }
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileThongKeKhachHangSaiMaTram").click();
            }
            }>
              Xu???t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu2Modal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu3Modal} >
          <ModalHeader>
            Th???ng k?? tr???ng th??i t???a ?????
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeTrangThaiToaDo">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">????n v???</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="3">S??? l?????ng tr???m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="2">S??? l?????ng kh??ch h??ng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tr???ng th??i</th>
                  </tr>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >T???ng s??? tr???m</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >C?? t???a ?????</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Ch??a c?? t???a ?????</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >C?? t???a ?????</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Ch??a c?? t???a ?????</th>

                  </tr>
                </thead>
                <tbody id="tbodyBieu3">
                  {
                    dataBieu3Modal !== null ?

                      dataBieu3Modal.map((item, index) =>
                        <tr>
                          <td >{index + 1}</td>
                          <td >{item.teN_DVIQLY}</td>
                          <td >{item.tongsO_TRAM}</td>
                          <td >{item.sotraM_COTOADO}</td>
                          <td >{item.sotraM_KHONGTOADO}</td>
                          <td >{item.sO_KHCOTOADO}</td>
                          <td >{item.sO_KHKOTOADO}</td>
                          <td></td>
                        </tr>
                      )
                      :
                      <tr>
                        <td>
                          Kh??ng c?? d??? li???u
                      </td>
                      </tr>
                  }
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>

            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileThongKeTrangThaiToaDo").click();
            }
            }>
              Xu???t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu3Modal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu4Modal} >
          <ModalHeader>
            Th???ng k?? danh s??ch tr???m theo t???a ?????
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeDanhSachTramTheoToaDo">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">T??n tr???m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="3">S??? l?????ng kh??ch h??ng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tr???ng th??i</th>
                  </tr>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >T???ng</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >C?? t???a ?????</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Ch??a c?? t???a ?????</th>

                  </tr>
                </thead>
                <tbody id="tbodyBieu4">
                  {
                    dataBieu4Modal !== null ?
                      dataBieu4Modal.map((item, index) =>
                        <tr>
                          <td >{index + 1}</td>
                          <td >{item.teN_TRAM}</td>
                          <td >{Number(item.kH_COTOADDO) + Number(item.kH_KOTOADO)}</td>
                          <td >{item.kH_COTOADDO}</td>
                          <td >{item.kH_KOTOADO}</td>
                          <td></td>

                        </tr>
                      )
                      :
                      <tr>
                        <td>
                          Kh??ng c?? d??? li???u
                      </td>
                      </tr>
                  }
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>

            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileThongKeDanhSachTramTheoToaDo").click();
            }
            }>
              Xu???t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu4Modal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu5Modal} >
          <ModalHeader>
            Th???ng k?? tr???ng th??i kh??ch h??ng theo t???a ?????
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeTrangThaiKhachHangTheoTaoDo">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">T??n kh??ch h??ng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="3">Th??ng tin</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tr???ng th??i</th>
                  </tr>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >T???ng </th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >C?? t???a ?????</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Ch??a c?? t???a ?????</th>

                  </tr>
                </thead>
                <tbody id="tbodyBieu5">
                  {
                    dataBieu5Modal !== null ?

                      dataBieu5Modal.map((item, index) =>
                        <tr>
                          <td >{index + 1}</td>
                          <td >{item.teN_KHANG}</td>
                          <td >{item.tongsO_TRAM}</td>
                          <td >{item.cO_TOADO === '1' ? 'x' : ''}</td>
                          <td >{item.cO_TOADO === '0' ? 'x' : ''}</td>
                          <td></td>
                        </tr>
                      )
                      :
                      <tr>
                        <td>
                          Kh??ng c?? d??? li???u
                      </td>
                      </tr>
                  }
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>

            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileTrangThaiKhachHangTheoTaoDo").click();
            }
            }>
              Xu???t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu5Modal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu6Modal} >
          <ModalHeader>
            T???ng h???p tr???ng th??i tr???m c??ng c???ng
          </ModalHeader>
          <ModalBody>
            {
              dataBieu6Modal === null ? <CircleLoadingComponent /> : <ThongKeTCCByCTYAndTCTComponent data={dataBieu6Modal} maDonVi={initContext.maDonVi === 'PB' ? 'PB' : initContext.maDonVi.slice(0, 4)} />
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileThongKeTramCCByUnit").click();
            }
            }>
              Xu???t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu6Modal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu7Modal} >
          <ModalHeader>
            Th???ng k?? danh s??ch tr???m ch??a c?? t???a ?????:
          </ModalHeader>
          <ModalBody>
            {
              listTram === null ? <CircleLoadingComponent /> : <ThongKeTaoDoTramComponent data={listTram} />
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileThongKeDanhSachTramTheoToaDo").click();
            }
            }>
              Xu???t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu7Modal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu8Modal} >
          <ModalHeader>
            Th???ng k?? tr???m theo ng??y!
          </ModalHeader>
          <ModalBody>
            <FormGroup className={classes.formControl} row>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  label="T??? Ng??y"
                  value={fromDateBieu8}
                  onChange={(e) => setFromDateBieu8(e)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}

                />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  label="T??? Ng??y"
                  value={toDateBieu8}
                  onChange={(e) => setToDateBieu8(e)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  style={{ marginLeft: 10 }}
                />
                <FormControl className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal" style={{ width: 238, height: 48 }}>
                  <InputLabel >Tr???ng Th??i B???n V???</InputLabel>
                  <Select
                    labelId="Tr???ng Th??i B???n V???"
                    value={statusTramBieu8}
                    label="Tr???ng Th??i B???n V???"
                    onChange={(e) => setStatusTramBieu8(e.target.value)
                    }
                    style={{ marginLeft: 10 }}
                  >
                    <MenuItem value={"0"}>Ch??a V???</MenuItem>
                    <MenuItem value={"1"}>??ang V???</MenuItem>
                    <MenuItem value={"2"}>???? V???</MenuItem>
                  </Select>
                </FormControl>
              </MuiPickersUtilsProvider>
              <FormControl style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Button color="success" onClick={() => {
                  const fromDate = fromDateBieu8.getDate() + '/' + (fromDateBieu8.getMonth() + 1) + '/' + fromDateBieu8.getFullYear();
                  const toDate = toDateBieu8.getDate() + '/' + (toDateBieu8.getMonth() + 1) + '/' + toDateBieu8.getFullYear();
                  fetch(URLAPI4001 + '/Api/SangTaiChuyenLuoi/getLogByDate', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                      {
                        MADONVI: maDonViSelected,
                        TUNGAY: fromDate,
                        DENNGAY: toDate,
                        LOAI: statusTramBieu8
                      }
                    )
                  })
                    .then((response) => {
                      if (response.status === 200) {
                        return response.json();
                      }
                      return null;
                    })
                    .then((res) => {
                      if (res !== null) {

                        setDataBieu8Modal(res);
                      }
                    })
                    .catch((error) => {
                      console.error(error);
                    })
                }}>
                  T??m Ki???m
              </Button>

              </FormControl>
            </FormGroup>
            {
              dataBieu8Modal === null ? <CircleLoadingComponent /> : <ThongKeTinhHinhVeTheoNgayComponent data={dataBieu8Modal} />
            }
          </ModalBody>
          <ModalFooter>
            {/* <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileThongKeDanhSachTramTheoToaDo").click();
            }
            }>
              Xu???t Excel
            </Button> */}
            <Button variant="primary" onClick={() => {
              setOpenBieu8Modal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openAddRoleModal} >
          <ModalHeader>
            Ph??n quy???n v???
          </ModalHeader>
          <ModalBody>
            {initContext.maDonVi !== null ?
              <AddRoleDrawerComponent maDonVi={initContext.maDonVi === 'PB' ? 'PB' : initContext.maDonVi.slice(0, 4)} />
              :
              <CircleLoadingComponent />
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={() => {
              setOpenAddRoleModal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openRemoveLockTram} >
          <ModalHeader>
            X??a Kh??a B???n V???
          </ModalHeader>
          <ModalBody>
            {initContext.maDonVi !== null ?
              <RemoveLockTramComponent maDonVi={initContext.maDonVi === 'PB' ? 'PB' : initContext.maDonVi.slice(0, 4)} />
              :
              <CircleLoadingComponent />
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={() => {
              setOpenRemoveLockTram(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBackupModal} >
          <ModalHeader>
            D??? li???u b???n v???
          </ModalHeader>
          <ModalBody>
            {initContext.maDonVi !== null && listKhachHang !== null && listTru !== null && listLine !== null && maTramSelected !== null && listTram ?
              // <BackupDataTramComponent maDonVi={initContext.maDonVi} maTram={maTramSelected} listTru={listTru} tramCurrent={listTram.filter(item=>item.mA_TRAM===maTramSelected)} listKhachHang={listKhachHang} listLine={listLine} />
              <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
                <Table striped style={{ width: '100%', height: '100%' }} id="backUpTram">
                  <thead>
                    <tr>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? ????n V???</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>M?? Tr???m</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Loai ?????i T?????ng</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Loai Chi Ti???t</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>T??n ?????i T?????ng</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Kinh ????? ?????i T?????ng</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>V?? ????? ?????i T?????ng</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Kinh ????? Nh??n</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>V?? ????? Nh??n</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>ID ?????i T?????ng</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>ID Point 1</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>ID Point 2</th>
                      <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Danh S??ch Kh??ch H??ng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listKhachHang !== null && listKhachHang.length !== 0 ? listKhachHang.map((kh, i) => {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td></td>
                        <td>KhachHang</td>
                        <td></td>
                        <td>{kh.teN_KHANG}</td>
                        <td>{kh.toA_DO !== undefined && kh.toA_DO !== null ? kh.toA_DO.longitude : ''}</td>
                        <td>{kh.toA_DO !== undefined && kh.toA_DO !== null ? kh.toA_DO.latitude : ''}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                      </tr>
                    })
                      :
                      null
                    }
                    {listTru !== null && listTru.length !== 0 ? listTru.map(item => {
                      return <tr>
                        <td>{item.mA_DVIQLY}</td>
                        <td style={{ "mso-number-format": "'\@'" }}>{item.mA_TRAM}</td>
                        <td>Tru</td>
                        <td>{item.typE_E}</td>
                        <td>{item.namE_E}</td>
                        <td>{item.longitude}</td>
                        <td>{item.latitude}</td>
                        <td>{item.longitudE_LABEL}</td>
                        <td>{item.latitudE_LABEL}</td>
                        <td>{item.iD_ELEMENT}</td>
                        <td></td>
                        <td></td>
                        <td>{item.dS_DIEMDO !== null && item.dS_DIEMDO !== undefined ? item.dS_DIEMDO.toString() : ''}</td>

                      </tr>
                    })
                      :
                      null
                    }
                    {listLine !== null && listLine.length !== 0 ? listLine.map(item => {
                      return <tr>
                        <td>{item.mA_DVIQLY}</td>
                        <td style={{ "mso-number-format": "'\@'" }}>{item.mA_TRAM}</td>
                        <td>DuongDay</td>
                        <td>{item.typE_E}</td>
                        <td>{item.namE_E}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{item.iD_ELEMENT}</td>
                        <td>{item.iD_POINT1}</td>
                        <td>{item.iD_POINT2}</td>
                        <td></td>

                      </tr>
                    })
                      :
                      null
                    }
                  </tbody>
                </Table>
              </div>
              :
              <CircleLoadingComponent />
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="success" onClick={() => {
              document.getElementById("buttonBackUpTram").click();
              setOpenBackupModal(false);
            }
            }>
              Xu???t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBackupModal(false)
            }
            }>
              Tho??t
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openSearchModal} >
          <ModalHeader>
            T??m Kh??ch H??ng!
          </ModalHeader>
          <ModalBody>
            <TextField
              id="outlined-search"
              style={{ width: '50%' }}
              value={searchMaKhachHang}
              onChange={(e) => setSearchMaKhachHang(e.target.value)}
              label="M?? ??i???m ??o (16 K?? T???)"
              type="search"
              variant="outlined"
              placeholder='M?? M?? ??i???m ??o (16 K?? T???)'
              error={searchMaKhachHang !== null && searchMaKhachHang !== undefined && searchMaKhachHang.length !== 16 ? true : false}
              helperText={searchMaKhachHang !== null && searchMaKhachHang !== undefined && searchMaKhachHang.length !== 16 ? "M?? ??i???m ??o Sai ?????nh D???ng" : ""}
            />

          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="success" onClick={() => {
              if (searchMaKhachHang !== null && searchMaKhachHang !== undefined && searchMaKhachHang.length !== 16) {

              } else {

                fetch(URLAPI4001 + '/Api/SangTaiChuyenLuoi/searchKhachHang?maDonVi=' + maDonViSelected + '&maDDo=' + searchMaKhachHang, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  }
                })
                  .then(response => {

                    if (response.status === 200) {
                      return response.json();
                    }
                    return null;
                  })
                  .then(responseJson => {
                    if (responseJson !== null && responseJson.length !== 0) {
                      setSearchObjectKhachHang(responseJson[0]);
                      setOpenSearchModal(false);
                      setPointCenter({ lat: Number(responseJson[0].LATITUDE), lng: Number(responseJson[0].LONGITUDE) })
                    } else {
                      alert('Kh??ng T??m Th???y M?? Kh??ch H??ng T????ng ???ng');
                    }
                  })
                  .catch(ex => {
                    alert(ex.toString());
                  })
              }
            }
            }>
              T??m
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenSearchModal(false)
            }
            }>
              H???y
            </Button>
          </ModalFooter>
        </Modal>

      </Container >
    );
  }
}

export default App;
