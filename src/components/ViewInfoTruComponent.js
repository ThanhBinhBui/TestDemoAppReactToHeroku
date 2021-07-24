import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';

export default function ViewInfoTruComponent(props) {    
    const [validateMaDonViQuanLy, setValidateMaDonViQuanLy] = useState(true);
    const [validateTenTru, setValidateTenTru] = useState(true);
    const [validateTram, setValidateTram] = useState(true);
    const [validateLng, setValidateLng] = useState(true);
    const [validateLat, setValidateLat] = useState(true);
    const [maDonViQuanLy, setMaDonViQuanLy] = useState(props.objectSelected.object.mA_DVIQLY);
    const [tenTru, setTenTru] = useState(props.objectSelected.object.namE_E);
    const [tram, setTram] = useState(props.objectSelected.object.mA_TRAM);
    const [lng, setLng] = useState(props.objectSelected.object.longitude);
    const [lat, setLat] = useState(props.objectSelected.object.latitude);   

    return <div style={{ display: 'flex', flexDirection: 'column', width: '100%',height:375, justifyContent: 'center', alignItems: 'center' }}>        
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <FormGroup>
                <Label for="exampleEmail">Mã đơn vị quản lý</Label>
                <Input  valid={validateMaDonViQuanLy} invalid={!validateMaDonViQuanLy} value={maDonViQuanLy}
                    onChange={(e) => {
                        setMaDonViQuanLy(e.target.value);
                        if (e.target.value === '' || e.target.value === null) {
                            setValidateMaDonViQuanLy(false);
                        } else {
                            setValidateMaDonViQuanLy(true);
                        }
                    }}
                />
            </FormGroup>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>

                <FormGroup>
                    <Label for="exampleEmail">Tên trụ </Label>
                    <Input valid={validateTenTru} invalid={!validateTenTru} value={tenTru}
                        onChange={(e) => {
                            setTenTru(e.target.value);

                            if (e.target.value === '' || e.target.value === null) {
                                setValidateTenTru(false);
                            } else {
                                setValidateTenTru(true);
                            }
                        }}
                    />
                </FormGroup>
            </Row>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>

                <FormGroup>
                    <Label for="exampleEmail">Trạm</Label>
                    <Input  valid={validateTram} invalid={!validateTram} value={tram}
                        onChange={(e) => {
                            setTram(e.target.value);

                            if (e.target.value === '' || e.target.value === null) {
                                setValidateTram(false);
                            } else {
                                setValidateTram(true);
                            }
                        }}
                    />
                </FormGroup>
            </Row>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>

                <FormGroup>
                    <Label for="exampleEmail">Kinh độ (Longitude) </Label>
                    <Input  valid={validateLng} invalid={!validateLng} value={lng}
                        onChange={(e) => {
                            setLng(e.target.value);

                            if (e.target.value === '' || e.target.value === null) {
                                setValidateLng(false);
                            } else {
                                setValidateLng(true);
                            }
                        }}
                    />
                </FormGroup>
            </Row>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>
                <FormGroup>
                    <Label for="exampleEmail">Vĩ Độ (Latitude) </Label>
                    <Input valid={validateLat} invalid={!validateLat} value={lat}
                        onChange={(e) => {
                            setLat(e.target.value);
                            if (e.target.value === '' || e.target.value === null) {
                                setValidateLat(false);
                            } else {
                                setValidateLat(true);
                            }
                        }}
                    />
                </FormGroup>


            </Row>
        </div>
        {/* <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="primary"
                onClick={() => {
                    props.functionSetPointCenter({ lng: Number(document.getElementById("inputTypingLng").value), lat: Number(document.getElementById("inputTypingLat").value) })
                    props.functionSetResultLocationTypingBox({ lng: Number(document.getElementById("inputTypingLng").value), lat: Number(document.getElementById("inputTypingLat").value) });

                }}
            >
                Xem Tạo Độ Hiện Tại
        </Button>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="primary"
                    onClick={() => document.getElementById("buttonLuuChangeLocationByTypingObject").click()}
                >
                    Lưu Thông Tin
        </Button>
            </div>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="primary"
                    onClick={() => document.getElementById("buttonLuuChangeLocationByTypingObject").click()}
                >
                    Hủy
        </Button>
            </div>
        </div> */}

        


    </div>
}