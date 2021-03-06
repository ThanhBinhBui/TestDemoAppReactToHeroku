import React, { useContext, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete, Polyline, InfoBox, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Button, Modal, ModalHeader, ModalBody, Progress, ModalFooter, Table, Badge } from 'reactstrap';
import { ListKhachHangContext, LoadingContext, ListTruContext, ListLineContext, OptionEffectObjectContext, ObjectSelectedContext } from '../App';
import { styleAll, styleSimple, styleDefault } from '../styles/mapStyles';
import ToolPlugin from './ToolPlugin';
import FixedPlugin from './FixedPlugin';
import RestorePlugin from './RestorePlugin';
import ReportPlugin from './ReportPlugin';
import IconKhachHang from '../asset/images/KhachHang.png';
import IconKhachHangActive from '../asset/images/KhachHangActive.png';
import IconKhachHangRightClick from '../asset/images/KhachHangRightClick.png';
import IconKhachHangGiamSanLuong from '../asset/images/KhachHangGiamSanLuong.png';
import IconKhachHangTangSanLuong from '../asset/images/KhachHangTangSanLuong.png';
import IconKhachHangKhachHangKhongSanLuong from '../asset/images/KhachHangKhongSanLuong.png';
import IconKhachHangKhachHangKhongSanLuongThangHienTai from '../asset/images/KhachHangKhongSanLuongThangHienTai.png';
import IconTramDisplay from '../asset/images/IconTramDisplay.png';
import IconTram from '../asset/images/Tram.png';
import IconTramActive from '../asset/images/TramActive.png';
import IconTramRightClick from '../asset/images/TramRightClick.png';
import IconTruTrungTheDisplay from '../asset/images/TruTrungTheDisplay.png';
import IconTruTrungThe from '../asset/images/TruTrungThe.png';
import IconTruTrungThePMIS from '../asset/images/TruTrungThePMIS.png';
import IconTruTrungTheActive from '../asset/images/TruTrungTheActive.png';
import IconTruTrungTheRightClick from '../asset/images/TruTrungTheRightClick.png';
import IconTruHaTheTron from '../asset/images/TruHaTheTron.png';
import IconTruHaTheTronActive from '../asset/images/TruHaTheTronActive.png';
import IconTruHaTheTronRightClick from '../asset/images/TruHaTheTronRightClick.png';
import IconTruHaTheVuong from '../asset/images/TruHaTheVuong.png';
import IconTruHaTheVuongActive from '../asset/images/TruHaTheVuongActive.png';
import IconTruHaTheVuongRightClick from '../asset/images/TruHaTheVuongRightClick.png';
import IconTuDien from '../asset/images/TuDien.png';
import IconTuDienActive from '../asset/images/TuDienActive.png';
import IconTuDienRightClick from '../asset/images/TuDienRightClick.png';
import IconPointLabel from '../asset/images/PointLabel.png';
import CircleLoadingComponent from './CircleLoadingComponent';
import ReactNotification from 'react-notifications-component';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { SizeTram, SizeTruHaThe, SizeKhachHangHeight, SizeKhachHangWidth, SizeTruTrungThe } from '../constants/IconSize';
import { InitPageContext } from '../MainScreen';
import InfoKhachHangComponent from './MapComponents/InfoKhachHangComponent';
import InfoTramComponent from './MapComponents/InfoTramComponent';
import { URLAPI, URLAPI4001 } from '../constants/UrlApi';
import InfoSearchKhachHangComponent from './MapComponents/InfoSearchKhachHangComponent';


