import React, { useEffect, useState } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import XLSX from 'xlsx';
import MauCapNhatKH from '../../asset/FileExcelTemplate/MauCapNhatKH.xlsx';
import MauCapNhatTru from '../../asset/FileExcelTemplate/MauCapNhatTru.xlsx';
import { Button } from 'reactstrap';
import { render } from '@testing-library/react';

export default function InfoKhachHangComponent(props) {
    const item = props.item;
    const maTram = props.maTramSelected;
    const tenTram = props.tenTramSelected; 
    const soTru = props.soTru;
    const [flag, setFlag] = useState(true);  

    debugger;
    return <div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Button variant="primary" onClick={() => {
                setFlag(!flag);
            }}> {flag ? 'Xem sản lượng' : 'Xem thông tin'}</Button>
        </div>
        {flag ?
            <>             
                <h4>Mã Trạm: {maTram}</h4>
                <h4>Tên Trạm: {tenTram}</h4>
                <h4>KH: {item.teN_KHANG}</h4>
                <h6>Mã KH: {item.mA_KHANG}</h6>
                <h6>ĐC: {item.sO_NHA + item.duonG_PHO}</h6>
                <h6>Số No: {item.sO_TBI}</h6>
                <h6>Danh số: {item.doanH_SO}</h6>
                <h6>Vị trí treo: {item.vtrI_TREO}</h6>
                <h6>Tọa độ: (lng: '{item.toA_DO.longitude}',lat:'{item.toA_DO.latitude}')</h6>
                <h6>Số Trụ: {soTru}</h6>
            </>
            :
            <>
                <h4>KH: {item.teN_KHANG}</h4>
                {item.dieN_TTHU !== null ? item.dieN_TTHU.map(i => {
                    return <h4>Tháng {i.thang}/{i.nam}: {i.dieN_TTHU} (kWh)</h4>
                }) : null}
                <h6>Áp giá: {item.chuoI_GIA}</h6>
                <h6>Mã sổ ghi điện {item.mA_SOGCS}</h6>
                <h6>Điện thoại liên hệ: {item.dieN_THOAI}</h6>
                <h6>Chủng loại công tơ: {item.loaI_CTO}</h6>
                <h6>Số hộ: {item.sO_HO}</h6>
                {item.chI_SO_MOI !== null && item.chI_SO_MOI !== undefined && item.chI_SO_MOI.length !== 0 ? <>
                    <h6>Kỳ: {item.chI_SO_MOI[0].ky}</h6>
                    <h6>Tháng: {item.chI_SO_MOI[0].thang}/{item.chI_SO_MOI[0].nam} </h6>
                    <h6>Bộ chỉ số: {item.chI_SO_MOI[0].bcs}</h6>
                    <h6>Ngày ghi điện: {item.chI_SO_MOI[0].ngaY_GHIDIEN}</h6>
                    <h6 style={{ fontWeight: 'bold' }}>Chỉ số mới: {item.chI_SO_MOI[0].chisO_MOI} </h6>
                </> : null}


            </>
        }
    </div>

}


