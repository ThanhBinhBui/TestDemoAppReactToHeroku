import React, { useEffect, useState } from 'react';
import { Button, Table, Input } from 'reactstrap';
import { URLAPI } from '../../constants/UrlApi';

export default function AddRoleDrawerComponent(props) {
    // const data = props.data;
    const maDonVi = props.maDonVi;
    const [listDonVi, setListDonVi] = useState(null);
    const [listUser, setListUser] = useState(null);
    const [textSearch, setTextSearch] = useState(null);
    const getListUser=()=>{
        fetch(URLAPI+'/APIKTGS/USERS?madvi=' + maDonVi)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return null;
            })
            .then((res) => {
                if (res !== null) {
                    setListUser(res);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    useEffect(() => {
        fetch(URLAPI+'/APIKTGS/USERS?madvi=' + maDonVi)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return null;
            })
            .then((res) => {
                if (res !== null) {
                    setListUser(res);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        fetch(URLAPI+'/APIKTGS/Dvi?madvi=' + maDonVi)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return null;
            })
            .then((res) => {
                if (res !== null) {
                    setListDonVi(res);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [])
    const getName = v => {
        return listDonVi.find(item => item.mA_DVIQLY === v) !== undefined ? listDonVi.find(item => item.mA_DVIQLY === v).teN_DVIQLY : '';
    }
    const changeRole = (maDonVi, userId, username, role) => {        
        fetch(URLAPI+'/APIKTGS/USERS/setRole', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "MA_DVIQLY": maDonVi,
                "USERID": userId,
                "USERNAME": username,
                "ROLE": role
            })
        })
            .then(response => {
                if (response.status === 200) {
                    getListUser();
                }
                return null;
            })
    }
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
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 53 }} >Quyền vẽ</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 79 }} >Mã đơn vị</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 230 }} >Tên đơn vị</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 180 }} >Tài khoản</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 180 }} >Tên tài khoản</th>
                    </tr>
                </thead>
            </Table>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">

                <Table striped style={{ width: '100%', height: '100%' }} id="thongKeTramCCByCTYAndTCT">

                    <tbody id="tbodyBieu6">
                        {listUser !== null && listDonVi !== null ? listUser.map((item, index) => {
                            
                            // if (maDonVi === 'PB') {
                            if (item.role !== '1') {
                                const nameDonVi = getName(item.mA_DVIQLY);
                                return <tr>
                                    <td align='center' style={{ width: 53 }}>
                                        <Input type="checkbox" style={{ display: 'flex', position: 'relative', zIndex: 0 }}
                                            onChange={(e) => {
                                                
                                                if (e.target.checked) {
                                                    changeRole(item.mA_DVIQLY, item.userid, item.username, '2');
                                                    item.rolename='DRAW';
                                                } else {
                                                    changeRole(item.mA_DVIQLY, item.userid, item.username, '0');
                                                    item.rolename='READ';
                                                }
                                            }}
                                            // value={item.rolename === 'DRAW' ? true : false}
                                            checked={item.rolename === 'DRAW' ? true : false}
                                        /></td>
                                    <td style={{ width: 79 }}>{item.mA_DVIQLY}</td>
                                    <td style={{ width: 230 }}>{nameDonVi}</td>
                                    <td style={{ width: 180 }}>{item.username}</td>
                                    <td style={{ width: 180 }}>{item.fullname}</td>
                                </tr>
                            }
                        }
                        )
                            :
                            null
                        }

                    </tbody>
                </Table>
            </div>

        </div>
    );
}


