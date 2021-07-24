import React, { useState } from 'react';
import {  Row, FormGroup, Label, Input } from 'reactstrap';

export default function ViewInfoKhachHangComponent(props) {
    const [validateMaKhachHang, setValidateMaKhachHang] = useState(true);
    const [validateTenKhachHang, setValidateTenKhachHang] = useState(true);
    const [validateDiaChi, setValidateDiaChi] = useState(true);
    const [validateLng, setValidateLng] = useState(true);
    const [validateLat, setValidateLat] = useState(true);
    const [maKhachHang, setMaKhachHang] = useState(props.objectSelected.object.mA_KHANG);
    const [tenKhachHang, setTenKhachHang] = useState(props.objectSelected.object.teN_KHANG);
    const [diaChi, setDiaChi] = useState(props.objectSelected.object.sO_NHA + " " + props.objectSelected.object.duonG_PHO);
    const [lng, setLng] = useState(props.objectSelected.object.toA_DO.longitude);
    const [lat, setLat] = useState(props.objectSelected.object.toA_DO.latitude);

    return <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 375, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <FormGroup>
                <Label for="exampleEmail">Mã Khách Hàng </Label>
                <Input valid={validateMaKhachHang} invalid={!validateMaKhachHang} value={maKhachHang}
                    onChange={(e) => {
                        setMaKhachHang(e.target.value);
                        if (e.target.value === '' || e.target.value === null) {
                            setValidateMaKhachHang(false);
                        } else {
                            setValidateMaKhachHang(true);
                        }
                    }}
                />
            </FormGroup>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>

                <FormGroup>
                    <Label for="exampleEmail">Tên Khách Hàng </Label>
                    <Input valid={validateTenKhachHang} invalid={!validateTenKhachHang} value={tenKhachHang}
                        onChange={(e) => {
                            setTenKhachHang(e.target.value);

                            if (e.target.value === '' || e.target.value === null) {
                                setValidateTenKhachHang(false);
                            } else {
                                setValidateTenKhachHang(true);
                            }
                        }}
                    />
                </FormGroup>
            </Row>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>

                <FormGroup>
                    <Label for="exampleEmail">Địa chỉ</Label>
                    <Input valid={validateDiaChi} invalid={!validateDiaChi} value={diaChi}
                        onChange={(e) => {
                            setDiaChi(e.target.value);
                            if (e.target.value === '' || e.target.value === null) {
                                setValidateDiaChi(false);
                            } else {
                                setValidateDiaChi(true);
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
                    <Input valid={validateLng} invalid={!validateLng} value={lng}
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
        <div>
        </div>
    </div>
}