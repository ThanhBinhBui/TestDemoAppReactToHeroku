import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function ThongKeDanhSachTramTheoToaDo() {

    
        return (
            <div>
                <ReactHTMLTableToExcel
                    id="exportExcelFileThongKeDanhSachTramTheoToaDo"
                    className="download-table-xls-button"
                    table="thongKeDanhSachTramTheoToaDo"
                    filename="Report"
                    sheet="Thông kê trạng thái trạm công cộng"
                    buttonText="Download as XLS" />
                
            </div>
        );
    } 


