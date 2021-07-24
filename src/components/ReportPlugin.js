import { Button } from "reactstrap";
import React, { useState, useContext } from "react";
import { GiBookAura } from 'react-icons/gi';
import Toggle from 'react-toggle';
import { InitPageContext } from "../MainScreen";
import GetAppIcon from '@material-ui/icons/GetApp';
import { IconButton } from '@material-ui/core';
import { URLAPI4001 } from "../constants/UrlApi";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export default function ReportPlugin(props) {

  const initContext = useContext(InitPageContext);
  const [direction, setDirection] = useState(false);
  const [directionCurrentLocation, setDirectionCurrentLocation] = useState(false);
  const [report, setReport] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAllTram, setShowAllTram] = useState(false);
  const [addRoleDrawer, setAddRoleDrawer] = useState(false);
  const [removeLockTram, setRemoveLockTram] = useState(false);

  const clearToggle = () => {
    setDirection(false);
    setReport(false);
    setShowAlert(false);
    setShowAllTram(false);
    setDirectionCurrentLocation(false);
    setAddRoleDrawer(false);
    setRemoveLockTram(false);
    props.setObjectHasAddLine(null);
    props.setIdTruSelected(null);
    props.setPopup(null);
    props.functionSetObjectSelected({ type: "", object: null });
    document.getElementById('buttonClearFixed').click();
    document.getElementById('buttonClearTool').click();
    document.getElementById('buttonHuyTruTrungTheFromPMIS').click();
    document.getElementById("buttonHuyChangeLocationByAddressObject").click();
  }
  return <div className="report-plugin">
    <div id="reportPluginClasses" className={"dropdown show-dropdown"}>
      <div onClick={() => {
        if (document.getElementById('reportPluginClasses').className === "dropdown show-dropdown open") {
          document.getElementById('reportPluginClasses').classList.remove('open');
        } else {
          if (document.getElementsByClassName("dropdown show-dropdown open").length !== 0) {
            for (let i = 0; i < document.getElementsByClassName("dropdown show-dropdown open").length; i++) {
              document.getElementsByClassName("dropdown show-dropdown open")[i].classList.remove('open');
            }
          }
          document.getElementById('reportPluginClasses').classList.add("open");
        }
      }} style={{ margin: 'auto' }}>
        <GiBookAura size={60} color={"#485DF9"} />
      </div>
      <ul className="dropdown-menu">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <h4>Hiển thị thông tin</h4>
        </div>
        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  if (!direction) {
                    clearToggle();
                    setDirection(true);
                    props.functionSetOptionEffectObject("Direction");
                  } else {
                    setDirection(false);
                    props.functionSetOptionEffectObject(null);
                  }
                }}
                checked={direction}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6>Chỉ đường bằng địa chỉ</h6>
            </div>
          </div>
        </li>

        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  if (!directionCurrentLocation) {
                    clearToggle();
                    setDirectionCurrentLocation(true);
                    props.functionSetOptionEffectObject("DirectionCurrentLocation");
                  } else {
                    setDirectionCurrentLocation(false);
                    props.functionSetOptionEffectObject(null);
                  }
                }}
                checked={directionCurrentLocation}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6>Chỉ đường từ vị trí hiện tại</h6>
            </div>
          </div>
        </li>

        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  if (!report) {
                    clearToggle();
                    setReport(true);
                    props.functionSetOptionEffectObject("Report");
                  } else {
                    setReport(false);
                    props.functionSetOptionEffectObject(null);
                  }
                }}
                checked={report}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6>Báo Cáo</h6>
            </div>
          </div>
        </li>
        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  if (!showAlert) {
                    clearToggle();
                    setShowAlert(true);
                    props.functionSetOptionEffectObject("ShowAllAlert");
                  } else {
                    setShowAlert(false);
                    props.functionSetOptionEffectObject(null);
                  }
                }}
                checked={showAlert}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6>Hiển thị cảnh báo</h6>
            </div>
          </div>
        </li>
        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  if (!showAllTram) {
                    clearToggle();
                    setShowAllTram(true);
                    props.functionSetOptionEffectObject("ShowAllTram");
                  } else {
                    setShowAllTram(false);
                    props.functionSetOptionEffectObject(null);
                  }
                }}
                checked={showAllTram}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6>Hiển thị toàn bộ trạm</h6>
            </div>
          </div>
        </li>
        {initContext.role === '1' ?
          <li className="button-container">
            <div style={{ display: 'flex', flex: 1 }}>
              <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                <Toggle
                  //defaultChecked={changeLocationByDrag}
                  onChange={(e) => {
                    if (!addRoleDrawer) {
                      clearToggle();
                      setAddRoleDrawer(true);
                      document.getElementById('buttonOpenAddRoleDrawer').click();
                      props.functionSetOptionEffectObject("AddRoleDrawer");
                    } else {
                      setAddRoleDrawer(false);
                      props.functionSetOptionEffectObject(null);
                    }
                  }}
                  checked={addRoleDrawer}
                />
              </div>
              <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                <h6>Phân quyền vẽ</h6>
              </div>
            </div>
          </li>
          :
          null
        }
        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <IconButton>
                <GetAppIcon
                  style={{ color: '#7467EF' }}
                  className="hover"
                  onClick={e => {
                    fetch(URLAPI4001 + '/Api/SangTaiChuyenLuoi/getAllDataBackupByDonVi?maDonVi='+props.maDonViSelected)
                      .then(response => {
                        if (response.status === 200) {
                          return response.json();
                        }
                        return null;
                      })
                      .then(res => {
                        debugger;
                        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                        const fileExtension = '.xlsx';
                        const ws = XLSX.utils.json_to_sheet(res);
                        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                        const data = new Blob([excelBuffer], { type: fileType });
                        FileSaver.saveAs(data, 'abc' + fileExtension);
                      })
                      .catch(err => {
                        console.log(err);
                      })
                  }}
                />
              </IconButton>
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10, alignItems: 'center' }}>
              <h6>Backup Toàn Bộ Trạm </h6>
            </div>
          </div>
        </li>

        {initContext.role === '1' ?
          <li className="button-container">
            <div style={{ display: 'flex', flex: 1 }}>
              <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                <Toggle
                  //defaultChecked={changeLocationByDrag}
                  onChange={(e) => {
                    if (!removeLockTram) {
                      clearToggle();
                      setRemoveLockTram(true);
                      document.getElementById('buttonOpenRemoveLockTram').click();
                      props.functionSetOptionEffectObject("RemoveLockTram");
                    } else {
                      setRemoveLockTram(false);
                      props.functionSetOptionEffectObject(null);
                    }
                  }}
                  checked={removeLockTram}
                />
              </div>
              <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                <h6>Xóa Khóa Bản Vẽ Trạm</h6>
              </div>
            </div>
          </li>
          :
          null
        }
      </ul>
    </div>
    <div id='buttonClearReport' onClick={() => {
      clearToggle();
    }}>
    </div>
  </div>
}

