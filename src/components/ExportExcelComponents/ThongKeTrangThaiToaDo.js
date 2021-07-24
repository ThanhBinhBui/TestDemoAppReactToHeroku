import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function ThongKeTrangThaiToaDo() {
    
        return (
            <div>
                <ReactHTMLTableToExcel
                    id="exportExcelFileThongKeTrangThaiToaDo"
                    className="download-table-xls-button"
                    table="thongKeTrangThaiToaDo"
                    filename="Report"
                    sheet="Thông kê trạng thái trạm công cộng"
                    buttonText="Download as XLS" />
               
            </div>
        );
}

