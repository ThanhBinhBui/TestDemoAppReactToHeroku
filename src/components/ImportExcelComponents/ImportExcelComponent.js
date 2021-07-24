import React, { useEffect, useState } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import XLSX from 'xlsx';
import MauCapNhatKH from '../../asset/FileExcelTemplate/MauCapNhatKH.xlsx';
import MauCapNhatTru from '../../asset/FileExcelTemplate/MauCapNhatTru.xlsx';
import { Button } from 'reactstrap';
import { URLAPI, URLAPI4001 } from '../../constants/UrlApi';

export default function ImportExcelComponent() {
    const [listKhachHang, setListKhachHang] = useState(null);
    const [listTruTrungThe, setListTruTrungThe] = useState(null);
    const [listTruTronHaThe, setListTruTronHaThe] = useState(null);
    const [listTruVuongHaThe, setListTruVuongHaThe] = useState(null);
    const [listTuDien, setListTuDien] = useState(null);
    //const [listLine, setListLine] = useState(null);
    //const [listLineTru, setListLineTru] = useState(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}>
                <h4 style={{ fontSize: 20, fontWeight: 'bold', color: 'black', margin: 'auto' }}>Cập nhật tọa độ từ Excel</h4>
            </div>
            <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                <div>Cập nhật tọa độ k/h: <a href={MauCapNhatKH} download>(File mẫu cập nhật k/h) </a></div>
                <input style={{ marginTop: 10, paddingLeft: 60 }} type="file" id="importKHFromExcel" onChange={(e) => {
                    console.log(e);
                    if (e.target.files[0] === undefined) { } else {
                        try {
                            const reader = new FileReader();
                            const rABS = !!reader.readAsBinaryString;

                            reader.onload = (e) => {
                                /* Parse data */
                                const bstr = e.target.result;
                                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                                /* Get first worksheet */
                                const wsname = wb.SheetNames[0];
                                const ws = wb.Sheets[wsname];
                                /* Convert array of arrays */
                                const dataExcelKH = XLSX.utils.sheet_to_json(ws);
                                // console.log(dataExcelKH);
                                setListKhachHang(dataExcelKH);

                                // if()
                                /* Update state */
                                // this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                                //   console.log(JSON.stringify(this.state.data, null, 2));
                                // });

                            };

                            if (rABS) {
                                reader.readAsBinaryString(e.target.files[0]);
                            } else {
                                reader.readAsArrayBuffer(e.target.files[0]);
                            };
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }}
                />
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="sm"  color="primary" onClick={() => {
                            let tmp=0;
                            if (listKhachHang !== null) {
                                
                                listKhachHang.map(item => {
                                    
                                    fetch(URLAPI+'/APIKTGS/KHANG/updateToaDo', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',

                                        },
                                        body: JSON.stringify({
                                            "MA_DVIQLY": item.MaDVQL.toString(),
                                            "MA_DDO": item.MaDD.toString(),
                                            "TOA_DO": { "LONGITUDE": item.KinhDo.toString(), "LATITUDE": item.ViDo.toString() }
                                        })
                                    })
                                        .then(response => {
                                            
                                            
                                            console.log({
                                                "MA_DVIQLY": item.MaDVQL.toString(),
                                                "MA_DDO": item.MaDD.toString(),
                                                "TOA_DO": { "LONGITUDE": item.KinhDo.toString(), "LATITUDE": item.ViDo.toString() }
                                            });
                                            console.log(response.status);
                                            if (response.status === 200) {
                                                tmp=tmp+1;
                                                if(tmp===listKhachHang.length){
                                                    alert('Thêm danh sách khách hàng thành công');
                                                }
                                            }
                                        })
                                        .catch((error) => {
                                            console.log({
                                                "MA_DVIQLY": item.MaDVQL.toString(),
                                                "MA_DDO": item.MaDD.toString(),
                                                "TOA_DO": { "LONGITUDE": item.KinhDo.toString(), "LATITUDE": item.ViDo.toString() }
                                            });
                                            alert("Error kh: " + error);
                                            
                                        });
                                })
                                document.getElementById('importKHFromExcel').value = '';
                            }
                        }} >Lưu</Button>
                        <Button size="sm"  color="primary" style={{ marginLeft: 20 }} onClick={() => {
                            document.getElementById('importKHFromExcel').value = '';
                        }}
                        >Hủy</Button>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                Cập nhật tọa độ trụ trung thế: <a href={MauCapNhatTru} download>(File mẫu) </a>
                <input style={{ marginTop: 10, paddingLeft: 60 }} type="file" id="importTruTrungTheFromExcel" onChange={(e) => {

                    if (e.target.files[0] === undefined) { } else {
                        try {
                            const reader = new FileReader();
                            const rABS = !!reader.readAsBinaryString;

                            reader.onload = (e) => {
                                /* Parse data */
                                const bstr = e.target.result;
                                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                                /* Get first worksheet */
                                const wsname = wb.SheetNames[0];
                                const ws = wb.Sheets[wsname];
                                /* Convert array of arrays */
                                const dataExcel = XLSX.utils.sheet_to_json(ws);
                                console.log(dataExcel);
                                setListTruTrungThe(dataExcel);   

                                /* Update state */
                                // this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                                //   console.log(JSON.stringify(this.state.data, null, 2));
                                // });

                            };

                            if (rABS) {
                                reader.readAsBinaryString(e.target.files[0]);
                            } else {
                                reader.readAsArrayBuffer(e.target.files[0]);
                            };
                            
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }}
                />
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="sm"  color="primary" onClick={() => {
                            let tmp=0;
                            if (listTruTrungThe !== null) {
                                listTruTrungThe.map(item => {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": item.MaDVQL.toString(),
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": item.MaTram.toString(),
                                                "TYPE_E": "TTRHE",
                                                "NAME_E": item.TenTru.toString(),
                                                "LONGITUDE": item.KinhDo.toString(),
                                                "LATITUDE": item.ViDo.toString(),
                                                "longitudE_LABEL": item.KinhDo.toString(),
                                                "latitudE_LABEL": item.ViDo.toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                    
                                            if (response.status === 200) {
                                                console.log('save success item');
                                                tmp=tmp+1;
                                                if(tmp===listTruTrungThe.length){
                                                    alert('Thêm danh sách trụ trung thế thành công');
                                                }
                                            }
                                        })

                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                })
                                document.getElementById('importTruTrungTheFromExcel').value = '';
                            }
                        }} >Lưu</Button>
                        <Button size="sm"  color="primary" style={{ marginLeft: 20 }} onClick={() => {
                            document.getElementById('importTruTrungTheFromExcel').value = '';
                        }}
                        >Hủy</Button>
                    </div>
                </div>

            </div>
            <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                Cập nhật tọa độ trụ hạ thế tròn: <a href={MauCapNhatTru} download>(File mẫu) </a>
                <input style={{ marginTop: 10, paddingLeft: 60 }} type="file" id="importTruHaTheTronFromExcel" onChange={(e) => {

                    if (e.target.files[0] === undefined) { } else {
                        try {
                            const reader = new FileReader();
                            const rABS = !!reader.readAsBinaryString;

                            reader.onload = (e) => {
                                /* Parse data */
                                const bstr = e.target.result;
                                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                                /* Get first worksheet */
                                const wsname = wb.SheetNames[0];
                                const ws = wb.Sheets[wsname];
                                /* Convert array of arrays */
                                const dataExcel = XLSX.utils.sheet_to_json(ws);
                                console.log(dataExcel);
                                setListTruTronHaThe(dataExcel);



                                /* Update state */
                                // this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                                //   console.log(JSON.stringify(this.state.data, null, 2));
                                // });

                            };

                            if (rABS) {
                                reader.readAsBinaryString(e.target.files[0]);
                            } else {
                                reader.readAsArrayBuffer(e.target.files[0]);
                            };
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }}
                />
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="sm"  color="primary" onClick={() => {
                            let tmp=0;
                            if (listTruTronHaThe !== null) {
                                listTruTronHaThe.map(item => {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": item.MaDVQL.toString(),
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": item.MaTram.toString(),
                                                "TYPE_E": "THATHE",
                                                "NAME_E": item.TenTru.toString(),
                                                "LONGITUDE": item.KinhDo.toString(),
                                                "LATITUDE": item.ViDo.toString(),
                                                "longitudE_LABEL": item.KinhDo.toString(),
                                                "latitudE_LABEL": item.ViDo.toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            //console.log('save point');
                                            if (response.status === 200) {
                                                console.log('save success item');
                                                tmp=tmp+1;
                                                if(tmp===listTruTronHaThe.length){
                                                    alert('Thêm danh sách trụ hạ thế thành công');
                                                }
                                            }
                                        })

                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                })
                                document.getElementById('importTruHaTheTronFromExcel').value = '';
                            }
                        }} >Lưu</Button>
                        <Button size="sm"  color="primary" style={{ marginLeft: 20 }} onClick={() => {
                            document.getElementById('importTruHaTheTronFromExcel').value = '';
                        }}
                        >Hủy</Button>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                Cập nhật tọa độ trụ hạ thế vuông: <a href={MauCapNhatTru} download>(File mẫu) </a>
                <input style={{ marginTop: 10, paddingLeft: 60 }} type="file" id="importTruHaTheVuongFromExcel" onChange={(e) => {

                    if (e.target.files[0] === undefined) { } else {
                        try {
                            const reader = new FileReader();
                            const rABS = !!reader.readAsBinaryString;

                            reader.onload = (e) => {
                                /* Parse data */
                                const bstr = e.target.result;
                                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                                /* Get first worksheet */
                                const wsname = wb.SheetNames[0];
                                const ws = wb.Sheets[wsname];
                                /* Convert array of arrays */
                                const dataExcel = XLSX.utils.sheet_to_json(ws);
                                console.log(dataExcel);
                                setListTruVuongHaThe(dataExcel);

                                /* Update state */
                                // this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                                //   console.log(JSON.stringify(this.state.data, null, 2));
                                // });

                            };

                            if (rABS) {
                                reader.readAsBinaryString(e.target.files[0]);
                            } else {
                                reader.readAsArrayBuffer(e.target.files[0]);
                            };
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }}
                />
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="sm"  color="primary" onClick={() => {
                            let tmp=0;
                            if (listTruVuongHaThe !== null) {
                                listTruVuongHaThe.map(item => {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": item.MaDVQL.toString(),
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": item.MaTram.toString(),
                                                "TYPE_E": "TVHTHE",
                                                "NAME_E": item.TenTru.toString(),
                                                "LONGITUDE": item.KinhDo.toString(),
                                                "LATITUDE": item.ViDo.toString(),
                                                "longitudE_LABEL": item.KinhDo.toString(),
                                                "latitudE_LABEL": item.ViDo.toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            //console.log('save point');
                                            if (response.status === 200) {
                                                console.log('save success item');
                                                tmp=tmp+1;
                                                if(tmp===listTruVuongHaThe.length){
                                                    alert('Thêm danh sách khách hàng thành công');
                                                }
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error save point: " + error);
                                        });
                                })
                                document.getElementById('importTruHaTheVuongFromExcel').value = '';
                            }
                        }} >Lưu</Button>
                        <Button size="sm"  color="primary" style={{ marginLeft: 20 }} onClick={() => {
                            document.getElementById('importTruHaTheVuongFromExcel').value = '';
                        }}
                        >Hủy</Button>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                Cập nhật tọa độ tủ điện: <a href={MauCapNhatTru} download>(File mẫu) </a>
                <input style={{ marginTop: 10, paddingLeft: 60 }} type="file" id="importTuDienFromExcel" onChange={(e) => {

                    if (e.target.files[0] === undefined) { } else {
                        try {
                            const reader = new FileReader();
                            const rABS = !!reader.readAsBinaryString;

                            reader.onload = (e) => {
                                /* Parse data */
                                const bstr = e.target.result;
                                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                                /* Get first worksheet */
                                const wsname = wb.SheetNames[0];
                                const ws = wb.Sheets[wsname];
                                /* Convert array of arrays */
                                const dataExcel = XLSX.utils.sheet_to_json(ws);
                                console.log(dataExcel);
                                setListTuDien(dataExcel);

                                /* Update state */
                                // this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                                //   console.log(JSON.stringify(this.state.data, null, 2));
                                // });

                            };

                            if (rABS) {
                                reader.readAsBinaryString(e.target.files[0]);
                            } else {
                                reader.readAsArrayBuffer(e.target.files[0]);
                            };
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }}
                />
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="sm"  color="primary" onClick={() => {
                            let tmp=0;
                            if (listTuDien !== null) {
                                
                                listTuDien.map(item => {
                                    fetch(URLAPI+'/APIKTGS/Drawing/savePoint', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": item.MaDVQL.toString(),
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": item.MaTram.toString(),
                                                "TYPE_E": "TUDIEN",
                                                "NAME_E": item.TenTru.toString(),
                                                "LONGITUDE": item.KinhDo.toString(),
                                                "LATITUDE": item.ViDo.toString(),
                                                "longitudE_LABEL": item.KinhDo.toString(),
                                                "latitudE_LABEL": item.ViDo.toString(),
                                                "dS_DIEMDO": null
                                            })
                                    })
                                        .then(response => {
                                            //console.log('save point');
                                            if (response.status === 200) {
                                                console.log('save success item');
                                                tmp=tmp+1;
                                                if(tmp===listTuDien.length){
                                                    alert('Thêm danh sách thủ điện thành công');
                                                }
                                            }
                                        })
                                        .catch((error) => {
                                            alert(error.toString());
                                        });
                                })
                                document.getElementById('importTuDienFromExcel').value = '';
                            }
                        }} >Lưu</Button>
                        <Button size="sm"  color="primary" style={{ marginLeft: 20 }} onClick={() => {
                            document.getElementById('importTuDienFromExcel').value = '';
                        }}
                        >Hủy</Button>
                    </div>
                </div>
            </div>
		    
            {/* <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                Cập nhật đường dây vào trạm: <a href={MauCapNhatTru} download>(File mẫu) </a>
                <input style={{ marginTop: 10, paddingLeft: 60 }} type="file" id="importLineKHTramFromExcel" onChange={(e) => {

                    if (e.target.files[0] === undefined) { } else {
                        try {
                            const reader = new FileReader();
                            const rABS = !!reader.readAsBinaryString;

                            reader.onload = (e) => {
                                const bstr = e.target.result;
                                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                       
                                const wsname = wb.SheetNames[0];
                                const ws = wb.Sheets[wsname];
                         
                                const dataExcel = XLSX.utils.sheet_to_json(ws);
                                console.log(dataExcel);
                                setListLine(dataExcel);

            
                                // this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                                //   console.log(JSON.stringify(this.state.data, null, 2));
                                // });

                            };

                            if (rABS) {
                                reader.readAsBinaryString(e.target.files[0]);
                            } else {
                                reader.readAsArrayBuffer(e.target.files[0]);
                            };
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }}
                />
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="sm" color="primary" onClick={() => {
                            let tmp = 0;
                            if (listLine !== null) {

                                listLine.map(item => {

                                    fetch('http://10.170.3.50:5000/APIKTGS/Drawing/saveLine', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": item.maDonVi,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": item.maTram,
                                                "TYPE_E": "DDIEN",
                                                "NAME_E": "Dây điện",
                                                "ID_POINT1": 'TRAM-' + item.maTram,
                                                "ID_POINT2": ""
                                            }
                                        )
                                    })
                                        .then(response => {

                                            if (response.status ===200) {
                                                return response.json();
                                            }

                                            return null;
                                        })
                                        .then((res) => {

                                            if (res !== null) {

                                                fetch('http://10.170.3.50:5000/APIKTGS/Drawing/saveQHE', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.maDonVi,
                                                            "MA_TRAM": item.maTram,
                                                            "ID_LINE": res.iD_ELEMENT,
                                                            "ID_POINT": 'TRAM-' + item.maTram,
                                                            "MA_DDO": item.maDD
                                                        }
                                                    )
                                                })
                                                    .then(response => {

                                                        if (response.status ===200) {

                                                            return response.json();
                                                        }
                                                        return null;

                                                    })

                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error: " + error);
                                        });
                                })
                                document.getElementById('importLineKHTramFromExcel').value = '';
                            }
                        }} >Lưu</Button>
                        <Button size="sm" color="primary" style={{ marginLeft: 20 }} onClick={() => {
                            document.getElementById('importLineKHTramFromExcel').value = '';
                        }}
                        >Hủy</Button>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                Cập nhật đường dây khách hàng vào trụ: <a href={MauCapNhatTru} download>(File mẫu) </a>
                <input style={{ marginTop: 10, paddingLeft: 60 }} type="file" id="importLineKHTruFromExcel" onChange={(e) => {

                    if (e.target.files[0] === undefined) { } else {
                        try {
                            const reader = new FileReader();
                            const rABS = !!reader.readAsBinaryString;

                            reader.onload = (e) => {
                               
                                const bstr = e.target.result;
                                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                               
                                const wsname = wb.SheetNames[0];
                                const ws = wb.Sheets[wsname];
                               
                                const dataExcel = XLSX.utils.sheet_to_json(ws);
                                console.log(dataExcel);
                                setListLineTru(dataExcel);

                               
                                // this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                                //   console.log(JSON.stringify(this.state.data, null, 2));
                                // });

                            };

                            if (rABS) {
                                reader.readAsBinaryString(e.target.files[0]);
                            } else {
                                reader.readAsArrayBuffer(e.target.files[0]);
                            };
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }}
                />
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="sm" color="primary" onClick={() => {
                            let tmp = 0;
                            if (listLineTru !== null) {

                                listLineTru.map(item => {

                                    fetch('http://10.170.3.50:5000/APIKTGS/Drawing/saveLine', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(
                                            {
                                                "MA_DVIQLY": item.maDonVi,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": item.maTram,
                                                "TYPE_E": "DDIEN",
                                                "NAME_E": "Dây điện",
                                                "ID_POINT1":  item.idPoint.toString(),
                                                "ID_POINT2": ""
                                            }
                                        )
                                    })
                                        .then(response => {
                                            
                                            console.log({
                                                "MA_DVIQLY": item.maDonVi,
                                                "ID_ELEMENT": "",
                                                "MA_TRAM": item.maTram,
                                                "TYPE_E": "DDIEN",
                                                "NAME_E": "Dây điện",
                                                "ID_POINT1":  item.idPoint.toString(),
                                                "ID_POINT2": ""
                                            });

                                            if (response.status ===200) {
                                                return response.json();
                                            }

                                            return null;
                                        })
                                        .then((res) => {

                                            if (res !== null) {

                                                fetch('http://10.170.3.50:5000/APIKTGS/Drawing/saveQHE', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(
                                                        {
                                                            "MA_DVIQLY": item.maDonVi,
                                                            "MA_TRAM": item.maTram,
                                                            "ID_LINE": res.iD_ELEMENT,
                                                            "ID_POINT": item.idPoint.toString(),
                                                            "MA_DDO": item.maDD
                                                        }
                                                    )
                                                })
                                                    .then(response => {
                                                        
                                                        console.log({
                                                            "MA_DVIQLY": item.maDonVi,
                                                            "MA_TRAM": item.maTram,
                                                            "ID_LINE": res.iD_ELEMENT,
                                                            "ID_POINT": item.idPoint.toString(),
                                                            "MA_DDO": item.maDD
                                                        });
                                                    
                                                        if (response.status ===200) {

                                                            return response.json();
                                                        }
                                                        return null;

                                                    })

                                                    .catch((error) => {
                                                        //console.log("Error: " + error);
                                                    });
                                            }
                                        })
                                        .catch((error) => {
                                            //console.log("Error: " + error);
                                        });
                                })
                                document.getElementById('importLineKHTruFromExcel').value = '';
                            }
                        }} >Lưu</Button>
                        <Button size="sm" color="primary" style={{ marginLeft: 20 }} onClick={() => {
                            document.getElementById('importLineKHTruFromExcel').value = '';
                        }}
                        >Hủy</Button>
                    </div>
                </div>
            </div>
         */}
        </div>
    );
}


