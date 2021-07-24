import React, { useState } from 'react';
import {  Row,  FormGroup, Label, Input, Button } from 'reactstrap';

export default function ChangLocationByTypingComponent(props) {
    const [validateLng, setValidateLng] = useState(true);
    const [validateLat, setValidateLat] = useState(true);
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);


    return <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', width: '100%', height: 75, justifyContent: 'center', alignItems: 'center' }}>
            <Row>
                <FormGroup>
                    <Label for="exampleEmail">Kinh Độ (Longtiude) </Label>
                    <Input id="inputTypingLng" valid={validateLng} invalid={!validateLng} value={lng}
                        onChange={(e) => {
                            setLng(e.target.value);
                            if (/^[+-]?\d+(\.\d+)?$/.test(e.target.value)) {
                                setValidateLng(true);
                            } else {
                                setValidateLng(false);
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
                    <Input id="inputTypingLat" valid={validateLat} invalid={!validateLat} value={lat}
                        onChange={(e) => {
                            setLat(e.target.value);
                            if (/^[+-]?\d+(\.\d+)?$/.test(e.target.value)) {
                                setValidateLat(true);
                            } else {
                                setValidateLat(false);
                            }
                        }}
                    />
                </FormGroup>


            </Row>
        </div>
        {/* <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="primary" color="primary"
                onClick={() => {
                    if ((props.objectSelected.type === 'Tru' || props.objectSelected.type === 'KhachHang') && (document.getElementById("inputTypingLng").value !== '' && document.getElementById("inputTypingLat").value !== '')) {
                        props.functionSetPointCenter({ lng: Number(document.getElementById("inputTypingLng").value), lat: Number(document.getElementById("inputTypingLat").value) })
                        props.functionSetResultLocationTypingBox({ lng: Number(document.getElementById("inputTypingLng").value), lat: Number(document.getElementById("inputTypingLat").value) });
                    } else {
                        window.alert('Vui lòng chọn đối tượng và nhập địa chỉ để xem vị trí');
                    }
                }}
            >
                Xem Toạ Độ Hiện Tại
        </Button>
        </div> */}
        <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="primary" color="primary"
                    onClick={() => document.getElementById("buttonLuuChangeLocationByTypingObject").click()}
                >
                    Lưu Thông Tin
        </Button>
            </div>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="primary" color="primary"
                    onClick={() => document.getElementById("buttonLuuChangeLocationByTypingObject").click()}
                >
                    Hủy
        </Button>
            </div>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
        </div>
        <div>
        </div>
    </div>
}