export default function Map(props) {

    const listKhachHang = useContext(ListKhachHangContext);
    const listTru = useContext(ListTruContext);
    const listLine = useContext(ListLineContext);
    const optionEffectObject = useContext(OptionEffectObjectContext);
    const objectSelected = useContext(ObjectSelectedContext);
    const showModalLoading = useContext(LoadingContext);
    const [openDetailKhachHangModal, setOpenDetailKhachHangModal] = useState(false);
    const [infoDetailKhachHangModal, setInfoDetailKhachHangModal] = useState(null);
    const [openConfirmChangeLoactionModal, setOpenConfirmChangeLocationModal] = useState(false);
    const [locationChange, setLocationChange] = useState(null);
    const [changeLocation, setChangeLocation] = useState(null);
    const [categoryMap, setCategoryMap] = useState('styleSimple');
    const [locationSearchBox, setLocationSearchBox] = useState(null);
    const [directionResponse, setDirectionResponse] = useState(null);
    const [idTruSelected, setIdTruSelected] = useState(null);
    const [listObjectAddTru, setListObjectAddTru] = useState(null);
    const [listObjectAddLine, setListObjectAddLine] = useState(null);
    //L??u t???m ????? th??m ???????ng d??y khi add tr???
    const [objectHasAdd, setObjectHasAdd] = useState(null);
    //L??u t???m ????? th??m ???????ng d??y b???ng chu???t ph???i
    const [objectHasAddLine, setObjectHasAddLine] = useState(null);
    const [popup, setPopup] = useState(null);
    const [flagReRender, setFlagReRender] = useState(false);
    const [zoomCurrent, setZoomCurrent] = useState(85.9999999999);
    const [listTruPmis, setListTruPmis] = useState(null);
    const [listTruPmisAdd, setListTruPmisAdd] = useState(null);
    const [listUndo, setListUndo] = useState(null);
    const [flagShowPoupAddTru, setFlagShowPopupAddTru] = useState(false);
    const [listObjectChangeTram,setListObjectChangeTram] = useState(null);
    const initContext = useContext(InitPageContext);

    const functionSetObjectHasAddLine = (v) => {
        setObjectHasAddLine(v);
    }
    const functionSetIdTruSelected = (v) => {
        setIdTruSelected(v);
    }
    const functionSetPopup = (v) => {
        setPopup(v);
    }
    const functionSetOptionEffectObject = (v) => {
        optionEffectObject.setOptionEffectObject(v);
    }
    const functionResetPointCenter = () => {
        props.functionSetPointCenter({ lat: props.defaultPointCenter.lat + 0.0000000001, lng: props.defaultPointCenter.lng });
    }
    const functionSetCategoryMap = (category) => {
        setCategoryMap(category);
    }
    const functionResetZoom = () => {
        setZoomCurrent(zoomCurrent - 0.0000000001);
    }
    const functionSetObjectSelected = (v) => {
        props.functionSetObjectSelected(v);
    }
    const showNotification = (title, message, duration, width) => {
        store.addNotification({
            title: title,
            message: message,
            type: "info",
            insert: "top",
            container: "top-left",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: duration,
                onScreen: true,
                showIcon: true
            },
            width: width,
        });
    }
    const reloadListPoint = () => {
        if (props.maTramSelected !== null && props.maDonViSelected !== null) {
            fetch(URLAPI+'/APIKTGS/Drawing/getPoint?madvi=' + props.maDonViSelected + '&ma_tram=' + props.maTramSelected)
                .then((response) => {
                    return response.json();
                })
                .then((responseJson) => {
                    props.functionSetListTru(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                })
        }
    }
    const reloadListLine = () => {
        if (props.maTramSelected !== null && props.maDonViSelected !== null) {
            fetch(URLAPI+'/APIKTGS/Drawing/getLine?madvi=' + props.maDonViSelected + '&ma_tram=' + props.maTramSelected)
                .then((response) => {
                    return response.json();
                })
                .then((responseJson) => {
                    props.functionSetListLine(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                })
        }
    }
    const [flagMap,setFlagMap]= useState(true);
    console.log(listObjectChangeTram===null?null:listObjectChangeTram);

    const changeTramManyObject = (type,id,maTram)=>{
        if(type==='Tru'){
            fetch(URLAPI4001+'/Api/SangTaiChuyenLuoi/changeTramPoint?id='+id+'&maTram='+maTram, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },                
            })
                .then(response => {
                    if (response.status === 200) {

                        showNotification('Th??ng b??o!', '???? chuy???n tr???m ?????i t?????ng ' + id + ' sang tr???m '+maTram+' th??nh c??ng ', 1000, 400);
                        props.functionSetListTru(listTru.length===1?null:listTru.filter(i=>i.iD_ELEMENT!==id))
                        
                    }
                })
               
                .catch((error) => {
                    console.log("Error: " + error);
                    alert("Error: " + error);
                })
        } else if (type==='Line'){
            fetch(URLAPI4001+'/Api/SangTaiChuyenLuoi/changeTramLine?id='+id+'&maTram='+maTram, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },                
            })
                .then(response => {
                    if (response.status === 200) {
                        showNotification('Th??ng b??o!', '???? chuy???n d??y ' + id + ' sang tr???m '+maTram+' th??nh c??ng ', 1000, 400);
                        props.functionSetListLine(listLine.length===1?null:listLine.filter(i=>i.iD_ELEMENT!==id));                        
                    }
                })
               
                .catch((error) => {
                    console.log("Error: " + error);
                    alert("Error: " + error);
                })
        } else{

        }
    }


    if (flagMap){    	
        return (
            <LoadScript
                id='script-loader'
                // googleMapsApiKey="AIzaSyBddLOpOb8D7rMeWUvyQBkLPNKUaKPfXy4"
                googleMapsApiKey="AIzaSyCFcCLWqtVrENo1ZLZ8CIdmnuRN0aXl_aw"
                // googleMapsApiKey="AIzaSyCgxWttuVQahcNjy5ixon7EBwliVNH-q-g"
                // googleMapsApiKey="AIzaSyAoUwpMUXtp9VglJCxfO0yFSFnHaC_oK50"
                // googleMapsClientId="134523081940-6gbcvs2eb176eaj6jeh0j9c2rsf2cauv.apps.googleusercontent.com"                
                libraries={["places", "geometry"]}
                onError={()=>{
    
                }}
            >
                <ReactNotification />
                <GoogleMap
                    id='map'
                    zoom={zoomCurrent}
                    center={props.pointCenter}
                    onRightClick={(e) => {
                        if (props.flagOnlyView || initContext.role !== '2') {
                        } else {
                            setPopup({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                            setFlagShowPopupAddTru(true);
                        }
                    }}
    
                    onMouseMove={(e) => {
                        if (flagShowPoupAddTru) {
    
                        } else if (optionEffectObject.value === 'XacDinhKhoangCachKhiThemTru' || optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByType' || optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByTypeNoLine') {
                            setPopup({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                        }
                    }}
                    onClick={(e) => {
                        if (document.getElementById('fixedPluginClasses').className === "dropdown show-dropdown open") {
                            document.getElementById('fixedPluginClasses').classList.remove('open');
                        }
                        if (document.getElementById('reportPluginClasses').className === "dropdown show-dropdown open") {
                            document.getElementById('reportPluginClasses').classList.remove('open');
                        }
                        if (document.getElementById('restorePluginClasses').className === "dropdown show-dropdown open") {
                            document.getElementById('restorePluginClasses').classList.remove('open');
                        }
                        if (document.getElementById('toolPluginClasses').className === "dropdown show-dropdown open") {
                            document.getElementById('toolPluginClasses').classList.remove('open');
                        }
                        if (optionEffectObject.value === "AddTru") {
                            const tmp = window.prompt('Xin h??y nh???p t??n tr???!');
    
                            if (tmp != null) {
                                if (listObjectAddTru != null) {
                                    setListObjectAddTru(listObjectAddTru => [...listObjectAddTru, { lat: e.latLng.lat(), lng: e.latLng.lng(), name: tmp, id: listObjectAddTru.length }]);
                                } else {
                                    setListObjectAddTru([{ lat: e.latLng.lat(), lng: e.latLng.lng(), name: tmp, id: 0 }]);
                                }
                            }
                        } else if (optionEffectObject.value === "ChangeLocationByClickObject") {
                            if (objectSelected.type === 'KhachHang') {
                                fetch(URLAPI+'/APIKTGS/KHANG/updateToaDo', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
    
                                    },
                                    body: JSON.stringify({
                                        "MA_DVIQLY": objectSelected.object.mA_DVIQLY,
                                        "MA_DDO": objectSelected.object.mA_DDO,
                                        "TOA_DO": { "LONGITUDE": e.latLng.lng().toString(), "LATITUDE": e.latLng.lat().toString() }
                                    })
                                })
                                    .then(response => {    
                                        if (response.status === 200) {
                                            showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? kh??ch h??ng ' + objectSelected.object.mA_DDO + ' th??nh c??ng ', 2000, 400);
                                            if (idTruSelected !== null) {    
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": idTruSelected,
                                                            "ID_POINT2": ""
                                                        }
                                                    )
                                                })
                                                    .then(responseSaveLine => {    
                                                        if (responseSaveLine.statusText === 'OK') {
                                                            return responseSaveLine.json();
                                                        }    
                                                        return null;
                                                    })
                                                    .then((res) => {
    
                                                        if (res !== null) {
    
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "ID_LINE": res.iD_ELEMENT,
                                                                        "ID_POINT": idTruSelected,
                                                                        "MA_DDO": objectSelected.object.mA_DDO
                                                                    }
                                                                )
                                                            })
                                                                .then(response => {
    
                                                                    if (response.status ===200) {
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then(res => {
                                                                    if (res !== null) {
    
                                                                        props.setListKhachHangHasLine([...props.listKhachHangHasLine, res.mA_DDO]);
                                                                        props.functionSetListLine([...listLine, res]);
                                                                        listKhachHang.map((itmKH) => {
                                                                            if (itmKH.mA_DDO === objectSelected.object.mA_DDO) {
                                                                                itmKH.toA_DO = {
                                                                                    "longitude": e.latLng.lng().toString(),
                                                                                    "latitude": e.latLng.lat().toString()
                                                                                };
                                                                            }
                                                                        });
    
                                                                        props.functionSetObjectSelected({ type: "", object: null });
                                                                        //setObjectHasAddLine(null);
                                                                    }
                                                                })
    
                                                                .catch((error) => {
                                                                    console.log("Error: " + error);
                                                                });
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.log("Error: " + error);
                                                    });
                                            } else {
                                                listKhachHang.map((itmKH) => {
                                                    if (itmKH.mA_DDO === objectSelected.object.mA_DDO) {
    
                                                        itmKH.toA_DO = {
                                                            "longitude": e.latLng.lng().toString(),
                                                            "latitude": e.latLng.lat().toString()
                                                        };
    
    
                                                    }
                                                });
    
                                                props.functionSetObjectSelected({ type: "", object: null });
                                            }
    
                                        }
    
    
                                    })
                                    .catch((error) => {
                                        console.log("Error kh: " + error);
                                    });
                            }
                        } else if (optionEffectObject.value === "AddTram") {
                            let tmp = window.prompt('Nh???p t??n tr???m');
                            if (tmp !== null) {
                                fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(
                                        {
                                            "MA_DVIQLY": props.maDonViSelected,
                                            "ID_ELEMENT": "",
                                            "MA_TRAM": props.maTramSelected,
                                            "TYPE_E": "TRAM",
                                            "NAME_E": tmp,
                                            "LONGITUDE": e.latLng.lng().toString(),
                                            "LATITUDE": e.latLng.lat().toString()
                                        })
                                })
                                    .then(response => {
    
                                        if (response.status ===200) {
    
                                            showNotification('Th??ng b??o!', '???? th??m tr???m ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                            return response.json();
                                            //tmpTru.push(response.json());
                                        }
    
                                        return null;
    
                                    })
                                    .then((res) => {
    
                                        if (res !== null) {
                                            props.functionSetListTru([...listTru, res]);
                                        } else {
                                            //console.log('Error: ' + tmp);
                                        }
                                    })
                                    .catch((error) => {
                                        //console.log("Error save point: " + error);
                                    });
                            } else {
                                alert('Kh??ng c?? th??ng tin th??? th??m tr???m');
                            }
                        } else if (optionEffectObject.value === "XacDinhKhoangCachKhiThemTruByType" && props.typeTruAdd !== null) {
                            if (props.typeTruAdd === 'TruTH') {
                                let tmp = window.prompt('Nh???p t??n tr??? trung th???');
                                
                                if (tmp !== null) {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": props.maDonViSelected,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": props.maTramSelected,
                                                "TYPE_E": "TTRHE",
                                                "NAME_E": tmp,
                                                "LONGITUDE": e.latLng.lng().toString(),
                                                "LATITUDE": e.latLng.lat().toString(),
                                                "longitudE_LABEL": e.latLng.lng().toString(),
                                                "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            if (response.status ===200) {
    
                                                showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                return response.json();
                                                //tmpTru.push(response.json());
                                            }
    
                                            return null;
    
                                        })
                                        .then((res) => {
                                            if (res !== null) {
                                                if (objectHasAdd !== null) {
                                                    fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                        method: 'POST',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify(
                                                            {
                                                                "MA_DVIQLY": props.maDonViSelected,
                                                                "ID_ELEMENT": "",
                                                                "MA_TRAM": props.maTramSelected,
                                                                "TYPE_E": "DDIEN",
                                                                "NAME_E": "D??y ??i???n",
                                                                "ID_POINT1": res.iD_ELEMENT,
                                                                "ID_POINT2": objectHasAdd.iD_ELEMENT,
                                                                "MA_DDO": ""
                                                            }
    
                                                        )
                                                    })
                                                        .then(response => {
    
    
                                                            if (response.status ===200) {
                                                                showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                return response.json();
                                                            }
                                                            return null;
    
                                                        })
                                                        .then((res) => {
                                                            if (res !== null) {
                                                                props.functionSetListLine([...listLine, res]);
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            //console.log("Error: " + error);
                                                        });
                                                }
                                                setObjectHasAdd(res);
                                                props.functionSetListTru([...listTru, res]);
                                                //setPopup(null);
                                            } else {
                                                //console.log('Error: ' + tmp);
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                } else {
                                    alert('Kh??ng c?? th??ng tin th??? th??m tr??? trung th???')
                                }
                            } else if (props.typeTruAdd === 'TruHTTron') {
                                let tmp = window.prompt('Nh???p t??n tr??? h??? th??? tr??n');
                                if (tmp !== null) {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": props.maDonViSelected,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": props.maTramSelected,
                                                "TYPE_E": "THATHE",
                                                "NAME_E": tmp,
                                                "LONGITUDE": e.latLng.lng().toString(),
                                                "LATITUDE": e.latLng.lat().toString(),
                                                "longitudE_LABEL": e.latLng.lng().toString(),
                                                "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            if (response.status ===200) {
                                                showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
                                                return response.json();
                                            }
    
                                            return null;
    
                                        })
                                        .then((res) => {
                                            if (res !== null) {
                                                if (objectHasAdd !== null) {
                                                    fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                        method: 'POST',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify(
                                                            {
                                                                "MA_DVIQLY": props.maDonViSelected,
                                                                "ID_ELEMENT": "",
                                                                "MA_TRAM": props.maTramSelected,
                                                                "TYPE_E": "DDIEN",
                                                                "NAME_E": "D??y ??i???n",
                                                                "ID_POINT1": res.iD_ELEMENT,
                                                                "ID_POINT2": objectHasAdd.iD_ELEMENT,
                                                                "MA_DDO": ""
                                                            }
    
                                                        )
                                                    })
                                                        .then(response => {
    
    
                                                            if (response.status ===200) {
                                                                showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                return response.json();
                                                            }
                                                            return null;
    
                                                        })
                                                        .then((res) => {
                                                            if (res !== null) {
                                                                props.functionSetListLine([...listLine, res]);
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            //console.log("Error: " + error);
                                                        });
                                                }
                                                setObjectHasAdd(res);
                                                props.functionSetListTru([...listTru, res]);
                                            } else {
                                            }
                                        })
                                        .catch((error) => {
                                        });
                                } else {
                                    alert('Kh??ng c?? th??ng tin th??? th??m tr??? h??? th??? tr??n')
                                }
                            } else if (props.typeTruAdd === 'TruHTVuong') {
                                let tmp = window.prompt('Nh???p t??n tr??? h??? th??? vu??ng: ');
                                if (tmp !== null) {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": props.maDonViSelected,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": props.maTramSelected,
                                                "TYPE_E": "TVHTHE",
                                                "NAME_E": tmp,
                                                "LONGITUDE": e.latLng.lng().toString(),
                                                "LATITUDE": e.latLng.lat().toString(),
                                                "longitudE_LABEL": e.latLng.lng().toString(),
                                                "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            if (response.status ===200) {
    
                                                showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                return response.json();
                                            }
    
                                            return null;
    
                                        })
                                        .then((res) => {
                                            if (res !== null) {
                                                if (objectHasAdd !== null) {
                                                    fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                        method: 'POST',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify(
                                                            {
                                                                "MA_DVIQLY": props.maDonViSelected,
                                                                "ID_ELEMENT": "",
                                                                "MA_TRAM": props.maTramSelected,
                                                                "TYPE_E": "DDIEN",
                                                                "NAME_E": "D??y ??i???n",
                                                                "ID_POINT1": res.iD_ELEMENT,
                                                                "ID_POINT2": objectHasAdd.iD_ELEMENT,
                                                                "MA_DDO": ""
                                                            }
    
                                                        )
                                                    })
                                                        .then(response => {
    
    
                                                            if (response.status ===200) {
                                                                showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                return response.json();
                                                            }
                                                            return null;
    
                                                        })
                                                        .then((res) => {
                                                            if (res !== null) {
                                                                props.functionSetListLine([...listLine, res]);
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            //console.log("Error: " + error);
                                                        });
                                                }
                                                setObjectHasAdd(res);
                                                props.functionSetListTru([...listTru, res]);
                                                //setPopup(null);
                                            } else {
                                                //console.log('Error: ' + tmp);
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                } else {
                                    alert('Kh??ng c?? th??ng tin th??? th??m tr??? h??? th??? vu??ng')
                                }
                            } else if (props.typeTruAdd === 'TuDien') {
                                let tmp = window.prompt('Nh???p t??n tr??? h??? th??? vu??ng: ');
                                if (tmp !== null) {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": props.maDonViSelected,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": props.maTramSelected,
                                                "TYPE_E": "TUDIEN",
                                                "NAME_E": tmp,
                                                "LONGITUDE": e.latLng.lng().toString(),
                                                "LATITUDE": e.latLng.lat().toString(),
                                                "longitudE_LABEL": e.latLng.lng().toString(),
                                                "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            if (response.status ===200) {
    
                                                showNotification('Th??ng b??o!', '???? th??m t??? di???n ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                return response.json();
                                            }
    
                                            return null;
    
                                        })
                                        .then((res) => {
                                            if (res !== null) {
                                                if (objectHasAdd !== null) {
                                                    fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                        method: 'POST',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify(
                                                            {
                                                                "MA_DVIQLY": props.maDonViSelected,
                                                                "ID_ELEMENT": "",
                                                                "MA_TRAM": props.maTramSelected,
                                                                "TYPE_E": "DDIEN",
                                                                "NAME_E": "D??y ??i???n",
                                                                "ID_POINT1": res.iD_ELEMENT,
                                                                "ID_POINT2": objectHasAdd.iD_ELEMENT,
                                                                "MA_DDO": ""
                                                            }
    
                                                        )
                                                    })
                                                        .then(response => {
    
    
                                                            if (response.status ===200) {
                                                                showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                return response.json();
                                                            }
                                                            return null;
    
                                                        })
                                                        .then((res) => {
                                                            if (res !== null) {
                                                                props.functionSetListLine([...listLine, res]);
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            //console.log("Error: " + error);
                                                        });
                                                }
                                                setObjectHasAdd(res);
                                                props.functionSetListTru([...listTru, res]);
                                                //setPopup(null);
                                            } else {
                                                //console.log('Error: ' + tmp);
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                } else {
                                    alert('Kh??ng c?? th??ng tin t??? ??i???n')
                                }
                            }
                        } else if (optionEffectObject.value === "XacDinhKhoangCachKhiThemTruByTypeNoLine" && props.typeTruAdd !== null) {
                            if (props.typeTruAdd === 'TruTH') {
                                let tmp = window.prompt('Nh???p t??n tr??? trung th???');
                                if (tmp !== null) {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": props.maDonViSelected,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": props.maTramSelected,
                                                "TYPE_E": "TTRHE",
                                                "NAME_E": tmp,
                                                "LONGITUDE": e.latLng.lng().toString(),
                                                "LATITUDE": e.latLng.lat().toString(),
                                                "longitudE_LABEL": e.latLng.lng().toString(),
                                                "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            if (response.status ===200) {
    
                                                showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                return response.json();
                                                //tmpTru.push(response.json());
                                            }
    
                                            return null;
    
                                        })
                                        .then((res) => {
                                            if (res !== null) {
    
                                                props.functionSetListTru([...listTru, res]);
                                                //setPopup(null);
                                            } else {
                                                //console.log('Error: ' + tmp);
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                } else {
                                    alert('Kh??ng c?? th??ng tin th??? th??m tr??? trung th???')
                                }
                            } else if (props.typeTruAdd === 'TruHTTron') {
                                let tmp = window.prompt('Nh???p t??n tr??? h??? th??? tr??n');
                                if (tmp !== null) {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": props.maDonViSelected,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": props.maTramSelected,
                                                "TYPE_E": "THATHE",
                                                "NAME_E": tmp,
                                                "LONGITUDE": e.latLng.lng().toString(),
                                                "LATITUDE": e.latLng.lat().toString(),
                                                "longitudE_LABEL": e.latLng.lng().toString(),
                                                "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            //console.log('save point');
                                            if (response.status ===200) {
    
                                                showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                return response.json();
                                                //tmpTru.push(response.json());
                                            }
    
                                            return null;
    
                                        })
                                        .then((res) => {
                                            if (res !== null) {
                                                props.functionSetListTru([...listTru, res]);
                                            } else {
                                                //console.log('Error: ' + tmp);
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                } else {
                                    alert('Kh??ng c?? th??ng tin th??? th??m tr??? h??? th??? tr??n')
                                }
                            } else if (props.typeTruAdd === 'TruHTVuong') {
                                let tmp = window.prompt('Nh???p t??n tr??? h??? th??? vu??ng: ');
                                if (tmp !== null) {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": props.maDonViSelected,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": props.maTramSelected,
                                                "TYPE_E": "TVHTHE",
                                                "NAME_E": tmp,
                                                "LONGITUDE": e.latLng.lng().toString(),
                                                "LATITUDE": e.latLng.lat().toString(),
                                                "longitudE_LABEL": e.latLng.lng().toString(),
                                                "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            if (response.status ===200) {
    
                                                showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                return response.json();
                                                //tmpTru.push(response.json());
                                            }
    
                                            return null;
    
                                        })
                                        .then((res) => {
                                            if (res !== null) {
    
                                                props.functionSetListTru([...listTru, res]);
    
                                            } else {
                                                //console.log('Error: ' + tmp);
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                } else {
                                    alert('Kh??ng c?? th??ng tin th??? th??m tr??? h??? th??? vu??ng')
                                }
                            } else if (props.typeTruAdd === 'TuDien') {
                                let tmp = window.prompt('Nh???p t??n t??? ??i???n: ');
                                if (tmp !== null) {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": props.maDonViSelected,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": props.maTramSelected,
                                                "TYPE_E": "TUDIEN",
                                                "NAME_E": tmp,
                                                "LONGITUDE": e.latLng.lng().toString(),
                                                "LATITUDE": e.latLng.lat().toString(),
                                                "longitudE_LABEL": e.latLng.lng().toString(),
                                                "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            if (response.status ===200) {
    
                                                showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                return response.json();
                                                //tmpTru.push(response.json());
                                            }
    
                                            return null;
    
                                        })
                                        .then((res) => {
                                            if (res !== null) {
    
                                                props.functionSetListTru([...listTru, res]);
    
                                            } else {
                                                //console.log('Error: ' + tmp);
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                } else {
                                    alert('Kh??ng c?? th??ng tin ????? th??m t???');
                                }
                            }
                        }
                    }}
                    options={categoryMap === 'styleAll' ?
                        {
                            styles: styleAll,
                            draggableCursor: IconTram
                        }
                        :
                        (categoryMap === 'styleDefault' ?
                            {
                                styles: styleDefault,
                                draggableCursor: IconTram
                            }
                            :
                            (categoryMap === 'styleSimple' ?
                                {
                                    styles: styleSimple,
                                    draggableCursor: IconTram
                                }
                                :
                                null
                            )
                        )
                    }
                    mapContainerStyle={{
                        height: '100vh',
                        width: '100%'
                    }}
                >
                    <Autocomplete
                        onLoad={(e) => setLocationSearchBox(e)}
                        onPlaceChanged={() => {
                            if (locationSearchBox != null) {
    
                                props.functionSetPointCenter({
                                    lat: locationSearchBox.getPlace().geometry.location.lat(),
                                    lng: locationSearchBox.getPlace().geometry.location.lng()
                                });
                            } else {
                            }
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Nh???p V??? Tr?? C???n T??m..."
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                width: `240px`,
                                height: `32px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
    
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                                position: "absolute",
                                left: "50%",
                                marginLeft: "-120px"
                            }}
                        />
                    </Autocomplete>
    
                    {props.locationDirectionCurrent !== null && props.locationDirectionCurrent !== undefined && objectSelected.type !== '' ?
                        props.locationDirectionCurrent.getPlace() !== undefined ?
                            <DirectionsService
                                options={
                                    objectSelected.type === 'Tram' ?
                                        {
                                            destination: { lat: Number(objectSelected.object.toado.latitude), lng: Number(objectSelected.object.toado.longitude) },//'Chicago, IL, USA',// {lat:10.762772,lng:106.26952744425445},
                                            origin: { lat: props.locationDirectionCurrent.getPlace().geometry.location.lat(), lng: props.locationDirectionCurrent.getPlace().geometry.location.lng() },
                                            travelMode: 'DRIVING'
                                        }
                                        :
                                        objectSelected.type === 'KhachHang' ?
                                            {
                                                destination: objectSelected.object.toA_DO !== null ? { lat: Number(objectSelected.object.toA_DO.latitude), lng: Number(objectSelected.object.toA_DO.longitude) } : null,
                                                origin: { lat: props.locationDirectionCurrent.getPlace().geometry.location.lat(), lng: props.locationDirectionCurrent.getPlace().geometry.location.lng() },
                                                travelMode: 'DRIVING'
                                            }
                                            :
                                            objectSelected.type === 'Tru' ?
                                                {
                                                    destination: { lat: Number(objectSelected.object.latitude), lng: Number(objectSelected.object.longitude) },
                                                    origin: { lat: props.locationDirectionCurrent.getPlace().geometry.location.lat(), lng: props.locationDirectionCurrent.getPlace().geometry.location.lng() },
                                                    travelMode: 'DRIVING'
                                                }
                                                :
                                                null
                                }
                                callback={(response) => {
    
                                    if (directionResponse === null) {
                                        
                                        setDirectionResponse(response);
                                    }
                                }}
                            />
                            :
                            null
                        :
                        null
                    }
                    {props.currentLocation !== null && props.currentLocation !== undefined && objectSelected.type !== '' ?
                        <DirectionsService
                            options={
                                objectSelected.type === 'Tram' ?
                                    {
                                        destination: { lat: Number(objectSelected.object.toado.latitude), lng: Number(objectSelected.object.toado.longitude) },//'Chicago, IL, USA',// {lat:10.762772,lng:106.26952744425445},
                                        origin: { lat: props.currentLocation.lat, lng: props.currentLocation.lng },
                                        travelMode: 'DRIVING'
                                    }
                                    :
                                    objectSelected.type === 'KhachHang' ?
                                        {
                                            destination: objectSelected.object.toA_DO !== null ? { lat: Number(objectSelected.object.toA_DO.latitude), lng: Number(objectSelected.object.toA_DO.longitude) } : null,
                                            origin: { lat: props.currentLocation.lat, lng: props.currentLocation.lng },
                                            travelMode: 'DRIVING'
                                        }
                                        :
                                        objectSelected.type === 'Tru' ?
                                            {
                                                destination: { lat: Number(objectSelected.object.latitude), lng: Number(objectSelected.object.longitude) },
                                                origin: { lat: props.currentLocation.lat, lng: props.currentLocation.lng },
                                                travelMode: 'DRIVING'
                                            }
                                            :
                                            null
                            }
                            callback={(response) => {
    
                                if (directionResponse === null) {
                                    //    
                                    setDirectionResponse(response);
                                }
                            }}
                        />
                        :
                        null
                    }
    
                    {directionResponse === null || props.locationDirectionCurrent === null || objectSelected.type === '' ? null :
                        <DirectionsRenderer
                            options={{
                                directions: directionResponse,
                                markerOptions: { icon: { url: IconKhachHangActive, scaledSize: new window.google.maps.Size(SizeKhachHangWidth, SizeKhachHangHeight), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(10.625, 31), labelOrigin: new window.google.maps.Point(10.625, 40) } }
                            }}
                            //routeIndex={1}
                            // optional
                            onLoad={directionsRenderer => {
                                
                                //console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
                            }}
                            // optional
                            onUnmount={directionsRenderer => {
                                
                                //console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
                            }}
                        />
                    }
    
    
                    {/* Th??m ???????ng d??y */}
                    {/* {(listObjectAddLine !== null && optionEffectObject.value === 'AddLine') ?
                        listObjectAddLine.map((obj, index) => {
                            if (index !== 0) {
                                if (index % 2 !== 0) {
                                    
                                    return <Polyline
                                        
                                        path={[listObjectAddLine[index - 1], obj]}
                                        options={{ strokeColor: '#4866FF' }}
                                    />
                                }
                            }
    
                        })
                        :
                        null
                    }
                    
                    {(listObjectAddTru !== null && optionEffectObject.value === 'AddTru') ?
                        <Polyline
                            
                            path={listObjectAddTru}
                            options={{ strokeColor: '#4866FF', strokeWeight:2, }}
                        />
                        :
                        null
                    } */}
    
                    {/* V??? ???????ng */}
                    {listLine === null ? null : listLine.map((item, index) => {
                        if (item.toadO_P2 !== null && item.toadO_P1 !== null) {
                            if ((optionEffectObject.value === 'ChangeLocationLabel' || optionEffectObject.value === 'ShowLabelPoint' || optionEffectObject.value === 'ShowLabelPointName' || optionEffectObject.value === 'ShowLabelPointDoanhSo') && listTru !== null) {
                                //console.log('label:' + item.iD_ELEMENT);
                                //console.log(item.mA_DDO);
                                if ((item.mA_DDO === null || item.mA_DDO === "") && item.typE_E === 'DDIEN') {
                                    //console.log('hide item');
                                    return <Polyline
                                        onClick={()=>{
                                            if (optionEffectObject.value === 'ChangeManyObject' && props.tramChangeManyObject!==null) {
                                                changeTramManyObject('Line',item.iD_ELEMENT,props.tramChangeManyObject.mA_TRAM);
                                            }
                                        }}
                                        path={[
                                            { lng: Number(item.toadO_P1.longitude), lat: Number(item.toadO_P1.latitude) },
                                            { lng: Number(item.toadO_P2.longitude), lat: Number(item.toadO_P2.latitude) }
                                        ]}
                                    />
                                } else {
                                    //console.log('return null');
                                    return null;
                                }
    
                            } else {
                                if (item.mA_DDO === null || item.mA_DDO === '') {
                                    if (item.typE_E === 'DDIEN_KH') {
                                        return <Polyline
                                            path={[
                                                { lng: Number(item.toadO_P1.longitude), lat: Number(item.toadO_P1.latitude) },
                                                { lng: Number(item.toadO_P2.longitude), lat: Number(item.toadO_P2.latitude) }
                                            ]}
                                            options={{
                                                icons: [{
                                                    icon: {
                                                        //path: 'M 15, 10, 5, 10',
                                                        //path: 'M 0,-1 0,1',
                                                        path: 'M 0,-0.1 0,0.1 M 0,-0.5 0,0.5',
                                                        strokeOpacity: 1,
                                                        stokeColor: '#0229FF',
                                                        //scale: 4
                                                        scale: 2
                                                    },
                                                    // icon:{url: IconTruTrungTheActive, scaledSize: new window.google.maps.Size(20, 20), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(10, 10), labelOrigin: new window.google.maps.Point(10, 10) },
                                                    //offset: '0',
                                                    repeat: '10px',
                                                    text: 'abc',
                                                    // repeat: '20px'
                                                }],
                                                strokeColor: '#CAA907',
                                                strokeOpacity: 0,
                                                strokeWeight: 100,
                                                //fillColor: '#5A5959',   
                                                fillColor: '#0229FF',
                                                //fillOpacity: 0.35,
                                                clickable: true,
                                                draggable: false,
                                                editable: false,
                                                visible: true,
                                            }}
                                            onClick={(e) => {
    
                                                //console.log(item);
                                                if (optionEffectObject.value === 'DeleteObject') {
                                                    let tmp = window.confirm("B???n ch???c c?? mu???n x??a ???????ng d??y " + item.namE_E + " ?");
                                                    if (tmp) {
                                                        fetch(URLAPI+'/APIKTGS/Drawing/deleteLine', {
                                                            method: 'POST',
                                                            headers: {
                                                                Accept: 'application/json',
                                                                'Content-Type': 'application/json',
    
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    "MA_DVIQLY": item.mA_DVIQLY,
                                                                    "ID_ELEMENT": item.iD_ELEMENT,
                                                                    "MA_TRAM": item.mA_TRAM
                                                                }
                                                            )
                                                        })
                                                            .then(response => {
    
                                                                if (response.status ===200) {
                                                                    //console.log('OK delete line: ' + item.iD_ELEMENT);
                                                                    showNotification('Th??ng b??o!', '???? x??a th??nh c??ng ???????ng d??y ' + item.namE_E, 2000, 400);
                                                                    if (listLine !== null) {
                                                                        let tmpListLine = listLine.filter((itemL) => itemL.iD_ELEMENT !== item.iD_ELEMENT);
                                                                        let tmpListKhachHang = listKhachHang.filter((itemC) => {
                                                                            if (itemC.toA_DO !== null) {
                                                                                if (itemC.toA_DO.longitude === item.toadO_P1.longitude
                                                                                    && itemC.toA_DO.latitude === item.toadO_P1.latitude) {
                                                                                    return itemC;
                                                                                }
                                                                                if (itemC.toA_DO.longitude === item.toadO_P2.longitude
                                                                                    && itemC.toA_DO.latitude === item.toadO_P2.latitude) {
                                                                                    return itemC;
                                                                                }
                                                                            }
                                                                        });
    
                                                                        //console.log(tmpListKhachHang);       
                                                                        //setListUndo(listUndo.pop());  
                                                                        if (listUndo === null) {
                                                                            setListUndo([{ type: 'DeleteLine', object: item }]);
                                                                        } else {
                                                                            setListUndo([...listUndo, { type: 'DeleteLine', object: item }]);
                                                                        }
                                                                        props.setListKhachHangHasLine(props.listKhachHangHasLine.filter(itm => itm !== tmpListKhachHang[0].mA_DDO));
                                                                        //console.log(tmpListLine); 
                                                                        props.functionSetListLine(null);
                                                                        props.functionSetListLine([...tmpListLine]);
                                                                    }
                                                                }
                                                            })
                                                            .catch((error) => {
                                                                //console.log("Error: " + error);
                                                            })
    
                                                    } else {
    
                                                    }
                                                } else if (optionEffectObject.value === 'ViewInfoObject') {
                                                    props.functionSetObjectSelected({ type: "Line", object: item });
                                                } else if (optionEffectObject.value === 'ChangeManyObject' && props.tramChangeManyObject!==null) {
                                                    changeTramManyObject('Line',item.iD_ELEMENT,props.tramChangeManyObject.mA_TRAM);
                                                }
                                            }
                                            }
                                        />
                                    } else if (item.typE_E === 'CAPNGAM') {
                                        return <Polyline
                                            path={[
                                                { lng: Number(item.toadO_P1.longitude), lat: Number(item.toadO_P1.latitude) },
                                                { lng: Number(item.toadO_P2.longitude), lat: Number(item.toadO_P2.latitude) }
                                            ]}
                                            options={{
                                                strokeColor: '#9C2B13',
                                                // strokeOpacity: 0,
                                                // strokeWeight: 100,
                                                // //fillColor: '#5A5959',   
                                                // fillColor: '#0229FF',                                      
                                                // //fillOpacity: 0.35,
                                                // clickable: true,
                                                // draggable: false,
                                                // editable: false,
                                                // visible: true,
                                            }}
                                            onClick={(e) => {
    
                                                //console.log(item);
                                                if (optionEffectObject.value === 'DeleteObject') {
                                                    let tmp = window.confirm("B???n ch???c c?? mu???n x??a ???????ng d??y " + item.namE_E + " ?");
                                                    if (tmp) {
                                                        fetch(URLAPI+'/APIKTGS/Drawing/deleteLine', {
                                                            method: 'POST',
                                                            headers: {
                                                                Accept: 'application/json',
                                                                'Content-Type': 'application/json',
    
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    "MA_DVIQLY": item.mA_DVIQLY,
                                                                    "ID_ELEMENT": item.iD_ELEMENT,
                                                                    "MA_TRAM": item.mA_TRAM
                                                                }
                                                            )
                                                        })
                                                            .then(response => {
    
                                                                if (response.status ===200) {
                                                                    //console.log('OK delete line: ' + item.iD_ELEMENT);
                                                                    showNotification('Th??ng b??o!', '???? x??a th??nh c??ng ???????ng d??y ' + item.namE_E, 2000, 400);
                                                                    if (listLine !== null) {
                                                                        let tmpListLine = listLine.filter((itemL) => itemL.iD_ELEMENT !== item.iD_ELEMENT);
                                                                        let tmpListKhachHang = listKhachHang.filter((itemC) => {
                                                                            if (itemC.toA_DO !== null) {
                                                                                if (itemC.toA_DO.longitude === item.toadO_P1.longitude
                                                                                    && itemC.toA_DO.latitude === item.toadO_P1.latitude) {
                                                                                    return itemC;
                                                                                }
                                                                                if (itemC.toA_DO.longitude === item.toadO_P2.longitude
                                                                                    && itemC.toA_DO.latitude === item.toadO_P2.latitude) {
                                                                                    return itemC;
                                                                                }
                                                                            }
                                                                        });
    
                                                                        //console.log(tmpListKhachHang);       
                                                                        //setListUndo(listUndo.pop());  
                                                                        if (listUndo === null) {
                                                                            setListUndo([{ type: 'DeleteLine', object: item }]);
                                                                        } else {
                                                                            setListUndo([...listUndo, { type: 'DeleteLine', object: item }]);
                                                                        }
                                                                        props.setListKhachHangHasLine(props.listKhachHangHasLine.filter(itm => itm !== tmpListKhachHang[0].mA_DDO));
                                                                        //console.log(tmpListLine); 
                                                                        props.functionSetListLine(null);
                                                                        props.functionSetListLine([...tmpListLine]);
                                                                    }
                                                                }
                                                            })
                                                            .catch((error) => {
                                                                //console.log("Error: " + error);
                                                            })
    
                                                    } else {
    
                                                    }
                                                } else if (optionEffectObject.value === 'ViewInfoObject') {
                                                    props.functionSetObjectSelected({ type: "Line", object: item });
                                                } else if (optionEffectObject.value === 'ChangeManyObject' && props.tramChangeManyObject!==null) {
                                                    changeTramManyObject('Line',item.iD_ELEMENT,props.tramChangeManyObject.mA_TRAM);
                                                }
                                            }
                                            }
                                        />
                                    } else {
                                        return <Polyline
    
                                            options={{
                                                label: { color: 'red', text: 'Thanh B??nh', fontWeight: 'bold', fontSize: "12px" },
                                                strokeWeight: props.sizeLine,
    
                                            }}
                                            path={[
                                                { lng: Number(item.toadO_P1.longitude), lat: Number(item.toadO_P1.latitude) },
                                                { lng: Number(item.toadO_P2.longitude), lat: Number(item.toadO_P2.latitude) }
                                            ]}
                                            onClick={(e) => {
    
                                                //console.log(item);
                                                if (optionEffectObject.value === 'DeleteObject') {
                                                    let tmp = window.confirm("B???n ch???c c?? mu???n x??a ???????ng d??y " + item.namE_E + " ?");
                                                    if (tmp) {
                                                        //console.log('abc');
                                                        fetch(URLAPI+'/APIKTGS/Drawing/deleteLine', {
                                                            method: 'POST',
                                                            headers: {
                                                                Accept: 'application/json',
                                                                'Content-Type': 'application/json',
    
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    "MA_DVIQLY": item.mA_DVIQLY,
                                                                    "ID_ELEMENT": item.iD_ELEMENT,
                                                                    "MA_TRAM": item.mA_TRAM
                                                                }
                                                            )
                                                        })
                                                            .then(response => {
                                                                if (response.status ===200) {
                                                                    showNotification('Th??ng b??o!', '???? x??a th??nh c??ng ???????ng d??y ' + item.namE_E, 2000, 400);
                                                                    //props.reloadPage(props.maDonViSelected,props.maTramSelected);
                                                                    if (listUndo === null) {
                                                                        setListUndo([{ type: 'DeleteLine', object: item }]);
                                                                    } else {
                                                                        setListUndo([...listUndo, { type: 'DeleteLine', object: item }]);
                                                                    }
                                                                }
                                                            })
                                                            // .then((res) => {
    
                                                            // })
                                                            .catch((error) => {
                                                                //console.log("Error: " + error);
                                                            })
                                                        if (listLine !== null) {
    
                                                            let tmpListLine = listLine.filter((itemL) => itemL.iD_ELEMENT !== item.iD_ELEMENT);
                                                            //console.log(listLine);  
                                                            //console.log(tmpListLine);   
    
                                                            props.functionSetListLine(null);
                                                            props.functionSetListLine(tmpListLine);
    
                                                        }
                                                    } else {
    
                                                    }
                                                } else if (optionEffectObject.value === 'ViewInfoObject') {
                                                    props.functionSetObjectSelected({ type: "Line", object: item });
                                                } else if (optionEffectObject.value === 'ChangeManyObject' && props.tramChangeManyObject!==null) {
                                                    changeTramManyObject('Line',item.iD_ELEMENT,props.tramChangeManyObject.mA_TRAM);
                                                }
                                            }
                                            }
                                        />
                                    }
    
                                } else {
                                    return <Polyline
                                        path={[
                                            { lng: Number(item.toadO_P1.longitude), lat: Number(item.toadO_P1.latitude) },
                                            { lng: Number(item.toadO_P2.longitude), lat: Number(item.toadO_P2.latitude) }
                                        ]}
                                        options={{
                                            icons: [{
                                                icon: {
                                                    //path: 'M 15, 10, 5, 10',
                                                    //path: 'M 0,-1 0,1',
                                                    //path: 'M 0,-0.1 0,0.1 M 0,-0.5 0,0.5',
                                                    //strokeOpacity: 10,
                                                    // strokeColor:'blue',
                                                    //strokeWeight:1,
                                                    //scale: 2,
                                                    path: 'M 0,-0.1 0,0.1 M 0,-0.5 0,0.5',
                                                    strokeOpacity: 1,
                                                    stokeColor: '#0229FF',
                                                    //scale: 4
                                                    scale: 2
                                                },
                                                // icon:{url: IconTruTrungTheActive, scaledSize: new window.google.maps.Size(20, 20), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(10, 10), labelOrigin: new window.google.maps.Point(10, 10) },
                                                //offset: '0',
                                                repeat: '10px',
                                                text: 'abc',
                                                // strokeWeight: SizeLine*props.sizeLine,
                                                // repeat: '20px'
                                            }],
                                            //strokeColor: '#',
                                            strokeOpacity: 0,
                                            //strokeWeight: SizeLine*props.sizeLine,
                                            strokeWeight: 100,
                                            // strokeColor:'blue',
                                            //strokeWeight:2,
                                            //fillColor: '#5A5959',                                        
                                            //fillColor:'white',
                                            //fillOpacity: 0.35,
                                            clickable: true,
                                            draggable: false,
                                            editable: false,
                                            visible: true,
                                        }}
                                        onClick={(e) => {
                                            ;
                                            //console.log(item);
                                            if (optionEffectObject.value === 'DeleteObject') {
                                                //console.log('delete: '+item.iD_ELEMENT);
                                                let tmp = window.confirm("B???n ch???c c?? mu???n x??a ???????ng d??y " + item.namE_E + " ?");
                                                if (tmp) {
                                                    fetch(URLAPI+'/APIKTGS/Drawing/deleteLine', {
                                                        method: 'POST',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'Content-Type': 'application/json',
    
                                                        },
                                                        body: JSON.stringify(
                                                            {
                                                                "MA_DVIQLY": item.mA_DVIQLY,
                                                                "ID_ELEMENT": item.iD_ELEMENT,
                                                                "MA_TRAM": item.mA_TRAM
                                                            }
                                                        )
                                                    })
                                                        .then(response => {
    
    
                                                            if (response.status ===200) {
                                                                //console.log('OK delete line: ' + item.iD_ELEMENT);
                                                                if (listLine !== null) {
                                                                    let tmpListLine = listLine.filter((itemL) => itemL.iD_ELEMENT !== item.iD_ELEMENT);
                                                                    let tmpListKhachHang = listKhachHang.filter((itemC) => {
                                                                        if (itemC.toA_DO !== null) {
                                                                            if (itemC.toA_DO.longitude === item.toadO_P1.longitude
                                                                                && itemC.toA_DO.latitude === item.toadO_P1.latitude) {
                                                                                return itemC;
                                                                            }
                                                                            if (itemC.toA_DO.longitude === item.toadO_P2.longitude
                                                                                && itemC.toA_DO.latitude === item.toadO_P2.latitude) {
                                                                                return itemC;
                                                                            }
                                                                        }
                                                                    });
    
                                                                    //console.log('delete line and khach hang has line');
                                                                    //console.log(tmpListKhachHang);
                                                                    if (listUndo === null) {
                                                                        setListUndo([{ type: 'DeleteLine', object: item }]);
                                                                    } else {
                                                                        setListUndo([...listUndo, { type: 'DeleteLine', object: item }]);
                                                                    }
                                                                    props.setListKhachHangHasLine(props.listKhachHangHasLine.filter(itm => itm !== tmpListKhachHang[0].mA_DDO));
                                                                    props.functionSetListLine(null);
                                                                    props.functionSetListLine([...tmpListLine]);
                                                                }
                                                                showNotification('Th??ng b??o!', '???? x??a th??nh c??ng ???????ng d??y ' + item.namE_E, 2000, 400);
                                                            }
                                                        })
                                                        // .then((res) => {
    
                                                        // })
                                                        .catch((error) => {
                                                            //console.log("Error: " + error);
                                                        })
    
                                                } else {
    
                                                }
                                            } else if (optionEffectObject.value === 'ChangeManyObject' && props.tramChangeManyObject!==null) {
                                                changeTramManyObject('Line',item.iD_ELEMENT,props.tramChangeManyObject.mA_TRAM);
                                            } else if (optionEffectObject.value === 'ViewInfoObject') {
                                                props.functionSetObjectSelected({ type: "Line", object: item });
                                            } 
                                        }
                                        }
                                    />
                                }
                            }
    
    
                        }
                    })}
                    {/* Hi???n th??? kho???ng c??ch */}
                    {optionEffectObject.value === 'ShowDistance' && listLine !== null ? listLine.map((item) => {
                        ////console.log(item);
                        if (item.toadO_P2 !== null && item.toadO_P1 !== null) {
                            return <Marker
                                key={'distanceLine' + props.tram.mA_TRAM}
                                position={{ lat: (Number(item.toadO_P1.latitude) + Number(item.toadO_P2.latitude)) / 2, lng: (Number(item.toadO_P1.longitude) + Number(item.toadO_P2.longitude)) / 2 }}
                                // draggable={optionEffectObject.value === 'ChangeLocationByDragObject' ? true : false}
                                draggable={true}
                                icon="none"
                                options={{
                                    label: item.mA_DDO === '' ? {
                                        color: 'blue', text: (
                                            window.google.maps.geometry.spherical.computeDistanceBetween(new window.google.maps.LatLng(Number(item.toadO_P1.latitude), Number(item.toadO_P1.longitude)), new window.google.maps.LatLng(Number(item.toadO_P2.latitude), Number(item.toadO_P2.longitude))).toFixed(2) + ' m'
                                            //'abc'
                                        ), fontWeight: 'bold', fontSize: "12px"
                                    } : {
                                            color: 'black', text: (
                                                window.google.maps.geometry.spherical.computeDistanceBetween(new window.google.maps.LatLng(Number(item.toadO_P1.latitude), Number(item.toadO_P1.longitude)), new window.google.maps.LatLng(Number(item.toadO_P2.latitude), Number(item.toadO_P2.longitude))).toFixed(2) + ' m'
                                                //'abc'
                                            ), fontWeight: 'bold', fontSize: "12px"
                                        }
                                }}
                            />
                        }
                    })
                        :
                        null
                    }
    
                    {/* V??? Tr???m */}
                    {props.tram === null || optionEffectObject.value === 'ShowAllTram' ? null :
                        <Marker
                            key={'tram' + props.tram.mA_TRAM}
                            position={{ lat: Number(props.tram.toado.latitude), lng: Number(props.tram.toado.longitude) }}
                            draggable={optionEffectObject.value === 'ChangeLocationByDragObject' ? true : false}
                            options={{ label: { color: 'red', text: props.tram.teN_TRAM, fontWeight: 'bold', fontSize: "12px" }}}
                            onDragEnd={(e) => {
                                fetch(URLAPI+'/APIKTGS/TRAM/saveToaDoTram', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(
                                        {
                                            "mA_DVIQLY": props.tram.mA_DVIQLY,
                                            "mA_TRAM": props.tram.mA_TRAM,
                                            "TOADO": {
                                                "LONGITUDE": e.latLng.lng().toString(),
                                                "LATITUDE": e.latLng.lat().toString()
                                            }
    
                                        })
                                })
                                    .then(response => {
                                        
                                        if (response.status ===200) {
                                            //console.log('OK ponit: ' + props.tram.teN_TRAM);
                                            showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? tr???m ' + props.tram.teN_TRAM + ' th??nh c??ng ', 2000, 400);
                                            return response.json();
                                        }
                                        return null;
                                    })
                                    .then((res) => {
                                        
                                        if (res !== null) {
                                            if (listLine !== null) {
                                                listLine.map((itm, index) => {
                                                    if (props.tram !== null && props.tram.toado !== null && itm.toadO_P1 !== null && itm.toadO_P2) {
    
                                                        if (itm.toadO_P1 !== null) {
                                                            if (itm.toadO_P1.longitude === props.tram.toado.longitude && itm.toadO_P1.latitude === props.tram.toado.latitude) {
                                                                itm.toadO_P1.longitude = e.latLng.lng().toString();
                                                                itm.toadO_P1.latitude = e.latLng.lat().toString();
                                                            }
                                                        }
                                                        if (itm.toadO_P2 !== null) {
                                                            if (itm.toadO_P2.longitude === props.tram.toado.longitude && itm.toadO_P2.latitude === props.tram.toado.latitude) {
                                                                itm.toadO_P2.longitude = e.latLng.lng().toString();
                                                                itm.toadO_P2.latitude = e.latLng.lat().toString();
                                                            }
                                                        }
                                                    }
                                                });
                                            }
    
                                            if (props.tram.toado !== null) {
                                                props.tram.toado.longitude = e.latLng.lng().toString();
                                                props.tram.toado.latitude = e.latLng.lat().toString();
                                            }
                                            setFlagReRender(!flagReRender);
                                            //console.log('setFagReRender');
                                        }
                                    })
                                    .catch((error) => {
                                        //console.log("Error: " + error);
                                    });
                            }}
                            onClick={(e) => {
                                if (optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByType' && objectHasAdd === null) {
                                    setObjectHasAdd(props.tram);
                                } else {
                                    props.functionSetObjectSelected({ type: "Tram", object: props.tram });
                                }
                            }}
                            onRightClick={(e) => {
                                if (objectHasAddLine !== null) {
                                    if (optionEffectObject.value === 'AddLineNgam' && objectHasAddLine.type === 'Tru') {
                                        fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(
                                                {
                                                    "MA_DVIQLY": props.maDonViSelected,
                                                    "ID_ELEMENT": "",
                                                    "MA_TRAM": props.maTramSelected,
                                                    "TYPE_E": "CAPNGAM",
                                                    "NAME_E": "D??y ??i???n",
                                                    "ID_POINT1": objectHasAddLine.idPoint,
                                                    "ID_POINT2": 'TRAM-' + props.tram.mA_TRAM
                                                }
                                            )
                                        })
                                            .then(response => {
    
                                                if (response.status ===200) {
                                                    //console.log('OK line: ' + props.tram.mA_TRAM);
                                                    showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                    return response.json();
                                                }
    
                                                return null;
                                            })
                                            .then(res => {
                                                if (res !== null) {
    
                                                    props.functionSetListLine([...listLine, res]);
                                                    setObjectHasAddLine(null);
                                                }
                                            })
                                            .catch((error) => {
                                                //console.log("Error: " + error);
                                            });
                                    }
                                    if (objectHasAddLine.type === 'Tru') {
                                        fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(
                                                {
                                                    "MA_DVIQLY": props.maDonViSelected,
                                                    "ID_ELEMENT": "",
                                                    "MA_TRAM": props.maTramSelected,
                                                    "TYPE_E": "DDIEN",
                                                    "NAME_E": "D??y ??i???n",
                                                    "ID_POINT1": objectHasAddLine.idPoint,
                                                    "ID_POINT2": 'TRAM-' + props.tram.mA_TRAM
                                                }
                                            )
                                        })
                                            .then(response => {
                                                console.log({
                                                    "MA_DVIQLY": props.maDonViSelected,
                                                    "ID_ELEMENT": "",
                                                    "MA_TRAM": props.maTramSelected,
                                                    "TYPE_E": "DDIEN",
                                                    "NAME_E": "D??y ??i???n",
                                                    "ID_POINT1": objectHasAddLine.idPoint,
                                                    "ID_POINT2": 'TRAM-' + props.tram.mA_TRAM
                                                })
    
                                                if (response.status ===200) {
                                                    //console.log('OK line: ' + props.tram.mA_TRAM);
                                                    showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                    return response.json();
                                                }
    
                                                return null;
                                            })
                                            .then(res => {
                                                if (res !== null) {
    
                                                    props.functionSetListLine([...listLine, res]);
                                                    setObjectHasAddLine(null);
                                                }
                                            })
                                            .catch((error) => {
                                                //console.log("Error: " + error);
                                            });
                                    } else if (objectHasAddLine.type === 'KhachHang') {
                                        fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(
                                                {
                                                    "MA_DVIQLY": props.maDonViSelected,
                                                    "ID_ELEMENT": "",
                                                    "MA_TRAM": props.maTramSelected,
                                                    "TYPE_E": "DDIEN",
                                                    "NAME_E": "D??y ??i???n",
                                                    "ID_POINT1": 'TRAM-' + props.tram.mA_TRAM,
                                                    "ID_POINT2": ""
                                                }
                                            )
                                        })
                                            .then(response => {
    
                                                if (response.status ===200) {
    
                                                    //showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                    ////console.log(amountLine);                                                    
    
                                                    return response.json();
                                                }
    
                                                return null;
                                            })
                                            .then((res) => {
    
                                                if (res !== null) {
    
                                                    fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                        method: 'POST',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify(
                                                            {
                                                                "MA_DVIQLY": props.maDonViSelected,
                                                                "MA_TRAM": props.maTramSelected,
                                                                "ID_LINE": res.iD_ELEMENT,
                                                                "ID_POINT": 'TRAM-' + props.tram.mA_TRAM,
                                                                "MA_DDO": objectHasAddLine.maDD
                                                            }
                                                        )
                                                    })
                                                        .then(response => {
    
                                                            if (response.status ===200) {
    
                                                                showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                return response.json();
                                                            }
                                                            return null;
    
                                                        })
                                                        .then(res => {
                                                            if (res !== null) {
    
                                                                props.setListKhachHangHasLine([...props.listKhachHangHasLine, res.mA_DDO]);
                                                                props.functionSetListLine([...listLine, res]);
                                                                setObjectHasAddLine(null);
                                                            }
                                                        })
    
                                                        .catch((error) => {
                                                            //console.log("Error: " + error);
                                                        });
                                                }
                                            })
                                            .catch((error) => {
                                                //console.log("Error: " + error);
                                            });
                                    }
                                } else {
                                    setObjectHasAddLine({
                                        type: "Tram",
                                        maDD: "",
                                        idPoint: "",
                                        maTram: props.tram.mA_TRAM
                                    });
                                }
                            }}
                            icon={objectSelected.type === 'Tram' ?
                                (objectSelected.object.mA_TRAM === props.tram.mA_TRAM ?
                                    { url: IconTramActive, scaledSize: new window.google.maps.Size(SizeTram * props.sizeTram, SizeTram * props.sizeTram), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram / 2), labelOrigin: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram + 10) }
                                    :
                                    { url: IconTram, scaledSize: new window.google.maps.Size(SizeTram * props.sizeTram, SizeTram * props.sizeTram), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram / 2), labelOrigin: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram + 10) }
                                )
                                :
                                (
                                    objectHasAddLine !== null ?
                                        (
                                            objectHasAddLine.maTram === props.tram.mA_TRAM ?
                                                (
                                                    { url: IconTramRightClick, scaledSize: new window.google.maps.Size(SizeTram * props.sizeTram, SizeTram * props.sizeTram), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram / 2), labelOrigin: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram + 10) }
                                                ) :
                                                { url: IconTram, scaledSize: new window.google.maps.Size(SizeTram * props.sizeTram, SizeTram * props.sizeTram), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram / 2), labelOrigin: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram + 10) }
                                        ) :
                                        { url: IconTram, scaledSize: new window.google.maps.Size(SizeTram * props.sizeTram, SizeTram * props.sizeTram), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram / 2), labelOrigin: new window.google.maps.Point(SizeTram * props.sizeTram / 2, SizeTram * props.sizeTram + 10) }
                                )
                            }
                        // { url: objectSelected.type==='Tram'??IconTramActive:objectHasAdd !==null?objectHasAdd.type.maTram===props.tram.mA_TRAM? IconTramRightClick:IconTram:IconTram:IconTram, scaledSize: new window.google.maps.Size(SizeTram*props.sizeTram, SizeTram*props.sizeTram), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTram*props.sizeTram/2, SizeTram*props.sizeTram/2), labelOrigin: new window.google.maps.Point(SizeTram*props.sizeTram/2, SizeTram*props.sizeTram+10) }
                        />
                    }
    
                    {props.listTram === null || optionEffectObject.value !== 'ShowAllTram' ? null : props.listTram.map(item => {
                        console.log(props.sizeTramAll);
                        console.log(props.showLabelTramAll);
                        return <Marker
                            key={'tram' + item.mA_TRAM}
                            position={{ lat: Number(item.toado.latitude), lng: Number(item.toado.longitude) }}
                            draggable={optionEffectObject.value === 'ChangeLocationByDragObject' ? true : false}
                            options={props.showLabelTramAll === 'HienThi' ? { label: { color: 'red', text: item.teN_TRAM, fontWeight: 'bold', fontSize: "12px" } } : null}
                            onClick={(e) => {
                                if (optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByType' && objectHasAdd === null) {
                                    setObjectHasAdd(props.tram);
                                } else {
                                    props.functionSetObjectSelected({ type: "Tram", object: item });
                                }
                            }}
                            icon={{ url: IconTram, scaledSize: new window.google.maps.Size(SizeTram * props.sizeTramAll, SizeTram * props.sizeTramAll), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTram * props.sizeTramAll / 2, SizeTram * props.sizeTramAll / 2), labelOrigin: new window.google.maps.Point(SizeTram * props.sizeTramAll / 2, SizeTram * props.sizeTramAll + 10) }}
                        />
                    })
                    }
    
                    {/* V??? Tr??? */}
                    {listTru === null ? null : listTru.map((item) => {
                        if (item.longitude !== null && item.longitude !== '' && item.latitude !== null && item.latitude !== '') {
                            if (item.typE_E === 'THATHE') {
                                return <Marker
                                    key={item.iD_ELEMENT + 'tru'}
                                    options={{ label: { color: '#094E99', text: item.namE_E, fontWeight: 'bold', fontSize: "12px" } }}
                                    draggable={optionEffectObject.value === 'ChangeLocationByDragObject' ? true : false}
                                    onDragEnd={(e) => {
                                        fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(
                                                {
                                                    "MA_DVIQLY": item.mA_DVIQLY,
                                                    "ID_ELEMENT": item.iD_ELEMENT,
                                                    "MA_TRAM": item.mA_TRAM,
                                                    "TYPE_E": "THATHE",
                                                    "NAME_E": item.namE_E,
                                                    "LONGITUDE": e.latLng.lng().toString(),
                                                    "LATITUDE": e.latLng.lat().toString(),
                                                    "longitudE_LABEL": e.latLng.lng().toString(),
                                                    "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                    "dS_DIEMDO": item.dS_DIEMDO
                                                })
                                        })
                                            .then(response => {
    
                                                if (response.status ===200) {
    
                                                    //console.log('OK ponit: ' + item.iD_ELEMENT);
                                                    showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? tru' + item.namE_E + ' th??nh c??ng ', 2000, 400);
                                                }
                                            })
                                            .then((res) => {
    
                                            })
                                            .catch((error) => {
                                                //console.log("Error: " + error);
                                            });
                                        if (listLine !== null) {
                                            listLine.map((itm, index) => {
                                                if (itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                                    if (itm.toadO_P1.longitude === item.longitude && itm.toadO_P1.latitude === item.latitude) {
                                                        itm.toadO_P1.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P1.latitude = e.latLng.lat().toString();
                                                    }
                                                    if (itm.toadO_P2.longitude === item.longitude && itm.toadO_P2.latitude === item.latitude) {
                                                        itm.toadO_P2.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P2.latitude = e.latLng.lat().toString();
                                                    }
                                                }
                                            });
                                        }
                                        if (listTru !== null) {
                                            listTru.map((itmTru) => {
                                                if (itmTru.iD_ELEMENT === item.iD_ELEMENT) {
                                                    itmTru.longitude = e.latLng.lng().toString();
                                                    itmTru.latitude = e.latLng.lat().toString();
                                                }
                                            });
                                        }
                                        setFlagReRender(!flagReRender);
                                        //console.log('setFagReRender');
                                        // const tmp = window.confirm("B???n c?? ch???c mu???n l??u v??? tr?? tr??? " + item.namE_E + " ?");
                                        // if (tmp) {
    
                                        // } else {
                                        //     window.alert('Kh??ng L??u');
                                        // }                                
                                    }}
                                    onClick={(e) => {
                                        if (optionEffectObject.value === "AddLine") {
                                            if (listObjectAddLine != null) {
                                                setListObjectAddLine(listObjectAddLine => [...listObjectAddLine,
                                                {
                                                    lat: Number(item.latitude),
                                                    lng: Number(item.longitude),
                                                    type: "Tru",
                                                    id: listObjectAddLine.length,
                                                    maDD: "",
                                                    idPoint: item.iD_ELEMENT
                                                }
                                                ]);
                                            } else {
                                                setListObjectAddLine([{ lat: Number(item.latitude), lng: Number(item.longitude), type: "Tru", id: 0, maDD: "", idPoint: item.iD_ELEMENT }]);
    
                                            }
    
                                        } else if (optionEffectObject.value === "UpdateNamePoint") {
                                            let name = window.prompt('Nh???p t??n tr???: ');
                                            if (name !== null) {
                                                fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.mA_DVIQLY,
                                                            "ID_ELEMENT": item.iD_ELEMENT,
                                                            "MA_TRAM": item.mA_TRAM,
                                                            "TYPE_E": "THATHE",
                                                            "NAME_E": name,
                                                            "LONGITUDE": item.longitude,
                                                            "LATITUDE": item.latitude,
                                                            "longitudE_LABEL": item.longitudE_LABEL,
                                                            "latitudE_LABEL": item.latitudE_LABEL,
                                                            "dS_DIEMDO": item.dS_DIEMDO
                                                        })
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
    
                                                            listTru.map(itm => {
                                                                if (itm.iD_ELEMENT === item.iD_ELEMENT) {
                                                                    itm.namE_E = name;
                                                                }
                                                            });
                                                            setFlagReRender(!flagReRender);
                                                        }
                                                    })
                                                    .then((res) => {
    
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else if (optionEffectObject.value === 'ChangeLocationByClickObject') {
                                            setIdTruSelected(item.iD_ELEMENT);
                                        } else if (optionEffectObject.value === 'DeleteObject') {
                                            let tmp = window.confirm("B???n ch???c c?? mu???n x??a tr??? " + item.namE_E + " ?");
                                            if (tmp) {
                                                fetch(URLAPI+'/APIKTGS/Drawing/deletePoint', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.mA_DVIQLY,
                                                            "ID_ELEMENT": item.iD_ELEMENT,
                                                            "MA_TRAM": item.mA_TRAM
                                                        })
                                                })
                                                    .then(response => {
                                                        if (response.status ===200) {
                                                            //console.log('OK delete point: ' + item.iD_ELEMENT);
                                                            showNotification('Th??ng b??o!', '???? x??a tr??? ' + item.namE_E + ' th??nh c??ng ', 2000, 400);
                                                        }
                                                    })
                                                    // .then((res) => {
    
                                                    // })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    })
                                                let listIdLine = [];
                                                let tmpListTru = [];
                                                let tmpListLine = [];
                                                if (listLine !== null) {
                                                    listLine.map((itm, index) => {
                                                        if (itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
    
                                                            //console.log(item);
                                                            //console.log(itm);
                                                            if ((itm.toadO_P1.longitude === item.longitude && itm.toadO_P1.latitude === item.latitude)
                                                                || (itm.toadO_P2.longitude === item.longitude && itm.toadO_P2.latitude === item.latitude)
                                                            ) {
                                                                listIdLine.push(itm.iD_ELEMENT);
                                                                fetch(URLAPI+'/APIKTGS/Drawing/deleteLine', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        Accept: 'application/json',
                                                                        'Content-Type': 'application/json',
    
                                                                    },
                                                                    body: JSON.stringify(
                                                                        {
                                                                            "MA_DVIQLY": itm.mA_DVIQLY,
                                                                            "ID_ELEMENT": itm.iD_ELEMENT,
                                                                            "MA_TRAM": itm.mA_TRAM
                                                                        }
                                                                    )
                                                                })
                                                                    .then(response => {
                                                                        if (response.status ===200) {
                                                                            //console.log('OK delete line: ' + itm.iD_ELEMENT);
                                                                            showNotification('Th??ng b??o!', '???? x??a ???????ng d??y ' + itm.iD_ELEMENT + ' th??nh c??ng ', 2000, 400);
                                                                        }
                                                                    })
                                                                    // .then((res) => {
    
                                                                    // })
                                                                    .catch((error) => {
                                                                        //console.log("Error: " + error);
                                                                    })
                                                            }
                                                        }
                                                    });
                                                    tmpListLine = listLine.filter((itemLine) => !listIdLine.includes(itemLine.iD_ELEMENT));
                                                }
    
                                                if (listTru !== null) {
                                                    listTru.map((itmTru) => {
                                                        if (itmTru.iD_ELEMENT === item.iD_ELEMENT) {
                                                            itmTru.longitude = "0";
                                                            itmTru.latitude = "0";
                                                        }
                                                    });
                                                    tmpListTru = listTru.filter((itemTru) => itemTru.iD_ELEMENT !== item.iD_ELEMENT);
                                                }
                                                if (tmpListLine.length !== 0) {
                                                    props.functionSetListTru(tmpListTru);
                                                }
                                                if (tmpListTru.length !== 0) {
                                                    props.functionSetListLine(null);
                                                    props.functionSetListLine(tmpListLine);
                                                }
                                                //setFlagReRender(!flagReRender);
                                            }
                                        } else if (optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByType' && objectHasAdd === null) {
                                            setObjectHasAdd(item);
                                        } else if (optionEffectObject.value === 'ChangeManyObject' && props.tramChangeManyObject!==null) {
                                            changeTramManyObject('Tru',item.iD_ELEMENT,props.tramChangeManyObject.mA_TRAM);
                                        } else {
                                            props.functionSetObjectSelected({ type: "Tru", object: item });
                                        }
                                    }}
                                    onRightClick={(e) => {
                                        if (objectHasAddLine !== null) {
                                            if (optionEffectObject.value === 'AddLineNgam' && objectHasAddLine.type === 'Tram') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "CAPNGAM",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": 'TRAM-' + objectHasAddLine.maTram
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + props.tram.mA_TRAM);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y ng???m th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                  
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (optionEffectObject.value === 'AddLineNgam' && objectHasAddLine.type === 'Tru') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "CAPNGAM",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": objectHasAddLine.idPoint
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + item.id);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                   
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.idPoint !== item.iD_ELEMENT && objectHasAddLine.type === 'Tru') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": objectHasAddLine.idPoint
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + item.id);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                   
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.type === 'KhachHang') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": ''
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + item.id);
                                                            //showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then((res) => {
    
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "ID_LINE": res.iD_ELEMENT,
                                                                        "ID_POINT": item.iD_ELEMENT,
                                                                        "MA_DDO": objectHasAddLine.maDD
                                                                    }
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
    
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then(res => {
                                                                    if (res !== null) {
    
                                                                        props.setListKhachHangHasLine([...props.listKhachHangHasLine, res.mA_DDO]);
                                                                        props.functionSetListLine([...listLine, res]);
                                                                        setObjectHasAddLine(null);
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.type === 'Tram') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": 'TRAM-' + objectHasAddLine.maTram
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + props.tram.mA_TRAM);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                  
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else {
                                            setObjectHasAddLine({
                                                type: "Tru",
                                                maDD: "",
                                                idPoint: item.iD_ELEMENT,
                                                maTram: ""
                                            });
                                        }
                                    }}
                                    onDragStart={(e) => {
                                        //setObjectSelected({ type: "Tru", object: item });
                                    }}
                                    icon={(objectSelected.type === 'Tru') ?
                                        ((objectSelected.object.iD_ELEMENT === item.iD_ELEMENT) ?
                                            { url: IconTruHaTheTronActive, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                            :
                                            { url: IconTruHaTheTron, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                        )
                                        :
                                        (
                                            objectHasAddLine !== null ?
                                                (
                                                    objectHasAddLine.idPoint === item.iD_ELEMENT ?
                                                        { url: IconTruHaTheTronRightClick, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                                        :
                                                        { url: IconTruHaTheTron, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                                ) :
                                                idTruSelected === item.iD_ELEMENT ?
                                                    { url: IconTruHaTheTronActive, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                                    :
                                                    { url: IconTruHaTheTron, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                        )
                                    }
                                    position={{ lat: Number(item.latitude), lng: Number(item.longitude) }}
    
                                // position={(optionEffectObject.value === 'ChangeLocationByAddressObject' && objectSelected.type === 'Tru' && props.resultLocationSearchBox != null) ?
                                //     (
                                //         objectSelected.object.iD_ELEMENT === item.iD_ELEMENT ?
                                //             {
                                //                 lng: Number(props.resultLocationSearchBox.lng),
                                //                 lat: Number(props.resultLocationSearchBox.lat)
                                //             }
                                //             :
                                //             { lat: Number(item.latitude), lng: Number(item.longitude) }
                                //     )
                                //     : ((optionEffectObject.value === 'ChangeLocationByTypingObject' && objectSelected.type === 'Tru' && props.resultLocationTypingBox != null) ?
                                //         objectSelected.object.iD_ELEMENT === item.iD_ELEMENT ?
                                //             {
                                //                 lng: Number(props.resultLocationTypingBox.lng),
                                //                 lat: Number(props.resultLocationTypingBox.lat)
                                //             }
                                //             :
                                //             { lat: Number(item.latitude), lng: Number(item.longitude) }
                                //         :
                                //         { lat: Number(item.latitude), lng: Number(item.longitude) }
                                //     )
                                // }
                                >
                                </Marker>
                            } else if (item.typE_E === 'TVHTHE') {
                                return <Marker
                                    key={item.iD_ELEMENT + 'tru'}
                                    options={{ label: { color: '#094E99', text: item.namE_E, fontWeight: 'bold', fontSize: "12px" } }}
                                    draggable={optionEffectObject.value === 'ChangeLocationByDragObject' ? true : false}
                                    onDragEnd={(e) => {
                                        fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(
                                                {
                                                    "MA_DVIQLY": item.mA_DVIQLY,
                                                    "ID_ELEMENT": item.iD_ELEMENT,
                                                    "MA_TRAM": item.mA_TRAM,
                                                    "TYPE_E": "TVHTHE",
                                                    "NAME_E": item.namE_E,
                                                    "LONGITUDE": e.latLng.lng().toString(),
                                                    "LATITUDE": e.latLng.lat().toString(),
                                                    "longitudE_LABEL": e.latLng.lng().toString(),
                                                    "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                    "dS_DIEMDO": item.dS_DIEMDO
                                                })
                                        })
                                            .then(response => {
                                                if (response.status ===200) {
                                                    //console.log('OK ponit: ' + item.iD_ELEMENT);
                                                    showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? tru' + item.namE_E + ' th??nh c??ng ', 2000, 400);
                                                }
                                            })
                                            // .then((res) => {
    
                                            // })
                                            .catch((error) => {
                                                //console.log("Error: " + error);
                                            });
                                        if (listLine !== null) {
                                            listLine.map((itm, index) => {
                                                if (itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                                    if (itm.toadO_P1.longitude === item.longitude && itm.toadO_P1.latitude === item.latitude) {
                                                        itm.toadO_P1.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P1.latitude = e.latLng.lat().toString();
                                                    }
                                                    if (itm.toadO_P2.longitude === item.longitude && itm.toadO_P2.latitude === item.latitude) {
                                                        itm.toadO_P2.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P2.latitude = e.latLng.lat().toString();
                                                    }
                                                }
                                            });
                                        }
                                        if (listTru !== null) {
                                            listTru.map((itmTru) => {
                                                if (itmTru.iD_ELEMENT === item.iD_ELEMENT) {
                                                    itmTru.longitude = e.latLng.lng().toString();
                                                    itmTru.latitude = e.latLng.lat().toString();
                                                }
                                            });
                                        }
                                        setFlagReRender(!flagReRender);
                                        //console.log('setFagReRender');
                                        // const tmp = window.confirm("B???n c?? ch???c mu???n l??u v??? tr?? tr??? " + item.namE_E + " ?");
                                        // if (tmp) {
    
                                        // } else {
                                        //     window.alert('Kh??ng L??u');
                                        // }                                
                                    }}
                                    onClick={(e) => {
                                        if (optionEffectObject.value === "AddLine") {
                                            if (listObjectAddLine != null) {
                                                setListObjectAddLine(listObjectAddLine => [...listObjectAddLine,
                                                {
                                                    lat: Number(item.latitude),
                                                    lng: Number(item.longitude),
                                                    type: "Tru",
                                                    id: listObjectAddLine.length,
                                                    maDD: "",
                                                    idPoint: item.iD_ELEMENT
                                                }
                                                ]);
                                            } else {
                                                setListObjectAddLine([{ lat: Number(item.latitude), lng: Number(item.longitude), type: "Tru", id: 0, maDD: "", idPoint: item.iD_ELEMENT }]);
    
                                            }
    
                                        } else if (optionEffectObject.value === "UpdateNamePoint") {
                                            let name = window.prompt('Nh???p t??n tr???: ');
                                            if (name !== null) {
                                                fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.mA_DVIQLY,
                                                            "ID_ELEMENT": item.iD_ELEMENT,
                                                            "MA_TRAM": item.mA_TRAM,
                                                            "TYPE_E": "TVHTHE",
                                                            "NAME_E": name,
                                                            "LONGITUDE": item.longitude,
                                                            "LATITUDE": item.latitude,
                                                            "longitudE_LABEL": item.longitudE_LABEL,
                                                            "latitudE_LABEL": item.latitudE_LABEL,
                                                            "dS_DIEMDO": item.dS_DIEMDO
                                                        })
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
    
                                                            listTru.map(itm => {
                                                                if (itm.iD_ELEMENT === item.iD_ELEMENT) {
                                                                    itm.namE_E = name;
                                                                }
                                                            });
                                                            setFlagReRender(!flagReRender);
                                                        }
                                                    })
                                                    .then((res) => {
    
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else if (optionEffectObject.value === 'ChangeLocationByClickObject') {
                                            setIdTruSelected(item.iD_ELEMENT);
                                        } else if (optionEffectObject.value === 'DeleteObject') {
                                            let tmp = window.confirm("B???n ch???c c?? mu???n x??a tr??? " + item.namE_E + " ?");
                                            if (tmp) {
                                                fetch(URLAPI+'/APIKTGS/Drawing/deletePoint', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.mA_DVIQLY,
                                                            "ID_ELEMENT": item.iD_ELEMENT,
                                                            "MA_TRAM": item.mA_TRAM
                                                        })
                                                })
                                                    .then(response => {
                                                        if (response.status ===200) {
                                                            //console.log('OK delete point: ' + item.iD_ELEMENT);
                                                            showNotification('Th??ng b??o!', '???? x??a tr??? ' + item.namE_E + ' th??nh c??ng ', 2000, 400);
                                                        }
                                                    })
                                                    // .then((res) => {
    
                                                    // })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    })
    
                                                let listIdLine = [];
                                                let tmpListTru = [];
                                                let tmpListLine = [];
                                                if (listLine !== null) {
                                                    listLine.map((itm, index) => {
                                                        if (itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                                            if ((itm.toadO_P1.longitude === item.longitude && itm.toadO_P1.latitude === item.latitude)
                                                                || (itm.toadO_P2.longitude === item.longitude && itm.toadO_P2.latitude === item.latitude)
                                                            ) {
                                                                listIdLine.push(itm.iD_ELEMENT);
                                                                fetch(URLAPI+'/APIKTGS/Drawing/deleteLine', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        Accept: 'application/json',
                                                                        'Content-Type': 'application/json',
    
                                                                    },
                                                                    body: JSON.stringify(
                                                                        {
                                                                            "MA_DVIQLY": itm.mA_DVIQLY,
                                                                            "ID_ELEMENT": itm.iD_ELEMENT,
                                                                            "MA_TRAM": itm.mA_TRAM
                                                                        }
                                                                    )
                                                                })
                                                                    .then(response => {
                                                                        if (response.status ===200) {
                                                                            //console.log('OK delete line: ' + itm.iD_ELEMENT);
                                                                            showNotification('Th??ng b??o!', '???? x??a ???????ng d??y ' + itm.iD_ELEMENT + ' th??nh c??ng ', 2000, 400);
                                                                        }
                                                                    })
                                                                    // .then((res) => {
    
                                                                    // })
                                                                    .catch((error) => {
                                                                        //console.log("Error: " + error);
                                                                    })
                                                            }
                                                        }
                                                    });
                                                    tmpListLine = listLine.filter((itemLine) => !listIdLine.includes(itemLine.iD_ELEMENT));
                                                }
    
                                                if (listTru !== null) {
                                                    listTru.map((itmTru) => {
                                                        if (itmTru.iD_ELEMENT === item.iD_ELEMENT) {
                                                            itmTru.longitude = "0";
                                                            itmTru.latitude = "0";
                                                        }
                                                    });
                                                    tmpListTru = listTru.filter((itemTru) => itemTru.iD_ELEMENT !== item.iD_ELEMENT);
                                                }
                                                if (tmpListLine.length !== 0) {
                                                    props.functionSetListTru(tmpListTru);
                                                }
                                                if (tmpListTru.length !== 0) {
                                                    props.functionSetListLine(null);
                                                    props.functionSetListLine(tmpListLine);
                                                }
                                                //setFlagReRender(!flagReRender);
                                            }
                                        } else if (optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByType' && objectHasAdd === null) {
                                            setObjectHasAdd(item);
                                        } else if (optionEffectObject.value === 'ChangeManyObject' && props.tramChangeManyObject!==null) {
                                            changeTramManyObject('Tru',item.iD_ELEMENT,props.tramChangeManyObject.mA_TRAM);
                                        } else {
                                            props.functionSetObjectSelected({ type: "Tru", object: item });
                                        }
                                    }}
                                    onRightClick={(e) => {
                                        if (objectHasAddLine !== null) {
                                            if (optionEffectObject.value === 'AddLineNgam' && objectHasAddLine.type === 'Tram') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "CAPNGAM",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": 'TRAM-' + objectHasAddLine.maTram
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + props.tram.mA_TRAM);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y ng???m th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                  
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (optionEffectObject.value === 'AddLineNgam' && objectHasAddLine.type === 'Tru') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "CAPNGAM",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": objectHasAddLine.idPoint
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + item.id);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                   
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.idPoint !== item.iD_ELEMENT && objectHasAddLine.type === 'Tru') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": objectHasAddLine.idPoint
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + item.id);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                   
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.type === 'KhachHang') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": ''
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
    
                                                        if (response.status ===200) {
    
                                                            //console.log('OK line: ' + item.id);
                                                            //showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then((res) => {
    
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "ID_LINE": res.iD_ELEMENT,
                                                                        "ID_POINT": item.iD_ELEMENT,
                                                                        "MA_DDO": objectHasAddLine.maDD
                                                                    }
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
    
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then(res => {
                                                                    if (res !== null) {
    
                                                                        props.setListKhachHangHasLine([...props.listKhachHangHasLine, res.mA_DDO]);
                                                                        props.functionSetListLine([...listLine, res]);
                                                                        setObjectHasAddLine(null);
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.type === 'Tram') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": 'TRAM-' + objectHasAddLine.maTram
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + props.tram.mA_TRAM);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                  
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else {
                                            setObjectHasAddLine({
                                                type: "Tru",
                                                maDD: "",
                                                idPoint: item.iD_ELEMENT,
                                                maTram: ""
                                            });
                                        }
                                    }}
                                    onDragStart={(e) => {
                                        //setObjectSelected({ type: "Tru", object: item });
                                    }}
                                    icon={objectSelected.type === 'Tru' ?
                                        (objectSelected.object.iD_ELEMENT === item.iD_ELEMENT ?
                                            { url: IconTruHaTheVuongActive, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                            :
                                            { url: IconTruHaTheVuong, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                        )
                                        :
                                        (
                                            objectHasAddLine !== null ?
                                                (
                                                    objectHasAddLine.idPoint === item.iD_ELEMENT ?
                                                        { url: IconTruHaTheVuongRightClick, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                                        :
                                                        { url: IconTruHaTheVuong, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                                ) :
                                                idTruSelected === item.iD_ELEMENT ?
                                                    { url: IconTruHaTheVuongActive, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                                    :
                                                    { url: IconTruHaTheVuong, scaledSize: new window.google.maps.Size(SizeTruHaThe * props.sizeTruHaThe, SizeTruHaThe * props.sizeTruHaThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe / 2, SizeTruHaThe * props.sizeTruHaThe / 2), labelOrigin: new window.google.maps.Point(SizeTruHaThe * props.sizeTruHaThe + 5, SizeTruHaThe * props.sizeTruHaThe + 5) }
                                        )
                                    }
                                    position={{ lat: Number(item.latitude), lng: Number(item.longitude) }}
                                // position={(optionEffectObject.value === 'ChangeLocationByAddressObject' && objectSelected.type === 'Tru' && props.resultLocationSearchBox != null) ?
                                //     (
                                //         objectSelected.object.iD_ELEMENT === item.iD_ELEMENT ?
                                //             {
                                //                 lng: Number(props.resultLocationSearchBox.lng),
                                //                 lat: Number(props.resultLocationSearchBox.lat)
                                //             }
                                //             :
                                //             { lat: Number(item.latitude), lng: Number(item.longitude) }
                                //     )
                                //     : ((optionEffectObject.value === 'ChangeLocationByTypingObject' && objectSelected.type === 'Tru' && props.resultLocationTypingBox != null) ?
                                //         objectSelected.object.iD_ELEMENT === item.iD_ELEMENT ?
                                //             {
                                //                 lng: Number(props.resultLocationTypingBox.lng),
                                //                 lat: Number(props.resultLocationTypingBox.lat)
                                //             }
                                //             :
                                //             { lat: Number(item.latitude), lng: Number(item.longitude) }
                                //         :
                                //         { lat: Number(item.latitude), lng: Number(item.longitude) }
                                //     )
                                // }
                                >
                                </Marker>
                            } else if (item.typE_E === 'TTRHE') {
                                return <Marker
                                    key={item.iD_ELEMENT + 'tru'}
                                    options={{ label: { color: '#094E99', text: item.namE_E, fontWeight: 'bold', fontSize: "12px" } }}
                                    draggable={optionEffectObject.value === 'ChangeLocationByDragObject' ? true : false}
                                    onDragEnd={(e) => {
                                        fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(
                                                {
                                                    "MA_DVIQLY": item.mA_DVIQLY,
                                                    "ID_ELEMENT": item.iD_ELEMENT,
                                                    "MA_TRAM": item.mA_TRAM,
                                                    "TYPE_E": "TTRHE",
                                                    "NAME_E": item.namE_E,
                                                    "LONGITUDE": e.latLng.lng().toString(),
                                                    "LATITUDE": e.latLng.lat().toString(),
                                                    "longitudE_LABEL": e.latLng.lng().toString(),
                                                    "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                    "dS_DIEMDO": item.dS_DIEMDO
                                                })
                                        })
                                            .then(response => {
                                                if (response.status ===200) {
                                                    //console.log('OK ponit: ' + item.iD_ELEMENT);
                                                    showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? tru' + item.namE_E + ' th??nh c??ng ', 2000, 400);
                                                }
                                            })
                                            // .then((res) => {
    
                                            // })
                                            .catch((error) => {
                                                //console.log("Error: " + error);
                                            });
                                        if (listLine !== null) {
                                            listLine.map((itm, index) => {
                                                if (itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                                    if (itm.toadO_P1.longitude === item.longitude && itm.toadO_P1.latitude === item.latitude) {
                                                        itm.toadO_P1.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P1.latitude = e.latLng.lat().toString();
                                                    }
                                                    if (itm.toadO_P2.longitude === item.longitude && itm.toadO_P2.latitude === item.latitude) {
                                                        itm.toadO_P2.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P2.latitude = e.latLng.lat().toString();
                                                    }
                                                }
                                            });
                                        }
                                        if (listTru !== null) {
                                            listTru.map((itmTru) => {
                                                if (itmTru.iD_ELEMENT === item.iD_ELEMENT) {
                                                    itmTru.longitude = e.latLng.lng().toString();
                                                    itmTru.latitude = e.latLng.lat().toString();
                                                }
                                            });
                                        }
                                        setFlagReRender(!flagReRender);
                                        //console.log('setFagReRender');
                                        // const tmp = window.confirm("B???n c?? ch???c mu???n l??u v??? tr?? tr??? " + item.namE_E + " ?");
                                        // if (tmp) {
    
                                        // } else {
                                        //     window.alert('Kh??ng L??u');
                                        // }                                
                                    }}
                                    onClick={(e) => {
                                        if (optionEffectObject.value === "AddLine") {
                                            if (listObjectAddLine != null) {
                                                setListObjectAddLine(listObjectAddLine => [...listObjectAddLine,
                                                {
                                                    lat: Number(item.latitude),
                                                    lng: Number(item.longitude),
                                                    type: "Tru",
                                                    id: listObjectAddLine.length,
                                                    maDD: "",
                                                    idPoint: item.iD_ELEMENT
                                                }
                                                ]);
                                            } else {
                                                setListObjectAddLine([{ lat: Number(item.latitude), lng: Number(item.longitude), type: "Tru", id: 0, maDD: "", idPoint: item.iD_ELEMENT }]);    
                                            }
    
                                        } else if (optionEffectObject.value === "UpdateNamePoint") {
                                            let name = window.prompt('Nh???p t??n tr???: ');
                                            if (name !== null) {
                                                fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.mA_DVIQLY,
                                                            "ID_ELEMENT": item.iD_ELEMENT,
                                                            "MA_TRAM": item.mA_TRAM,
                                                            "TYPE_E": "TTRHE",
                                                            "NAME_E": name,
                                                            "LONGITUDE": item.longitude,
                                                            "LATITUDE": item.latitude,
                                                            "longitudE_LABEL": item.longitudE_LABEL,
                                                            "latitudE_LABEL": item.latitudE_LABEL,
                                                            "dS_DIEMDO": item.dS_DIEMDO
                                                        })
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
    
                                                            listTru.map(itm => {
                                                                if (itm.iD_ELEMENT === item.iD_ELEMENT) {
                                                                    itm.namE_E = name;
                                                                }
                                                            });
                                                            setFlagReRender(!flagReRender);
                                                        }
                                                    })
                                                    .then((res) => {
    
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else if (optionEffectObject.value === 'ChangeLocationByClickObject') {
                                            setIdTruSelected(item.iD_ELEMENT);
                                        } else if (optionEffectObject.value === 'DeleteObject') {
                                            let tmp = window.confirm("B???n ch???c c?? mu???n x??a tr??? " + item.namE_E + " ?");
                                            if (tmp) {
                                                fetch(URLAPI+'/APIKTGS/Drawing/deletePoint', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.mA_DVIQLY,
                                                            "ID_ELEMENT": item.iD_ELEMENT,
                                                            "MA_TRAM": item.mA_TRAM
                                                        })
                                                })
                                                    .then(response => {
                                                        if (response.status ===200) {
                                                            //console.log('OK delete point: ' + item.iD_ELEMENT);
                                                            showNotification('Th??ng b??o!', '???? x??a tr??? ' + item.namE_E + ' th??nh c??ng ', 2000, 400);
                                                        }
                                                    })
                                                    // .then((res) => {
    
                                                    // })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    })
    
                                                let listIdLine = [];
                                                let tmpListTru = [];
                                                let tmpListLine = [];
                                                if (listLine !== null) {
                                                    listLine.map((itm, index) => {
                                                        if (itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                                            if ((itm.toadO_P1.longitude === item.longitude && itm.toadO_P1.latitude === item.latitude)
                                                                || (itm.toadO_P2.longitude === item.longitude && itm.toadO_P2.latitude === item.latitude)
                                                            ) {
                                                                listIdLine.push(itm.iD_ELEMENT);
                                                                fetch(URLAPI+'/APIKTGS/Drawing/deleteLine', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        Accept: 'application/json',
                                                                        'Content-Type': 'application/json',
    
                                                                    },
                                                                    body: JSON.stringify(
                                                                        {
                                                                            "MA_DVIQLY": itm.mA_DVIQLY,
                                                                            "ID_ELEMENT": itm.iD_ELEMENT,
                                                                            "MA_TRAM": itm.mA_TRAM
                                                                        }
                                                                    )
                                                                })
                                                                    .then(response => {
                                                                        if (response.status ===200) {
                                                                            //console.log('OK delete line: ' + itm.iD_ELEMENT);
                                                                            showNotification('Th??ng b??o!', '???? x??a ???????ng d??y ' + itm.iD_ELEMENT + ' th??nh c??ng ', 2000, 400);
                                                                        }
                                                                    })
                                                                    // .then((res) => {
    
                                                                    // })
                                                                    .catch((error) => {
                                                                        //console.log("Error: " + error);
                                                                    })
                                                            }
                                                        }
                                                    });
                                                    tmpListLine = listLine.filter((itemLine) => !listIdLine.includes(itemLine.iD_ELEMENT));
                                                }
                                                if (listTru !== null) {
                                                    listTru.map((itmTru) => {
                                                        if (itmTru.iD_ELEMENT === item.iD_ELEMENT) {
                                                            itmTru.longitude = "0";
                                                            itmTru.latitude = "0";
                                                        }
                                                    });
                                                    tmpListTru = listTru.filter((itemTru) => itemTru.iD_ELEMENT !== item.iD_ELEMENT);
                                                }
                                                if (tmpListLine.length !== 0) {
                                                    props.functionSetListTru(tmpListTru);
                                                }
                                                if (tmpListTru.length !== 0) {
                                                    props.functionSetListLine(null);
                                                    props.functionSetListLine(tmpListLine);
                                                }
                                                //setFlagReRender(!flagReRender);
                                            }
                                        } else if (optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByType' && objectHasAdd === null) {
                                            setObjectHasAdd(item);
                                        } else if (optionEffectObject.value === 'ChangeManyObject' && props.tramChangeManyObject!==null) {
                                            changeTramManyObject('Tru',item.iD_ELEMENT,props.tramChangeManyObject.mA_TRAM);
                                        } else {
                                            props.functionSetObjectSelected({ type: "Tru", object: item });
                                        }
                                    }}
                                    onRightClick={(e) => {
                                        if (objectHasAddLine !== null) {
                                            if (optionEffectObject.value === 'AddLineNgam' && objectHasAddLine.type === 'Tram') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "CAPNGAM",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": 'TRAM-' + objectHasAddLine.maTram
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + props.tram.mA_TRAM);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y ng???m th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                  
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (optionEffectObject.value === 'AddLineNgam' && objectHasAddLine.type === 'Tru') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "CAPNGAM",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": objectHasAddLine.idPoint
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + item.id);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                   
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.idPoint !== item.iD_ELEMENT && objectHasAddLine.type === 'Tru') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": objectHasAddLine.idPoint
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + item.id);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                   
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.type === 'KhachHang') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": ''
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            // if(listUndo===null){
                                                            //     setListUndo([{type:'AddLine',object:res}]);
                                                            // }else{
                                                            //     setListUndo([...listUndo,{type:'Addline',object:res}]);
                                                            // }
                                                            //console.log('OK line: ' + item.id);
                                                            //showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then((res) => {
    
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "ID_LINE": res.iD_ELEMENT,
                                                                        "ID_POINT": item.iD_ELEMENT,
                                                                        "MA_DDO": objectHasAddLine.maDD
                                                                    }
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
    
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then(res => {
                                                                    if (res !== null) {
    
                                                                        props.setListKhachHangHasLine([...props.listKhachHangHasLine, res.mA_DDO]);
                                                                        props.functionSetListLine([...listLine, res]);
                                                                        setObjectHasAddLine(null);
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.type === 'Tram') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": 'TRAM-' + objectHasAddLine.maTram
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + props.tram.mA_TRAM);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                  
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else {
                                            setObjectHasAddLine({
                                                type: "Tru",
                                                maDD: "",
                                                idPoint: item.iD_ELEMENT,
                                                maTram: ""
                                            });
                                        }
                                    }}
                                    onDragStart={(e) => {
                                        //setObjectSelected({ type: "Tru", object: item });
                                    }}
                                    icon={objectSelected.type === 'Tru' ?
                                        (objectSelected.object.iD_ELEMENT === item.iD_ELEMENT ?
                                            { url: IconTruTrungTheActive, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                            :
                                            { url: IconTruTrungThe, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                        )
                                        :
                                        (
                                            objectHasAddLine !== null ?
                                                (
                                                    objectHasAddLine.idPoint === item.iD_ELEMENT ?
                                                        { url: IconTruTrungTheRightClick, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                                        :
                                                        { url: IconTruTrungThe, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                                ) :
                                                idTruSelected === item.iD_ELEMENT ?
                                                    { url: IconTruTrungTheActive, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                                    :
                                                    { url: IconTruTrungThe, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                        )
                                    }
                                    position={{ lat: Number(item.latitude), lng: Number(item.longitude) }}
                                // position={(optionEffectObject.value === 'ChangeLocationByAddressObject' && objectSelected.type === 'Tru' && props.resultLocationSearchBox != null) ?
                                //     (
                                //         objectSelected.object.iD_ELEMENT === item.iD_ELEMENT ?
                                //             {
                                //                 lng: Number(props.resultLocationSearchBox.lng),
                                //                 lat: Number(props.resultLocationSearchBox.lat)
                                //             }
                                //             :
                                //             { lat: Number(item.latitude), lng: Number(item.longitude) }
                                //     )
                                //     : ((optionEffectObject.value === 'ChangeLocationByTypingObject' && objectSelected.type === 'Tru' && props.resultLocationTypingBox != null) ?
                                //         objectSelected.object.iD_ELEMENT === item.iD_ELEMENT ?
                                //             {
                                //                 lng: Number(props.resultLocationTypingBox.lng),
                                //                 lat: Number(props.resultLocationTypingBox.lat)
                                //             }
                                //             :
                                //             { lat: Number(item.latitude), lng: Number(item.longitude) }
                                //         :
                                //         { lat: Number(item.latitude), lng: Number(item.longitude) }
                                //     )
                                // }
                                >
                                </Marker>
                            } else if (item.typE_E === 'TUDIEN') {
                                return <Marker
                                    key={item.iD_ELEMENT + 'tru'}
                                    options={{ label: { color: '#094E99', text: item.namE_E, fontWeight: 'bold', fontSize: "12px" } }}
                                    draggable={optionEffectObject.value === 'ChangeLocationByDragObject' ? true : false}
                                    onDragEnd={(e) => {
                                        fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(
                                                {
                                                    "MA_DVIQLY": item.mA_DVIQLY,
                                                    "ID_ELEMENT": item.iD_ELEMENT,
                                                    "MA_TRAM": item.mA_TRAM,
                                                    "TYPE_E": "TUDIEN",
                                                    "NAME_E": item.namE_E,
                                                    "LONGITUDE": e.latLng.lng().toString(),
                                                    "LATITUDE": e.latLng.lat().toString(),
                                                    "longitudE_LABEL": e.latLng.lng().toString(),
                                                    "latitudE_LABEL": (e.latLng.lat() + 0.0005).toString(),
                                                    "dS_DIEMDO": item.dS_DIEMDO
                                                })
                                        })
                                            .then(response => {
                                                if (response.status ===200) {
                                                    //console.log('OK ponit: ' + item.iD_ELEMENT);
                                                    showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? tru' + item.namE_E + ' th??nh c??ng ', 2000, 400);
                                                }
                                            })
                                            // .then((res) => {
    
                                            // })
                                            .catch((error) => {
                                                //console.log("Error: " + error);
                                            });
                                        if (listLine !== null) {
                                            listLine.map((itm, index) => {
                                                if (itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                                    if (itm.toadO_P1.longitude === item.longitude && itm.toadO_P1.latitude === item.latitude) {
                                                        itm.toadO_P1.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P1.latitude = e.latLng.lat().toString();
                                                    }
                                                    if (itm.toadO_P2.longitude === item.longitude && itm.toadO_P2.latitude === item.latitude) {
                                                        itm.toadO_P2.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P2.latitude = e.latLng.lat().toString();
                                                    }
                                                }
                                            });
                                        }
                                        if (listTru !== null) {
                                            listTru.map((itmTru) => {
                                                if (itmTru.iD_ELEMENT === item.iD_ELEMENT) {
                                                    itmTru.longitude = e.latLng.lng().toString();
                                                    itmTru.latitude = e.latLng.lat().toString();
                                                }
                                            });
                                        }
                                        setFlagReRender(!flagReRender);
                                        //console.log('setFagReRender');
                                        // const tmp = window.confirm("B???n c?? ch???c mu???n l??u v??? tr?? tr??? " + item.namE_E + " ?");
                                        // if (tmp) {
    
                                        // } else {
                                        //     window.alert('Kh??ng L??u');
                                        // }                                
                                    }}
                                    onClick={(e) => {
                                        if (optionEffectObject.value === "AddLine") {
                                            if (listObjectAddLine != null) {
                                                setListObjectAddLine(listObjectAddLine => [...listObjectAddLine,
                                                {
                                                    lat: Number(item.latitude),
                                                    lng: Number(item.longitude),
                                                    type: "Tru",
                                                    id: listObjectAddLine.length,
                                                    maDD: "",
                                                    idPoint: item.iD_ELEMENT
                                                }
                                                ]);
                                            } else {
                                                setListObjectAddLine([{ lat: Number(item.latitude), lng: Number(item.longitude), type: "Tru", id: 0, maDD: "", idPoint: item.iD_ELEMENT }]);
    
                                            }
    
                                        } else if (optionEffectObject.value === "UpdateNamePoint") {
                                            let name = window.prompt('Nh???p t??n tr???: ');
                                            if (name !== null) {
                                                fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.mA_DVIQLY,
                                                            "ID_ELEMENT": item.iD_ELEMENT,
                                                            "MA_TRAM": item.mA_TRAM,
                                                            "TYPE_E": "TUDIEN",
                                                            "NAME_E": name,
                                                            "LONGITUDE": item.longitude,
                                                            "LATITUDE": item.latitude,
                                                            "longitudE_LABEL": item.longitudE_LABEL,
                                                            "latitudE_LABEL": item.latitudE_LABEL,
                                                            "dS_DIEMDO": item.dS_DIEMDO
                                                        })
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
    
                                                            listTru.map(itm => {
                                                                if (itm.iD_ELEMENT === item.iD_ELEMENT) {
                                                                    itm.namE_E = name;
                                                                }
                                                            });
                                                            setFlagReRender(!flagReRender);
                                                        }
                                                    })
                                                    .then((res) => {
    
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else if (optionEffectObject.value === 'ChangeLocationByClickObject') {
                                            setIdTruSelected(item.iD_ELEMENT);
                                        } else if (optionEffectObject.value === 'DeleteObject') {
                                            let tmp = window.confirm("B???n ch???c c?? mu???n x??a tr??? " + item.namE_E + " ?");
                                            if (tmp) {
                                                fetch(URLAPI+'/APIKTGS/Drawing/deletePoint', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.mA_DVIQLY,
                                                            "ID_ELEMENT": item.iD_ELEMENT,
                                                            "MA_TRAM": item.mA_TRAM
                                                        })
                                                })
                                                    .then(response => {
                                                        if (response.status ===200) {
                                                            //console.log('OK delete point: ' + item.iD_ELEMENT);
                                                            showNotification('Th??ng b??o!', '???? x??a tr??? ' + item.namE_E + ' th??nh c??ng ', 2000, 400);
                                                        }
                                                    })
                                                    // .then((res) => {
    
                                                    // })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    })
    
                                                let listIdLine = [];
                                                let tmpListTru = [];
                                                let tmpListLine = [];
                                                if (listLine !== null) {
                                                    listLine.map((itm, index) => {
                                                        if (itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                                            if ((itm.toadO_P1.longitude === item.longitude && itm.toadO_P1.latitude === item.latitude)
                                                                || (itm.toadO_P2.longitude === item.longitude && itm.toadO_P2.latitude === item.latitude)
                                                            ) {
                                                                listIdLine.push(itm.iD_ELEMENT);
                                                                fetch(URLAPI+'/APIKTGS/Drawing/deleteLine', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        Accept: 'application/json',
                                                                        'Content-Type': 'application/json',
    
                                                                    },
                                                                    body: JSON.stringify(
                                                                        {
                                                                            "MA_DVIQLY": itm.mA_DVIQLY,
                                                                            "ID_ELEMENT": itm.iD_ELEMENT,
                                                                            "MA_TRAM": itm.mA_TRAM
                                                                        }
                                                                    )
                                                                })
                                                                    .then(response => {
                                                                        if (response.status ===200) {
                                                                            //console.log('OK delete line: ' + itm.iD_ELEMENT);
                                                                            showNotification('Th??ng b??o!', '???? x??a ???????ng d??y ' + itm.iD_ELEMENT + ' th??nh c??ng ', 2000, 400);
                                                                        }
                                                                    })
                                                                    // .then((res) => {
    
                                                                    // })
                                                                    .catch((error) => {
                                                                        //console.log("Error: " + error);
                                                                    })
                                                            }
                                                        }
                                                    });
                                                    tmpListLine = listLine.filter((itemLine) => !listIdLine.includes(itemLine.iD_ELEMENT));
                                                }
                                                if (listTru !== null) {
                                                    listTru.map((itmTru) => {
                                                        if (itmTru.iD_ELEMENT === item.iD_ELEMENT) {
                                                            itmTru.longitude = "0";
                                                            itmTru.latitude = "0";
                                                        }
                                                    });
                                                    tmpListTru = listTru.filter((itemTru) => itemTru.iD_ELEMENT !== item.iD_ELEMENT);
                                                }
                                                if (tmpListLine.length !== 0) {
                                                    props.functionSetListTru(tmpListTru);
                                                }
                                                if (tmpListTru.length !== 0) {
                                                    props.functionSetListLine(null);
                                                    props.functionSetListLine(tmpListLine);
                                                }
                                                //setFlagReRender(!flagReRender);
                                            }
                                        } else if (optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByType' && objectHasAdd === null) {
                                            setObjectHasAdd(item);
                                        } else if (optionEffectObject.value === 'ChangeManyObject' && props.tramChangeManyObject!==null) {
                                            changeTramManyObject('Tru',item.iD_ELEMENT,props.tramChangeManyObject.mA_TRAM);
                                        } else {
                                            props.functionSetObjectSelected({ type: "Tru", object: item });
                                        }
                                    }}
                                    onRightClick={(e) => {
    
                                        if (objectHasAddLine !== null) {
                                            if (optionEffectObject.value === 'AddLineNgam' && objectHasAddLine.type === 'Tram') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "CAPNGAM",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": 'TRAM-' + objectHasAddLine.maTram
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + props.tram.mA_TRAM);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y ng???m th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                  
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (optionEffectObject.value === 'AddLineNgam' && objectHasAddLine.type === 'Tru') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "CAPNGAM",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": objectHasAddLine.idPoint
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + item.id);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                   
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.idPoint !== item.iD_ELEMENT && objectHasAddLine.type === 'Tru') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": objectHasAddLine.idPoint
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + item.id);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                   
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.type === 'KhachHang') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": ''
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            // if(listUndo===null){
                                                            //     setListUndo([{type:'AddLine',object:res}]);
                                                            // }else{
                                                            //     setListUndo([...listUndo,{type:'Addline',object:res}]);
                                                            // }
                                                            //console.log('OK line: ' + item.id);
                                                            //showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then((res) => {
    
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "ID_LINE": res.iD_ELEMENT,
                                                                        "ID_POINT": item.iD_ELEMENT,
                                                                        "MA_DDO": objectHasAddLine.maDD
                                                                    }
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
    
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then(res => {
                                                                    if (res !== null) {
    
                                                                        props.setListKhachHangHasLine([...props.listKhachHangHasLine, res.mA_DDO]);
                                                                        props.functionSetListLine([...listLine, res]);
                                                                        setObjectHasAddLine(null);
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.type === 'Tram') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": item.iD_ELEMENT,
                                                            "ID_POINT2": 'TRAM-' + objectHasAddLine.maTram
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            //console.log('OK line: ' + props.tram.mA_TRAM);
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                  
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else {
                                            setObjectHasAddLine({
                                                type: "Tru",
                                                maDD: "",
                                                idPoint: item.iD_ELEMENT,
                                                maTram: ""
                                            });
                                        }
                                    }}
                                    onDragStart={(e) => {
                                        //setObjectSelected({ type: "Tru", object: item });
                                    }}
                                    icon={objectSelected.type === 'Tru' ?
                                        (objectSelected.object.iD_ELEMENT === item.iD_ELEMENT ?
                                            { url: IconTuDienActive, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                            :
                                            { url: IconTuDien, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                        )
                                        :
                                        (
                                            objectHasAddLine !== null ?
                                                (
                                                    objectHasAddLine.idPoint === item.iD_ELEMENT ?
                                                        { url: IconTuDienRightClick, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                                        :
                                                        { url: IconTuDien, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                                ) :
                                                idTruSelected === item.iD_ELEMENT ?
                                                    { url: IconTuDienActive, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                                    :
                                                    { url: IconTuDien, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe + 5, SizeTruTrungThe * props.sizeTruTrungThe + 5) }
                                        )
                                    }
                                    position={{ lat: Number(item.latitude), lng: Number(item.longitude) }}                               
                                >
                                </Marker>
                            }
                        }
                    })}
    
                    {/* V??? Tr??? Trung Th??? PMIS*/}
                    {listTruPmis === null ? null : listTruPmis.map((item) => {
                        //console.log(item);
                        return <Marker
                            key={item.iD_TRU + 'truPMIS'}
                            options={{ label: { color: 'red', text: item.teN_TRU, fontWeight: 'bold', fontSize: "12px" } }}
    
                            onClick={(e) => {
                                if (listTruPmisAdd !== null) {
                                    let tmp = listTruPmisAdd.filter((itm) => itm.iD_TRU === item.iD_TRU);
                                    if (tmp.length === 0) {
                                        setListTruPmisAdd([...listTruPmisAdd, item]);
                                    }
                                } else {
                                    setListTruPmisAdd([item]);
                                }
    
                            }}
                            icon={listTruPmisAdd !== null ?
                                (listTruPmisAdd.filter(itm => itm.iD_TRU === item.iD_TRU).length === 1 ?
                                    { url: IconTruTrungTheActive, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe) }
                                    :
                                    { url: IconTruTrungThePMIS, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe) }
                                )
                                :
                                { url: IconTruTrungThePMIS, scaledSize: new window.google.maps.Size(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe / 2, SizeTruTrungThe * props.sizeTruTrungThe / 2), labelOrigin: new window.google.maps.Point(SizeTruTrungThe * props.sizeTruTrungThe, SizeTruTrungThe * props.sizeTruTrungThe) }
                            }
    
                            position={{ lat: Number(item.latitude), lng: Number(item.longitude) }}
                        >
                        </Marker>
    
                    })}
    
                    {/* V??? kh??ch h??ng */}
                    {listKhachHang === null || optionEffectObject.value === 'ShowLabelPoint' || optionEffectObject.value === 'ShowLabelPointName' || optionEffectObject.value === 'ShowLabelPointDoanhSo' || optionEffectObject.value === 'ChangeLocationLabel' ? null : listKhachHang.map(kh => {
                        if (kh.toA_DO === null) {
    
                        } else if ((kh.toA_DO.longitude === "0" && kh.toA_DO.latitude === "0") || (kh.toA_DO.longitude === "" && kh.toA_DO.latitude === "")) {
    
                        }
                        else {
                            let flagShow='';
                            let date= new Date();
                            let monthCurrent  = date.getMonth()+1;
                            let yearCurrent = date.getFullYear();

                            if(kh.dieN_TTHU!==null && kh.chI_SO_MOI !==null && kh.dieN_TTHU.length!==0){
                                if(kh.dieN_TTHU[0]!==undefined && kh.dieN_TTHU[1]!==undefined && kh.dieN_TTHU[2]!==undefined ){
                                    if(kh.dieN_TTHU[0].dieN_TTHU==="0" && kh.dieN_TTHU[1].dieN_TTHU==="0" && kh.dieN_TTHU[2].dieN_TTHU==="0"){
                                        flagShow='KhongSanLuong3Thang';
                                    } else if(kh.dieN_TTHU[0].dieN_TTHU==="0" || kh.dieN_TTHU[0].thang!==monthCurrent.toString()){
                                        flagShow='KhongSanLuongThangHienTai';
                                    }  else if(Number(kh.dieN_TTHU[0].dieN_TTHU) - Number(kh.dieN_TTHU[1].dieN_TTHU)>0){
                                        if(((Number(kh.dieN_TTHU[0].dieN_TTHU) - Number(kh.dieN_TTHU[1].dieN_TTHU))/Number(kh.dieN_TTHU[1].dieN_TTHU))>0.3){
                                            flagShow='SanLuongTang'
                                        }
                                    } else if(Number(kh.dieN_TTHU[0].dieN_TTHU) - Number(kh.dieN_TTHU[1].dieN_TTHU)<0){
                                        if(((Number(kh.dieN_TTHU[1].dieN_TTHU) - Number(kh.dieN_TTHU[0].dieN_TTHU))/Number(kh.dieN_TTHU[1].dieN_TTHU))>0.3){
                                            flagShow='SanLuongGiam'
                                        }
                                    }   
                                } else if(kh.dieN_TTHU[0]!==undefined && kh.dieN_TTHU[1]!==undefined  ){
                                    if((kh.dieN_TTHU[0].dieN_TTHU==="0" && kh.dieN_TTHU[1].dieN_TTHU==="0") || Number(kh.dieN_TTHU[0].thang)<=monthCurrent-3 ){
                                        flagShow='KhongSanLuong3Thang';
                                    } else if(kh.dieN_TTHU[0].dieN_TTHU==="0" || kh.dieN_TTHU[0].thang!==monthCurrent.toString()){
                                        flagShow='KhongSanLuongThangHienTai';
                                    }  else if(Number(kh.dieN_TTHU[0].dieN_TTHU) - Number(kh.dieN_TTHU[1].dieN_TTHU)>0){
                                        if(((Number(kh.dieN_TTHU[0].dieN_TTHU) - Number(kh.dieN_TTHU[1].dieN_TTHU))/Number(kh.dieN_TTHU[1].dieN_TTHU))>0.3){
                                            flagShow='SanLuongTang'
                                        }
                                    } else if(Number(kh.dieN_TTHU[0].dieN_TTHU) - Number(kh.dieN_TTHU[1].dieN_TTHU)<0){
                                        if(((Number(kh.dieN_TTHU[1].dieN_TTHU) - Number(kh.dieN_TTHU[0].dieN_TTHU))/Number(kh.dieN_TTHU[1].dieN_TTHU))>0.3){
                                            flagShow='SanLuongGiam'
                                        }
                                    }   
                                } else if(kh.dieN_TTHU[0]!==undefined ){
                                    if(Number(kh.dieN_TTHU[0].thang)<=monthCurrent-3 ||  Number(kh.nam)< yearCurrent){
                                        flagShow='KhongSanLuong3Thang';
                                    } else if(kh.dieN_TTHU[0].dieN_TTHU==="0" || kh.dieN_TTHU[0].thang!==monthCurrent.toString()){
                                        flagShow='KhongSanLuongThangHienTai';
                                    }  
                                } else {
                                    flagShow='KhongSanLuongThangHienTai';
                                } 
                            }
                            console.log('kh: '+ flagShow);

                            return <Marker
                                key={kh.mA_DDO}
                                label={props.flagShowLableKH?{ color: 'red', text: kh.teN_KHANG, fontWeight: 'bold', fontSize: "12px" }:null}
                                icon={objectSelected.type === 'KhachHang' ?
                                    (objectSelected.object.mA_DDO === kh.mA_DDO ?
                                        { url: IconKhachHangActive, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                        :
                                        flagShow==='KhongSanLuong3Thang'?
                                                { url: IconKhachHangKhachHangKhongSanLuong, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                :
                                                flagShow==='KhongSanLuongThangHienTai'?
                                                    { url: IconKhachHangKhachHangKhongSanLuongThangHienTai, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                    :
                                                    flagShow==='SanLuongTang'?
                                                        { url: IconKhachHangTangSanLuong, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                        :
                                                        flagShow==='SanLuongGiam'?
                                                            { url: IconKhachHangGiamSanLuong, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                            :
                                                            { url: IconKhachHang, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                    )
                                    :
                                    (
                                        objectHasAddLine !== null ?
                                            (
                                                objectHasAddLine.maDD === kh.mA_DDO ?
                                                    { url: IconKhachHangRightClick, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                    :
                                                    flagShow==='KhongSanLuong3Thang'?
                                                { url: IconKhachHangKhachHangKhongSanLuong, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                :
                                                flagShow==='KhongSanLuongThangHienTai'?
                                                    { url: IconKhachHangKhachHangKhongSanLuongThangHienTai, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                    :
                                                    flagShow==='SanLuongTang'?
                                                        { url: IconKhachHangTangSanLuong, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                        :
                                                        flagShow==='SanLuongGiam'?
                                                            { url: IconKhachHangGiamSanLuong, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                            :
                                                            { url: IconKhachHang, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                            ) :                                           
                                                flagShow==='KhongSanLuong3Thang'?
                                                { url: IconKhachHangKhachHangKhongSanLuong, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                :
                                                flagShow==='KhongSanLuongThangHienTai'?
                                                    { url: IconKhachHangKhachHangKhongSanLuongThangHienTai, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                    :
                                                    flagShow==='SanLuongTang'?
                                                        { url: IconKhachHangTangSanLuong, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                        :
                                                        flagShow==='SanLuongGiam'?
                                                            { url: IconKhachHangGiamSanLuong, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                                            :
                                                            { url: IconKhachHang, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                    )
                                }                                
                                draggable={optionEffectObject.value === 'ChangeLocationByDragObject' ? true : false}
                                onClick={(e) => {
                                    if (optionEffectObject.value === 'UpdateCustomerLocationByLocation') {
                                        let str = window.prompt("Nh???p v??o t???a ????? (lng:'100',lat:'10'):");
                                        if (str !== null) {
                                            let arr = str.split("'");
                                            let lng = arr[1];
                                            let lat = arr[3];
                                            if (lat !== null && lng !== null) {
                                                fetch(URLAPI4001+'/Api/SangTaiChuyenLuoi/setAllLocationByLocation', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: '*/*',
                                                        'Content-Type': 'application/json',
                                                        "Access-Control-Allow-Origin": "*"
                                                    },
                                                    body: JSON.stringify({
                                                        "MADONVI": props.maDonViSelected,
                                                        "MATRAM": props.maTramSelected,
                                                        "LATNEW": lat,
                                                        "LNGNEW": lng,
                                                        "LATOLD": kh.toA_DO.latitude,
                                                        "LNGOLD": kh.toA_DO.longitude,
                                                        "USERNAME":initContext.username 
                                                    })
                                                })
                                                    .then(response => {
    
    
                                                        if (response.status === 200) {
                                                            props.reloadPage(props.maDonViSelected, props.maTramSelected);
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
                                    } else {
                                        props.functionSetObjectSelected({ type: "KhachHang", object: kh });
                                    }
                                }}
                                onRightClick={(e) => {
                                    if (optionEffectObject.value === 'AddLineKHToKH') {
                                        if (objectHasAddLine !== null) {
                                            if (objectHasAddLine.type === 'KhachHang') {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN_KH",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": objectHasAddLine.maDD,
                                                            "ID_POINT2": kh.mA_DDO
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
    
                                                            //showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                    
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then((res) => {
    
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            setObjectHasAddLine(null);
    
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else {
                                            setObjectHasAddLine({
                                                type: "KhachHang",
                                                maDD: kh.mA_DDO,
                                                idPoint: "",
                                                maTram: ''
                                            });
                                        }
                                    } else if (!props.listKhachHangHasLine.includes(kh.mA_DDO)) {
                                        //console.log('right click');
                                        //console.log(!props.listKhachHangHasLine.includes(kh.mA_DDO ))
                                        if (objectHasAddLine !== null) {
                                            if (objectHasAddLine.type === 'Tru') {
                                                debugger;
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": objectHasAddLine.idPoint,
                                                            "ID_POINT2": ""
                                                        }
                                                    )
                                                })
                                                    .then(response => {
                                                        debugger;
                                                        if (response.status ===200) {
    
                                                            //showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                    
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then((res) => {
                                                        debugger;
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "ID_LINE": res.iD_ELEMENT,
                                                                        "ID_POINT": objectHasAddLine.idPoint,
                                                                        "MA_DDO": kh.mA_DDO
                                                                    }
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
    
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then(res => {
                                                                    if (res !== null) {
    
                                                                        props.setListKhachHangHasLine([...props.listKhachHangHasLine, res.mA_DDO]);
                                                                        props.functionSetListLine([...listLine, res]);
                                                                        setObjectHasAddLine(null);
                                                                    }
                                                                })
    
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            } else if (objectHasAddLine.type === 'Tram') {
                                                debugger;
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": props.maDonViSelected,
                                                            "ID_ELEMENT": "",
                                                            "MA_TRAM": props.maTramSelected,
                                                            "TYPE_E": "DDIEN",
                                                            "NAME_E": "D??y ??i???n",
                                                            "ID_POINT1": 'TRAM-' + objectHasAddLine.maTram,
                                                            "ID_POINT2": ""
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
    
                                                            //showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
                                                            ////console.log(amountLine);                                                    
    
                                                            return response.json();
                                                        }
    
                                                        return null;
                                                    })
                                                    .then((res) => {
    
                                                        if (res !== null) {
                                                            if (listUndo === null) {
                                                                setListUndo([{ type: 'AddLine', object: res }]);
                                                            } else {
                                                                setListUndo([...listUndo, { type: 'AddLine', object: res }]);
                                                            }
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "ID_LINE": res.iD_ELEMENT,
                                                                        "ID_POINT": 'TRAM-' + objectHasAddLine.maTram,
                                                                        "MA_DDO": kh.mA_DDO
                                                                    }
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
    
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then(res => {
                                                                    if (res !== null) {
    
                                                                        props.setListKhachHangHasLine([...props.listKhachHangHasLine, res.mA_DDO]);
                                                                        props.functionSetListLine([...listLine, res]);
                                                                        setObjectHasAddLine(null);
                                                                    }
                                                                })
    
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        } else {
                                            setObjectHasAddLine({
                                                type: "KhachHang",
                                                maDD: kh.mA_DDO,
                                                idPoint: "",
                                                maTram: ''
                                            });
                                        }
                                    }
                                }}
                                onDragEnd={(e) => {
                                    //console.log(e.latLng.lat());
                                    //console.log(e.latLng.lng().toString());
                                    fetch(URLAPI+'/APIKTGS/KHANG/updateToaDo', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
    
                                        },
                                        body: JSON.stringify({
                                            "MA_DVIQLY": kh.mA_DVIQLY,
                                            "MA_DDO": kh.mA_DDO,
                                            "TOA_DO": { "LONGITUDE": e.latLng.lng().toString(), "LATITUDE": e.latLng.lat().toString() }
                                        })
                                    })
                                        .then(response => {
    
                                            showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? kh??ch h??ng ' + kh.mA_DDO + ' th??nh c??ng ', 2000, 400);
    
                                        })
    
                                        .catch((error) => {
                                            //console.log("Error kh: " + error);
                                        });
    
                                    let tmpObject = [];
                                    if (listLine !== null) {
    
                                        listLine.map((itm, index) => {
                                            if (itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                                if (kh.toA_DO !== null) {
                                                    if (itm.toadO_P1.longitude === kh.toA_DO.longitude && itm.toadO_P1.latitude === kh.toA_DO.latitude) {
                                                        itm.toadO_P1.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P1.latitude = e.latLng.lat().toString();
    
                                                    }
                                                    if (itm.toadO_P2.longitude === kh.toA_DO.longitude && itm.toadO_P2.latitude === kh.toA_DO.latitude) {
                                                        itm.toadO_P2.longitude = e.latLng.lng().toString();
                                                        itm.toadO_P2.latitude = e.latLng.lat().toString();
    
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    //console.log(tmpObject);
                                    // if (tmpObject.length != 0) {
                                    //     tmpObject.map((itmT, indexT) => {
                                    //         //console.log('call api line ' + indexT);
                                    //         fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                    //             method: 'POST',
                                    //             headers: {
                                    //                 Accept: 'application/json',
                                    //                 'Content-Type': 'application/json',
                                    //             },
                                    //             body: JSON.stringify(
                                    //                 {
                                    //                     "MA_DVIQLY": itmT.mA_DVIQLY,
                                    //                     "ID_ELEMENT": itmT.iD_ELEMENT,
                                    //                     "MA_TRAM": itmT.mA_TRAM,
                                    //                     "TYPE_E": itmT.typE_E,
                                    //                     "NAME_E": itmT.namE_E,
                                    //                     "LONGITUDE_X": itmT.longitudE_X,
                                    //                     "LATITUDE_X": itmT.latitudE_X,
                                    //                     "LONGITUDE_Y": itmT.longitudE_Y,
                                    //                     "LATITUDE_Y": itmT.latitudE_Y
                                    //                 }
                                    //             )
                                    //         })
                                    //             .then(response => {
                                    //                 
                                    //                 if (response.status ===200) {
                                    //                     //console.log('OK line: ' + itmT.iD_ELEMENT);
                                    //                     showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? ???????ng d??y' + itmT.iD_ELEMENT + ' th??nh c??ng!', 2000, 400);
                                    //                 }
                                    //                 if (indexT === tmpObject.length - 1) {
    
                                    //                     //window.alert('???? l??u th??nh c??ng');
                                    //                 }
                                    //             })
                                    //             // .then((res) => {
    
                                    //             // })
                                    //             .catch((error) => {
                                    //                 //console.log("Error line: " + error);
                                    //             });
    
                                    //     });
                                    // }
                                    //console.log(kh);
                                    //console.log(e.latLng.lng().toString());
                                    //console.log('===');
                                    if (listKhachHang !== null) {
                                        listKhachHang.map((itmKH) => {
                                            if (itmKH.mA_DDO === kh.mA_DDO) {
                                                //console.log(itmKH.toA_DO);
                                                itmKH.toA_DO = {
                                                    "longitude": e.latLng.lng().toString(),
                                                    "latitude": e.latLng.lat().toString()
                                                };
                                            }
                                        });
                                    }
    
                                    //setObjectSelected({type: "", object: null});
                                    setFlagReRender(!flagReRender);
                                    ////console.log('setFagReRender');
                                    //setLocationChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                                    //setOpenConfirmChangeLocationModal(true);
                                    // let r = window.confirm('B???n c?? ch???c thay ?????i v??? tr?? kh??ch h??ng ' + kh.mA_KHANG + ' ?');
                                    // if (r == true) {
    
                                    // }
                                }}
    
                                position={
                                    optionEffectObject.value === 'ChangeLocationByTypingObject' ?
                                        (
                                            (props.resultLocationTypingBox != null && objectSelected != null) ?
                                                (
                                                    objectSelected.type === "KhachHang" ?
    
                                                        objectSelected.object.mA_DDO === kh.mA_DDO ?
                                                            {
                                                                lng: Number(props.resultLocationTypingBox.lng),
                                                                lat: Number(props.resultLocationTypingBox.lat)
                                                            }
                                                            :
                                                            {
                                                                lng: kh.toA_DO === null ? 0 : Number(kh.toA_DO.longitude),
                                                                lat: kh.toA_DO === null ? 0 : Number(kh.toA_DO.latitude)
                                                            }
    
                                                        :
                                                        {
                                                            lng: kh.toA_DO === null ? 0 : Number(kh.toA_DO.longitude),
                                                            lat: kh.toA_DO === null ? 0 : Number(kh.toA_DO.latitude)
                                                        }
                                                )
                                                :
                                                {
                                                    lng: kh.toA_DO === null ? 0 : Number(kh.toA_DO.longitude),
                                                    lat: kh.toA_DO === null ? 0 : Number(kh.toA_DO.latitude)
                                                }
                                        )
                                        :
                                        (
                                            optionEffectObject.value === 'ChangeLocationByAddressObject' ?
    
                                                (
                                                    objectSelected.type === "KhachHang" ?
    
                                                        (
                                                            objectSelected.object.mA_DDO === kh.mA_DDO ?
                                                                props.resultLocationSearchBox != null ?
                                                                    {
                                                                        lng: Number(props.resultLocationSearchBox.lng),
                                                                        lat: Number(props.resultLocationSearchBox.lat)
                                                                    }
                                                                    :
                                                                    {
                                                                        lng: kh.toA_DO === null ? 0 : Number(kh.toA_DO.longitude),
                                                                        lat: kh.toA_DO === null ? 0 : Number(kh.toA_DO.latitude)
                                                                    }
                                                                :
                                                                {
                                                                    lng: kh.toA_DO === null ? 0 : Number(kh.toA_DO.longitude),
                                                                    lat: kh.toA_DO === null ? 0 : Number(kh.toA_DO.latitude)
                                                                }
                                                        )
                                                        :
                                                        {
                                                            lng: kh.toA_DO === null ? 0 : Number(kh.toA_DO.longitude),
                                                            lat: kh.toA_DO === null ? 0 : Number(kh.toA_DO.latitude)
                                                        }
                                                )
                                                :
                                                {
                                                    lng: kh.toA_DO === null ? 0 : Number(kh.toA_DO.longitude),
                                                    lat: kh.toA_DO === null ? 0 : Number(kh.toA_DO.latitude)
                                                }
                                        )}
                            >
                            </Marker>
                        }
                    })}        

                    {/* V??? kh??ch h??ng sau khi t??m ki???m */}
                    {props.searchObjectKhachHang === null ? null :  <Marker
                                key={props.searchObjectKhachHang.MA_DDO}
                                label={{ color: 'red', text: props.searchObjectKhachHang.TEN_KHANG, fontWeight: 'bold', fontSize: "12px" }}                               
                                icon={objectSelected.type === 'KhachHang' ?
                                    (objectSelected.object.MA_DDO === props.searchObjectKhachHang.MA_DDO ?
                                        { url: IconKhachHangActive, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                        :                                        
                                        { url: IconKhachHang, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                    ):
                                    { url: IconKhachHang, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                }                                
                                position={{
                                            lng: Number(props.searchObjectKhachHang.LONGITUDE),                                                    
                                            lat: Number(props.searchObjectKhachHang.LATITUDE)
                                        }}
                            >
                            </Marker>
                        }            
    
                    {/* Thay ?????i v??? tr?? label tr??? */}
                    {optionEffectObject.value === 'ChangeLocationLabel' && listTru !== null ?
                        listTru.map(item => {
                            if (item.dS_DIEMDO !== null && item.latitudE_LABEL !== null && item.longitudE_LABEL !== null) {
                                return <Marker
                                    key={item.iD_ELEMENT + 'labelTru'}
                                    draggable={true}
                                    onDragEnd={(e) => {
                                        const tmp = window.confirm("B???n c?? ch???c mu???n l??u v??? danh s??ch kh??ch h??ng c???a tr??? " + item.namE_E + " ?");
                                        if (tmp) {
                                            fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        "MA_DVIQLY": item.mA_DVIQLY,
                                                        "ID_ELEMENT": item.iD_ELEMENT,
                                                        "MA_TRAM": item.mA_TRAM,
                                                        "TYPE_E": item.typE_E,
                                                        "NAME_E": item.namE_E,
                                                        "LONGITUDE": item.longitude,
                                                        "LATITUDE": item.latitude,
                                                        "longitudE_LABEL": e.latLng.lng().toString(),
                                                        "latitudE_LABEL": e.latLng.lat().toString(),
                                                        "dS_DIEMDO": item.dS_DIEMDO
                                                    })
                                            })
                                                .then(response => {
                                                    if (response.status ===200) {
                                                        //console.log('OK ponit: ' + item.iD_ELEMENT);
                                                        showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? danh s??ch' + item.namE_E + ' th??nh c??ng ', 2000, 400);
                                                        listTru.map((itm, index) => {
                                                            if (itm.iD_ELEMENT === item.iD_ELEMENT) {
                                                                listTru[index].longitudE_LABEL = e.latLng.lng().toString();
                                                                listTru[index].latitudE_LABEL = e.latLng.lat().toString()
                                                            }
                                                        });
                                                        setFlagReRender(!flagReRender);
                                                    }
                                                })
                                                .catch((error) => {
                                                    //console.log("Error: " + error);
                                                });
                                        } else {
                                            window.alert('Kh??ng L??u');
                                        }
                                    }}
                                    icon={{ url: IconPointLabel, scaledSize: new window.google.maps.Size(20, 20), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(10, 10), labelOrigin: new window.google.maps.Point(20 + 10, 20 + 10) }}
                                    position={{ lat: Number(item.latitudE_LABEL), lng: Number(item.longitudE_LABEL) }}
                                >
                                </Marker>
    
                            }
                        })
                        :
                        null
                    }
    
                    {/* Hi???n th??? label tr??? */}
                    {(optionEffectObject.value === 'ShowLabelPoint' || optionEffectObject.value === 'ChangeLocationLabel') && listTru !== null ?
                        listTru.map(item => {
                            //console.log(item);
                            if (item.dS_DIEMDO !== null && item.longitudE_LABEL !== null && item.latitudE_LABEL !== null) {
                                //console.log(item.dS_DIEMDO);
                                return <>
                                    <InfoBox
                                        position={{ lat: Number(item.latitudE_LABEL), lng: Number(item.longitudE_LABEL) }}
    
                                        options={{
                                            alignBottom: true,
                                            closeBoxURL: ""
                                        }}
                                        zIndex={9999}
    
                                    >
                                        <div style={{
                                            opacity: 0.75,
                                            padding: 12, zIndex: 9999
                                        }}>
                                            {item.dS_DIEMDO.map((itm, index) => {
                                                let dataKH = listKhachHang.filter(itmKH => itmKH.mA_DDO === itm);
                                                //console.log(dataKH);
                                                if (dataKH.length !== 0) {
                                                    return <div
                                                        onClick={() => {
                                                            //console.log('onclick in abc');
                                                            setInfoDetailKhachHangModal(item);
                                                            setOpenDetailKhachHangModal(true);
                                                        }}
                                                        className={"tooltipMaDonVi"} style={{ fontSize: 10, fontColor: 'red', fontWeight: 'bold' }}
                                                        title={"T??n kh??ch h??ng: " + dataKH[0].teN_KHANG + " || Danh s???: " + dataKH[0].doanH_SO + " || S??? h???: " + dataKH[0].sO_HO + "|| S??? c??ng t??: " + dataKH[0].sO_TBI + " || Chu???i gi??: " + dataKH[0].chuoI_GIA
                                                        }>
                                                        {itm}
                                                    </div>
                                                } else {
                                                    return <div style={{ fontSize: 16, fontColor: `#08233B`, fontWeight: 'bold' }}>
                                                        {itm}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                    </InfoBox>
                                    <Polyline
    
                                        path={[{ lng: Number(item.longitude), lat: Number(item.latitude) }, { lng: Number(item.longitudE_LABEL), lat: Number(item.latitudE_LABEL) },]}
                                        options={{
                                            strokeColor: '#5A5959',
                                            strokeOpacity: 0.8,
                                            strokeWeight: 0.5,
                                            fillColor: '#5A5959',
                                            //fillOpacity: 0.35,
                                            clickable: false,
                                            draggable: false,
                                            editable: false,
                                            visible: true,
                                        }}
                                    />
                                </>
                            }
                        })
                        :
                        null
                    }
                    {(optionEffectObject.value === 'ShowLabelPointName') && listTru !== null ?
                        listTru.map(item => {
                            //console.log(item);
                            if (item.dS_DIEMDO !== null && item.longitudE_LABEL !== null && item.latitudE_LABEL !== null) {
                                //console.log(item.dS_DIEMDO);
                                return <>
                                    <InfoBox
                                        position={{ lat: Number(item.latitudE_LABEL), lng: Number(item.longitudE_LABEL) }}
                                        options={{
                                            alignBottom: true,
                                            closeBoxURL: ""
                                        }}
                                    >
                                        <div style={{
                                            width: 200,
                                            opacity: 0.75,
                                            padding: 12, zIndex: 1
                                        }}>
                                            {item.dS_DIEMDO.map((itm, index) => {
                                                let dataKH = listKhachHang.filter(itmKH => itmKH.mA_DDO === itm);
                                                if (dataKH.length !== 0) {
                                                    return <div onClick={() => {
                                                        //console.log('onclick in abc');
                                                        setInfoDetailKhachHangModal(item);
                                                        setOpenDetailKhachHangModal(true);
                                                    }}
                                                        className={"tooltipMaDonVi"} style={{ fontSize: 10, fontColor: `#08233B`, fontWeight: 'bold' }}
                                                        title={"T??n kh??ch h??ng: " + dataKH[0].teN_KHANG + " || Danh s???: " + dataKH[0].doanH_SO + " || S??? h???: " + dataKH[0].sO_HO + "|| S??? c??ng t??: " + dataKH[0].sO_TBI + " || Chu???i gi??: " + dataKH[0].chuoI_GIA
                                                        }>
                                                        {dataKH[0].teN_KHANG}
                                                    </div>
                                                } else {
    
                                                    return <div style={{ fontSize: 16, fontColor: `#08233B`, fontWeight: 'bold' }}>
                                                        {itm}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                    </InfoBox>
                                    <Polyline
    
                                        path={[{ lng: Number(item.longitude), lat: Number(item.latitude) }, { lng: Number(item.longitudE_LABEL), lat: Number(item.latitudE_LABEL) },]}
                                        options={{
                                            strokeColor: '#5A5959',
                                            strokeOpacity: 0.8,
                                            strokeWeight: 0.5,
                                            fillColor: '#5A5959',
                                            //fillOpacity: 0.35,
                                            clickable: false,
                                            draggable: false,
                                            editable: false,
                                            visible: true,
                                        }}
                                    />
                                </>
                            }
                        })
                        :
                        null
                    }
                    {(optionEffectObject.value === 'ShowLabelPointDoanhSo') && listTru !== null ?
                        listTru.map(item => {
                            //console.log(item);
                            if (item.dS_DIEMDO !== null && item.longitudE_LABEL !== null && item.latitudE_LABEL !== null) {
                                //console.log(item.dS_DIEMDO);
                                return <>
                                    <InfoBox
                                        position={{ lat: Number(item.latitudE_LABEL), lng: Number(item.longitudE_LABEL) }}
                                        options={{
                                            //pixelOffset: (60, 60),
                                            alignBottom: true,
                                            closeBoxURL: ""
    
                                        }}
    
                                    >
                                        <div style={{
                                            width: 150,
                                            opacity: 0.75,
                                            padding: 12, zIndex: 1
                                        }}>
                                            {item.dS_DIEMDO.map((itm, index) => {
                                                let dataKH = listKhachHang.filter(itmKH => itmKH.mA_DDO === itm);
                                                if (dataKH.length !== 0) {
                                                    return <div onClick={() => {
                                                        //console.log('onclick in abc');
                                                        setInfoDetailKhachHangModal(item);
                                                        setOpenDetailKhachHangModal(true);
                                                    }}
                                                        className={"tooltipMaDonVi"} style={{ fontSize: 10, fontColor: `#08233B`, fontWeight: 'bold' }}
                                                        title={"T??n kh??ch h??ng: " + dataKH[0].teN_KHANG + " || Danh s???: " + dataKH[0].doanH_SO + " || S??? h???: " + dataKH[0].sO_HO + "|| S??? c??ng t??: " + dataKH[0].sO_TBI + " || Chu???i gi??: " + dataKH[0].chuoI_GIA
                                                        }>
                                                        {dataKH[0].doanH_SO}
    
                                                    </div>
                                                } else {
    
                                                    return <div style={{ fontSize: 16, fontColor: `#08233B`, fontWeight: 'bold' }}>
                                                        {itm}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                    </InfoBox>
                                    <Polyline
    
                                        path={[{ lng: Number(item.longitude), lat: Number(item.latitude) }, { lng: Number(item.longitudE_LABEL), lat: Number(item.latitudE_LABEL) },]}
                                        options={{
                                            strokeColor: '#5A5959',
                                            strokeOpacity: 0.8,
                                            strokeWeight: 0.5,
                                            fillColor: '#5A5959',
                                            //fillOpacity: 0.35,
                                            clickable: false,
                                            draggable: false,
                                            editable: false,
                                            visible: true,
                                        }}
                                    />
                                </>
                            }
                        })
                        :
                        null
                    }
    
                    {/* Tao window info cho kh??ch h??ng */}
                    {(objectSelected.type === 'KhachHang' && optionEffectObject.value === null && objectSelected.object.toA_DO !== null) ?
                        <InfoWindow
                            onCloseClick={() => props.functionSetObjectSelected({ type: "", object: null })}
                            position={{ lat: Number(objectSelected.object.toA_DO.latitude), lng: Number(objectSelected.object.toA_DO.longitude) }}
                        >
                            <InfoKhachHangComponent maTramSelected={props.maTramSelected} tenTramSelected={props.tenTramSelected} item={objectSelected.object} soTru={listTru === null ? 'Kh??ng c??' : listTru.find(i => {
                                    if (i.dS_DIEMDO !== null && i.dS_DIEMDO !== '') {
                                        return i.dS_DIEMDO.includes(objectSelected.object.mA_DDO)
                                    }
                                }
                                ) === undefined ? 'Kh??ng c??' : listTru.find(i => {
                                    if (i.dS_DIEMDO !== null && i.dS_DIEMDO !== '') {
                                        return i.dS_DIEMDO.includes(objectSelected.object.mA_DDO)
                                    }
                                }
                                ).namE_E}/>
                            {/* <div>
    
                                <h4>KH: {objectSelected.object.teN_KHANG}</h4>
                                <h6>??C: {objectSelected.object.sO_NHA + objectSelected.object.duonG_PHO}</h6>
                                <h6>S??? No: {objectSelected.object.sO_TBI}</h6>
                                <h6>Danh s???: {objectSelected.object.doanH_SO}</h6>
                                <h6>M?? KH: {objectSelected.object.mA_KHANG}</h6>
                                <h6>V??? tr?? treo: {objectSelected.object.vtrI_TREO}</h6>
                                <h6>T???a ?????: (lng: '{objectSelected.object.toA_DO.longitude}',lat:'{objectSelected.object.toA_DO.latitude}')</h6>
                                <h6>S??? Tr???: {listTru === null ? 'Kh??ng c??' : listTru.find(i => {
                                    if (i.dS_DIEMDO !== null && i.dS_DIEMDO !== '') {
                                        return i.dS_DIEMDO.includes(objectSelected.object.mA_DDO)
                                    }
                                }
                                ) === undefined ? 'Kh??ng c??' : listTru.find(i => {
                                    if (i.dS_DIEMDO !== null && i.dS_DIEMDO !== '') {
                                        return i.dS_DIEMDO.includes(objectSelected.object.mA_DDO)
                                    }
                                }
                                ).namE_E}</h6>
                                
                            </div> */}
                        </InfoWindow>
                        :
                        null
                    }

                    {/* Tao window info cho kh??ch h??ng Search */}
                    {(props.searchObjectKhachHang !== null && props.searchObjectKhachHang!== undefined) ?
                        <InfoWindow
                            position={{ lat: Number(props.searchObjectKhachHang.LATITUDE), lng: Number(props.searchObjectKhachHang.LONGITUDE) }}
                        >
                            <InfoSearchKhachHangComponent item={props.searchObjectKhachHang}/>                            
                        </InfoWindow>
                        :
                        null
                    }

                    {(objectSelected.type === 'Tram' && (optionEffectObject.value === null || optionEffectObject.value === 'ShowAllTram')) ?
                        <InfoWindow
                            onCloseClick={() => props.functionSetObjectSelected({ type: "", object: null })}
                            position={{ lat: Number(objectSelected.object.toado.latitude), lng: Number(objectSelected.object.toado.longitude) }}
                        >
                            {/* <div>
    
                                <h4>T??n Tr???m: {objectSelected.object.teN_TRAM}</h4>
                                <h6>M?? Tr???m: {objectSelected.object.mA_TRAM}</h6>
                                <h6>T???a ?????: (lng: '{objectSelected.object.toado.longitude}',lat:'{objectSelected.object.toado.latitude}')</h6>
                            </div> */}
                            <InfoTramComponent tram={objectSelected.object} maDonViSelected={props.maDonViSelected} />
                        </InfoWindow>
                        :
                        null
                    }
                    {(objectSelected.type === 'Tru' && optionEffectObject.value === null && objectSelected.object !== null) ?
                        <InfoWindow
                            onCloseClick={() => props.functionSetObjectSelected({ type: "", object: null })}
                            position={{ lat: Number(objectSelected.object.latitude), lng: Number(objectSelected.object.longitude) }}
                        >
                            <div>
    
                                <h4>M?? Tr???m: {objectSelected.object.mA_TRAM}</h4>
                                <h6>T??n Tr???: {objectSelected.object.namE_E}</h6>
                                <h6>T???a ?????: (lng: '{objectSelected.object.longitude}',lat:'{objectSelected.object.latitude}')</h6>
                                <h6>Danh s??ch kh??ch h??ng: {objectSelected.object.dS_DIEMDO===null || objectSelected.object.dS_DIEMDO.length === 0 ? '' : objectSelected.object.dS_DIEMDO.toString()}</h6>
                            </div>
                        </InfoWindow>
                        :
                        null
                    }
    
                    {popup !== null && optionEffectObject.value !== 'XacDinhKhoangCachKhiThemTruByType' && optionEffectObject.value !== 'XacDinhKhoangCachKhiThemTruByTypeNoLine' && flagShowPoupAddTru ?
                        <InfoWindow
                            onCloseClick={() => { setPopup(null); setFlagShowPopupAddTru(false) }}
                            position={{ lat: popup.lat, lng: popup.lng }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
    
                                {props.tram !== null ? null :
                                    <div style={{ display: 'flex', width: 75 / 2 + 40, height: 75 / 2 + 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                                        onClick={() => {
                                            fetch(URLAPI+'/APIKTGS/TRAM/saveToaDoTram', {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        "mA_DVIQLY": props.maDonViSelected,
                                                        "mA_TRAM": props.maTramSelected,
                                                        "TOADO": {
                                                            "LONGITUDE": popup.lng.toString(),
                                                            "LATITUDE": popup.lat.toString()
                                                        }
                                                    })
                                            })
                                                .then(response => {
                                                    //console.log('save point');
                                                    if (response.status ===200) {
                                                        showNotification('Th??ng b??o!', '???? th??m tr???m th??nh c??ng!', 2000, 400);
    
                                                        return response.json();
                                                    }
    
                                                    return null;
    
                                                })
                                                .then((res) => {
                                                    if (res !== null) {
    
                                                        setPopup(null);
                                                        setFlagShowPopupAddTru(false);
                                                        props.setTram(res);
                                                    } else {
                                                        //console.log('Error: save tr???m');
                                                    }
                                                })
                                                .catch((error) => {
                                                    //console.log("Error save point: " + error);
                                                });
                                        }}>
                                        <div>Tr???m</div>
                                        <img src={IconTramDisplay} style={{ width: 75 / 2, height: 75 / 2 }} />
                                    </div>
                                }
                                <div style={{ display: 'flex', width: 75 / 2 + 40, height: 75 / 2 + 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                                    onClick={() => {
                                        let tmp = window.prompt('Nh???p t??n tr??? h??? th??? vu??ng: ');
                                        if (tmp !== null) {
                                            fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        "MA_DVIQLY": props.maDonViSelected,
                                                        "ID_ELEMENT": "",
                                                        "MA_TRAM": props.maTramSelected,
                                                        "TYPE_E": "TVHTHE",
                                                        "NAME_E": tmp,
                                                        "LONGITUDE": popup.lng.toString(),
                                                        "LATITUDE": popup.lat.toString(),
                                                        "longitudE_LABEL": popup.lng.toString(),
                                                        "latitudE_LABEL": (popup.lat + 0.0005).toString(),
                                                        "dS_DIEMDO": null
                                                    })
                                            })
                                                .then(response => {
                                                    //console.log('save point');
                                                    if (response.status ===200) {
    
                                                        showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                        return response.json();
                                                    }
    
                                                    return null;
    
                                                })
                                                .then((res) => {
                                                    if (res !== null) {
                                                        if (objectHasAdd !== null) {
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "ID_ELEMENT": "",
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "TYPE_E": "DDIEN",
                                                                        "NAME_E": "D??y ??i???n",
                                                                        "ID_POINT1": res.iD_ELEMENT,
                                                                        "ID_POINT2": objectHasAdd.iD_ELEMENT,
                                                                        "MA_DDO": ""
                                                                    }
    
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
                                                                        //console.log('OK line: ' + objectHasAdd.id);
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then((res) => {
                                                                    if (res !== null) {
                                                                        props.functionSetListLine([...listLine, res]);
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                        setObjectHasAdd(res);
                                                        props.functionSetListTru([...listTru, res]);
                                                        setPopup(null);
                                                        setFlagShowPopupAddTru(false);
                                                    } else {
                                                        //console.log('Error: ' + tmp);
                                                    }
                                                })
                                                .catch((error) => {
                                                    //console.log("Error save point: " + error);
                                                });
                                        } else {
                                            alert('Kh??ng c?? th??ng tin th??? th??m tr??? h??? th??? vu??ng')
                                        }
                                    }}
                                >
                                    <div>HT vu??ng</div>
                                    <img src={IconTruHaTheVuong} style={{ width: 75 / 2, height: 75 / 2 }} />
                                </div>
                                <div style={{ display: 'flex', width: 75 / 2 + 40, height: 75 / 2 + 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                                    onClick={() => {
                                        let tmp = window.prompt('Nh???p t??n tr??? h??? th??? tr??n');
                                        if (tmp !== null) {
                                            fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        "MA_DVIQLY": props.maDonViSelected,
                                                        "ID_ELEMENT": "",
                                                        "MA_TRAM": props.maTramSelected,
                                                        "TYPE_E": "THATHE",
                                                        "NAME_E": tmp,
                                                        "LONGITUDE": popup.lng.toString(),
                                                        "LATITUDE": popup.lat.toString(),
                                                        "longitudE_LABEL": popup.lng.toString(),
                                                        "latitudE_LABEL": (popup.lat + 0.0005).toString(),
                                                        "dS_DIEMDO": null
                                                    })
                                            })
                                                .then(response => {
                                                    //console.log('save point');
                                                    if (response.status ===200) {
    
                                                        showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                        return response.json();
                                                        //tmpTru.push(response.json());
                                                    }
    
                                                    return null;
    
                                                })
                                                .then((res) => {
                                                    if (res !== null) {
                                                        if (objectHasAdd !== null) {
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "ID_ELEMENT": "",
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "TYPE_E": "DDIEN",
                                                                        "NAME_E": "D??y ??i???n",
                                                                        "ID_POINT1": res.iD_ELEMENT,
                                                                        "ID_POINT2": objectHasAdd.iD_ELEMENT,
                                                                        "MA_DDO": ""
                                                                    }
    
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
                                                                        //console.log('OK line: ' + objectHasAdd.id);
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then((res) => {
                                                                    if (res !== null) {
                                                                        props.functionSetListLine([...listLine, res]);
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                        setObjectHasAdd(res);
                                                        props.functionSetListTru([...listTru, res]);
                                                        setPopup(null);
                                                        setFlagShowPopupAddTru(false);
                                                    } else {
                                                        //console.log('Error: ' + tmp);
                                                    }
                                                })
                                                .catch((error) => {
                                                    //console.log("Error save point: " + error);
                                                });
                                        } else {
                                            alert('Kh??ng c?? th??ng tin th??? th??m tr??? h??? th??? tr??n')
                                        }
                                    }}
                                >
                                    <div>HT tr??n</div>
                                    <img src={IconTruHaTheTron} style={{ width: 75 / 2, height: 75 / 2 }} />
                                </div>
                                <div style={{ display: 'flex', width: 75 / 2 + 40, height: 75 / 2 + 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                                    onClick={() => {
                                        let tmp = window.prompt('Nh???p t??n tr??? trung th???');
                                        if (tmp !== null) {
                                            fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        "MA_DVIQLY": props.maDonViSelected,
                                                        "ID_ELEMENT": "",
                                                        "MA_TRAM": props.maTramSelected,
                                                        "TYPE_E": "TTRHE",
                                                        "NAME_E": tmp,
                                                        "LONGITUDE": popup.lng.toString(),
                                                        "LATITUDE": popup.lat.toString(),
                                                        "longitudE_LABEL": popup.lng.toString(),
                                                        "latitudE_LABEL": (popup.lat + 0.0005).toString(),
                                                        "dS_DIEMDO": null
                                                    })
                                            })
                                                .then(response => {
                                                    //console.log('save point');
                                                    if (response.status ===200) {
    
                                                        showNotification('Th??ng b??o!', '???? th??m tr??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                        return response.json();
                                                        //tmpTru.push(response.json());
                                                    }
    
                                                    return null;
    
                                                })
                                                .then((res) => {
                                                    if (res !== null) {
                                                        if (objectHasAdd !== null) {
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "ID_ELEMENT": "",
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "TYPE_E": "DDIEN",
                                                                        "NAME_E": "D??y ??i???n",
                                                                        "ID_POINT1": res.iD_ELEMENT,
                                                                        "ID_POINT2": objectHasAdd.iD_ELEMENT,
                                                                        "MA_DDO": ""
                                                                    }
    
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
                                                                        //console.log('OK line: ' + objectHasAdd.id);
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then((res) => {
                                                                    if (res !== null) {
                                                                        props.functionSetListLine([...listLine, res]);
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                        setObjectHasAdd(res);
                                                        props.functionSetListTru([...listTru, res]);
                                                        setFlagShowPopupAddTru(false);
                                                        setPopup(null);
                                                    } else {
                                                        //console.log('Error: ' + tmp);
                                                    }
                                                })
                                                .catch((error) => {
                                                    //console.log("Error save point: " + error);
                                                });
                                        } else {
                                            alert('Kh??ng c?? th??ng tin th??? th??m tr??? trung th???')
                                        }
                                    }}
    
                                >
                                    <div>Trung th???</div>
                                    <img src={IconTruTrungTheDisplay} style={{ width: 75 / 2, height: 75 / 2 }} />
                                </div>
                                <div style={{ display: 'flex', width: 75 / 2 + 40, height: 75 / 2 + 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                                    onClick={() => {
                                        let tmp = window.prompt('Nh???p t??n t??? ??i???n: ');
                                        if (tmp !== null) {
                                            fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        "MA_DVIQLY": props.maDonViSelected,
                                                        "ID_ELEMENT": "",
                                                        "MA_TRAM": props.maTramSelected,
                                                        "TYPE_E": "TUDIEN",
                                                        "NAME_E": tmp,
                                                        "LONGITUDE": popup.lng.toString(),
                                                        "LATITUDE": popup.lat.toString(),
                                                        "longitudE_LABEL": popup.lng.toString(),
                                                        "latitudE_LABEL": (popup.lat + 0.0005).toString(),
                                                        "dS_DIEMDO": null
                                                    })
                                            })
                                                .then(response => {
                                                    //console.log('save point');
                                                    if (response.status ===200) {
    
                                                        showNotification('Th??ng b??o!', '???? th??m t??? ' + tmp + ' th??nh c??ng!', 2000, 400);
    
                                                        return response.json();
                                                    }
    
                                                    return null;
    
                                                })
                                                .then((res) => {
                                                    if (res !== null) {
                                                        if (objectHasAdd !== null) {
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "ID_ELEMENT": "",
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "TYPE_E": "DDIEN",
                                                                        "NAME_E": "D??y ??i???n",
                                                                        "ID_POINT1": res.iD_ELEMENT,
                                                                        "ID_POINT2": objectHasAdd.iD_ELEMENT,
                                                                        "MA_DDO": ""
                                                                    }
    
                                                                )
                                                            })
                                                                .then(response => {
    
    
                                                                    if (response.status ===200) {
                                                                        //console.log('OK line: ' + objectHasAdd.id);
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                        return response.json();
                                                                    }
                                                                    return null;
    
                                                                })
                                                                .then((res) => {
                                                                    if (res !== null) {
                                                                        props.functionSetListLine([...listLine, res]);
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                        setObjectHasAdd(res);
                                                        props.functionSetListTru([...listTru, res]);
                                                        setPopup(null);
                                                        setFlagShowPopupAddTru(false);
                                                    } else {
                                                        //console.log('Error: ' + tmp);
                                                    }
                                                })
                                                .catch((error) => {
                                                    //console.log("Error save point: " + error);
                                                });
                                        } else {
                                            alert('Kh??ng c?? th??ng tin th??? th??m tr??? h??? th??? vu??ng')
                                        }
                                    }}
                                >
                                    <div >T??? ??i???n</div>
                                    <img src={IconTuDien} style={{ width: 75 / 2, height: 75 / 2 }} />
                                </div>
    
                                {optionEffectObject.value === 'XacDinhKhoangCachKhiThemTru' ? null :
    
                                    <div style={{ display: 'flex', width: 75 / 2 + 40, height: 75 / 2 + 40, justifyContent: 'center', alignItems: 'center', marginLeft: 30 }}
    
                                    >
                                        <h1>
                                            <Badge href="#" color="primary">{objectHasAdd === null ? 0 :
                                                'K/c: ' + window.google.maps.geometry.spherical.computeDistanceBetween(new window.google.maps.LatLng(Number(objectHasAdd.latitude), Number(objectHasAdd.longitude)), new window.google.maps.LatLng(popup.lat, popup.lng)).toFixed(2) + '(m)'
                                            }
                                            </Badge>
                                        </h1>
                                    </div>
                                }
    
                                <div style={{ display: 'flex', width: 20, height: 20, 'text-align': 'center' }}
                                >
                                </div>
    
                            </div>
    
                        </InfoWindow>
                        :
                        null
                    }
                    {(optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByType' || optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByTypeNoLine' || optionEffectObject.value === 'XacDinhKhoangCachKhiThemTru') && popup !== null ?
                        <div style={{ display: 'flex', position: 'absolute', top: 50, left: 10, height: 75, justifyContent: 'center', alignItems: 'center', marginLeft: 30 }}
    
                        >
                            <h1>
                                <Badge href="#" color="primary">{objectHasAdd === null ? 0 :
                                    'K/c: ' + window.google.maps.geometry.spherical.computeDistanceBetween(new window.google.maps.LatLng(Number(objectHasAdd.latitude), Number(objectHasAdd.longitude)), new window.google.maps.LatLng(popup.lat, popup.lng)).toFixed(2) + '(m)'
                                }
                                </Badge>
                            </h1>
                        </div>
                        :
                        null
                    }
                    {directionResponse !== null ?
                        <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: 50, left: 10, height: 150, justifyContent: 'center', alignItems: 'center', marginLeft: 30 }}
    
                        >
                            <h1>
                                <Badge href="#" color="primary">{
                                    'K/c: ' + directionResponse.routes[0].legs[0].distance.text
                                }
                                </Badge>
                            </h1>
                            <h1>
                                <Badge href="#" color="primary">{
                                    'T/g: ' + directionResponse.routes[0].legs[0].duration.text
                                }
                                </Badge>
                            </h1>
                        </div>
                        :
                        null
                    }
    
                    <Modal isOpen={showModalLoading}>
                        <ModalHeader>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircleLoadingComponent />
                                </div>
                                <div style={{ display: 'flex', flex: 1 }}>
                                    ??ang X??? L?? ...
    
                            </div>
                            </div>
    
                        </ModalHeader>
                        <ModalBody>
                            {/* <Progress  striped value={100} /> */}
                            <Progress bar animated color="info" value="100">Loading...</Progress>
                        </ModalBody>
                        {/* <ModalFooter>
                            <Button variant="primary" >
                                ????ng
                            </Button>
                        </ModalFooter> */}
                    </Modal>
    
                    <Modal isOpen={openConfirmChangeLoactionModal}>
                        <ModalHeader>
                            Th??ng B??o!!!
                        </ModalHeader>
                        <ModalBody>
                            B???n c?? mu???n l??u v??? tr?? m???i c???a kh??ch h??ng {changeLocation} kh??ng?
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="info" onClick={() => {
    
                                fetch(URLAPI+'/APIKTGS/KHANG/updateToaDo', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
    
                                    },
                                    body: JSON.stringify({
                                        "MA_DVIQLY": changeLocation.slice(0, 6),
                                        "MA_DDO": changeLocation,
                                        "TOA_DO": { "LONGITUDE": locationChange.lng.toString(), "LATITUDE": locationChange.lat.toString() }
                                    })
                                })
                                    .then(response => {
    
                                        setOpenConfirmChangeLocationModal(false);
                                        for (let i = 0; i < listKhachHang.length; i++) {
                                            if (listKhachHang[i].mA_DDO === changeLocation) {
                                                listKhachHang[i].toA_DO.longitude = locationChange.lng.toString();
                                                listKhachHang[i].toA_DO.latitude = locationChange.lat.toString();
                                                //console.log('change list KH');
                                            }
                                        }
                                        setLocationChange(null);
                                        setChangeLocation(null);
                                        return response;
                                    })
                                    .catch((error) => {
                                        alert("Error: " + error);
                                        //console.log("Error: " + error);
                                    });
                            }} >
                                L??u To??? ?????
                            </Button>
                            <Button variant="primary" onClick={() => setOpenConfirmChangeLocationModal(false)}>
                                Kh??ng L??u T???a ?????
                            </Button>
                        </ModalFooter>
                    </Modal>
                    <Modal size='lg' isOpen={openDetailKhachHangModal} style={{ width: 1000, height: 1000 }}>
                        <ModalHeader>
                            Th??ng tin chi ti???t kh??ch h??ng {infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.teN_KHANG}
                        </ModalHeader>
                        <ModalBody>
                            Danh s??ch c??c kh??ch h??ng kh??ng c?? t???a ?????, c???n c???p nh???t b??n ch????ng tr??nh ghi ch??? s??? mobile
                        <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
                                <Table striped responsive bordered
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <tr>
                                        <th scope="row">M?? ????n v???</th>
                                        <td>{infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.mA_DVIQLY}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">T??n kh??ch h??ng</th>
                                        <td>{infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.teN_KHANG}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Danh s???</th>
                                        <td>{infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.doanH_SO}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">S??? h???</th>
                                        <td>{infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.sO_HO}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">S??? c??ng t??</th>
                                        <td>{infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.sO_TBI}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Lo???i c??ng t??</th>
                                        <td>{infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.loaI_TBI}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Chu???i gi??</th>
                                        <td>{infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.chuoI_GIA}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">?????a ch???</th>
                                        <td>{infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.sO_NHA + ' ' + infoDetailKhachHangModal.duonG_PHO}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Ghi ch??</th>
                                        <td>{infoDetailKhachHangModal === null ? '' : infoDetailKhachHangModal.ghI_CHU}</td>
                                    </tr>
                                </Table>
                            </div>
                        </ModalBody>
                        <ModalFooter>
    
                            <Button variant="primary" onClick={() => {
                                setOpenDetailKhachHangModal(false);
                            }
                            }>
                                Tho??t
                        </Button>
                        </ModalFooter>
                    </Modal>
    
                    <Button id='buttonLuuAddTru' onClick={() => {
                        const tmp = window.confirm("B???n c?? ch???c mu???n l??u c??c ?????i t?????ng m???i?");
                        if (tmp && listObjectAddTru !== null) {
                            let tmpTru = [];
                            let tmpLine = [];
                            let tmpAmountTru = 0;
                            let tmpAmountLine = 0;
                            let lengthTru = listObjectAddTru.length;
                            if (props.maDonViSelected !== null && props.maTramSelected !== null) {
                                listObjectAddTru.map((item, index) => {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": props.maDonViSelected,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": props.maTramSelected,
                                                "TYPE_E": "TRU",
                                                "NAME_E": item.name,
                                                "LONGITUDE": item.lng.toString(),
                                                "LATITUDE": item.lat.toString(),
                                                "longitudE_LABEL": item.lng.toString(),
                                                "latitudE_LABEL": (item.lat + 0.0005).toString(),
                                                "dS_DIEMDO": null
    
                                            })
                                    })
                                        .then(response => {
                                            //console.log('save point');
    
                                            if (response.status ===200) {
                                                //console.log('OK ponit: ' + item.id);
                                                showNotification('Th??ng b??o!', '???? l??u tr??? ' + item.name + ' th??nh c??ng!', 500, 400);
                                                tmpAmountTru++;
                                                return response.json();
                                            }
    
                                            return null;
    
                                        })
                                        .then((res) => {
                                            if (res !== null) {
    
    
                                                tmpTru.push(res);
                                                if (tmpAmountTru === lengthTru) {
                                                    //console.log(tmpTru);
                                                    tmpTru.map((itm, i) => {
                                                        if (i !== 0) {
                                                            fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                                method: 'POST',
                                                                headers: {
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        "MA_DVIQLY": props.maDonViSelected,
                                                                        "ID_ELEMENT": "",
                                                                        "MA_TRAM": props.maTramSelected,
                                                                        "TYPE_E": "DDIEN",
                                                                        "NAME_E": "D??y ??i???n",
                                                                        "ID_POINT1": itm.iD_ELEMENT,
                                                                        "ID_POINT2": tmpTru[i - 1].iD_ELEMENT,
                                                                        "MA_DDO": ""
                                                                    }
                                                                )
                                                            })
                                                                .then(response => {
    
                                                                    if (response.status ===200) {
                                                                        //console.log('OK line: ' + itm.iD_ELEMENT);
                                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 500, 400);
                                                                        tmpAmountLine++;
                                                                        return response.json()
                                                                    }
                                                                    return null;
                                                                })
                                                                .then((res) => {
                                                                    if (res !== null) {
    
                                                                        tmpLine.push(res);
                                                                        if (tmpAmountLine === lengthTru - 1) {
                                                                            props.functionSetListLine([...listLine, ...tmpLine]);
                                                                        }
    
                                                                    } else {
                                                                        //console.log('Error save line:' + item.id)
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    //console.log("Error: " + error);
                                                                });
                                                        }
                                                    })
                                                    props.functionSetListTru([...listTru, ...tmpTru]);
                                                }
                                            } else {
                                                //console.log('Error: ' + item.id);
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                });
                                //console.log('end save Tru');
                                setListObjectAddTru(null);
    
    
                            } else {
                                window.alert('Vui l??ng ch???n ????n v??? v?? tr???m ????? th???c hi???n thao t??c!');
                            }
                        } else {
                            window.alert('Kh??ng L??u');
                        }
                    }}>
                    </Button>
                    <Button id='buttonHuyAddTru' onClick={() => {
                        setListObjectAddTru(null);
                    }}>
                    </Button>
                    <Button id='buttonLuuAddLine' onClick={() => {
                        const tmp = window.confirm("B???n c?? ch???c mu???n l??u ???????ng d??y m???i?");
                        if (tmp && listObjectAddLine != null) {
                            let tmpLine = [];
                            let amountLine = 0;
                            if (listObjectAddLine.length % 2 === 0) {
                                amountLine = listObjectAddLine.length / 2;
                            } else {
                                amountLine = (listObjectAddLine.length - 1) / 2;
                            }
    
                            //console.log(listObjectAddLine.length % 2 === 0);
                            //console.log(listObjectAddLine.length / 2);
                            //console.log(listObjectAddLine.length);
    
                            listObjectAddLine.map((item, index) => {
                                //console.log(item);
                                if (index != 0) {
                                    if (index % 2 !== 0) {
                                        if (item.type === 'KhachHang' && listObjectAddLine[index - 1].type === 'Tru') {
                                            const tmpIndex = index;
                                            const tmpItem = item;
                                            fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        "MA_DVIQLY": props.maDonViSelected,
                                                        "ID_ELEMENT": "",
                                                        "MA_TRAM": props.maTramSelected,
                                                        "TYPE_E": "DDIEN",
                                                        "NAME_E": "D??y ??i???n",
                                                        "ID_POINT1": listObjectAddLine[index - 1].idPoint,
                                                        "ID_POINT2": ''
                                                    }
                                                )
                                            })
                                                .then(response => {
    
                                                    if (response.status ===200) {
                                                        //console.log('OK line: ' + item.id);
                                                        //console.log(amountLine);
    
                                                        return response.json();
                                                    }
    
                                                    return null;
                                                })
                                                .then((res) => {
                                                    //console.log('res');
    
                                                    //console.log(tmpItem);
                                                    //console.log(tmpItem.maDD);
                                                    //console.log(listObjectAddLine[tmpIndex - 1].idPoint);
                                                    if (res !== null) {
                                                        fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                            method: 'POST',
                                                            headers: {
                                                                Accept: 'application/json',
                                                                'Content-Type': 'application/json',
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    "MA_DVIQLY": props.maDonViSelected,
                                                                    "MA_TRAM": props.maTramSelected,
                                                                    "ID_LINE": res.iD_ELEMENT,
                                                                    "ID_POINT": listObjectAddLine[tmpIndex - 1].idPoint,
                                                                    "MA_DDO": tmpItem.maDD
                                                                }
                                                            )
                                                        })
                                                            .then(response => {
                                                                if (response.status ===200) {
                                                                    showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                                    return response.json();
                                                                }
                                                                return null;
    
                                                            })
                                                            .then(res => {
                                                                if (res !== null) {
                                                                    tmpLine.push(res);
                                                                    if (tmpLine.length === amountLine) {
                                                                        if (tmpLine.length > 0) {
                                                                            props.functionSetListLine([...listLine, ...tmpLine]);
                                                                            setListObjectAddLine(null);
                                                                        } else {
                                                                            window.alert('Ch??a c?? ???????ng d??y ????? l??u');
                                                                        }
                                                                    }
                                                                }
                                                            })
    
                                                            .catch((error) => {
                                                                //console.log("Error: " + error);
                                                            });
                                                    }
                                                })
                                                .catch((error) => {
                                                    //console.log("Error: " + error);
                                                });
    
    
    
                                        } else if (item.type === 'Tru' && listObjectAddLine[index - 1].type === 'KhachHang') {
                                            const tmpIndex = index;
                                            const tmpItem = item;
                                            fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        "MA_DVIQLY": props.maDonViSelected,
                                                        "ID_ELEMENT": "",
                                                        "MA_TRAM": props.maTramSelected,
                                                        "TYPE_E": "DDIEN",
                                                        "NAME_E": "D??y ??i???n",
                                                        "ID_POINT1": listObjectAddLine[index - 1].idPoint,
                                                        "ID_POINT2": ''
                                                    }
                                                )
                                            })
                                                .then(response => {
    
                                                    if (response.status ===200) {
    
                                                        return response.json();
                                                    }
    
                                                    return null;
                                                })
                                                .then((res) => {
                                                    if (res !== null) {
                                                        fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                            method: 'POST',
                                                            headers: {
                                                                Accept: 'application/json',
                                                                'Content-Type': 'application/json',
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    "MA_DVIQLY": props.maDonViSelected,
                                                                    "MA_TRAM": props.maTramSelected,
                                                                    "ID_LINE": res.iD_ELEMENT,
                                                                    "ID_POINT": listObjectAddLine[tmpIndex - 1].idPoint,
                                                                    "MA_DDO": tmpItem.maDD
                                                                }
                                                            )
                                                        })
                                                            .then(response => {
    
                                                                if (response.status ===200) {
    
                                                                    showNotification('Th??ng b??o!', '???? l??u quan h??? th??nh c??ng!', 2000, 400);
                                                                    return response.json();
                                                                }
                                                                return null;
    
                                                            })
                                                            .then(res => {
                                                                if (res !== null) {
                                                                    tmpLine.push(res);
                                                                    if (tmpLine.length === amountLine) {
                                                                        if (tmpLine.length > 0) {
                                                                            props.functionSetListLine([...listLine, ...tmpLine]);
                                                                            setListObjectAddLine(null);
                                                                        } else {
                                                                            window.alert('Ch??a c?? ???????ng d??y ????? l??u');
                                                                        }
                                                                    }
                                                                }
                                                            })
    
                                                            .catch((error) => {
                                                            });
                                                    }
                                                })
                                                .catch((error) => {
                                                    console.log("Error: " + error);
                                                });
                                        } else if ((item.type === 'Tru' && listObjectAddLine[index - 1].type === 'Tru') ||
                                            (item.type === 'Tru' && listObjectAddLine[index - 1].type === 'Tram')) {
                                            fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        "MA_DVIQLY": props.maDonViSelected,
                                                        "ID_ELEMENT": "",
                                                        "MA_TRAM": props.maTramSelected,
                                                        "TYPE_E": "DDIEN",
                                                        "NAME_E": "D??y ??i???n",
                                                        "ID_POINT1": item.idPoint,
                                                        "ID_POINT2": listObjectAddLine[index - 1].idPoint
                                                    }
                                                )
                                            })
                                                .then(response => {
    
                                                    if (response.status ===200) {
                                                        showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                        return response.json();
                                                    }
    
                                                    return null;
                                                })
                                                .then((res) => {
                                                    if (res !== null) {
                                                        tmpLine.push(res);
                                                        if (tmpLine.length === amountLine) {
                                                            if (tmpLine.length > 0) {
                                                                props.functionSetListLine([...listLine, ...tmpLine]);
                                                                setListObjectAddLine(null);
                                                            } else {
                                                                window.alert('Ch??a c?? ???????ng d??y ????? l??u');
                                                            }
                                                        }
                                                    }
                                                })
                                                .catch((error) => {
                                                    //console.log("Error: " + error);
                                                });
                                        }
    
                                    }
                                }
                            });
                        } else {
                            window.alert('Ch??a c?? ???????ng d??y ????? l??u');
                        }
                    }}>
    
                    </Button>
                    <Button id='buttonHuyAddLine' onClick={() => {
                        setListObjectAddLine(null);
                    }}>
                    </Button>
    
                    <Button id='buttonLuuChangeLocationByAddressObject' onClick={() => {
                        if (objectSelected.type === "Tru" && props.resultLocationSearchBox != null) {
                            const tmp = window.confirm("B???n c?? ch???c mu???n l??u thay ?????i v??? tr?? c???a ?????i t?????ng " + objectSelected.object.namE_E + " ?");
                            if (tmp) {
    
                                fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(
                                        {
                                            "MA_DVIQLY": objectSelected.object.mA_DVIQLY,
                                            "ID_ELEMENT": objectSelected.object.iD_ELEMENT,
                                            "MA_TRAM": objectSelected.object.mA_TRAM,
                                            "TYPE_E": objectSelected.object.typE_E,
                                            "NAME_E": objectSelected.object.namE_E,
                                            "LONGITUDE": props.resultLocationSearchBox.lng.toString(),
                                            "LATITUDE": props.resultLocationSearchBox.lat.toString(),
                                            "longitudE_LABEL": props.resultLocationSearchBox.lng.toString(),
                                            "latitudE_LABEL": (props.resultLocationSearchBox.lat + 0.0005).toString(),
                                            "dS_DIEMDO": objectSelected.object.dS_DIEMDO
                                        })
                                })
                                    .then(response => {
                                        if (response.status ===200) {
                                            showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? tr??? ' + objectSelected.object.namE_E + ' th??nh c??ng!', 2000, 400);
                                        }
                                    })
                                    .catch((error) => {
                                        //console.log("Error: " + error);
                                    });
    
                                let tmpObject = [];
                                if (listLine !== null) {
    
                                    listLine.map((itm, index) => {
                                        if (objectSelected.object.toA_DO !== null && itm.toadO_P1 !== null && itm.toadO_P2) {
    
                                            if (itm.toadO_P1.longitude === objectSelected.object.longitude && itm.toadO_P1.latitude === objectSelected.object.latitude) {
                                                itm.toadO_P1.longitude = props.resultLocationSearchBox.lng.toString();
                                                itm.toadO_P1.latitude = props.resultLocationSearchBox.lat.toString();
    
                                            }
                                            if (itm.toadO_P2.longitude === objectSelected.object.longitude && itm.toadO_P2.latitude === objectSelected.object.latitude) {
                                                itm.toadO_P2.longitude = props.resultLocationSearchBox.lng.toString();
                                                itm.toadO_P2.latitude = props.resultLocationSearchBox.lat.toString();
                                            }
                                        }
                                    });
                                }
    
                                // if (listLine !== null) {                                
                                //     listLine.map((itm, index) => {
                                //         if (objectSelected.object.toA_DO !== null && itm.toadO_P1!==null && itm.toadO_P2!==null) {
                                //             if (itm.toadO_P1.longitude === objectSelected.object.toA_DO.longitude && itm.toadO_P1.latitude === objectSelected.object.toA_DO.latitude) {
                                //                 itm.toadO_P1.longitude = props.resultLocationSearchBox.lng.toString();
                                //                 itm.toadO_P1.latitude = props.resultLocationSearchBox.lat.toString();
    
                                //             }
                                //             if (itm.toadO_P2.longitude === objectSelected.object.toA_DO.longitude && itm.toadO_P2.latitude === objectSelected.object.toA_DO.latitude) {
                                //                 itm.toadO_P2.longitude = props.resultLocationSearchBox.lng.toString();
                                //                 itm.toadO_P2.latitude = props.resultLocationSearchBox.lat.toString();
    
                                //             }
                                //         }
                                //     });
                                // }
                                if (listTru !== null) {
    
                                    listTru.map((itmTru) => {
                                        if (itmTru.iD_ELEMENT === objectSelected.object.iD_ELEMENT) {
                                            itmTru.longitude = props.resultLocationSearchBox.lng.toString();
                                            itmTru.latitude = props.resultLocationSearchBox.lat.toString();
                                        }
                                    });
                                }
                                props.functionSetObjectSelected({ type: "", object: null });
                                document.getElementById('inputSearchBoxChangeLocationByAddress').value = '';
                                props.functionSetResultLocationSearchBox(null);
    
                            } else {
                                window.alert('Kh??ng L??u');
                            }
                        } else if (objectSelected.type === "KhachHang" && props.resultLocationSearchBox != null) {
                            const tmp = window.confirm("B???n c?? ch???c mu???n l??u thay ?????i v??? tr?? c???a kh??ch h??ng " + objectSelected.object.teN_KHANG + " ?");
                            if (tmp) {
                                fetch(URLAPI+'/APIKTGS/KHANG/updateToaDo', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        "MA_DVIQLY": objectSelected.object.mA_DVIQLY,
                                        "MA_DDO": objectSelected.object.mA_DDO,
                                        "TOA_DO": { "LONGITUDE": props.resultLocationSearchBox.lng.toString(), "LATITUDE": props.resultLocationSearchBox.lat.toString() }
                                    })
                                })
                                    .then(response => {
    
                                        return response;
                                    })
                                    .catch((error) => {
                                        //console.log("Error: " + error);
                                    });
                                let tmpObject = [];
                                if (listLine !== null) {
                                    // listLine.map((itm, index) => {
                                    //     if (itm.toadO_P1.longitude === objectSelected.object.longitude && itm.toadO_P1.latitude === objectSelected.object.latitude) {
                                    //         itm.toadO_P1.longitude = props.resultLocationSearchBox.lng.toString();
                                    //         itm.toadO_P1.latitude = props.resultLocationSearchBox.lat.toString();
                                    //         
                                    //     }
                                    //     if (itm.toadO_P2.longitude === objectSelected.object.longitude && itm.toadO_P2.latitude === objectSelected.object.latitude) {
                                    //         itm.toadO_P2.longitude = props.resultLocationSearchBox.lng.toString();
                                    //         itm.toadO_P2.latitude = props.resultLocationSearchBox.lat.toString();
                                    //         
                                    //     }
                                    // });
                                    listLine.map((itm, index) => {
                                        if (objectSelected.object.toA_DO !== null && itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                            if (itm.toadO_P1.longitude === objectSelected.object.toA_DO.longitude && itm.toadO_P1.latitude === objectSelected.object.toA_DO.latitude) {
                                                itm.toadO_P1.longitude = props.resultLocationSearchBox.lng.toString();
                                                itm.toadO_P1.latitude = props.resultLocationSearchBox.lat.toString();
    
                                            }
                                            if (itm.toadO_P2.longitude === objectSelected.object.toA_DO.longitude && itm.toadO_P2.latitude === objectSelected.object.toA_DO.latitude) {
                                                itm.toadO_P2.longitude = props.resultLocationSearchBox.lng.toString();
                                                itm.toadO_P2.latitude = props.resultLocationSearchBox.lat.toString();
    
                                            }
                                        }
                                    });
                                }
    
                                for (let i = 0; i < listKhachHang.length; i++) {
                                    if (listKhachHang[i].mA_DDO === objectSelected.object.mA_DDO) {
                                        listKhachHang[i].toA_DO.longitude = props.resultLocationSearchBox.lng.toString();
                                        listKhachHang[i].toA_DO.latitude = props.resultLocationSearchBox.lat.toString();
    
                                    }
                                }
                                props.functionSetObjectSelected({ type: "", object: null });
                                document.getElementById('inputSearchBoxChangeLocationByAddress').value = '';
                                props.functionSetResultLocationSearchBox(null);
                            } else {
                                window.alert('Kh??ng L??u');
                            }
                        } else if (objectSelected.type === "Tram" && props.resultLocationSearchBox != null) {
                            // const tmp = window.confirm("B???n c?? ch???c mu???n l??u thay ?????i v??? tr?? c???a Tr???m?");
    
                            // if(tmp){
                            fetch(URLAPI+'/APIKTGS/TRAM/saveToaDoTram', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(
                                    {
                                        "mA_DVIQLY": props.tram.mA_DVIQLY,
                                        "mA_TRAM": props.tram.mA_TRAM,
                                        "TOADO": {
                                            "LONGITUDE": props.resultLocationSearchBox.lng.toString(),
                                            "LATITUDE": props.resultLocationSearchBox.lat.toString()
                                        }
    
                                    })
                            })
                                .then(response => {
                                    if (response.status ===200) {
                                        showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? tr???m ' + props.tram.teN_TRAM + ' th??nh c??ng ', 2000, 400);
                                        return response.json();
                                    }
                                    return null;
                                })
                                .then((res) => {
                                    if (res !== null) {
                                        if (listLine !== null) {
                                            listLine.map((itm, index) => {
                                                if (objectSelected.object.toado !== null && itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
                                                    if (itm.toadO_P1.longitude === objectSelected.object.toado.longitude && itm.toadO_P1.latitude === objectSelected.object.toado.latitude) {
                                                        itm.toadO_P1.longitude = props.resultLocationSearchBox.lng.toString();
                                                        itm.toadO_P1.latitude = props.resultLocationSearchBox.lat.toString();
                                                    }
                                                    if (itm.toadO_P2.longitude === objectSelected.object.toado.longitude && itm.toadO_P2.latitude === objectSelected.object.toado.latitude) {
                                                        itm.toadO_P2.longitude = props.resultLocationSearchBox.lng.toString();
                                                        itm.toadO_P2.latitude = props.resultLocationSearchBox.lat.toString();
                                                    }
                                                }
                                            });
                                        }
                                        if (props.tram.toado !== null) {
                                            props.tram.toado.longitude = props.resultLocationSearchBox.lng.toString();
                                            props.tram.toado.latitude = props.resultLocationSearchBox.lat.toString();
                                        }
    
                                        //setFlagReRender(!flagReRender);
                                        props.functionSetObjectSelected({ type: "", object: null });
                                        //props.setTram(props.tram);
                                    }
                                })
                                .catch((error) => {
                                    //console.log("Error: " + error);
                                });
                            // }
                        } else {
                            window.alert('Vui l??ng ch???n ?????a ch??? v?? ?????i t?????ng ????? thay ?????i v??? tr???');
                        }
                    }}>
    
                    </Button>
                    <Button id='buttonHuyChangeLocationByAddressObject' onClick={() => {
                        props.functionSetObjectSelected({ type: "", object: null });
                        document.getElementById('inputSearchBoxChangeLocationByAddress').value = '';
                        //props.setLocationDirectionCurrent(null);
                        setDirectionResponse(null);
                    }} />
                    <Button id='buttonLuuChangeLocationByTypingObject' onClick={() => {
                        if (objectSelected.type === "Tru" && document.getElementById("inputTypingLng").value !== '' && document.getElementById("inputTypingLat").value !== '') {
                            const tmp = window.confirm("B???n c?? ch???c mu???n l??u thay ?????i v??? tr?? c???a tr??? " + objectSelected.object.namE_E + " ?");
                            if (tmp) {
                                fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
    
                                    },
                                    body: JSON.stringify(
                                        {
                                            "MA_DVIQLY": objectSelected.object.mA_DVIQLY,
                                            "ID_ELEMENT": objectSelected.object.iD_ELEMENT,
                                            "MA_TRAM": objectSelected.object.mA_TRAM,
                                            "TYPE_E": objectSelected.object.typE_E,
                                            "NAME_E": objectSelected.object.namE_E,
                                            "LONGITUDE": document.getElementById("inputTypingLng").value.toString(),
                                            "LATITUDE": document.getElementById("inputTypingLat").value.toString(),
                                            "longitudE_LABEL": document.getElementById("inputTypingLng").value.toString(),
                                            "latitudE_LABEL": (Number(document.getElementById("inputTypingLng").value) + 0.0005).toString(),
                                            "dS_DIEMDO": objectSelected.object.dS_DIEMDO
                                        })
                                })
                                    .then(response => {
                                        if (response.status ===200) {
                                            showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? tr??? ' + objectSelected.object.namE_E + ' th??nh c??ng!', 2000, 400);
                                        }
                                    })
                                    .catch((error) => {
                                        //console.log("Error: " + error);
                                    });
                                let tmpObject = [];
                                if (listLine !== null) {
                                    listLine.map((itm, index) => {
                                        if (objectSelected.object !== null && itm.toadO_P1 !== null && itm.toadO_P2 !== null) {
    
                                            if (itm.toadO_P1.longitude === objectSelected.object.longitude && itm.toadO_P1.latitude === objectSelected.object.latitude) {
                                                itm.toadO_P1.longitude = document.getElementById("inputTypingLng").value.toString();
                                                itm.toadO_P1.latitude = document.getElementById("inputTypingLat").value.toString();
    
                                            }
                                            if (itm.toadO_P2.longitude === objectSelected.object.longitude && itm.toadO_P2.latitude === objectSelected.object.latitude) {
                                                itm.toadO_P2.longitude = document.getElementById("inputTypingLng").value.toString();
                                                itm.toadO_P2.latitude = document.getElementById("inputTypingLat").value.toString();
    
                                            }
                                        }
                                    });
                                }
                                if (listTru !== null) {
                                    listTru.map((itmTru) => {
                                        if (itmTru.iD_ELEMENT === objectSelected.object.iD_ELEMENT) {
                                            itmTru.longitude = document.getElementById("inputTypingLng").value.toString();
                                            itmTru.latitude = document.getElementById("inputTypingLat").value.toString();
                                        }
                                    });
                                }
                                document.getElementById('inputTypingLng').value = '';
                                document.getElementById('inputTypingLat').value = '';
                                props.functionSetObjectSelected({ type: "", object: null });
                                //props.functionSetResultLocationTypingBox(null);
    
                            } else {
                                window.alert('Kh??ng L??u');
                            }
                        } else if (objectSelected.type === "KhachHang" && document.getElementById("inputTypingLng").value !== '' && document.getElementById("inputTypingLat").value !== '') {
                            const tmp = window.confirm("B???n c?? ch???c mu???n l??u thay ?????i v??? tr?? c???a kh??ch h??ng " + objectSelected.object.teN_KHANG + " ?");
                            if (tmp) {
                                fetch(URLAPI+'/APIKTGS/KHANG/updateToaDo', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
    
                                    },
                                    body: JSON.stringify({
                                        "MA_DVIQLY": objectSelected.object.mA_DVIQLY,
                                        "MA_DDO": objectSelected.object.mA_DDO,
                                        "TOA_DO": { "LONGITUDE": document.getElementById("inputTypingLng").value.toString(), "LATITUDE": document.getElementById("inputTypingLat").value.toString() }
                                    })
                                })
                                    .then(response => {
                                        showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? kh??ch h??ng ' + objectSelected.object.mA_DDO + ' th??nh c??ng!', 2000, 400);
                                        return response;
                                    })
                                    .catch((error) => {
                                        //console.log("Error: " + error);
                                    });
                                let tmpObject = [];
                                if (listLine !== null) {
                                    listLine.map((itm, index) => {
                                        if (objectSelected.object.toA_DO !== null && itm.toadO_P1 !== null && itm.toadO_P2) {
                                            if (itm.toadO_P1.longitude === objectSelected.object.toA_DO.longitude && itm.toadO_P1.latitude === objectSelected.object.toA_DO.latitude) {
                                                itm.toadO_P1.longitude = document.getElementById("inputTypingLng").value.toString();
                                                itm.toadO_P1.latitude = document.getElementById("inputTypingLat").value.toString();
    
                                            }
                                            if (itm.toadO_P2.longitude === objectSelected.object.toA_DO.longitude && itm.toadO_P2.latitude === objectSelected.object.toA_DO.latitude) {
                                                itm.toadO_P2.longitude = document.getElementById("inputTypingLng").value.toString();
                                                itm.toadO_P2.latitude = document.getElementById("inputTypingLat").value.toString();
    
                                            }
                                        }
                                    });
                                }
    
                                for (let i = 0; i < listKhachHang.length; i++) {
                                    if (listKhachHang[i].mA_DDO === objectSelected.object.mA_DDO) {
                                        listKhachHang[i].toA_DO.longitude = document.getElementById("inputTypingLng").value.toString();
                                        listKhachHang[i].toA_DO.latitude = document.getElementById("inputTypingLat").value.toString();
                                    }
                                }
                                document.getElementById('inputTypingLng').value = '';
                                document.getElementById('inputTypingLat').value = '';
                                props.functionSetObjectSelected({ type: "", object: null });
                                // props.functionSetResultLocationTypingBox(null);                            
                            } else {
                                window.alert('Kh??ng L??u');
                            }
                        } else if (objectSelected.type === "Tram" && document.getElementById("inputTypingLng").value !== '' && document.getElementById("inputTypingLat").value !== '') {
                            // const tmp = window.confirm("B???n c?? ch???c mu???n l??u thay ?????i v??? tr?? c???a Tr???m?");
    
                            // if(tmp){
                            fetch(URLAPI+'/APIKTGS/TRAM/saveToaDoTram', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(
                                    {
                                        "mA_DVIQLY": props.tram.mA_DVIQLY,
                                        "mA_TRAM": props.tram.mA_TRAM,
                                        "TOADO": {
                                            "LONGITUDE": document.getElementById("inputTypingLng").value.toString(),
                                            "LATITUDE": document.getElementById("inputTypingLat").value.toString()
                                        }
    
                                    })
                            })
                                .then(response => {
                                    if (response.status ===200) {
                                        showNotification('Th??ng b??o!', '???? thay ?????i v??? tr?? tr???m ' + props.tram.teN_TRAM + ' th??nh c??ng ', 2000, 400);
                                        return response.json();
                                    }
                                    return null;
                                })
                                .then((res) => {
                                    if (res !== null) {
                                        if (listLine !== null) {
                                            listLine.map((itm, index) => {
                                                if (objectSelected.object.toA_DO !== null && itm.toadO_P1 !== null && itm.toadO_P2) {
                                                    if (itm.toadO_P1.longitude === objectSelected.object.toado.longitude && itm.toadO_P1.latitude === objectSelected.object.toado.latitude) {
                                                        itm.toadO_P1.longitude = document.getElementById("inputTypingLng").value.toString();
                                                        itm.toadO_P1.latitude = document.getElementById("inputTypingLat").value.toString();
    
                                                    }
                                                    if (itm.toadO_P2.longitude === objectSelected.object.toado.longitude && itm.toadO_P2.latitude === objectSelected.object.toado.latitude) {
                                                        itm.toadO_P2.longitude = document.getElementById("inputTypingLng").value.toString();
                                                        itm.toadO_P2.latitude = document.getElementById("inputTypingLat").value.toString();
    
                                                    }
                                                }
                                            });
                                        }
    
                                        if (props.tram.toado !== null) {
                                            props.tram.toado.longitude = document.getElementById("inputTypingLng").value.toString();
                                            props.tram.toado.latitude = document.getElementById("inputTypingLat").value.toString();
                                        }
    
                                        props.functionSetObjectSelected({ type: "", object: null });
    
                                    }
                                })
                                .catch((error) => {
                                    //console.log("Error: " + error);
                                });
                            // }
                        }
                        else {
                            window.alert('Vui l??ng ch???n ?????a ch??? v?? ?????i t?????ng ????? thay ?????i v??? tr???');
                        }
    
    
                    }}>
    
                    </Button>
                    <Button id='buttonHuyChangeLocationByTypingObject' onClick={() => {
                        props.functionSetObjectSelected({ type: "", object: null });
                        document.getElementById('inputTypingLng').value = '';
                        document.getElementById('inputTypingLat').value = '';
                        props.functionSetResultLocationTypingBox(null);
                    }} />
                    <Button id='buttonRemoveObjectHasAdd' onClick={() => {
                        setObjectHasAdd(null);
                    }} />
                    <Button id='buttonUndo' onClick={() => {
    
                        if (listUndo !== null) {
                            const item = listUndo[listUndo.length - 1];
                            if (item.type === "AddLine") {
                                fetch(URLAPI+'/APIKTGS/Drawing/deleteLine', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
    
                                    },
                                    body: JSON.stringify(
                                        {
                                            "MA_DVIQLY": item.object.mA_DVIQLY,
                                            "ID_ELEMENT": item.object.iD_ELEMENT,
                                            "MA_TRAM": item.object.mA_TRAM
                                        }
                                    )
                                })
                                    .then(response => {
    
                                        if (response.status ===200) {
    
                                            
                                            if (listLine !== null) {
                                                props.functionSetListLine(listLine.filter(i => i.iD_ELEMENT !== item.object.iD_ELEMENT));
                                            }
                                            if (item.object.mA_DDO !== null && item.object.mA_DDO !== '') {
                                                props.setListKhachHangHasLine(props.listKhachHangHasLine.filter(itm => itm !== item.object.mA_DDO));
                                            }
                                            setFlagReRender(!flagReRender);
                                            if (listUndo.length === 1) {
                                                setListUndo(null);
                                            } else {
                                                let tmp = listUndo;
                                                tmp.pop();
                                                setListUndo(tmp);
                                            }
                                            //console.log('OK delete line: ' + item.iD_ELEMENT);
                                            showNotification('Th??ng b??o!', '???? x??a th??nh c??ng ???????ng d??y ' + item.namE_E, 2000, 400);
                                        }
                                    })
                                    // .then((res) => {
    
                                    // })
                                    .catch((error) => {
                                        //console.log("Error: " + error);
                                    })
    
                            } else if (item.type === 'DeleteLine') {
    
                                if (item.object.mA_DDO === null || item.object.mA_DDO === '') {
                                    if (item.object.typE_E === 'DDIEN_KH') {
                                        fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(
                                                {
                                                    "MA_DVIQLY": item.object.mA_DVIQLY,
                                                    "ID_ELEMENT": "",
                                                    "MA_TRAM": item.object.mA_DVIQLY,
                                                    "TYPE_E": item.object.typE_E,
                                                    "NAME_E": item.object.namE_E,
                                                    "ID_POINT1": item.object.iD_POINT1,
                                                    "ID_POINT2": item.object.iD_POINT2,
                                                }
                                            )
                                        })
                                            .then(response => {
    
                                                if (response.status ===200) {
                                                    return response.json();
                                                }
    
                                                return null;
                                            })
                                            .then((res) => {
                                                if (res !== null) {
                                                    props.functionSetListLine([...listLine, res]);
                                                    if (item.object.mA_DDO !== null && item.object.mA_DDO !== '') {
                                                        props.setListKhachHangHasLine([...props.listKhachHangHasLine, item.object.mA_DDO]);
                                                    }
                                                    if (listUndo.length == 1) {
                                                        setListUndo(null);
                                                    } else {
                                                        let tmp = listUndo;
                                                        tmp.pop();
                                                        setListUndo(tmp);
                                                    }
                                                }
                                            })
                                            .catch((error) => {
                                                //console.log("Error: " + error);
                                            });
                                    } else {
    
                                        fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(
                                                {
                                                    "MA_DVIQLY": item.object.mA_DVIQLY,
                                                    "ID_ELEMENT": "",
                                                    "MA_TRAM": item.object.mA_TRAM,
                                                    "TYPE_E": item.object.typE_E,
                                                    "NAME_E": item.object.namE_E,
                                                    "ID_POINT1": item.object.iD_POINT1,
                                                    "ID_POINT2": item.object.iD_POINT2,
                                                }
                                            )
                                        })
                                            .then(responseSaveLine => {
    
                                                if (responseSaveLine.statusText === 'OK') {
                                                    return responseSaveLine.json();
                                                }
    
                                                return null;
                                            })
                                            .then((res) => {
    
                                                if (res !== null) {
                                                    props.functionSetListLine([...listLine, res]);
                                                    if (item.object.mA_DDO !== null && item.object.mA_DDO !== '') {
                                                        props.setListKhachHangHasLine([...props.listKhachHangHasLine, item.object.mA_DDO]);
                                                    }
                                                    if (listUndo.length == 1) {
                                                        setListUndo(null);
                                                    } else {
                                                        let tmp = listUndo;
                                                        tmp.pop();
                                                        setListUndo(tmp);
                                                    }
                                                }
                                            })
                                            .catch((error) => {
                                                //console.log("Error: " + error);
                                            });
                                    }
                                } else {
                                    fetch(URLAPI+'/APIKTGS/Drawing/saveLine', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": item.object.mA_DVIQLY,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": item.object.mA_TRAM,
                                                "TYPE_E": item.object.typE_E,
                                                "NAME_E": item.object.namE_E,
                                                "ID_POINT1": item.object.iD_POINT1,
                                                "ID_POINT2": item.object.iD_POINT2,
                                            }
                                        )
                                    })
                                        .then(response => {
                                            if (response.status ===200) {
                                                return response.json();
                                            }
    
                                            return null;
                                        })
                                        .then((res) => {
    
                                            if (res !== null) {
                                                fetch(URLAPI+'/APIKTGS/Drawing/saveQHE', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.object.mA_DVIQLY,
                                                            "MA_TRAM": item.object.mA_TRAM,
                                                            "ID_LINE": res.iD_ELEMENT,
                                                            "ID_POINT": item.object.iD_POINT1,
                                                            "MA_DDO": item.object.mA_DDO
                                                        }
                                                    )
                                                })
                                                    .then(response => {
    
                                                        if (response.status ===200) {
                                                            showNotification('Th??ng b??o!', '???? l??u ???????ng d??y th??nh c??ng!', 2000, 400);
    
                                                            return response.json();
                                                        }
                                                        return null;
    
                                                    })
                                                    .then(res => {
                                                        if (res !== null) {
                                                            props.setListKhachHangHasLine([...props.listKhachHangHasLine, res.mA_DDO]);
                                                            if (item.object.mA_DDO !== null && item.object.mA_DDO !== '') {
                                                                props.setListKhachHangHasLine([...props.listKhachHangHasLine, item.object.mA_DDO]);
                                                            }
                                                            props.functionSetListLine([...listLine, res]);
                                                            if (listUndo.length == 1) {
                                                                setListUndo(null);
                                                            } else {
                                                                let tmp = listUndo;
                                                                tmp.pop();
                                                                setListUndo(tmp);
                                                            }
    
                                                            //setObjectHasAddLine(null);
                                                        }
                                                    })
    
                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error: " + error);
                                        });
                                }
                            }
                        }
                    }} />
                    <Button id='buttonLoadTruTrungTheFromPMIS' onClick={() => {
                        if (props.maDonViSelected !== null && props.tram != null && props.maTramSelected !== null) {
                            fetch(URLAPI+'/APIKTGS/TRUPMIS?madvi=' + props.maDonViSelected, {
                                method: 'GET',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                            })
                                .then(response => {
    
                                    if (response.status ===200) {
                                        return response.json();
                                    }
                                    return null;
                                })
                                .then((res) => {
                                    if (res !== null && res.length !== 0) {
                                        let dataPMIS = res.filter(item => ((Math.abs(Number(item.latitude).toFixed(2) - Number(props.tram.toado.latitude).toFixed(2)) < 0.005) &&
                                            (Math.abs(Number(item.longitude).toFixed(2) - Number(props.tram.toado.longitude).toFixed(2)) < 0.005)));
                                        setListTruPmis(dataPMIS);
                                    } else {
    
                                    }
                                })
                                .catch((error) => {
                                    //console.log("Error save point: " + error);
                                });
    
                        }
    
                    }} />
                    <Button id='buttonLuuTruTrungTheFromPMIS' onClick={() => {
                        if (listTruPmisAdd !== null) {
                            listTruPmisAdd.map(item => {
                                fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(
                                        {
                                            "MA_DVIQLY": props.maDonViSelected,
                                            "ID_ELEMENT": "",
                                            "MA_TRAM": props.maTramSelected,
                                            "TYPE_E": "TTRHE",
                                            "NAME_E": item.teN_TRU,
                                            "LONGITUDE": item.longitude,
                                            "LATITUDE": item.latitude,
                                            "longitudE_LABEL": item.longitude.toString(),
                                            "latitudE_LABEL": (Number(item.latitude) + 0.0005).toString(),
                                            "dS_DIEMDO": null
                                        })
                                })
                                    .then(response => {
                                        if (response.status ===200) {
                                            setListTruPmisAdd(null);
                                        }
                                    })
                                    .catch((error) => {
                                        //console.log("Error save point: " + error);
                                    });
                            })
                            setTimeout(() => {
                                fetch(URLAPI+'/APIKTGS/Drawing/getPoint?madvi=' + props.maDonViSelected + '&ma_tram=' + props.maTramSelected)
                                    .then((response) => {
    
                                        return response.json();
                                    })
                                    .then((responseJson) => {
                                        props.functionSetListTru(responseJson);
                                        if (responseJson !== null) {
                                            let listTmp = [];
                                            responseJson.map((item) => {
                                                if (item.dS_DIEMDO !== null) {
                                                    listTmp = [...listTmp, ...item.dS_DIEMDO];
                                                }
                                            });
                                            props.setListKhachHangHasLine(listTmp);
                                        }
                                        props.setShowModalLoading(false);
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        alert(error);
                                    })
    
                            }, 5000);
                        }
    
                    }} />
                    <Button id='buttonHuyTruTrungTheFromPMIS' onClick={() => {
                        setListTruPmis(null);
                        setListTruPmisAdd(null);
                    }} />                    
                    <Button id='buttonHuyTimDuong' onClick={() => {
                        setDirectionResponse(null);
                    }} />
    
                    <FixedPlugin categoryMap={categoryMap}
                        functionSetCategoryMap={functionSetCategoryMap}
                        optionEffectObject={optionEffectObject.value}
                        functionSetOptionEffectObject={functionSetOptionEffectObject}
                        functionSetObjectSelected={functionSetObjectSelected}
                        reloadListLine={reloadListLine}
                        reloadListPoint={reloadListPoint}
                        maTramSelected={props.maTramSelected}
                        maDonViSelected={props.maDonViSelected}
                        setObjectHasAddLine={functionSetObjectHasAddLine}
                        setIdTruSelected={functionSetIdTruSelected}
                        setPopup={functionSetPopup}
                        flagOnlyView={props.flagOnlyView}
                    />
                    <RestorePlugin
                        functionResetPointCenter={functionResetPointCenter}
                        functionResetZoom={functionResetZoom}
                        setObjectHasAddLine={functionSetObjectHasAddLine}
                        setIdTruSelected={functionSetIdTruSelected}
                        setPopup={functionSetPopup}
    
                    />
                    <ToolPlugin optionEffectObject={optionEffectObject.value}
                        functionSetOptionEffectObject={functionSetOptionEffectObject}
                        functionSetObjectSelected={functionSetObjectSelected}
                        reloadListLine={reloadListLine}
                        reloadListPoint={reloadListPoint}
                        setObjectHasAddLine={functionSetObjectHasAddLine}
                        setIdTruSelected={functionSetIdTruSelected}
                        setPopup={functionSetPopup}
                        flagOnlyView={props.flagOnlyView}
                    />
                    <ReportPlugin optionEffectObject={optionEffectObject.value}
                        functionSetOptionEffectObject={functionSetOptionEffectObject}
                        functionSetObjectSelected={functionSetObjectSelected}
                        setObjectHasAddLine={functionSetObjectHasAddLine}
                        setIdTruSelected={functionSetIdTruSelected}
                        setPopup={functionSetPopup}
                        flagOnlyView={props.flagOnlyView}
                        maDonViSelected={props.maDonViSelected}
                    />
                </GoogleMap>
            </LoadScript >
        )
    }else{

    }
}
