import React, { useState, useEffect, useContext } from 'react';
import logo from './asset/images/logo.svg';
import './App.css';
import { Container, Row, Col, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import MAutocomplete from '@material-ui/lab/Autocomplete';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import listLocation21PC from './data/DanhSachToaDo21PC';
import Map from './components/CustomerLostPowerComponent/MapComponent';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
// import SimpleTooltip from './components/SimpleTooltips';
//import dataDonVi from './data/DanhSachDonVi';
import ChangLocationByTypingComponent from './components/ChangLocationByTypingComponent';
import ViewInfoKhachHangComponent from './components/ViewInfoKhachHangComponent';
import ViewInfoTruComponent from './components/ViewInfoTruComponent';
import ViewInfoLineComponent from './components/ViewInfoLineComponent';
import { InitPageContext } from './MainScreen';
import CircleLoadingComponent from './components/CircleLoadingComponent';

import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiOutlineFall, AiFillAmazonCircle } from 'react-icons/ai';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
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
import SelectListTramComponent from './components/ModalComponent/SelectListTramComponent';
import { URLAPI, URLAPI4001, URLLOCAL } from './constants/UrlApi';
import SelectCustomerLostPowerComponent from './components/ModalComponent/SelectCustomerLostPowerComponent';

export const ListKhachHangContext = React.createContext();
export const ListTruContext = React.createContext();
export const ListLineContext = React.createContext();
export const OptionEffectObjectContext = React.createContext();
export const ObjectSelectedContext = React.createContext();
export const LoadingContext = React.createContext();
export const ListKhachHangNoLineContext = React.createContext();

