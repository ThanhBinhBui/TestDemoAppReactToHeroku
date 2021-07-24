import { ContactsOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Button, Table, Input } from 'reactstrap';
import { URLAPI, URLAPI4001 } from '../../constants/UrlApi';

export default function SelectCustomerLostPowerComponent(props) {
    // const data = props.data;
    const data = props.data;
    const dataFix = props.dataFix;
    const [listDonVi, setListDonVi] = useState(null);
    const [listUser, setListUser] = useState(null);
    const [textSearch, setTextSearch] = useState(null);
    const [listLog, setListLog] = useState(null);

    const convertStringToDate = (s) => {
        if (s !== null && s !== undefined) {
            const tmp = new Date(s);
            return tmp.toLocaleString();
        } else {
            return '';
        }

    };

    console.log('render remove log');
    console.log(data);
    console.log(dataFix);
    console.log(data.filter(i => !dataFix.includes(i.maKhachHang)));

    return (
        <div>
            <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
                <Input valid={textSearch === null ? false : true} invalid={textSearch === null ? true : false}
                    onChange={(v) => {
                        setTextSearch(v.target.value);
                    }} />
            </div>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">

                <Table striped style={{ width: '100%', height: '100%' }} >
                    <thead>
                        <tr >
                            <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} ></th>
                            {/* <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Mã Đơn Vị</th> */}
                            <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Mã Khách Hàng</th>
                            <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Tên Khách Hàng</th>
                            <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Tên Người Yêu Cầu</th>
                            <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Ngày Tạo</th>
                        </tr>
                    </thead>
                    <tbody >
                        {data !== null && data.length !== 0 ? data.map((item) => {
                            if (textSearch === null) {
                                return <tr>
                                    <td onClick={() => {
                                        props.setCustomerLostPowerSelected(item.MaPE + '001');
                                        props.setOpen(false);
                                        props.setShowModalLoading(true);
                                    }}><a href="#" >Xem</a></td>
                                    <td>{item.MaPE}</td>
                                    <td>{item.TenKH}</td>
                                    <td>{item.TenNguoiYeuCau}</td>
                                    {/* <td>{convertStringToDate(item.ngayYeuCau)}</td> */}
                                    <td>{convertStringToDate(item.NgayTao)}</td>
                                </tr>
                            } else {
                                if (item.MaPE.includes(textSearch)
                                    || item.TenKH.includes(textSearch)
                                    || item.TenNguoiYeuCau.includes(textSearch)
                                    || item.NgayTao.includes(textSearch)) {
                                    return <tr>
                                        <td onClick={() => {
                                            props.setCustomerLostPowerSelected(item.MaPE + '001');
                                            props.setOpen(false);
                                            props.setShowModalLoading(true);
                                        }}><a href="#">Xem</a></td>
                                        <td>{item.MaPE}</td>
                                        <td>{item.TenKH}</td>
                                        <td>{item.TenNguoiYeuCau}</td>
                                        <td>{convertStringToDate(item.NgayTao)}</td>
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


