import React, { useContext, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete, Polyline, InfoBox, DirectionsService,DirectionsRenderer } from '@react-google-maps/api';
import { Button, Modal, ModalHeader, ModalBody, Progress, ModalFooter, Table, Badge } from 'reactstrap';
import { ListKhachHangContext, LoadingContext, ListTruContext, ListLineContext, OptionEffectObjectContext, ObjectSelectedContext } from '../../CustomerLostPowerScreen';
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
import IconTramDisplay from '../../asset/images/IconTramDisplay.png';
import IconTram from '../../asset/images/Tram.png';
import IconTramActive from '../../asset/images/TramActive.png';
import IconTramRightClick from '../../asset/images/TramRightClick.png';
import IconTruTrungTheDisplay from '../../asset/images/TruTrungTheDisplay.png';
import IconTruTrungThe from '../../asset/images/TruTrungThe.png';
import IconTruTrungThePMIS from '../../asset/images/TruTrungThePMIS.png';
import IconTruTrungTheActive from '../../asset/images/TruTrungTheActive.png';
import IconTruTrungTheRightClick from '../../asset/images/TruTrungTheRightClick.png';
import IconTruHaTheTron from '../../asset/images/TruHaTheTron.png';
import IconTruHaTheTronActive from '../../asset/images/TruHaTheTronActive.png';
import IconTruHaTheTronRightClick from '../../asset/images/TruHaTheTronRightClick.png';
import IconTruHaTheVuong from '../../asset/images/TruHaTheVuong.png';
import IconTruHaTheVuongActive from '../../asset/images/TruHaTheVuongActive.png';
import IconTruHaTheVuongRightClick from '../../asset/images/TruHaTheVuongRightClick.png';
import IconTuDien from '../../asset/images/TuDien.png';
import IconTuDienActive from '../../asset/images/TuDienActive.png';
import IconTuDienRightClick from '../../asset/images/TuDienRightClick.png';
import IconPointLabel from '../../asset/images/PointLabel.png';
import CircleLoadingComponent from '../CircleLoadingComponent';
import ReactNotification from 'react-notifications-component';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import {SizeTram,SizeTruHaThe,SizeKhachHangHeight,SizeKhachHangWidth, SizeTruTrungThe} from '../../constants/IconSize';
import InfoKhachHangComponent from '../MapComponents/InfoKhachHangComponent';
import { URLAPI, URLAPI4001,URLLOCAL } from '../../constants/UrlApi';
import { UndoRounded } from '@material-ui/icons';