export default function CustomerLostPowerScreen() {
  console.log('Multi screen');
  const history = useHistory();
  const initContext = useContext(InitPageContext);
  const [listCustomerLostPower, setListCustomerLostPower] = useState(null);
  const [listCustomerLostPowerFix, setListCustomerLostPowerFix] = useState([]);
  const [customerLostPowerSelected, setCustomerLostPowerSelected] = useState(null);
  const [openSelectCustomerLostPower, setOpenSelectCustomerLostPower] = useState(false);
  const [tram, setTram] = useState(null);
  const [flagShowLableKH, setFlagShowLableKH] = useState(true);
  const [listTramCurrent, setListTramCurrent] = useState(null);
  const [listKhachHang, setListKhachHang] = useState([{
    "mA_DVIQLY": "PB0203",
    "mA_DDO": "PB02030077960001",
    "mA_KHANG": "PB02030077960",
    "teN_KHANG": "Nguyễn Thị Thu Huyền",
    "sO_NHA": "Tổ 8,",
    "duonG_PHO": "thôn 2, xã Nam Chính (HA06 TT Nước SH N.Chính)",
    "mA_HDONG": "60600120001051",
    "doanH_SO": "08-00102",
    "sO_HO": "1",
    "sO_TBI": "04147241",
    "loaI_TBI": "HC",
    "chuoI_GIA": "KT: 100%*SHBT-A",
    "vtrI_TREO": "Trên cột ngoài nhà",
    "sO_COT": "HA06",
    "toA_DO": {
      "longitude": "",
      "latitude": ""
    },
    "ghI_CHU": null,
    "mA_TRAM_CU": null,
    "mA_TRAM_MOI": null,
    "ngaY_CHUYEN": null
  }]);
  const [listTru, setListTru] = useState([
    {
      "mA_DVIQLY": "PB0502",
      "iD_ELEMENT": "1368",
      "mA_TRAM": "050226060",
      "typE_E": "THATHE",
      "namE_E": "a",
      "longitude": "",
      "latitude": "",
      "longitudE_LABEL": "",
      "latitudE_LABEL": "",
      "dS_DIEMDO": [
      ]
    }
  ]);
  const [listLine, setListLine] = useState([
    {
      "mA_DVIQLY": "PB0502",
      "iD_ELEMENT": "2320",
      "mA_TRAM": "050226060",
      "typE_E": "DDIEN",
      "namE_E": "Dây điện",
      "mA_DDO": "",
      "iD_POINT1": "1369",
      "toadO_P1": {
        "longitude": "",
        "latitude": ""
      },
      "iD_POINT2": "",
      "toadO_P2": null
    }
  ]);
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
  const [categoryDirection, setCategoryDirection] = useState('Address');
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
  const [khachHangKhongCoDuLieu, setKhachHangKhongCoDuLieu] = useState(null);
  const [textSearchKhachHangKhongCoDuLieu, setTextSearchKhachHangKhongCoDuLieu] = useState(null);
  const [locationDirectionCurrent, setLocationDirectionCurrent] = useState(null);
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
  const functionSetCurrentLocation = (v) => setCurrentLocation(v);
  const [openSelectTramModal, setOpenSelectTramModal] = useState(false);
  const [reload, setReload] = useState(false);
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

  const getData = (l) => {
    if (l === null || l.length === 0) { } else {
      let listKhachHangTmp = [];
      let tmp = 0;
      let listTruTmp = [];
      let tmpTru = 0;
      let listLineTmp = [];
      let tmpLine = 0;
      l.map((item, index) => {
        fetch(URLAPI + '/APIKTGS/KHANG?madvi=' + item.mA_DVIQLY + '&ma_tram=' + item.mA_TRAM)
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              return response.json();
            }
            return null;

          })
          .then((res) => {
            if (res !== null) {
              if (tmp === l.length - 1) {
                setListKhachHang([...listKhachHangTmp, ...res]);
              } else {
                tmp += 1;
                listKhachHangTmp = [...listKhachHangTmp, ...res];
              }
              //setListKhachHang([...listKhachHang, ...res]);
            }
          })
          .catch((error) => {
            console.error(error);
            alert(error);
          });

        fetch(URLAPI + '/APIKTGS/Drawing/getPoint?madvi=' + item.mA_DVIQLY + '&ma_tram=' + item.mA_TRAM)
          .then((response) => {
            if (response.status === 200) {

              return response.json();
            }
            return null;
          })
          .then((res) => {
            if (res !== null) {
              if (tmpTru === l.length - 1) {
                setListTru([...listTruTmp, ...res]);
              } else {
                tmpTru += 1;
                listTruTmp = [...listTruTmp, ...res];
              }
            }
          }

            //return responseJson.movies;
          )
          .catch((error) => {
            console.error(error);
            alert(error);
          })
        fetch(URLAPI + '/APIKTGS/Drawing/getLine?madvi=' + item.mA_DVIQLY + '&ma_tram=' + item.mA_TRAM)
          .then((response) => {
            if (response.status === 200) {

              return response.json();
            }
            return null;
          })
          .then((res) => {
            if (res !== null) {
              if (tmpLine === l.length - 1) {
                setListLine([...listLineTmp, ...res]);
              } else {
                tmpLine += 1;
                listLineTmp = [...listLineTmp, ...res];
              }
            }

            //return responseJson.movies;
          })
          .catch((error) => {
            console.error(error);
            alert(error);
          })
      });
      if (l[0].toado !== null && l[0].toado.longitude !== null && l[0].toado.latitude !== null && l[0].toado.longitude !== '' && l[0].toado.latitude !== '') {
        setPointCenter({ lng: Number(l[0].toado.longitude), lat: Number(l[0].toado.latitude) });
        setDefaultPointCenter({ lng: Number(l[0].toado.longitude), lat: Number(l[0].toado.latitude) });
        setTram(l[0]);
      } else {
        fetch(URLAPI + '/APIKTGS/TRAM/GETTOADOTRAM?MADVI=' + l[0].mA_DVIQLY + '&MATRAM=' + l[0].mA_TRAM)
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
                "mA_DVIQLY": l[0].mA_DVIQLY,
                "mA_TRAM": l[0].mA_TRAM,
                "teN_TRAM": l[0].teN_TRAM,
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
      }
    }
  }
  const getNameTram = (v) => {
    listTram.filter(i => i.mA_TRAM === v);
    return listTram[0].teN_TRAM;
  }


  // if (listTramCurrent !== null || listTramCurrent !== []) {
  //   getData(listTramCurrent)
  // }

  //let maDonVi = null;
  useEffect(() => {
    const currentDate = new Date();
    console.log('useEffect customer lost power init');
    setShowModalLoading(true);
    let maDonVi = initContext.maDonVi;

    fetch(URLLOCAL + '/Api/SangTaiChuyenLuoi/getCustomerLostPowerFix?ngay=' + currentDate.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }))
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        let tmp = [];
        res.map(i => {
          tmp.push(i.MAKHANG)
        })
        setListCustomerLostPowerFix(tmp);
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });

    // fetch(URLLOCAL + '/Api/SangTaiChuyenLuoi/getAllCurrentCustomerLostPower?maDonVi=' + maDonVi)
    fetch('http://10.170.215.79:4000/Api/SangTaiChuyenLuoi/getCustomerLostPower?maDonVi=' + maDonVi)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setListCustomerLostPower(res);
        fetch(URLAPI + '/APIKTGS/Dvi?madvi=' + maDonVi)
          .then((response) => {
            return response.json();
          })
          .then((responseJson) => {
            if (responseJson.length === 1) {
              setListDonVi(responseJson);
              setAutocompleteDonVi(responseJson[0])
            } else {
              setListDonVi(responseJson);
            }
            setShowModalLoading(false);
          })
          .catch((error) => {
            console.error(error);
            alert(error);
          });

      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  }, [reload])

  useEffect(() => {
    console.log('change customer lost power');
    console.log(customerLostPowerSelected);
    if (customerLostPowerSelected !== null && customerLostPowerSelected !== undefined) {
      // debugger;
      fetch(URLLOCAL + '/Api/SangTaiChuyenLuoi/getInfoCustomerLostPower?maKH=' + customerLostPowerSelected)
        .then((response) => {
          debugger;
          return response.json();
        })
        .then((res) => {
          // debugger;
          if (res !== null && res !== undefined && res.length !== 0) {
            setCustomerLostPowerSelected(res[0]);
            setPointCenter({ lat: Number(res[0].LATITUDE), lng: Number(res[0].LONGITUDE) });
            setShowModalLoading(false);
          } else {
            alert('Không tìm thấy khách hàng trong sơ đồ đơn tuyến');
            setShowModalLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        });
    }
  }, [customerLostPowerSelected])

  console.log('render in multiScreen');
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
            padding: 0, margin: 0, 'box-shadow': 'rgba(0, 0, 0, 0.3) 3px 10px 16px'
          }}>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
              <div style={{ display: 'flex', width: '100%', height: 100, flexDirection: 'row', backgroundColor: "#485DF9" }}>
                {/* <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TiThMenu size={32} color="black" onClick={() => setShowNavBar(false)} />
                  </div> */}
                <div style={{ display: 'flex', flex: 5, justifyContent: 'center', alignItems: 'center' }}>
                  <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'yellow', margin: 'auto' }}>Sơ đồ đơn tuyến NR -KH</h2>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
                </div>
              </div>
              {optionEffectObject === null ?
                <div>
                  {/* <div style={{ marginLeft: 20, marginRight: 20, borderColor: 'gray', 'border': '1px solid' }}></div> */}
                  <div style={{ display: 'flex', width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Khách Hàng Mất Điện</h4>
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <MAutocomplete
                      id="autocompleteDonVi"
                      title="Tên Đơn Vị Quản Lý"
                      options={listDonVi}
                      value={autocompleteDonVi}
                      getOptionLabel={option => option.teN_DVIQLY}
                      style={{ width: 300 }}
                      renderInput={params => <TextField {...params} label="Tên Đơn Vị Quản Lý" variant="outlined" />}

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
                      Tổng Số Khách Hàng Mất Điện: {listCustomerLostPower === null ? "0" : listCustomerLostPower.length}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      // history.push('/AppManyTram');
                      setOpenSelectCustomerLostPower(true);
                      // setFlagAutoCompleteSearch(true);
                    }}>Chọn Khách Hàng Cần Xem</Button>
                  </div>
                </div>
                :
                null
              }
              <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <RadioGroup aria-label="gender" name="radioGroupStatusTram" value={categoryDirection} onChange={(e) => {
                  setCategoryDirection(e.target.value);
                }}>
                  <FormControlLabel value={"Address"} control={<Radio color="primary" />} label="Địa Chỉ" />
                  <FormControlLabel value={"Location"} control={<Radio color="primary" />} label="Vị Trí" />
                </RadioGroup>
              </div>
              <div style={categoryDirection === 'Address' ? { display: 'flex', flexDirection: 'column', width: '100%', height: 150 } : { display: 'none', flexDirection: 'column', width: '100%', height: 150 }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Tìm đường theo địa chỉ</h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>

                  <LoadScript
                    id='script-loader'
                    // googleMapsApiKey="AIzaSyBddLOpOb8D7rMeWUvyQBkLPNKUaKPfXy4"
                    googleMapsApiKey="AIzaSyCFcCLWqtVrENo1ZLZ8CIdmnuRN0aXl_aw"
                    libraries={["places", "geometry"]}
                  >
                    <Autocomplete
                      onLoad={(e) => setLocationSearchBox(e)}
                      onPlaceChanged={() => {
                        if (locationSearchBox != null) {
                          setCurrentLocation({
                            lat: locationSearchBox.getPlace().geometry.location.lat(),
                            lng: locationSearchBox.getPlace().geometry.location.lng()
                          });
                        } else {
                        }
                      }}
                    >
                      <Input
                        id="inputStart"
                        type="text"
                        placeholder="Nhập địa chỉ của bạn..."
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
                    }}>Hủy</Button>
                  </div>
                </div>
              </div>

              <div style={categoryDirection === 'Location' ? { display: 'flex', flexDirection: 'column', width: '100%', height: 150 } : { display: 'none', flexDirection: 'column', width: '100%', height: 150 }}>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Tìm đường từ vị trí hiện tại</h4>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      navigator.geolocation.getCurrentPosition(showPosition => {
                        if (showPosition.coords.latitude !== null && showPosition.coords.longitude) {
                          setCurrentLocation({ lat: showPosition.coords.latitude, lng: showPosition.coords.longitude })
                        }
                      });
                    }}>Lấy vị trí hiện tại</Button>
                    <Button color="primary" style={{ marginLeft: 10 }} onClick={() => {
                      setObjectSelected({ type: "", object: null });
                      document.getElementById("buttonHuyTimDuong").click();
                    }}>Hủy</Button>
                  </div>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  {currentLocation !== null ? ' Kinh độ: ' + currentLocation.lng : ''}
                </div>
                <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  {currentLocation !== null ? ' Vĩ độ: ' + currentLocation.lat + '' : ''}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <Button color="primary" onClick={() => {
                  history.push('/App');
                }}>Trang chủ</Button>
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
                            listTramCurrent={listTramCurrent}
                            sizeKhachHang={sizeKhachHang}
                            sizeLine={sizeLine}
                            setShowModalLoading={functionSetShowModalLoading}
                            setCurrentLocation={functionSetCurrentLocation}
                            currentLocation={currentLocation}
                            flagOnlyView={flagOnlyView}
                            flagShowLableKH={flagShowLableKH}
                            customerLostPowerSelected={customerLostPowerSelected}
                            username={initContext.username}
                            setCustomerLostPowerSelected={setCustomerLostPowerSelected}
                            setPointCenter={setPointCenter}
                            reload={reload}
                            setReload={setReload}
                          />
                        </ListKhachHangNoLineContext.Provider>
                      </ObjectSelectedContext.Provider>
                    </ListLineContext.Provider>
                  </ListTruContext.Provider>
                </ListKhachHangContext.Provider>
              </OptionEffectObjectContext.Provider>
            </LoadingContext.Provider>

            <div
              onClick={() => {
                setFlagShowLableKH(!flagShowLableKH);
              }}
              title="Tên Khách Hàng"
              style={{
                display: 'flex', position: 'absolute', bottom: 30, left: 10, width: 64, height: 64,
                //background: rgba(0, 0, 0, .3),
                backgroundColor: '#A8AAAA',
                borderRadius: 8,

                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <AiFillAmazonCircle size={60} color="#485DF9" />
            </div>
          </Col>
        </Row >
        <Modal size='lg' isOpen={openSelectCustomerLostPower} >
          <ModalHeader>
            Chọn Khách Hàng Mất Điện Cần Xem
          </ModalHeader>
          <ModalBody>
            {initContext.maDonVi !== null ?
              <SelectCustomerLostPowerComponent setShowModalLoading={setShowModalLoading} data={listCustomerLostPower} dataFix={listCustomerLostPowerFix} setCustomerLostPowerSelected={setCustomerLostPowerSelected} setOpen={setOpenSelectCustomerLostPower} />
              :
              <CircleLoadingComponent />
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={() => {
              setOpenSelectCustomerLostPower(false)
            }
            }>
              Thoát
            </Button>
          </ModalFooter>
        </Modal>

      </Container >
    );
  }
}


