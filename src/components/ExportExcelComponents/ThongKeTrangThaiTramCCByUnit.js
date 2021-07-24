import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function ThongKeTrangThaiTramCCByUnit(props) {   

    return (
        <div>
            <ReactHTMLTableToExcel
                id="exportExcelFileThongKeTramCCByUnit"
                className="download-table-xls-button"
                table="thongKeTramCCByCTYAndTCT"
                filename="Report"
                sheet="Thông kê trạng thái trạm công cộng"
                buttonText="Download as XLS" />
        </div>
    );
}

