import React, { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';
import { URLAPI, URLAPI4001 } from '../../constants/UrlApi';

export default function ThongKeTCCByCTYAndTCTComponent(props) {
    const data = props.data;
    const maDonVi = props.maDonVi;
    const [listDonVi, setListDonVi] = useState(null);
    useEffect(() => {
        fetch(URLAPI4001+'/Api/SangTaiChuyenLuoi/getDonViCon?maDonVi=' + maDonVi)
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
    },[])
    const getName = v => {
        return listDonVi.find(item => item.MADONVI === v);
    }
    console.log('render in thong ke');
    return (
        <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
            <Table striped style={{ width: '100%', height: '100%' }} id="thongKeTramCCByCTYAndTCT">
                <thead>
                    <tr >
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tên đơn vị</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} rowSpan="2">Tổng trạm</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} colSpan="6">Số lượng bản vẽ trạm</th>

                    </tr>
                    <tr >
                        <th style={{ 'position': 'sticky', 'top': '50px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Chưa vẽ</th>
                        <th style={{ 'position': 'sticky', 'top': '50px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Tỉ lệ (%)</th>
                        <th style={{ 'position': 'sticky', 'top': '50px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Đang vẽ</th>
                        <th style={{ 'position': 'sticky', 'top': '50px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Tỉ lệ (%)</th>
                        <th style={{ 'position': 'sticky', 'top': '50px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }} >Đã vẽ</th>
                        <th style={{ 'position': 'sticky', 'top': '50px', 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center' }}>Tỉ lệ (%)</th>
                    </tr>
                </thead>
                <tbody id="tbodyBieu6">
                    {/* {dataBieu6Modal !== null ?
                  <tr>
                    <td ></td>
                    <td >Tổng</td>
                    <td ></td>
                    <td ></td>
                    <td >{dataBieu1Modal.filter(item => item.vE_SODO === '2').length}</td>
                    <td >{dataBieu1Modal.filter(item => item.vE_SODO === '1').length}</td>
                    <td >{dataBieu1Modal.filter(item => item.vE_SODO === '0').length}</td>
                    <td ></td>
                  </tr>
                  :
                  <tr>
                    <td>
                      Không có dữ liệu
                    </td>
                  </tr>
                } */}
                    {data !== null && listDonVi !== null ? data.map((item, index) => {
                        
                        // if (maDonVi === 'PB') {
                            if (item.MADONVI === 'TỔNG') {
                                return <tr>
                                    <td>TỔNG</td>
                                    <td>{item.TONGTRAM}</td>
                                    <td>{Number(item.TONGTRAM) - Number(item.DANGVE === null ? '0' : item.DANGVE) - Number(item.DAVE === null ? '0' : item.DAVE)}</td>
                                    <td> {(100 * (Number(item.TONGTRAM) - Number(item.DANGVE === null ? '0' : item.DANGVE) - Number(item.DAVE === null ? '0' : item.DAVE)) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                                    <td>{item.DANGVE === null ? '0' : item.DANGVE}</td>
                                    <td> {item.DANGVE === null ? '0.00' : (100 * Number(item.DANGVE) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                                    <td>{item.DAVE === null ? '0' : item.DAVE}</td>
                                    <td> {item.DAVE === null ? '0.00' : (100 * Number(item.DAVE) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                                </tr>
                            } else {
                                return <tr>
                                    <td>{listDonVi[index].TENDONVI}</td>
                                    <td>{item.TONGTRAM}</td>
                                    <td>{Number(item.TONGTRAM) - Number(item.DANGVE === null ? '0' : item.DANGVE) - Number(item.DAVE === null ? '0' : item.DAVE)}</td>
                                    <td> {(100 * (Number(item.TONGTRAM) - Number(item.DANGVE === null ? '0' : item.DANGVE) - Number(item.DAVE === null ? '0' : item.DAVE)) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                                    <td>{item.DANGVE === null ? '0' : item.DANGVE}</td>
                                    <td> {item.DANGVE === null ? '0.00' : (100 * Number(item.DANGVE) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                                    <td>{item.DAVE === null ? '0' : item.DAVE}</td>
                                    <td> {item.DAVE === null ? '0.00' : (100 * Number(item.DAVE) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                                </tr>
                            }
                        // } 
                        // else {
                        //     if (index === 0) {
                        //         return null;
                        //     } else {
                        //         if (item.MADONVI === 'TỔNG') {
                        //             return <tr>
                        //                 <td>TỔNG</td>
                        //                 <td>{item.TONGTRAM}</td>
                        //                 <td>{Number(item.TONGTRAM) - Number(item.DANGVE === null ? '0' : item.DANGVE) - Number(item.DAVE === null ? '0' : item.DAVE)}</td>
                        //                 <td> {(100 * (Number(item.TONGTRAM) - Number(item.DANGVE === null ? '0' : item.DANGVE) - Number(item.DAVE === null ? '0' : item.DAVE)) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                        //                 <td>{item.DANGVE === null ? '0' : item.DANGVE}</td>
                        //                 <td> {item.DANGVE === null ? '0.00' : (100 * Number(item.DANGVE) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                        //                 <td>{item.DAVE === null ? '0' : item.DAVE}</td>
                        //                 <td> {item.DAVE === null ? '0.00' : (100 * Number(item.DAVE) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                        //             </tr>
                        //         } else {
                        //             if(item.MADONVI.length===4){

                        //             }
                        //             return <tr>
                        //                 <td>{listDonVi[index - 1].TENDONVI}</td>
                        //                 <td>{item.TONGTRAM}</td>
                        //                 <td>{Number(item.TONGTRAM) - Number(item.DANGVE === null ? '0' : item.DANGVE) - Number(item.DAVE === null ? '0' : item.DAVE)}</td>
                        //                 <td> {(100 * (Number(item.TONGTRAM) - Number(item.DANGVE === null ? '0' : item.DANGVE) - Number(item.DAVE === null ? '0' : item.DAVE)) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                        //                 <td>{item.DANGVE === null ? '0' : item.DANGVE}</td>
                        //                 <td> {item.DANGVE === null ? '0.00' : (100 * Number(item.DANGVE) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                        //                 <td>{item.DAVE === null ? '0' : item.DAVE}</td>
                        //                 <td> {item.DAVE === null ? '0.00' : (100 * Number(item.DAVE) / Number(item.TONGTRAM)).toFixed(2)}(%)</td>
                        //             </tr>
                        //         }
                        //     }
                        // }


                    }

                    )
                        :
                        null
                    }

                </tbody>
            </Table>
        </div>

    );
}


