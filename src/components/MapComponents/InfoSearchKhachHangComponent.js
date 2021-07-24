import React, { useEffect, useState } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import XLSX from 'xlsx';
import MauCapNhatKH from '../../asset/FileExcelTemplate/MauCapNhatKH.xlsx';
import MauCapNhatTru from '../../asset/FileExcelTemplate/MauCapNhatTru.xlsx';
import { Button } from 'reactstrap';
import { render } from '@testing-library/react';

export default function InfoSearchKhachHangComponent(props) {
    const item = props.item;
    return <div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <h3>Thông Tin Khách Hàng</h3>
        </div>
        <h4>Mã Trạm: {item.MA_TRAM}</h4>
        <h4>KH: {item.TEN_KHANG}</h4>
        <h6>Mã KH: {item.MA_KHANG}</h6>
        <h6>Mã DD: {item.MA_DDO}</h6>
        <h6>ĐC: {item.SO_NHA + item.DUONG_PHO}</h6>
        <h6>Danh số: {item.DOANH_SO}</h6>        
        <h6>Áp giá: {item.CHUOI_GIA}</h6>
        <h6>Số hộ: {item.SO_HO}</h6>       
        <h6>Mã sổ ghi điện {item.MA_SOGCS}</h6>
        <h6>Số No: {item.SO_TBI}</h6>
        <h6>Điện thoại liên hệ: {item.DTHOAI}</h6>
        <h6>Chủng loại công tơ: {item.LOAI_CTO}</h6>
        <h6>Chủng loại công tơ: {item.MA_CLOAI}</h6>      
        <h6>Tọa độ: (lng: '{item.LONGITUDE}',lat:'{item.LATITUDE}')</h6>
    </div>

}


