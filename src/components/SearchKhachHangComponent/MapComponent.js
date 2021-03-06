import React, { useContext, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete, Polyline, InfoBox, DirectionsService,DirectionsRenderer,useJsApiLoader } from '@react-google-maps/api';
import { Button, Modal, ModalHeader, ModalBody, Progress, ModalFooter, Table, Badge } from 'reactstrap';
import { ListKhachHangContext, LoadingContext, ListTruContext, ListLineContext, OptionEffectObjectContext, ObjectSelectedContext } from '../../MainMultilTramScreen';
import { styleAll, styleSimple, styleDefault } from '../../styles/mapStyles';
import ToolPlugin from '../ToolPlugin';
import FixedPlugin from '../FixedPlugin';
import RestorePlugin from '../RestorePlugin';
import ReportPlugin from '../ReportPlugin';
import IconKhachHang from '../../asset/images/KhachHang.png';
import IconKhachHangActive from '../../asset/images/KhachHangActive.png';
import IconKhachHangRightClick from '../../asset/images/KhachHangRightClick.png';
import IconKhachHangGiamSanLuong from '../../asset/images/KhachHangGiamSanLuong.png';
import IconKhachHangTangSanLuong from '../../asset/images/KhachHangTangSanLuong.png';
import IconKhachHangKhachHangKhongSanLuong from '../../asset/images/KhachHangKhongSanLuong.png';
import IconKhachHangKhachHangKhongSanLuongThangHienTai from '../../asset/images/KhachHangKhongSanLuongThangHienTai.png';
import IconTram from '../../asset/images/Tram.png';
import CircleLoadingComponent from '../CircleLoadingComponent';
import ReactNotification from 'react-notifications-component';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import {SizeTram,SizeTruHaThe,SizeKhachHangHeight,SizeKhachHangWidth, SizeTruTrungThe} from '../../constants/IconSize';
import { URLAPI, URLAPI4001 } from '../../constants/UrlApi';

