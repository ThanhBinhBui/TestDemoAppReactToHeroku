import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function ThongKeTrangThaiKhachHangTheoToaDo() {

       return (
            <div>
                <ReactHTMLTableToExcel
                    id="exportExcelFileTrangThaiKhachHangTheoTaoDo"
                    className="download-table-xls-button"
                    table="thongKeTrangThaiKhachHangTheoTaoDo"
                    filename="Report"
                    sheet="Thông kê trạng thái trạm công cộng"
                    buttonText="Download as XLS" />
                
            </div>
        );
    
}

