import React from "react";
import { MdMyLocation } from 'react-icons/md';
import { GiPerson } from 'react-icons/gi';
import { FaCompress } from 'react-icons/fa';

function RestorePlugin(props) {

  return <div className="restore-plugin">
    <div id="restorePluginClasses" className={"dropdown show-dropdown"}>
      <div onClick={() => {
        if (document.getElementById('restorePluginClasses').className === "dropdown show-dropdown open") {
          document.getElementById('restorePluginClasses').classList.remove('open');
        } else {
          if (document.getElementsByClassName("dropdown show-dropdown open").length != 0) {
            for (let i = 0; i < document.getElementsByClassName("dropdown show-dropdown open").length; i++) {
              document.getElementsByClassName("dropdown show-dropdown open")[i].classList.remove('open');
            }
          }
          document.getElementById('restorePluginClasses').classList.add("open");
        }
      }} style={{ margin: 'auto' }}>
        <MdMyLocation size={60} color={"#485DF9"} />
      </div>
      <div className="dropdown-menu" >
        <h5> Trạng thái</h5>
        <div style={{ 'display': 'flex', flexDirection: 'row' }}>
          <div onClick={() => props.functionResetPointCenter()} style={{ display: 'flex', width: 70, height: 70, borderRadius: 5, justifyContent: 'center', alignitems: 'center' }}>
            <GiPerson size={60} color={"#485DF9"}         
            />
          </div>
          <div onClick={() => props.functionResetZoom()} style={{ display: 'flex', width: 70, height: 70, borderRadius: 5, justifyContent: 'center', alignitems: 'center' }}>
            <FaCompress size={60} color={"#485DF9"}            
            />
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default RestorePlugin;
