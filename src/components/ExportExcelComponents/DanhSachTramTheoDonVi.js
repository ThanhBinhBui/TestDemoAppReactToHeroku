import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function DanhSachTramTheoDonVi() {

    
        return (
            <div>
                <ReactHTMLTableToExcel
                    id="exportExcelFileDanhSachTramTheoDonVi"
                    className="download-table-xls-button"
                    table="thongKeDanhSachTramTheoDonVi"
                    filename="Report"
                    sheet="Thông kê trạng thái trạm công cộng"
                    buttonText="Download as XLS" />
                
            </div>
        );
    } 


