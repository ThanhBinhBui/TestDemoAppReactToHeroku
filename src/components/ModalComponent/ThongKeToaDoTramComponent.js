import React, { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';

export default function TongKeTCCByCTYAndTCTComponent(props) {
    const data = props.data;

    return (
        <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
            <Table striped style={{ width: '100%', height: '100%' }} id="thongKeDanhSachTramTheoToaDo">
                <thead>
                    <tr >
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >STT</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Mã trạm</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Tên trạm</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Có tọa độ</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Không tọa độ</th>
                    </tr>
                </thead>
                <tbody id="tbodyBieu7">
                    {data !== null ?
                        <tr>
                            <td ></td>
                            <td colSpan="2">Tổng</td>
                            {/* <td ></td> */}
                            <td >{data.filter(item => item.toado !== null && item.toado.latitude !== '' && item.toado.longitude !== '' && item.toado.latitude !== 0 && item.toado.longitude !== 0).length}</td>
                            <td >{data.filter(item => item.toado === null || item.toado.latitude === '' || item.toado.longitude === '' || item.toado.latitude === 0 || item.toado.longitude === 0).length}</td>

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
                                <td >{item.mA_TRAM}</td>
                                <td >{item.teN_TRAM}</td>
                                <td >{item.toado === null || item.toado.latitude === '' || item.toado.longitude === '' || item.toado.latitude === 0 || item.toado.longitude === 0 ? '' : 'x'}</td>
                                <td >{item.toado === null || item.toado.latitude === '' || item.toado.longitude === '' || item.toado.latitude === 0 || item.toado.longitude === 0 ? 'x' : ''}</td>

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