export default function Map(props) {

    const listKhachHang = useContext(ListKhachHangContext);
    const listTru = useContext(ListTruContext);    
    const listLine = useContext(ListLineContext);
    const optionEffectObject = useContext(OptionEffectObjectContext);
    const objectSelected = useContext(ObjectSelectedContext);
    const showModalLoading = useContext(LoadingContext);
    const [openDetailKhachHangModal,setOpenDetailKhachHangModal] = useState(false);
    const [infoDetailKhachHangModal,setInfoDetailKhachHangModal] = useState(null);
    const [openConfirmChangeLoactionModal, setOpenConfirmChangeLocationModal] = useState(false);
    const [locationChange, setLocationChange] = useState(null);
    const [changeLocation, setChangeLocation] = useState(null);
    const [categoryMap, setCategoryMap] = useState('styleSimple');   
    const [locationSearchBox, setLocationSearchBox] = useState(null);
    const [directionResponse,setDirectionResponse] = useState(null);
    const [idTruSelected,setIdTruSelected] = useState(null);   
    const [listObjectAddTru, setListObjectAddTru] = useState(null);
    const [listObjectAddLine, setListObjectAddLine] = useState(null);
    //L??u t???m ????? th??m ???????ng d??y khi add tr???
    const [objectHasAdd, setObjectHasAdd] = useState(null);
    //L??u t???m ????? th??m ???????ng d??y b???ng chu???t ph???i
    const [objectHasAddLine,setObjectHasAddLine] = useState(null);
    const [popup, setPopup] = useState(null);
    const [flagReRender, setFlagReRender] = useState(false);
    const [zoomCurrent, setZoomCurrent] = useState(85.9999999999);
    const [listTruPmis,setListTruPmis] = useState(null);
    const [listTruPmisAdd,setListTruPmisAdd] = useState(null);
    const [listUndo,setListUndo] = useState(null);
    const [flagShowPoupAddTru,setFlagShowPopupAddTru] = useState(false);

    const functionSetObjectHasAddLine = (v)=>{
        setObjectHasAddLine(v);
    }
    const functionSetIdTruSelected = (v)=>{
        setIdTruSelected(v);
    }    
    const functionSetPopup = (v)=>{
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

    // const {isLoaded} = useJsApiLoader({
    //     id:'google-map-script',
    //     googleMapsApiKey:'AIzaSyBddLOpOb8D7rMeWUvyQBkLPNKUaKPfXy4'
    // })
    
    return (
        <LoadScript
            id='script-loader'
            // googleMapsApiKey="AIzaSyBddLOpOb8D7rMeWUvyQBkLPNKUaKPfXy4"
            googleMapsApiKey="AIzaSyCFcCLWqtVrENo1ZLZ8CIdmnuRN0aXl_aw"
             libraries={["places", "geometry"]}    
        >
            <ReactNotification />
            <GoogleMap
                id='map'                
                zoom={zoomCurrent}
                center={props.pointCenter}
                onRightClick={(e) => {
                    if(props.flagOnlyView){
                        
                    }else{

                        setPopup({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                        setFlagShowPopupAddTru(true);
                    }
                }}

                onMouseMove={(e) => {
                    if(flagShowPoupAddTru){

                    }else if(optionEffectObject.value==='XacDinhKhoangCachKhiThemTru' || optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByType' || optionEffectObject.value === 'XacDinhKhoangCachKhiThemTruByTypeNoLine'){
                        setPopup({ lat: e.latLng.lat(), lng: e.latLng.lng() });
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
                {/* V??? kh??ch h??ng */}
                {listKhachHang === null || optionEffectObject.value === 'ShowLabelPoint' || optionEffectObject.value === 'ShowLabelPointName' || optionEffectObject.value === 'ShowLabelPointDoanhSo' || optionEffectObject.value === 'ChangeLocationLabel' ? null : listKhachHang.map(kh => {
                        if (kh.toA_DO === null) {
    
                        } else if ((kh.toA_DO.longitude === "0" && kh.toA_DO.latitude === "0") || (kh.toA_DO.longitude === "" && kh.toA_DO.latitude === "")) {
    
                        }
                        else {
                            let flagShow='';
                            let date= new Date();
                            let monthCurrent  = date.getMonth()+1;

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
                                    if(Number(kh.dieN_TTHU[0].thang)<=monthCurrent-3 ){
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
                                // icon={objectSelected.type === "KhachHang" ?
                                //     (objectSelected.object.mA_DDO === kh.mA_DDO ?
                                //         { url: IconKhachHangActive, scaledSize: new window.google.maps.Size(SizeKhachHangWidth,SizeKhachHangHeight), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth/2, SizeKhachHangHeight), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth/2, SizeKhachHangHeight+9) }
                                //         :
                                //         { url: IconKhachHang, scaledSize: new window.google.maps.Size(SizeKhachHangWidth,SizeKhachHangHeight), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth/2, SizeKhachHangHeight), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth/2, SizeKhachHangHeight+9) }
                                //     ) : { url: IconKhachHang, scaledSize: new window.google.maps.Size(SizeKhachHangWidth,SizeKhachHangHeight), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth/2, SizeKhachHangHeight), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth/2, SizeKhachHangHeight+9) }}
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
                        Th??ng tin chi ti???t kh??ch h??ng {infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.teN_KHANG}
                    </ModalHeader>
                    <ModalBody>
                        Danh s??ch c??c kh??ch h??ng kh??ng c?? t???a ?????, c???n c???p nh???t b??n ch????ng tr??nh ghi ch??? s??? mobile
                    <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
                        <Table striped responsive bordered                         
                        style={{ width: '100%', height: '100%' }} 
                        >    
                        <tr>
                            <th scope="row">M?? ????n v???</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.mA_DVIQLY}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">T??n kh??ch h??ng</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.teN_KHANG}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">Danh s???</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.doanH_SO}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">S??? h???</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.sO_HO}</td>                                
                        </tr>                        
                        <tr>
                            <th scope="row">S??? c??ng t??</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.sO_TBI}</td>                                
                        </tr>    
                        <tr>
                            <th scope="row">Lo???i c??ng t??</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.loaI_TBI}</td>                                
                        </tr>                     
                        <tr>
                            <th scope="row">Chu???i gi??</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.chuoI_GIA}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">?????a ch???</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.sO_NHA+' '+infoDetailKhachHangModal.duonG_PHO}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">Ghi ch??</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.ghI_CHU}</td>                                
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

                           
                
                <RestorePlugin 
                    functionResetPointCenter={functionResetPointCenter} 
                    functionResetZoom={functionResetZoom} 
                    setObjectHasAddLine={functionSetObjectHasAddLine}
                    setIdTruSelected={functionSetIdTruSelected}
                    setPopup={functionSetPopup}                    
                />                
            </GoogleMap>
        </LoadScript >
    )
}
