import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';

export default function ViewInfoLineComponent(props) {
    const [validateMaDonViQuanLy, setValidateMaDonViQuanLy] = useState(true);
    const [validateTenLine, setValidateTenLine] = useState(true);
    const [validateTram, setValidateTram] = useState(true);
    const [validateLngX, setValidateLngX] = useState(true);
    const [validateLatX, setValidateLatX] = useState(true);
    const [validateLngY, setValidateLngY] = useState(true);
    const [validateLatY, setValidateLatY] = useState(true);
    const [maDonViQuanLy, setMaDonViQuanLy] = useState(props.objectSelected.object.mA_DVIQLY);
    const [tenLine, setTenLine] = useState(props.objectSelected.object.namE_E);
    const [tram, setTram] = useState(props.objectSelected.object.mA_TRAM);
    const [lngX, setLngX] = useState(props.objectSelected.object.logitudE_X);
    const [latX, setLatX] = useState(props.objectSelected.object.latitudE_X);
    const [lngY, setLngY] = useState(props.objectSelected.object.logitudE_Y);
    const [latY, setLatY] = useState(props.objectSelected.object.latitudE_Y);

   

    return <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height:525,justifyContent: 'center', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>


            <FormGroup>
                <Label for="exampleEmail">Mã đơn vị quản lý</Label>
                <Input valid={validateMaDonViQuanLy} invalid={!validateMaDonViQuanLy} value={maDonViQuanLy}
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
                    <Label for="exampleEmail">Tên dường </Label>
                    <Input  valid={validateTenLine} invalid={!validateTenLine} value={tenLine}
                        onChange={(e) => {
                            setTenLine(e.target.value);

                            if (e.target.value === '' || e.target.value === null) {
                                setValidateTenLine(false);
                            } else {
                                setValidateTenLine(true);
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
                    <Input valid={validateTram} invalid={!validateTram} value={tram}
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
                    <Label for="exampleEmail">Kinh độ X (Longitude)</Label>
                    <Input valid={validateLngX} invalid={!validateLngX} value={lngX}
                        onChange={(e) => {
                            setLngX(e.target.value);

                            if (e.target.value === '' || e.target.value === null) {
                                setValidateLngX(false);
                            } else {
                                setValidateLngX(true);
                            }
                        }}
                    />
                </FormGroup>
            </Row>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>
                <FormGroup>
                    <Label for="exampleEmail">Vĩ Độ X (Latitude) </Label>
                    <Input valid={validateLatX} invalid={!validateLatX} value={latX}
                        onChange={(e) => {
                            setLatX(e.target.value);
                            if (e.target.value === '' || e.target.value === null) {
                                setValidateLatX(false);
                            } else {
                                setValidateLatX(true);
                            }
                        }}
                    />
                </FormGroup>


            </Row>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>

                <FormGroup>
                    <Label for="exampleEmail">Kinh độ Y (Longitude) </Label>
                    <Input valid={validateLngY} invalid={!validateLngY} value={lngY}
                        onChange={(e) => {
                            setLngY(e.target.value);

                            if (e.target.value === '' || e.target.value === null) {
                                setValidateLngY(false);
                            } else {
                                setValidateLngY(true);
                            }
                        }}
                    />
                </FormGroup>
            </Row>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>
                <FormGroup>
                    <Label for="exampleEmail">Vĩ Độ Y (Latitude) </Label>
                    <Input valid={validateLatY} invalid={!validateLatY} value={latY}
                        onChange={(e) => {
                            setLatY(e.target.value);
                            if (e.target.value === '' || e.target.value === null) {
                                setValidateLatY(false);
                            } else {
                                setValidateLatY(true);
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