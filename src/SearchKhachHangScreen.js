import React, { useState, useRef, useEffect, useContext } from 'react';
import logo from './asset/images/logo.svg';
import './App.css';
import { Container, Row, Col, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import MAutocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel'
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import listLocation21PC from './data/DanhSachToaDo21PC';
import Map from './components/SearchKhachHangComponent/MapComponent';
import { withStyles } from '@material-ui/core/styles';
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
import { AiFillAmazonCircle } from 'react-icons/ai';
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
import { URLAPI, URLAPI4001 } from './constants/UrlApi';

export const ListKhachHangContext = React.createContext();
export const ListTruContext = React.createContext();
export const ListLineContext = React.createContext();
export const OptionEffectObjectContext = React.createContext();
export const ObjectSelectedContext = React.createContext();
export const LoadingContext = React.createContext();
export const ListKhachHangNoLineContext = React.createContext();

export default function SearchKhachHangScreen() {
  console.log('Search screen');
  const history = useHistory();
  const initContext = useContext(InitPageContext);
  const [tram, setTram] = useState(null);
  const [flagShowLableKH, setFlagShowLableKH] = useState(false);
  const [listTramCurrent, setListTramCurrent] = useState(null);
  const [listKhachHang, setListKhachHang] = useState([{
    "mA_DVIQLY": "PB0203",
    "mA_DDO": "PB02030077960001",
    "mA_KHANG": "PB02030077960",
    "teN_KHANG": "Nguy?n Th? Thu Huy?n",
    "sO_NHA": "T? 8,",
    "duonG_PHO": "thôn 2, xã Nam Chính (HA06 TT Nu?c SH N.Chính)",
    "mA_HDONG": "60600120001051",
    "doanH_SO": "08-00102",
    "sO_HO": "1",
    "sO_TBI": "04147241",
    "loaI_TBI": "HC",
    "chuoI_GIA": "KT: 100%*SHBT-A",
    "vtrI_TREO": "Trên c?t ngoài nhà",
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
      "namE_E": "Dây di?n",
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
  const [statusTram, setStatusTram] = useState(null);
  const [showLeftNavigator, setShowLeftNavigator] = useState(true);
  const [openBieu1Modal, setOpenBieu1Modal] = useState(false);
  const [openBieu2Modal, setOpenBieu2Modal] = useState(false);
  const [openBieu3Modal, setOpenBieu3Modal] = useState(false);
  const [openBieu4Modal, setOpenBieu4Modal] = useState(false);
  const [openBieu5Modal, setOpenBieu5Modal] = useState(false);
  const [openBieu6Modal, setOpenBieu6Modal] = useState(false);
  const [openBieu7Modal, setOpenBieu7Modal] = useState(false);
  const [dataBieu1Modal, setDataBieu1Modal] = useState(null);
  const [dataBieu2Modal, setDataBieu2Modal] = useState(null);
  const [dataBieu3Modal, setDataBieu3Modal] = useState(null);
  const [dataBieu4Modal, setDataBieu4Modal] = useState(null);
  const [dataBieu5Modal, setDataBieu5Modal] = useState(null);
  const [dataBieu6Modal, setDataBieu6Modal] = useState(null);
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
    console.log('useEffect multi');
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
  }, [])

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
                  <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'yellow', margin: 'auto' }}>So d? don tuy?n NR -KH</h2>
                </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
                </div>
              </div>

              {optionEffectObject === null ?
                <div>
                  {/* <div style={{ marginLeft: 20, marginRight: 20, borderColor: 'gray', 'border': '1px solid' }}></div> */}
                  <div style={{ display: 'flex', width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Tìm Khách Hàng</h4>
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <InputLabel
                      color={'primary'}
                      variant={'outlined'}
                      shrink={true}
                      margin={'dense'}
                    >
                      ABC
                    </InputLabel>

                  </div>
                  <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary" onClick={() => {
                      // history.push('/AppManyTram');
                      // setOpenSelectTramModal(true);
                      getData(listTramCurrent);
                      setFlagAutoCompleteSearch(false);
                    }}>Xem chi ti?t danh sách tr?m dã ch?n</Button>
                  </div>

                </div>
                :
                null
              }
            </div>
          </Col>
          <Col xs="12" sm="12" md="7" lg="8" xl="9" style={{ padding: 0, margin: 0 }} id="mapCol1">
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
        <Modal size='lg' isOpen={openDanhSachCanhBaoModal}>
          <ModalHeader>
            Thông Báo!!!
           </ModalHeader>
          <ModalBody>
            Danh sách hàng thay d?i do sang t?i chuy?n lu?i x?y ra:
            <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>#</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Ðon V? Qu?n Lý</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Ði?m Ðo</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Ghi Chú</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Tr?m Cu</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Tr?m M?i</th>
                  </tr>
                </thead>
                <tbody>
                  {listKhachHangCanhBao !== null ? listKhachHangCanhBao.map((kh, i) => {
                    return <tr>
                      <th scope="row">{i + 1}</th>
                      <td>{kh.mA_DVIQLY}</td>
                      <td>{kh.mA_DDO}</td>
                      <td>{kh.ghI_CHU === "MISSING" ? 'Ði?m do dã du?c sang t?i qua tr?m khác, mã tr?m m?i là: ' + kh.mA_TRAM_MOI : 'Ði?m do m?i du?c chuy?n sang tr?m khác, mã tr?m cu là: ' + kh.mA_TRAM_CU}</td>
                      <td>{kh.mA_TRAM_CU}</td>
                      <td>{kh.mA_TRAM_MOI}</td>
                    </tr>
                  }) : <tr>
                      <td colSpan='6'>
                        Không có d? li?u
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
                    }
                    if (tmp !== 0) {
                      setOpenDanhSachNotLoactionModal(true);
                    }
                  })
                }

              }}

            >
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openDanhSachCanhBaoByDonViModal}>
          <ModalHeader>
            Thông Báo!!!
           </ModalHeader>
          <ModalBody>
            Danh sách hàng thay d?i do sang t?i chuy?n lu?i x?y ra:
            <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>#</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Ðon V? Qu?n Lý</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Ði?m Ðo</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Ghi Chú</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Tr?m Cu</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Tr?m M?i</th>
                  </tr>
                </thead>
                <tbody>
                  {listKhachHangCanhBaoByDonVi !== null ? listKhachHangCanhBaoByDonVi.map((kh, i) => {
                    return <tr>
                      <th scope="row">{i + 1}</th>
                      <td>{kh.mA_DVIQLY}</td>
                      <td>{kh.mA_DDO}</td>
                      <td>{kh.ghI_CHU === "MISSING" ? 'Ði?m do dã du?c sang t?i qua tr?m khác, mã tr?m m?i là: ' + kh.mA_TRAM_MOI : 'Ði?m do m?i du?c chuy?n sang tr?m này, mã tr?m cu là: ' + kh.mA_TRAM_CU}</td>
                      <td>{kh.mA_TRAM_CU}</td>
                      <td>{kh.mA_TRAM_MOI}</td>
                    </tr>
                  }) : <tr>
                      <td colSpan='6'>
                        Không có d? li?u
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
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openDanhSachKhachHangMoiModal}>
          <ModalHeader>
            Thông Báo!!!
           </ModalHeader>
          <ModalBody>
            Danh sách hàng m?i:
            <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>#</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Ðon V?</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Tr?m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Khách Hàng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Tên Khách Hàng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Ngày Thêm</th>
                  </tr>
                </thead>
                <tbody>
                  {listKhachHangMoi !== null ? listKhachHangMoi.map((kh, i) => {
                    return <tr>
                      <th scope="row">{i + 1}</th>
                      <td>{kh.mA_DVIQLY}</td>
                      <td>{kh.mA_TRAM}</td>
                      <td>{kh.mA_KHANG}</td>
                      <td>{kh.teN_KHANG}</td>
                      <td>{kh.ngaY_THEM}</td>
                    </tr>
                  }) : <tr>
                      <td colSpan='6'>
                        Không có d? li?u
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
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openDanhSachNotLoactionModal} style={{ width: 1000, height: 1000 }}>
          <ModalHeader>
            Thông Báo!!!
          </ModalHeader>
          <ModalBody>
            Danh sách các khách hàng không có t?a d?, c?n c?p nh?t bên chuong trình ghi ch? s? mobile
            <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }}>
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Ðon V? Qu?n Lý</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Mã Ði?m Ðo</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Kinh Ð?</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Vi Ð?</th>
                  </tr>
                </thead>
                <tbody>
                  {listKhachHang !== null ? listKhachHang.map((kh, i) => {
                    if (kh.toA_DO === null) {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>Không có t?a d?</td>
                        <td>Không có t?a d?</td>
                      </tr>
                    } else if (kh.toA_DO.longitude === null && kh.toA_DO.latitude == null) {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>Không có t?a d?</td>
                        <td>Không có t?a d?</td>
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
                        <td>Không có t?a d?</td>
                        <td>{kh.toA_DO.latitude}</td>
                      </tr>
                    } else if (kh.toA_DO.latitude == null) {
                      return <tr>
                        <td>{kh.mA_DVIQLY}</td>
                        <td>{kh.mA_DDO}</td>
                        <td>{kh.toA_DO.longitude}</td>
                        <td>Không có t?a d?</td>
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
                        Không có d? li?u
                      </td>
                    </tr>
                  }
                </tbody>
              </Table>

            </div>
          </ModalBody>
          <ModalFooter>

            <Button variant="primary" onClick={() => {
              setOpenDanhSachNotLoactionModal(false)
            }
            }>
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu1Modal} style={{ width: 1000, height: 1000 }}>
          <ModalHeader>
            Th?ng kê tr?ng thái tr?m công c?ng
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeTramCC">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Ðon v?</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="2">S? lu?ng tr?m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="3">S? lu?ng b?n v? tr?m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tr?ng thái</th>
                  </tr>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': '72px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>CMIS</th>
                    <th style={{ 'position': 'sticky', 'top': '72px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Qu?n lý KT</th>
                    <th style={{ 'position': 'sticky', 'top': '72px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Ðã V?</th>
                    <th style={{ 'position': 'sticky', 'top': '72px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Ðang v?</th>
                    <th style={{ 'position': 'sticky', 'top': '72px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Chua V?</th>
                  </tr>
                </thead>
                <tbody id="tbodyBieu1">
                  {dataBieu1Modal !== null ?
                    <tr>
                      <td ></td>
                      <td >T?ng</td>
                      <td ></td>
                      <td ></td>
                      <td >{dataBieu1Modal.filter(item => item.vE_SODO === '2').length}</td>
                      <td >{dataBieu1Modal.filter(item => item.vE_SODO === '1').length}</td>
                      <td >{dataBieu1Modal.filter(item => item.vE_SODO === '0').length}</td>
                      <td ></td>
                    </tr>
                    :
                    <tr>
                      <td>
                        Không có d? li?u
                      </td>
                    </tr>
                  }
                  {dataBieu1Modal !== null ? dataBieu1Modal.map((item, index) =>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.teN_TRAM}</td>
                      <td></td>
                      <td></td>
                      <td>{item.vE_SODO === '2' ? 'x' : ''}</td>
                      <td>{item.vE_SODO === '1' ? 'x' : ''}</td>
                      <td>{item.vE_SODO === '0' ? 'x' : ''}</td>
                      <td></td>
                    </tr>
                  )
                    :
                    null
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
              Xu?t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu1Modal(false)
            }
            }>
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu2Modal} style={{ width: 1000, height: 1000 }}>
          <ModalHeader>
            Th?ng kê khách hàng chua g?n vào b?n v?
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeKhachHangSaiMaTram">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Tên tr?m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>T?ng s? khách hàng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>T?ng s? khách hàng chua g?n vào b?n v?</th>
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
                          Không có d? li?u
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
              Xu?t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu2Modal(false)
            }
            }>
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu3Modal} style={{ width: 1000, height: 1000 }}>
          <ModalHeader>
            Th?ng kê tr?ng thái t?a d?
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeTrangThaiToaDo">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Ðon v?</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="3">S? lu?ng tr?m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="2">S? lu?ng khách hàng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tr?ng thái</th>
                  </tr>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >T?ng s? tr?m</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Có t?a d?</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Chua có t?a d?</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Có t?a d?</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Chua có t?a d?</th>

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
                          Không có d? li?u
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
              Xu?t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu3Modal(false)
            }
            }>
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu4Modal} style={{ width: 1000, height: 1000 }}>
          <ModalHeader>
            Th?ng kê danh sách tr?m theo t?a d?
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeDanhSachTramTheoToaDo">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tên tr?m</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="3">S? lu?ng khách hàng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tr?ng thái</th>
                  </tr>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >T?ng</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Có t?a d?</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Chua có t?a d?</th>

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
                          Không có d? li?u
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
              Xu?t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu4Modal(false)
            }
            }>
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu5Modal} style={{ width: 1000, height: 1000 }}>
          <ModalHeader>
            Th?ng kê tr?ng thái khách hàng theo t?a d?
          </ModalHeader>
          <ModalBody>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
              <Table striped style={{ width: '100%', height: '100%' }} id="thongKeTrangThaiKhachHangTheoTaoDo">
                <thead>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">STT</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tên khách hàng</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="3">Thông tin</th>
                    <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tr?ng thái</th>
                  </tr>
                  <tr >
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >T?ng </th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Có t?a d?</th>
                    <th style={{ 'position': 'sticky', 'top': '48px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Chua có t?a d?</th>

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
                          Không có d? li?u
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
              Xu?t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu5Modal(false)
            }
            }>
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu6Modal} style={{ width: 1000, height: 1000 }}>
          <ModalHeader>
            T?ng h?p tr?ng thái tr?m công c?ng
          </ModalHeader>
          <ModalBody>
            {
              dataBieu6Modal === null ? null : <ThongKeTCCByCTYAndTCTComponent data={dataBieu6Modal} maDonVi={initContext.maDonVi === 'PB' ? 'PB' : initContext.maDonVi.slice(0, 4)} />
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileThongKeTramCCByUnit").click();
            }
            }>
              Xu?t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu6Modal(false)
            }
            }>
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openBieu7Modal} style={{ width: 1000, height: 1000 }}>
          <ModalHeader>
            Th?ng kê danh sách tr?m chua có t?a d?:
          </ModalHeader>
          <ModalBody>
            {
              listTram === null ? null : <ThongKeTaoDoTramComponent data={listTram} />
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="success" onClick={() => {
              document.getElementById("exportExcelFileThongKeDanhSachTramTheoToaDo").click();
            }
            }>
              Xu?t Excel
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenBieu7Modal(false)
            }
            }>
              Thoát
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={openSelectTramModal} style={{ width: 1000, height: 1000 }}>
          <ModalHeader>
            Ch?n danh sách tr?m c?n xem
          </ModalHeader>
          <ModalBody>
            {
              listTram === null ? null : <SelectListTramComponent data={listTram} setListTramCurrent={setListTramCurrent} />
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="success" color="info" onClick={() => {
              document.getElementById("buttonXemDuLieuMultiTram").click();
              setOpenSelectTramModal(false)
            }
            }>
              Xem
            </Button>
            <Button variant="primary" onClick={() => {
              setOpenSelectTramModal(false);
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


