import React, { useEffect, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default function BackUpTram(props) {   

    return (
        <div>
            <ReactHTMLTableToExcel
                id="buttonBackUpTram"
                className="download-table-xls-button"
                table="backUpTram"
                filename={props.maTram!==null?props.maTram:"Report"}
                sheet="data"
                buttonText="Download as XLS" />

        </div>
    );
}


