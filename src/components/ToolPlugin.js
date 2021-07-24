import React, { useState, useContext } from "react";
import { GiPencilBrush } from 'react-icons/gi';
import Toggle from 'react-toggle';
import { InitPageContext } from "../MainScreen";

function ToolPlugin(props) {

  const [changeLocationByDrag, setChangeLocationByDrag] = useState(false);
  const [changeLocationByTyping, setChangeLocationByTyping] = useState(false);
  const [changeLocationByAddress, setChangeLocationByAddress] = useState(false);
  const [changeLocationByClick, setChangeLocationByClick] = useState(false);
  const [deleteObject, setDeleteObject] = useState(false);
  const [addLineKHToKH, setAddLineKHToKH] = useState(false);
  const [updateCustomerLocationByLocation, setUpdateCustomerLocationByLocation] = useState(false);
  const [updateNamePoint, setUpdateNamePoint] = useState(false);
  const [statusBanVe, setStatusBanVe] = useState(false);
  const [reChuotDeTimKhoangCach, setReChuotDeTimKhoangCach] = useState(false);
  const [addTruByType, setAddTruByType] = useState(false);
  const [addTruByTypeNoLine, setAddTruByTypeNoLine] = useState(false);
  const [loadTruPMIS, setLoadTruPMIS] = useState(false);
  const [importExcel, setImportExcel] = useState(false);
  const [load3Tram, setLoad3Tram] = useState(false);
  const [addLineNgam, setAddLineNgam] = useState(false);
  const [getToaDoKHFromGCS,setGetToaDoKHFromGCS] = useState(false);
  const [changeManyObject,setChangeManyObject] = useState(false);
  const initContext = useContext(InitPageContext);

  const clearToggle = () => {
    setChangeLocationByDrag(false);
    setChangeLocationByTyping(false);
    setChangeLocationByAddress(false);
    setDeleteObject(false);
    setChangeLocationByClick(false);
    setAddLineKHToKH(false);
    setUpdateNamePoint(false);
    setStatusBanVe(false);
    setUpdateCustomerLocationByLocation(false);
    setReChuotDeTimKhoangCach(false);
    setAddTruByType(false);
    setLoadTruPMIS(false);
    setAddTruByTypeNoLine(false);
    setImportExcel(false);
    setLoad3Tram(false)
    setAddLineNgam(false);
    setChangeManyObject(false);
    setGetToaDoKHFromGCS(false);
    props.setObjectHasAddLine(null);
    props.setIdTruSelected(null);
    props.setPopup(null);
    props.functionSetObjectSelected({ type: "", object: null });
    document.getElementById('buttonHuyTruTrungTheFromPMIS').click();
    document.getElementById('buttonClearFixed').click();
    document.getElementById('buttonClearReport').click();
    document.getElementById("buttonHuyChangeLocationByAddressObject").click();
  }
  return <div className="tool-plugin">
    <div id="toolPluginClasses" className={"dropdown show-dropdown"}>
      <div onClick={() => {
        if (document.getElementById('toolPluginClasses').className === "dropdown show-dropdown open") {
          document.getElementById('toolPluginClasses').classList.remove('open');
        } else {
          if (document.getElementsByClassName("dropdown show-dropdown open").length !== 0) {
            for (let i = 0; i < document.getElementsByClassName("dropdown show-dropdown open").length; i++) {
              document.getElementsByClassName("dropdown show-dropdown open")[i].classList.remove('open');
            }
          }
          document.getElementById('toolPluginClasses').classList.add("open");
        }
      }} style={{ margin: 'auto' }}>
        <GiPencilBrush size={60} color={"#485DF9"} />
      </div>
      <ul className="dropdown-menu">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <h4 >Công cụ vẽ</h4>
        </div>
        {props.flagOnlyView || initContext.role !== '2' ?
          null
          :
          <>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>

                  <Toggle
                    //defaultChecked={changeLocationByDrag}
                    onChange={(e) => {
                      if (!statusBanVe) {
                        clearToggle();
                        setStatusBanVe(true);
                        props.functionSetOptionEffectObject("StatusBanVe");
                      } else {
                        setStatusBanVe(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={statusBanVe}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6>Trạng thái bảng vẽ</h6>
                </div>

              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    //defaultChecked={changeLocationByDrag}
                    onChange={(e) => {
                      if (!changeLocationByClick) {
                        clearToggle();
                        setChangeLocationByClick(true);
                        props.functionSetOptionEffectObject("ChangeLocationByClickObject");
                      } else {
                        setChangeLocationByClick(false);
                        props.functionSetObjectSelected({ type: "", object: null });
                        props.functionSetOptionEffectObject(null);

                      }
                    }}
                    checked={changeLocationByClick}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Cập nhật kh không có tọa độ</h6>
                </div>

              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    //defaultChecked={changeLocationByDrag}
                    onChange={(e) => {
                      if (!changeLocationByDrag) {
                        clearToggle();
                        setChangeLocationByDrag(true);
                        props.functionSetOptionEffectObject("ChangeLocationByDragObject");
                      } else {
                        setChangeLocationByDrag(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={changeLocationByDrag}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Thay đổi vị trí bằng kéo thả</h6>
                </div>

              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>

                  <Toggle
                    //defaultChecked={changeLocationByDrag}
                    onChange={(e) => {
                      if (!changeLocationByTyping) {
                        clearToggle();
                        setChangeLocationByTyping(true);
                        props.functionSetOptionEffectObject("ChangeLocationByTypingObject");
                      } else {
                        setChangeLocationByTyping(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={changeLocationByTyping}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Thay đổi vị trí bằng tọa độ</h6>
                </div>

              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>

                  <Toggle
                    //defaultChecked={changeLocationByDrag}
                    onChange={(e) => {
                      if (!changeLocationByAddress) {
                        clearToggle();
                        setChangeLocationByAddress(true);
                        props.functionSetOptionEffectObject("ChangeLocationByAddressObject");
                      } else {
                        setChangeLocationByAddress(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={changeLocationByAddress}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Thay đổi vị trí bằng địa chỉ</h6>
                </div>
              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!reChuotDeTimKhoangCach) {
                        clearToggle();
                        setReChuotDeTimKhoangCach(true);
                        props.functionSetOptionEffectObject("XacDinhKhoangCachKhiThemTru");
                      } else {
                        setReChuotDeTimKhoangCach(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={reChuotDeTimKhoangCach}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Thêm trụ theo khoảng cách</h6>
                </div>
              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!addTruByType) {
                        clearToggle();
                        setAddTruByType(true);
                        props.functionSetOptionEffectObject("XacDinhKhoangCachKhiThemTruByType");
                      } else {
                        setAddTruByType(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={addTruByType}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Thêm trụ bằng loại trụ</h6>
                </div>
              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!addTruByTypeNoLine) {
                        clearToggle();
                        setAddTruByTypeNoLine(true);
                        props.functionSetOptionEffectObject("XacDinhKhoangCachKhiThemTruByTypeNoLine");
                      } else {
                        setAddTruByTypeNoLine(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={addTruByTypeNoLine}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Thêm trụ không đường dây</h6>
                </div>
              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!addLineKHToKH) {
                        clearToggle();
                        setAddLineKHToKH(true);
                        props.functionSetOptionEffectObject("AddLineKHToKH");
                      } else {
                        setAddLineKHToKH(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={addLineKHToKH}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Đường dây nối kh-kh</h6>
                </div>

              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!addLineNgam) {
                        clearToggle();
                        setAddLineNgam(true);
                        props.functionSetOptionEffectObject("AddLineNgam");
                      } else {
                        setAddLineNgam(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={addLineNgam}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Đường dây ngầm dưới đất</h6>
                </div>

              </div>
            </li>

            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!updateCustomerLocationByLocation) {
                        clearToggle();
                        setUpdateCustomerLocationByLocation(true);
                        props.functionSetOptionEffectObject("UpdateCustomerLocationByLocation");
                      } else {
                        setUpdateCustomerLocationByLocation(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={updateCustomerLocationByLocation}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Cập nhật tọa độ nhiều kh</h6>
                </div>
              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!updateNamePoint) {
                        clearToggle();
                        setUpdateNamePoint(true);
                        props.functionSetOptionEffectObject("UpdateNamePoint");
                      } else {
                        setUpdateNamePoint(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={updateNamePoint}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Cập nhật tên trụ</h6>
                </div>
              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!loadTruPMIS) {
                        clearToggle();
                        setLoadTruPMIS(true);
                        document.getElementById('buttonLoadTruTrungTheFromPMIS').click();
                        props.functionSetOptionEffectObject("LoadTruTrungTheFromPMIS");
                      } else {
                        setLoadTruPMIS(false);
                        document.getElementById('buttonHuyTruTrungTheFromPMIS').click();
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={loadTruPMIS}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Đồng bộ trụ từ PMIS</h6>
                </div>
              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!changeManyObject) {
                        clearToggle();
                        setChangeManyObject(true);
                        props.functionSetOptionEffectObject("ChangeManyObject");
                      } else {
                        setChangeManyObject(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={changeManyObject}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Chuyển trạm nhiều đối tượng</h6>
                </div>
              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!getToaDoKHFromGCS) {
                        clearToggle();
                        setGetToaDoKHFromGCS(true);
                        props.functionSetOptionEffectObject("GetToaDoKHFromGCS");
                      } else {
                        setGetToaDoKHFromGCS(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={getToaDoKHFromGCS}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Đồng bộ tọa độ KH từ GCS</h6>
                </div>

              </div>
            </li>
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!importExcel) {
                        clearToggle();
                        setImportExcel(true);
                        props.functionSetOptionEffectObject("ImportExcel");
                      } else {
                        setImportExcel(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={importExcel}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Thêm đối tượng từ Excel</h6>
                </div>
              </div>
            </li>           
            <li className="button-container">
              <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Toggle
                    onChange={(e) => {
                      if (!deleteObject) {
                        clearToggle();
                        setDeleteObject(true);
                        props.functionSetOptionEffectObject("DeleteObject");
                      } else {
                        setDeleteObject(false);
                        props.functionSetOptionEffectObject(null);
                      }
                    }}
                    checked={deleteObject}
                  />
                </div>
                <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                  <h6 >Xóa đối tượng</h6>
                </div>
              </div>
            </li>
          </>
        }
      </ul>
    </div>
    <div id='buttonClearTool' onClick={() => {
      clearToggle();
    }}>
    </div>
  </div>
}
export default ToolPlugin;

