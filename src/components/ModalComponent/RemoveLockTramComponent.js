import { ContactsOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Button, Table, Input } from 'reactstrap';
import { URLAPI, URLAPI4001 } from '../../constants/UrlApi';

export default function RemoveLockTramComponent(props) {
    // const data = props.data;
    const maDonVi = props.maDonVi;
    const [listDonVi, setListDonVi] = useState(null);
    const [listUser, setListUser] = useState(null);
    const [textSearch, setTextSearch] = useState(null);
    const [listLog, setListLog] = useState(null);

    useEffect(() => {
        fetch(URLAPI4001 + `/Api/SangTaiChuyenLuoi/getAllLockTram?maDonVi=${maDonVi}`)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return null;
            })
            .then((res) => {
                if (res !== null) {
                    setListLog(res);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [])
    console.log('render remove log');
    console.log(listLog);
    return (
        <div>
            <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
                <Input valid={textSearch === null ? false : true} invalid={textSearch === null ? true : false}
                    onChange={(v) => {
                        setTextSearch(v.target.value);
                    }} />
            </div>
            <Table>
                <thead>
                    <tr >
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 53 }} ></th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 79 }} >Mã Đơn Vị</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 230 }} >Mã Trạm</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 180 }} >Ngày Tạo</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 180 }} >Người Tạo</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 180 }} >Ngày Sửa</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 180 }} >Người Sửa</th>
                    </tr>
                </thead>
            </Table>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">

                <Table striped style={{ width: '100%', height: '100%' }} >

                    <tbody >
                        {listLog !== null && listLog.lengh !== 0 ? listLog.map((item) => {
                            if (textSearch === null) {
                                return <tr>
                                    <td onClick={() => {
                                        fetch(URLAPI4001 + `/Api/SangTaiChuyenLuoi/deleteLockTram?maTram=${item.MA_TRAM}`, {
                                            method: 'POST'
                                        })
                                            .then((response) => {
                                                if (response.status === 200) {

                                                    return response.json();
                                                }
                                                return null;
                                            })
                                            .then((res) => {
                                                debugger
                                                if (res === 'SUCCESS') {

                                                    setListLog(listLog.filter(i => i.MA_TRAM !== item.MA_TRAM));
                                                    alert('Xóa thành công trạng thái khóa trạm ' + item.MA_TRAM)
                                                }
                                            })
                                            .catch((error) => {
                                                console.error(error);
                                            });
                                    }}><a href="#" >Xóa</a></td>
                                    <td>{item.MA_DVIQLY}</td>
                                    <td>{item.MA_TRAM}</td>
                                    <td>{item.NGAY_TAO}</td>
                                    <td>{item.NGUOI_TAO}</td>
                                    <td>{item.NGAY_SUA}</td>
                                    <td>{item.NGUOI_SUA}</td>
                                </tr>
                            } else {
                                if (item.MA_TRAM.includes(textSearch)
                                    || item.NGAY_SUA.includes(textSearch)
                                    || item.NGUOI_SUA.includes(textSearch)
                                    || item.NGAY_TAO.includes(textSearch)
                                    || item.NGUOI_TAO.includes(textSearch)
                                    || item.MA_DVIQLY.includes(textSearch)) {
                                    return <tr>
                                        <td onClick={() => {
                                            fetch(URLAPI4001 + `/Api/SangTaiChuyenLuoi/deleteLockTram?maTram=${item.MA_TRAM}`, {
                                                method: 'POST'
                                            })
                                                .then((response) => {
                                                    if (response.status === 200) {

                                                        return response.json();
                                                    }
                                                    return null;
                                                })
                                                .then((res) => {
                                                    debugger
                                                    if (res === 'SUCCESS') {

                                                        setListLog(listLog.filter(i => i.MA_TRAM !== item.MA_TRAM));
                                                        alert('Xóa thành công trạng thái khóa trạm ' + item.MA_TRAM)
                                                    }
                                                })
                                                .catch((error) => {
                                                    console.error(error);
                                                });
                                        }}><a href="#">Xóa</a></td>
                                        <td>{item.MA_DVIQLY}</td>
                                        <td>{item.MA_TRAM}</td>
                                        <td>{item.NGAY_TAO}</td>
                                        <td>{item.NGUOI_TAO}</td>
                                        <td>{item.NGAY_SUA}</td>
                                        <td>{item.NGUOI_SUA}</td>
                                    </tr>
                                }
                            }

                        }) : null}
                    </tbody>
                </Table>
            </div>

        </div>
    );
}


