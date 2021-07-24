import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function ThongKeTrangThaiTramCC(props) {   

    return (
        <div>
            <ReactHTMLTableToExcel
                id="exportExcelFileThongKeTramCC"
                className="download-table-xls-button"
                table="thongKeTramCC"
                filename="Report"
                sheet="Thông kê trạng thái trạm công cộng"
                buttonText="Download as XLS" />
        </div>
    );
}

