import React, { useEffect, useState } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import XLSX from 'xlsx';
import MauCapNhatKH from '../../asset/FileExcelTemplate/MauCapNhatKH.xlsx';
import MauCapNhatTru from '../../asset/FileExcelTemplate/MauCapNhatTru.xlsx';
import { Button } from 'reactstrap';
import { render } from '@testing-library/react';
import { URLAPI } from '../../constants/UrlApi';

export default function InfoTramComponent(props) {
    const item = props.tram;
    const maDonViSelected = props.maDonViSelected;
    const soTru = props.soTru;
    const [flag, setFlag] = useState(true);
    const [maSoGCS, setMaSoGCS] = useState(null);
    const [ngayGhiDien, setNgayGhiDien] = useState(null)

    useEffect(() => {
        fetch(URLAPI+'/APIKTGS/Tram/getSoNgayGhi?madvi=' + maDonViSelected + '&matram=' + item.mA_TRAM)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return null;
            })
            .then((res) => {
                if (res !== null && res.lenght !== 0) {
                    setMaSoGCS(res[0].mA_SOGCS);
                    setNgayGhiDien(res[0].ngaY_GHIDIEN);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    return <div>
        <h4>Tên Trạm: {item.teN_TRAM}</h4>
        <h6>Mã Trạm: {item.mA_TRAM}</h6>
        <h6>Mã Sổ GCS: {maSoGCS !== null ? maSoGCS : ''}</h6>
        <h6>Ngày Ghi Chỉ Số: {ngayGhiDien !== null ? ngayGhiDien : ''}</h6>
        <h6>Tọa độ: (lng: '{item.toado.longitude}',lat:'{item.toado.latitude}')</h6>
    </div>

}