export default function Map(props) {

    const customerLostPowerSelected = props.customerLostPowerSelected;
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
    //Lưu tạm để thêm đường dây khi add trụ
    const [objectHasAdd, setObjectHasAdd] = useState(null);
    //Lưu tạm để thêm đường dây bằng chuột phải
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
    const reloadListPoint= ()=>{
        if(props.maTramSelected!==null && props.maDonViSelected!==null){
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
    const reloadListLine= ()=>{       
        if(props.maTramSelected!==null && props.maDonViSelected!==null){
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
    console.log('CustomerLostPower');    
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
                        placeholder="Nhập Vị Trí Cần Tìm..."
                        style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            width: `240px`,
                            height: `32px`,
                            padding: `0 12px`,
                            borderRadius: `3px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`,
                            position: "absolute",
                            left: "50%",
                            marginLeft: "-120px"
                        }}
                    />
                </Autocomplete>
                
                
                {props.currentLocation!==null && props.currentLocation!==undefined && objectSelected.type!==''?
               <DirectionsService 
               options={
                   objectSelected.type==='KhachHang'?
                       {
                           destination:objectSelected.object.LONGITUDE!==undefined && objectSelected.object.LATITUDE!==undefined ?{lat:Number(objectSelected.object.LATITUDE),lng:Number(objectSelected.object.LONGITUDE)}:null,
                           origin:{lat:props.currentLocation.lat,lng:props.currentLocation.lng},
                           travelMode:'DRIVING'
                       }
                   :
                   null
           }
               callback={(response)=>{

                   if(directionResponse===null){
                    //    
                       setDirectionResponse(response);
                   }
               }}                
           />
           :
                           null
                }
                {directionResponse===null || props.currentLocation===null || objectSelected.type===''?null:
                    <DirectionsRenderer 
                        options={{
                            directions: directionResponse,
                            markerOptions:{icon:{ url: IconKhachHangActive, scaledSize: new window.google.maps.Size(SizeKhachHangWidth,SizeKhachHangHeight), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(10.625, 31), labelOrigin: new window.google.maps.Point(10.625, 40) }}
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
                {/* Vẽ khách hàng */}
                {customerLostPowerSelected !== null && customerLostPowerSelected!==undefined?                
                <Marker
                                key={customerLostPowerSelected.MA_DDO}
                                label={props.flagShowLableKH?{ color: 'red', text: customerLostPowerSelected.TEN_KHANG, fontWeight: 'bold', fontSize: "12px" }:null}                                
                                icon={objectSelected.type === 'KhachHang' ?
                                    (objectSelected.object.MA_DDO === customerLostPowerSelected.MA_DDO ?
                                        { url: IconKhachHangActive, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                        :
                                        { url: IconKhachHang, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                                    )
                                    :
                                     { url: IconKhachHang, scaledSize: new window.google.maps.Size(SizeKhachHangWidth * props.sizeKhachHang, SizeKhachHangHeight * props.sizeKhachHang), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang), labelOrigin: new window.google.maps.Point(SizeKhachHangWidth * props.sizeKhachHang / 2, SizeKhachHangHeight * props.sizeKhachHang + 10) }
                       
                                }                                
                                draggable={false}
                                onClick={(e) => {                                    
                                        props.functionSetObjectSelected({ type: "KhachHang", object: customerLostPowerSelected });
                                }}                               
    
                                position={{ lng: customerLostPowerSelected.LONGITUDE !== null && customerLostPowerSelected.LONGITUDE !== undefined ?  Number(customerLostPowerSelected.LONGITUDE):0,
                                                    lat: customerLostPowerSelected.LATITUDE !== null && customerLostPowerSelected.LATITUDE !== undefined ? Number(customerLostPowerSelected.LATITUDE):0,
                                                }}
                            >
                            </Marker>
                            :
                            null
                }

               

                {/* Tao window info cho khách hàng */}
                {(directionResponse===null && objectSelected.type === 'KhachHang' && optionEffectObject.value === null && objectSelected.object.LONGITUDE !== undefined && objectSelected.object.LATITUDE !== undefined ) ?
                    <InfoWindow
                        onCloseClick={() => props.functionSetObjectSelected({ type: "", object: null })}
                        position={{ lat: Number(objectSelected.object.LATITUDE), lng: Number(objectSelected.object.LONGITUDE) }}
                    >                        
                        <div>                            
                            <h6>Mã KH: {objectSelected.object.MA_KHANG}</h6>
                            <h4>KH: {objectSelected.object.TEN_KHANG}</h4>
                            <h6>ĐC: {objectSelected.object.SO_NHA +' '+ objectSelected.object.DUONG_PHO}</h6>
                            <h6>Số No: {objectSelected.object.SO_TBI}</h6>
                            <h6>Danh số: {objectSelected.object.DOANH_SO}</h6>
                            <h6>Vị trí treo: {objectSelected.object.VITRI_TREO}</h6>
                            <h6>Mã sổ gcs: {objectSelected.object.MA_SOGCS}</h6>
                            <h6>Tọa độ: (lng: '{objectSelected.object.LONGITUDE}',lat:'{objectSelected.object.LATITUDE}')</h6>   
                            <Button variant="info" color="info" onClick={() => {
                        fetch(URLLOCAL + '/Api/SangTaiChuyenLuoi/insertCustomerLostPowerFix',{
                            method:'Post',
                            headers: {
                                Accept: '*/*',
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin':'*'
                              },
                            body:JSON.stringify( {
                                "maKHang":objectSelected.object.MA_KHANG,
                                "userCreate":props.username
                            })
                        })
                        .then((response) => {
                            debugger;
                            if(response.status===200){
                                return response.json();
                            }
                            return null;
                        })
                        .then((res) => {
                            if(res==='SUCCESS'){
                                alert('Đã chuyển trạng thái sửa chửa hoàn tất khách hàng '+objectSelected.object.TEN_KHANG);
                                props.setReload(!props.reload);
                            } 
                           
                        })
                        .catch((error) => {
                          console.error(error);
                          alert(error);
                        });
                    }
                    }>
                        Đã sửa
                    </Button>
                        </div>
                    </InfoWindow>
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
                                Đang Xử Lý ...
    
                        </div>
                        </div>

                    </ModalHeader>
                    <ModalBody>
                        {/* <Progress  striped value={100} /> */}
                        <Progress bar animated color="info" value="100">Loading...</Progress>
                    </ModalBody>
                    {/* <ModalFooter>
                        <Button variant="primary" >
                            Đóng
                        </Button>
                    </ModalFooter> */}
                </Modal>

                <Modal size='lg' isOpen={openDetailKhachHangModal} style={{ width: 1000, height: 1000 }}>
                    <ModalHeader>
                        Thông tin chi tiết khách hàng {infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.teN_KHANG}
                    </ModalHeader>
                    <ModalBody>
                        Danh sách các khách hàng không có tọa độ, cần cập nhật bên chương trình ghi chỉ số mobile
                    <div style={{ height: '500px', overflowY: 'auto' }} className="table-resposive">
                        <Table striped responsive bordered                         
                        style={{ width: '100%', height: '100%' }} 
                        >    
                        <tr>
                            <th scope="row">Mã đơn vị</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.mA_DVIQLY}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">Tên khách hàng</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.teN_KHANG}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">Danh số</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.doanH_SO}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">Số hộ</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.sO_HO}</td>                                
                        </tr>                        
                        <tr>
                            <th scope="row">Số công tơ</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.sO_TBI}</td>                                
                        </tr>    
                        <tr>
                            <th scope="row">Loại công tơ</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.loaI_TBI}</td>                                
                        </tr>                     
                        <tr>
                            <th scope="row">Chuỗi giá</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.chuoI_GIA}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">Địa chỉ</th>
                            <td>{infoDetailKhachHangModal===null?'':infoDetailKhachHangModal.sO_NHA+' '+infoDetailKhachHangModal.duonG_PHO}</td>                                
                        </tr>
                        <tr>
                            <th scope="row">Ghi chú</th>
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
                        Thoát
                    </Button>
                    </ModalFooter>
                </Modal>

                <Button id='buttonLuuAddTru' onClick={() => {
                    const tmp = window.confirm("Bạn có chắc muốn lưu các đối tượng mới?");
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
                                            showNotification('Thông báo!', 'Đã lưu trụ ' + item.name + ' thành công!', 500, 400);
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
                                                                    "NAME_E": "Dây điện",
                                                                    "ID_POINT1": itm.iD_ELEMENT,
                                                                    "ID_POINT2": tmpTru[i - 1].iD_ELEMENT,
                                                                    "MA_DDO": ""                                                                    
                                                                }
                                                            )
                                                        })
                                                            .then(response => {                                                               
                                                                
                                                                if (response.status ===200) {
                                                                    //console.log('OK line: ' + itm.iD_ELEMENT);
                                                                    showNotification('Thông báo!', 'Đã lưu đường dây thành công!', 500, 400);
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
                            window.alert('Vui lòng chọn đơn vị và trạm để thực hiện thao tác!');
                        }
                    } else {
                        window.alert('Không Lưu');
                    }
                }}>
                </Button>
                <Button id='buttonHuyAddTru' onClick={() => {
                    setListObjectAddTru(null);
                }}>
                </Button>
                <Button id='buttonLuuAddLine' onClick={() => {
                    const tmp = window.confirm("Bạn có chắc muốn lưu đường dây mới?");
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
                                    if (item.type === 'KhachHang' && listObjectAddLine[index - 1].type === 'Tru'){
                                        const tmpIndex=index;
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
                                                    "NAME_E": "Dây điện",
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
                                                                showNotification('Thông báo!', 'Đã lưu đường dây thành công!', 2000, 400);

                                                                return response.json();
                                                            }
                                                            return null;

                                                        })
                                                        .then(res=>{
                                                            if (res!==null){
                                                                tmpLine.push(res);
                                                                if (tmpLine.length === amountLine) {
                                                                    if (tmpLine.length > 0) {                                                                        
                                                                        props.functionSetListLine([...listLine, ...tmpLine]);
                                                                        setListObjectAddLine(null);
                                                                    } else {
                                                                        window.alert('Chưa có đường dây để lưu');
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

                                        
                                        
                                    }else if (item.type === 'Tru' && listObjectAddLine[index - 1].type === 'KhachHang'){
                                        const tmpIndex=index;
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
                                                    "NAME_E": "Dây điện",
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
                                                                
                                                                showNotification('Thông báo!', 'Đã lưu quan hệ thành công!', 2000, 400);
                                                                return response.json();
                                                            }
                                                            return null;

                                                        })
                                                        .then(res=>{
                                                            if (res!==null){
                                                                tmpLine.push(res);
                                                                if (tmpLine.length === amountLine) {
                                                                    if (tmpLine.length > 0) {
                                                                        props.functionSetListLine([...listLine, ...tmpLine]);
                                                                        setListObjectAddLine(null);
                                                                    } else {
                                                                        window.alert('Chưa có đường dây để lưu');
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
                                    (item.type === 'Tru' && listObjectAddLine[index - 1].type === 'Tram')){
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
                                                    "NAME_E": "Dây điện",
                                                    "ID_POINT1": item.idPoint,
                                                    "ID_POINT2": listObjectAddLine[index - 1].idPoint                                               
                                                }                                                
                                        )
                                    })
                                        .then(response => {
                                            
                                            if (response.status ===200) {                                                
                                                showNotification('Thông báo!', 'Đã lưu đường dây thành công!', 2000, 400);                                               

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
                                                        window.alert('Chưa có đường dây để lưu');
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
                        window.alert('Chưa có đường dây để lưu');
                    }
                }}>

                </Button>
                <Button id='buttonHuyAddLine' onClick={() => {
                    setListObjectAddLine(null);
                }}>
                </Button>
                
                <Button id='buttonLuuChangeLocationByAddressObject' onClick={() => {
                    if (objectSelected.type === "Tru" && props.resultLocationSearchBox != null) {
                        const tmp = window.confirm("Bạn có chắc muốn lưu thay đổi vị trí của đối tượng " + objectSelected.object.namE_E + " ?");
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
                                        "latitudE_LABEL": (props.resultLocationSearchBox.lat+0.0005).toString(),
                                        "dS_DIEMDO": objectSelected.object.dS_DIEMDO
                                    })
                            })
                                .then(response => {
                                    if (response.status ===200) {
                                        showNotification('Thông báo!', 'Đã thay đổi vị trí trụ ' + objectSelected.object.namE_E + ' thành công!', 2000, 400);
                                    }
                                })
                                .catch((error) => {
                                    //console.log("Error: " + error);
                                });

                            let tmpObject = [];
                            if (listLine !== null) {

                                listLine.map((itm, index) => {
                                    if (objectSelected.object.toA_DO !== null && itm.toadO_P1!==null && itm.toadO_P2) {

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
                            window.alert('Không Lưu');
                        }
                    } else if (objectSelected.type === "KhachHang" && props.resultLocationSearchBox != null) {
                        const tmp = window.confirm("Bạn có chắc muốn lưu thay đổi vị trí của khách hàng " + objectSelected.object.teN_KHANG + " ?");
                        if (tmp) {
                            fetch(URLAPI+'/Api/SangTaiChuyenLuoi/saveKH', {
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
                            window.alert('Không Lưu');
                        }
                    } else if (objectSelected.type === "Tram" && props.resultLocationSearchBox != null ) {
                        // const tmp = window.confirm("Bạn có chắc muốn lưu thay đổi vị trí của Trạm?");
                        
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
                                            "TOADO":{
                                                "LONGITUDE":props.resultLocationSearchBox.lng.toString(),
                                                "LATITUDE":props.resultLocationSearchBox.lat.toString()
                                            }
                                            
                                        })
                                })
                                    .then(response => {
                                        if (response.status ===200) {
                                            showNotification('Thông báo!', 'Đã thay đổi vị trí trạm ' + props.tram.teN_TRAM + ' thành công ', 2000, 400);
                                            return response.json();
                                        }
                                        return null;
                                    })
                                    .then((res) => {
                                        if(res!==null){                                           
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
                                            if(props.tram.toado!==null){
                                                props.tram.toado.longitude=props.resultLocationSearchBox.lng.toString();
                                                props.tram.toado.latitude=props.resultLocationSearchBox.lat.toString();
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
                        window.alert('Vui lòng chọn địa chỉ và đối tượng để thay đổi vị trí?');
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
                        const tmp = window.confirm("Bạn có chắc muốn lưu thay đổi vị trí của trụ " + objectSelected.object.namE_E + " ?");
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
                                        "latitudE_LABEL": (Number(document.getElementById("inputTypingLng").value)+0.0005).toString(),
                                        "dS_DIEMDO": objectSelected.object.dS_DIEMDO
                                    })
                            })
                                .then(response => {
                                    if (response.status ===200) {                                        
                                        showNotification('Thông báo!', 'Đã thay đổi vị trí trụ ' + objectSelected.object.namE_E + ' thành công!', 2000, 400);
                                    }
                                })
                                .catch((error) => {
                                    //console.log("Error: " + error);
                                });
                            let tmpObject = [];
                            if (listLine !== null) {
                                listLine.map((itm, index) => {
                                    if(objectSelected.object!==null && itm.toadO_P1 !== null && itm.toadO_P2 !== null){

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
                            window.alert('Không Lưu');
                        }
                    } else if (objectSelected.type === "KhachHang" && document.getElementById("inputTypingLng").value !== '' && document.getElementById("inputTypingLat").value !== '') {
                        const tmp = window.confirm("Bạn có chắc muốn lưu thay đổi vị trí của khách hàng " + objectSelected.object.teN_KHANG + " ?");
                        if (tmp) {
                            fetch(URLAPI+'/Api/SangTaiChuyenLuoi/saveKH', {
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
                                    showNotification('Thông báo!', 'Đã thay đổi vị trí khách hàng ' + objectSelected.object.mA_DDO + ' thành công!', 2000, 400);
                                    return response;
                                })
                                .catch((error) => {
                                    //console.log("Error: " + error);
                                });
                            let tmpObject = [];
                            if (listLine !== null) {
                                listLine.map((itm, index) => {
                                    if (objectSelected.object.toA_DO !== null && itm.toadO_P1!==null && itm.toadO_P2 ) {
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
                            window.alert('Không Lưu');
                        }
                    } else if (objectSelected.type === "Tram" && document.getElementById("inputTypingLng").value !== '' && document.getElementById("inputTypingLat").value !== '' ) {
                        // const tmp = window.confirm("Bạn có chắc muốn lưu thay đổi vị trí của Trạm?");
                                             
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
                                            "TOADO":{
                                                "LONGITUDE":document.getElementById("inputTypingLng").value.toString(),
                                                "LATITUDE":document.getElementById("inputTypingLat").value.toString()
                                            }
                                            
                                        })
                                })
                                    .then(response => {
                                        if (response.status ===200) {
                                            showNotification('Thông báo!', 'Đã thay đổi vị trí trạm ' + props.tram.teN_TRAM + ' thành công ', 2000, 400);
                                            return response.json();
                                        }
                                        return null;
                                    })
                                    .then((res) => {
                                        if(res!==null){
                                            if (listLine !== null) {
                                                listLine.map((itm, index) => {
                                                    if (objectSelected.object.toA_DO !== null && itm.toadO_P1!==null && itm.toadO_P2 ) {
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
                                            
                                            if(props.tram.toado!==null){
                                                props.tram.toado.longitude=document.getElementById("inputTypingLng").value.toString();
                                                props.tram.toado.latitude=document.getElementById("inputTypingLat").value.toString();
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
                        window.alert('Vui lòng chọn địa chỉ và đối tượng để thay đổi vị trí?');
                    }


                }}>

                </Button>
                <Button id='buttonHuyChangeLocationByTypingObject' onClick={() => {
                    props.functionSetObjectSelected({ type: "", object: null });
                    document.getElementById('inputTypingLng').value = '';
                    document.getElementById('inputTypingLat').value = '';
                    props.functionSetResultLocationTypingBox(null);
                }} />
                <Button id='buttonRemoveObjectHasAdd' onClick={()=>{
                    setObjectHasAdd(null);
                }}/>
                <Button id='buttonUndo' onClick={()=>{
                                    
                    if(listUndo!==null){
                        const item=listUndo[listUndo.length-1];                        
                        if(item.type==="AddLine"){
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
                                                            props.functionSetListLine(listLine.filter(i=>i.iD_ELEMENT!==item.object.iD_ELEMENT));
                                                        }
                                                        if(item.object.mA_DDO!==null && item.object.mA_DDO!==''){
                                                            props.setListKhachHangHasLine(props.listKhachHangHasLine.filter(itm=>itm!==item.object.mA_DDO));  
                                                        }
                                                        setFlagReRender(!flagReRender);
                                                        if(listUndo.length===1){
                                                            setListUndo(null);
                                                        }else{
                                                            let tmp=listUndo;
                                                            tmp.pop();
                                                            setListUndo(tmp);
                                                        }
                                                        //console.log('OK delete line: ' + item.iD_ELEMENT);
                                                        showNotification('Thông báo!', 'Đã xóa thành công đường dây ' + item.namE_E, 2000, 400);
                                                    }
                                                })
                                                // .then((res) => {
    
                                                // })
                                                .catch((error) => {
                                                    //console.log("Error: " + error);
                                                })
                                            
                        } else if (item.type==='DeleteLine'){
                            
                            if(item.object.mA_DDO===null || item.object.mA_DDO===''){
                                if(item.object.typE_E==='DDIEN_KH'){
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
                                                if(item.object.mA_DDO!==null && item.object.mA_DDO!==''){
                                                    props.setListKhachHangHasLine([...props.listKhachHangHasLine,item.object.mA_DDO]);  
                                                } 
                                                if(listUndo.length==1){
                                                    setListUndo(null);
                                                }else{
                                                    let tmp=listUndo;
                                                    tmp.pop();
                                                    setListUndo(tmp);
                                                }
                                            }
                                        })                                                                                    
                                        .catch((error) => {
                                            //console.log("Error: " + error);
                                        });
                                }else{
                                    
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
                                                if(item.object.mA_DDO!==null && item.object.mA_DDO!==''){
                                                    props.setListKhachHangHasLine([...props.listKhachHangHasLine,item.object.mA_DDO]);  
                                                } 
                                                if(listUndo.length==1){
                                                    setListUndo(null);
                                                }else{
                                                    let tmp=listUndo;
                                                    tmp.pop();
                                                    setListUndo(tmp);
                                                }
                                            }
                                        })                                                                                    
                                        .catch((error) => {
                                            //console.log("Error: " + error);
                                        });
                                }
                            }else{
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
                                                            showNotification('Thông báo!', 'Đã lưu đường dây thành công!', 2000, 400);
                                    
                                                            return response.json();
                                                        }
                                                        return null;
                                    
                                                    })
                                                    .then(res=>{
                                                        if (res!==null){   
                                                            props.setListKhachHangHasLine([...props.listKhachHangHasLine,res.mA_DDO]);
                                                            if(item.object.mA_DDO!==null && item.object.mA_DDO!==''){
                                                                props.setListKhachHangHasLine([...props.listKhachHangHasLine,item.object.mA_DDO]);  
                                                            } 
                                                            props.functionSetListLine([...listLine, res]);
                                                            if(listUndo.length==1){
                                                                setListUndo(null);
                                                            }else{
                                                                let tmp=listUndo;
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
                }}/>
                <Button id='buttonLoadTruTrungTheFromPMIS' onClick={()=>{
                    if (props.maDonViSelected!==null && props.tram!=null && props.maTramSelected!==null){                        
                        fetch(URLAPI+'/APIKTGS/TRUPMIS?madvi='+props.maDonViSelected, {
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
                                let dataPMIS =res.filter(item=>((Math.abs(Number(item.latitude).toFixed(2)-Number(props.tram.toado.latitude).toFixed(2))<0.005) &&
                                    (Math.abs(Number(item.longitude).toFixed(2)-Number(props.tram.toado.longitude).toFixed(2))<0.005)));                                  
                                setListTruPmis(dataPMIS);      
                            } else {
                                
                            }                            
                        })
                        .catch((error) => {
                            //console.log("Error save point: " + error);
                        });

                    }
                    
                }}/>
                <Button id='buttonLuuTruTrungTheFromPMIS' onClick={()=>{
                    if(listTruPmisAdd!==null && listTruPmisAdd!==UndoRounded){
                        listTruPmisAdd.map(item=>{
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
                        setTimeout(()=>{
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

                        },5000);                      
                    }
                    
                }}/>
                <Button id='buttonHuyTruTrungTheFromPMIS' onClick={()=>{                    
                    setListTruPmis(null);
                    setListTruPmisAdd(null);
                }}/>
                <Button id='buttonHuyTimDuong' onClick={() => {
                    setDirectionResponse(null);
                }} />    
            </GoogleMap>
        </LoadScript >
    )
}
