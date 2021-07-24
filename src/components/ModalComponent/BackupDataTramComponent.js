// import React, { useEffect, useState } from 'react';
// import { Button, Table, Input } from 'reactstrap';
// import { URLAPI } from '../../constants/UrlApi';

// export default function BackupDataTramComponent(props) {
//     // const data = props.data;
//     const maDonVi = props.maDonVi;
//     const tramCurrent = props.tramCurrent;
//     const listTru = props.listTru;
//     const listLine = props.listLine;
//     const listKhachHang = props.listKhachHang;
    
//     

//     const getName = v => {
//         return listDonVi.find(item => item.mA_DVIQLY === v) !== undefined ? listDonVi.find(item => item.mA_DVIQLY === v).teN_DVIQLY : '';
//     }
//     console.log('render in thong ke');
   
//     return (
//         <div>
//             <div style={{ display: 'flex', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
//                 <Input valid={textSearch === null ? false : true} invalid={textSearch === null ? true : false}
//                     onChange={(v) => {
//                         setTextSearch(v.target.value);
//                     }} />
//             </div>
//             <Table>
//                 <thead>
//                     <tr >
//                         <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 53 }}>Mã Đơn Vị</th>
//                         <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 79 }}>Mã Trạm</th>
//                         <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 230 }}>Mã Đối Tượng</th>
//                         <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 180 }}>Tên Đối Tượng</th>
//                         <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 180 }}>Kinh Độ</th>
//                         <th style={{ 'position': 'sticky', 'top': 0, 'background': '#4999B1', 'color': 'white', 'vertical-align': 'middle', 'text-align': 'center', width: 180 }}>Vĩ Độ</th>
//                     </tr>
//                 </thead>
//             </Table>
//             <div style={{ height: '600px', overflowY: 'auto' }} className="table-resposive">
//                 <Table striped style={{ width: '100%', height: '100%' }} id="thongKeTramCCByCTYAndTCT">
//                     <tbody id="tbodyBieu6">
//                         {listKhachHang.map(item=>{

//                         })}
//                         {listUser !== null && listDonVi !== null ? listUser.map((item, index) => {
//                             
//                             // if (maDonVi === 'PB') {
//                             if (item.role !== '1') {
//                                 const nameDonVi = getName(item.mA_DVIQLY);
//                                 return <tr>
//                                     <td align='center' style={{ width: 53 }}> </td>
//                                     <td style={{ width: 79 }}>{item.mA_DVIQLY}</td>
//                                     <td style={{ width: 230 }}>{nameDonVi}</td>
//                                     <td style={{ width: 180 }}>{item.username}</td>
//                                     <td style={{ width: 180 }}>{item.fullname}</td>
//                                 </tr>
//                             }
//                         }
//                         )
//                             :
//                             null
//                         }

//                     </tbody>
//                 </Table>
//             </div>

//         </div>
//     );
// }


