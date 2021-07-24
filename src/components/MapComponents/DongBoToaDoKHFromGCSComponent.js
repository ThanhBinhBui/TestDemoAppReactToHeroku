import React, { useEffect, useState } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import XLSX from 'xlsx';
import MauCapNhatKH from '../../asset/FileExcelTemplate/MauCapNhatKH.xlsx';
import MauCapNhatTru from '../../asset/FileExcelTemplate/MauCapNhatTru.xlsx';
import { Button } from 'reactstrap';
import { URLAPI, URLAPI4001 } from '../../constants/UrlApi';

export default function DongBoToaDoKHFromGCSComponent(props) {
    const [listKhachHang, setListKhachHang] = useState(null);
    const tramCurrent = props.maTramCurrent;
    const donViCurrent = props.maDonViCurrent;
    const [listTruTrungThe, setListTruTrungThe] = useState(null);
    const [listTruTronHaThe, setListTruTronHaThe] = useState(null);
    const [listTruVuongHaThe, setListTruVuongHaThe] = useState(null);
    const [listTuDien, setListTuDien] = useState(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}>
                <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Đồng bộ tọa độ khách hàng from GCS</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', paddingLeft: 10, paddingRight: 10, marginTop: 50 }}>
                <h4 style={{ display: 'flex', flexDirection: 'row', fontSize: 20, color: 'black', margin: 'auto' }}>Mã Trạm: {tramCurrent !== null ? tramCurrent : ''}</h4>
                <h4 style={{ display: 'flex', flexDirection: 'row', fontSize: 20, color: 'black', margin: 'auto' }}>Mã Đơn Vị: {donViCurrent !== null ? donViCurrent : ''}</h4>

                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                        <Button size="sm" color="primary" onClick={() => {
                            props.setShowModalLoading(true);
                            if (tramCurrent !== null && donViCurrent !== null && donViCurrent.length === 6) {
                                fetch(URLAPI4001 + '/Api/SangTaiChuyenLuoi/dongBoToaDoFromGCS?maDonVi=' + donViCurrent + '&maTram=' + tramCurrent, {
                                    method: 'POST'
                                })
                                    .then((response) => {
                                        if (response.status === 200) {
                                            return response.json();
                                        }
                                        return null;
                                    })
                                    .then((res) => {
                                        if (res !== null) {
                                            debugger;
                                            if (res === 'SUCCES') {
                                                alert('Đồng bộ thành công tọa độ khách hàng từ GCS')
                                            } else {
                                                alert("Lỗi đồng bộ tọa độ khách hàng GCS");
                                            }
                                        }
                                        props.setShowModalLoading(false);
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        alert(error.toString());
                                        props.setShowModalLoading(false);
                                    });
                            } else {
                                props.setShowModalLoading(false);
                                alert('Vui lòng chọn trạm cần đồng bộ!');
                            }
                        }} >Lưu</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}


