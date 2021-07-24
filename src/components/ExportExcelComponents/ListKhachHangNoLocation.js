import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function ListKhachHangNoLocation(props) {   

    return (
        <div>
            <ReactHTMLTableToExcel
                id="exportExcelFileListKhachHangNoLocation"
                className="download-table-xls-button"
                table="listKhachHangNoLocation"
                filename="Report"
                sheet="DS"
                buttonText="Download as XLS" />
        </div>
    );
}

