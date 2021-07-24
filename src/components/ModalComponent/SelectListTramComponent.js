import React, { useEffect, useState } from 'react';
import { Button, Table, Input } from 'reactstrap';


export default function SelectListTramComponent(props) {
    const data = props.data;
    const [textSearch, setTextSearch] = useState(null);
    const [listMaTram, setListMaTram] = useState(null);
    const dataCurrent = textSearch === '' || textSearch === null ? data : data.filter(i => i.mA_TRAM.includes(textSearch) || i.teN_TRAM.includes(textSearch))    
    
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
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 53 }} >Xem</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 110 }} >Mã trạm</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 213 }} >Tên trạm</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 186 }} >Kinh độ (longitude)</th>
                        <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 187 }} >Vĩ độ (latitude)</th>
                    </tr>
                </thead>
            </Table>
            <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
                <Table striped style={{ width: '100%', height: '100%' }} >
                    <tbody >
                        {dataCurrent !== null && dataCurrent !== [] ?
                            dataCurrent.map((item, index) => {                                

                                return <tr>
                                    <td align='center' style={{ width: 53 }}>
                                        <Input type="checkbox" style={{ display: 'flex', position: 'relative', zIndex: 0 }}
                                            onChange={(e) => {
                                                
                                                if (e.target.checked) {
                                                    if (listMaTram !== null && listMaTram !== []) {
                                                        setListMaTram([...listMaTram, item]);
                                                    } else {
                                                        setListMaTram([item]);
                                                        // setListMaTram([...listMaTram, item]);
                                                    }
                                                } else {
                                                    if (listMaTram.length === 1) {
                                                        setListMaTram(null);
                                                    } else {
                                                        setListMaTram(listMaTram.filter(i => i.mA_TRAM !== item.mA_TRAM));
                                                    }
                                                }
                                            }}
                                            checked={listMaTram !== null && listMaTram.filter(i => i.mA_TRAM === item.mA_TRAM).length !== 0 ? true : false}
                                        /></td>
                                    <td style={{ width: 110 }}>{item.mA_TRAM}</td>
                                    <td style={{ width: 213 }}>{item.teN_TRAM}</td>
                                    <td style={{ width: 186 }}>{item.toado === null || item.toado.longitude === '' || item.toado.longitude === 0 ? '' : item.toado.longitude}</td>
                                    <td style={{ width: 187 }}>{item.toado === null || item.toado.latitude === '' || item.toado.latitude === 0 ? '' : item.toado.latitude}</td>
                                </tr>
                            }
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
            <div style={{ display: 'none' }}>
                <Button id='buttonXemDuLieuMultiTram' onClick={() => {
                    props.setListTramCurrent(listMaTram);
                }} />
            </div>

        </div>
    );
}


