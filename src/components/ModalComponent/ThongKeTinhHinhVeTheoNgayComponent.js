import React, { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';

export default function ThongKeTinhHinhVeTheoNgayComponent(props) {
    const data = props.data;

    return (
        <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
            <Table striped style={{ width: '100%', height: '100%' }} id="thongKeDanhSachTramTheoToaDo">
                <thead>
                    <tr >
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >STT</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Mã Đơn Vị</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Mã Trạm</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Trạng Thái</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Ngày Thay Đổi</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Người Thay Đổi</th>
                    </tr>
                </thead>
                <tbody id="tbodyBieu7">
                    {data !== null ?
                        <tr>
                            <td ></td>
                            <td colSpan="2">Tổng</td>
                            {/* <td ></td> */}
                            <td>{data.length}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        :
                        <tr>
                            <td>
                                Không có dữ liệu
                </td>
                        </tr>
                    }
                    {data !== null ?
                        data.map((item, index) =>
                            <tr>
                                <td >{index + 1}</td>
                                <td >{item.MA_DVIQLY}</td>
                                <td >{item.MA_TRAM}</td>
                                <td >{item.TRANG_THAI==='2'?'Đã Vẽ':item.TRANG_THAI==='1'?'Đang Vẽ':'Chưa Vẽ'}</td>
                                <td >{item.NGAY_SUA}</td>
                                <td >{item.NGUOI_SUA}</td>
                            </tr>
                        )
                        :
                        <tr>
                            <td>
                                Không có dữ liệu
                </td>
                        </tr>
                    }
                </tbody>
            </Table>
        </div>
    );
}


