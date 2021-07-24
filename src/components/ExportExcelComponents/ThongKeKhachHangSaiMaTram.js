import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function ThongKeKhachHangSaiMaTram() {
    
    return (
        <div>
            <ReactHTMLTableToExcel
                id="exportExcelFileThongKeKhachHangSaiMaTram"
                className="download-table-xls-button"
                table="thongKeKhachHangSaiMaTram"
                filename="Report"
                sheet="Thông kê trạng thái khách hàng sai mã trạm"
                buttonText="Download as XLS" />
        </div >
    )
}


