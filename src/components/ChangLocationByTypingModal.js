import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import { URLAPI } from '../constants/UrlApi';

export default function ChangLocationByTypingModal(props) {
    const [validateLng, setValidateLng] = useState(true);
    const [validateLat, setValidateLat] = useState(true);
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);

    const patt = new RegExp("/^[+-]?\d+(\.\d+)?$/");

    return <Modal isOpen={props.isOpen}>
        <ModalHeader>
            Thay đổi vị trí khách hàng {props.objectSelected.type === 'KhachHang' ? props.objectSelected.object.mA_KHANG : null} bằng tọa dộ
        </ModalHeader>
        <ModalBody>
            {(props.objectSelected.type === 'KhachHang' && props.objectSelected.object != null) ?
                <Row>
                    <Col>
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
                    </Col>
                    <Col>
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
                    </Col>
                </Row>
                :
                null
            }
            <Row>
            </Row>
        </ModalBody>
        <ModalFooter>
            {/* <Button variant="primary" onClick={() => {
                alert('show');
                if ((props.objectSelected.type === 'Tru' || props.objectSelected.type === 'KhachHang') && (document.getElementById("inputTypingLng").value !== '' && document.getElementById("inputTypingLat").value !== '')) {
                    props.functionSetPointCenter({ lng: Number(document.getElementById("inputTypingLng").value), lat: Number(document.getElementById("inputTypingLat").value) })
                    props.functionSetLocationChange({ lng: Number(document.getElementById("inputTypingLng").value), lat: Number(document.getElementById("inputTypingLat").value) });
                } else {
                    window.alert('Vui lòng chọn đối tượng và nhập địa chỉ để xem vị trí');
                }


            }}>
                Xem Tọa Độ Hiện Tại
        </Button> */}

            <Button variant="primary" onClick={() => {
                if (props.objectSelected.type === 'KhachHang') {
                    fetch(URLAPI+'/APIKTGS/KHANG/updateToaDo', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',

                        },
                        body: JSON.stringify({
                            "MA_DVIQLY": props.objectSelected.object.mA_KHANG.slice(0, 6),
                            "MA_DDO": props.objectSelected.object.mA_DDO,
                            "TOA_DO": { "LONGITUDE": document.getElementById("inputTypingLng").value, "LATITUDE": document.getElementById("inputTypingLat").value }
                        })
                    })
                        .then(response => {

                            props.functionSetOpenChangeLocationModal(false);
                            props.functionSetTMPLocationAfterSave();

                            return response;
                        })
                        .catch((error) => {
                            //console.log("Error: " + error);
                        });
                } else if (props.objectSelected.type === 'Trụ') {

                }

            }} >
                Lưu Thông Tin
        </Button>
            <Button variant="primary" onClick={() => props.functionSetOpenChangeLocationModal(false)}>
                Hủy
        </Button>
        </ModalFooter>
    </Modal>
}