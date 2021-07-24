/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React, { useState, useContext } from "react";
import { AiFillSetting } from 'react-icons/ai';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Toggle from 'react-toggle';
import { ListKhachHangNoLineContext } from "../App";
import { URLAPI, URLAPI4001 } from '../constants/UrlApi';
// import imagine1 from "assets/img/sidebar-1.jpg";
// import imagine2 from "assets/img/sidebar-2.jpg";
// import imagine3 from "assets/img/sidebar-3.jpg";
// import imagine4 from "assets/img/sidebar-4.jpg";
function FixedPlugin(props) {
  const listKhachHangNoLine = useContext(ListKhachHangNoLineContext)
  const [showListKhachHangFull, setShowListKhachHangFull] = useState(false);
  const [showListKhachHangNoLine, setShowListKhachHangNoLine] = useState(false);
  const [changeLocationLabel, setChangeLocationLabel] = useState(false);
  const [showDistance, setShowDistance] = useState(false);
  const [showLabelPoint, setShowLabelPoint] = useState(false);
  const [showLabelPointName, setShowLabelPointName] = useState(false);
  const [showLabelPointDoanhSo, setShowLabelPointDoanhSo] = useState(false);
  const [changeSizeObject, setChangeSizeObject] = useState(false);
  const clearToggle = () => {
    setShowListKhachHangFull(false);
    setShowLabelPoint(false);
    setChangeLocationLabel(false);
    setShowDistance(false);
    setShowListKhachHangNoLine(false);
    setShowLabelPointName(false);
    setShowLabelPointDoanhSo(false);
    setChangeSizeObject(false);
    document.getElementById('buttonClearReport').click();
    document.getElementById('buttonClearTool').click();
    props.setObjectHasAddLine(null);
    props.setIdTruSelected(null);
    props.setPopup(null);
    props.functionSetObjectSelected({ type: "", object: null });
    document.getElementById('buttonHuyTruTrungTheFromPMIS').click();
    document.getElementById("buttonHuyChangeLocationByAddressObject").click();
  }

  return <div className="fixed-plugin">
    {/* <div id="fixedPluginClasses" className={this.props.fixedClasses}> */}
    <div id="fixedPluginClasses" className={"dropdown show-dropdown"}>
      <div onClick={() => {
        if (document.getElementById('fixedPluginClasses').className === "dropdown show-dropdown open") {
          document.getElementById('fixedPluginClasses').classList.remove('open');
        } else {
          if (document.getElementsByClassName("dropdown show-dropdown open").length != 0) {
            for (let i = 0; i < document.getElementsByClassName("dropdown show-dropdown open").length; i++) {
              document.getElementsByClassName("dropdown show-dropdown open")[i].classList.remove('open');
            }
          }
          document.getElementById('fixedPluginClasses').classList.add("open");
        }
      }} style={{ margin: 'auto' }}>
        <AiFillSetting size={60} color={"#485DF9"} />
      </div>
      <div className="dropdown-menu">
        <li className="button-container">
          <div style={{ display: 'flex', height: 46 }}>

          </div>
        </li>
        <li className="button-container">
          <div style={{ display: 'flex', height: 46 }}>

          </div>
        </li>
        <li className="button-container">
          <div style={{ display: 'flex', height: 46 }}>

          </div>
        </li>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <h6>Hiển thị thông tin</h6>
        </div>
        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  if (!showListKhachHangFull) {
                    clearToggle();
                    console.log(props.maTramSelected);
                    console.log(props.maDonViSelected);
                    if (props.maTramSelected !== null && props.maDonViSelected) {
                      console.log(URLAPI4001+'/Api/SangTaiChuyenLuoi/getCustomerNoLine');
                      fetch(URLAPI4001+'/Api/SangTaiChuyenLuoi/getCustomerNoLine', {
                        method: 'POST',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',

                        },
                        body: JSON.stringify({
                          "MADONVI": props.maDonViSelected,
                          "MATRAM": props.maTramSelected
                        })
                      })
                        .then(response => {

                          if (response.status === 200) {
                            return response.json();
                          }
                          return null;
                        })
                        .then(responseJson => {
                          if (responseJson !== null) {
                            listKhachHangNoLine.setListKhachHangNoLine(responseJson.map(item => item.MA_DDO));
                          }
                        })
                    }
                    setShowListKhachHangFull(true);
                    props.functionSetOptionEffectObject("ShowListKhachHangFull");
                  } else {
                    setShowListKhachHangFull(false);
                    props.functionSetObjectSelected({ type: "", object: null });
                    props.functionSetOptionEffectObject(null);
                  }
                }}
                checked={showListKhachHangFull}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6>Bảng khách hàng</h6>
            </div>
          </div>
        </li>

        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  props.reloadListLine();
                  props.reloadListPoint();
                  if (!showLabelPoint) {
                    clearToggle();
                    setShowLabelPoint(true);
                    props.functionSetOptionEffectObject("ShowLabelPoint");
                  } else {
                    setShowLabelPoint(false);
                    props.functionSetObjectSelected({ type: "", object: null });
                    props.functionSetOptionEffectObject(null);

                  }
                }}
                checked={showLabelPoint}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6> Hiển thị danh sách theo mã kh</h6>
            </div>
          </div>
        </li>

        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  props.reloadListLine();
                  props.reloadListPoint();
                  if (!showLabelPointName) {
                    clearToggle();
                    setShowLabelPointName(true);
                    props.functionSetOptionEffectObject("ShowLabelPointName");
                  } else {
                    setShowLabelPointName(false);

                    props.functionSetOptionEffectObject(null);

                  }
                }}
                checked={showLabelPointName}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6> Hiển thị danh sách theo tên kh</h6>
            </div>
          </div>
        </li>
        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  props.reloadListLine();
                  props.reloadListPoint();
                  if (!showLabelPointDoanhSo) {
                    clearToggle();
                    setShowLabelPointDoanhSo(true);
                    props.functionSetOptionEffectObject("ShowLabelPointDoanhSo");
                  } else {
                    setShowLabelPointDoanhSo(false);
                    props.functionSetOptionEffectObject(null);

                  }
                }}
                checked={showLabelPointDoanhSo}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6> Hiển thị danh sách theo danh số kh</h6>
            </div>
          </div>
        </li>
        {props.flagOnlyView ? null :
          <li className="button-container">
            <div style={{ display: 'flex', flex: 1 }}>
              <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                <Toggle
                  //defaultChecked={changeLocationByDrag}
                  onChange={(e) => {
                    props.reloadListLine();
                    props.reloadListPoint();
                    if (!changeLocationLabel) {
                      clearToggle();
                      setChangeLocationLabel(true);
                      props.functionSetOptionEffectObject("ChangeLocationLabel");
                    } else {
                      setChangeLocationLabel(false);
                      props.functionSetOptionEffectObject(null);
                    }
                  }}
                  checked={changeLocationLabel}
                />
              </div>
              <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
                <h6 >Thay đổi vị trí danh sách</h6>
              </div>
            </div>
          </li>
        }
        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>

              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  if (!showDistance) {
                    clearToggle();
                    setShowDistance(true);
                    props.functionSetOptionEffectObject("ShowDistance");
                  } else {
                    setShowDistance(false);
                    props.functionSetOptionEffectObject(null);
                  }
                }}
                checked={showDistance}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6 >Hiển thị độ dài đường dây</h6>
            </div>

          </div>
        </li>
        <div style={{ display: 'flex', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
          <h6>Loại hiển thị bản đồ</h6>
        </div>
        <li className="button-container">
          <div >
            <RadioGroup aria-label="gender" name="gender1" value={props.categoryMap} onChange={(e) => { props.functionSetCategoryMap(e.target.value) }}>
              <FormControlLabel value="styleAll" control={<Radio color="primary" />} label="Toàn Bộ" />
              <FormControlLabel value="styleSimple" control={<Radio color="primary" />} label="Toàn Tên Dường" />
              <FormControlLabel value="styleDefault" control={<Radio color="primary" />} label="Tên Dường Lớn" />
            </RadioGroup>
            {/* </FormControl> */}
          </div>
        </li>

        <div style={{ display: 'flex', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
          <h6>Kích thước đối tượng</h6>
        </div>
        <li className="button-container">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Toggle
                //defaultChecked={changeLocationByDrag}
                onChange={(e) => {
                  if (!changeSizeObject) {
                    clearToggle();
                    setChangeSizeObject(true);
                    props.functionSetOptionEffectObject("ChangeSizeObject");
                  } else {
                    setChangeSizeObject(false);
                    props.functionSetOptionEffectObject(null);
                  }
                }}
                checked={changeSizeObject}
              />
            </div>
            <div style={{ display: 'flex', flex: 7, marginLeft: 10 }}>
              <h6 >Thay đổi kích thước </h6>
            </div>
          </div>
        </li>
      </div>
      <div style={{ display: 'none' }}>
        <div id='buttonClearFixed' onClick={() => {
          clearToggle();
        }}>
        </div>

      </div>
    </div>
  </div>
}

export default FixedPlugin;

// class FixedPlugin extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       classes: "dropdown show-dropdown open",
//       bg_checked: true,
//       bgImage: this.props.bgImage
//     };
//   }
//   handleClick = () => {
//     this.props.handleFixedClick();
//   };
//   onChangeClick = () => {
//     this.props.handleHasImage(!this.state.bg_checked);
//     this.setState({ bg_checked: !this.state.bg_checked });
//   };
//   render() {
//     return (
//       <div className="fixed-plugin">
//         {/* <div id="fixedPluginClasses" className={this.props.fixedClasses}> */}
//         <div id="fixedPluginClasses" className="dropdown show-dropdown open">
//           <div onClick={this.handleClick} style={{margin:'auto'}}>
//             <AiFillSetting size={60}/>
//           </div>
//           <ul className="dropdown-menu">
//             <li className="header-title">Configuration</li>
//             <li className="adjustments-line">
//               <p className="pull-left">Background Image</p>
//               <div className="pull-right">
//                 <Toggle
//                   defaultChecked={this.state.bg_checked}
//                   onChange={this.onChangeClick}
//                 />
//               </div>
//               <div className="clearfix" />
//             </li>
//             <li className="adjustments-line">
//               <a className="switch-trigger">
//                 <p>Filters</p>
//                 <div className="pull-right">
//                   <span
//                     className={
//                       this.props.bgColor === "black"
//                         ? "badge filter active"
//                         : "badge filter"
//                     }
//                     data-color="black"
//                     onClick={() => {
//                       this.props.handleColorClick("black");
//                     }}
//                   />
//                   <span
//                     className={
//                       this.props.bgColor === "azure"
//                         ? "badge filter badge-azure active"
//                         : "badge filter badge-azure"
//                     }
//                     data-color="azure"
//                     onClick={() => {
//                       this.props.handleColorClick("azure");
//                     }}
//                   />
//                   <span
//                     className={
//                       this.props.bgColor === "green"
//                         ? "badge filter badge-green active"
//                         : "badge filter badge-green"
//                     }
//                     data-color="green"
//                     onClick={() => {
//                       this.props.handleColorClick("green");
//                     }}
//                   />
//                   <span
//                     className={
//                       this.props.bgColor === "orange"
//                         ? "badge filter badge-orange active"
//                         : "badge filter badge-orange"
//                     }
//                     data-color="orange"
//                     onClick={() => {
//                       this.props.handleColorClick("orange");
//                     }}
//                   />
//                   <span
//                     className={
//                       this.props.bgColor === "red"
//                         ? "badge filter badge-red active"
//                         : "badge filter badge-red"
//                     }
//                     data-color="red"
//                     onClick={() => {
//                       this.props.handleColorClick("red");
//                     }}
//                   />
//                   <span
//                     className={
//                       this.props.bgColor === "purple"
//                         ? "badge filter badge-purple active"
//                         : "badge filter badge-purple"
//                     }
//                     data-color="purple"
//                     onClick={() => {
//                       this.props.handleColorClick("purple");
//                     }}
//                   />
//                 </div>
//                 <div className="clearfix" />
//               </a>
//             </li>
//             {/* <li className="header-title">Sidebar Images</li>
//             <li className={this.state["bgImage"] === imagine1 ? "active" : ""}>
//               <a
//                 className="img-holder switch-trigger"
//                 onClick={() => {
//                   this.setState({ bgImage: imagine1 });
//                   this.props.handleImageClick(imagine1);
//                 }}
//               >
//                 <img src={imagine1} alt="..." />
//               </a>
//             </li>
//             <li className={this.state["bgImage"] === imagine2 ? "active" : ""}>
//               <a
//                 className="img-holder switch-trigger"
//                 onClick={() => {
//                   this.setState({ bgImage: imagine2 });
//                   this.props.handleImageClick(imagine2);
//                 }}
//               >
//                 <img src={imagine2} alt="..." />
//               </a>
//             </li>
//             <li className={this.state["bgImage"] === imagine3 ? "active" : ""}>
//               <a
//                 className="img-holder switch-trigger"
//                 onClick={() => {
//                   this.setState({ bgImage: imagine3 });
//                   this.props.handleImageClick(imagine3);
//                 }}
//               >
//                 <img src={imagine3} alt="..." />
//               </a>
//             </li>
//             <li className={this.state["bgImage"] === imagine4 ? "active" : ""}>
//               <a
//                 className="img-holder switch-trigger"
//                 onClick={() => {
//                   this.setState({ bgImage: imagine4 });
//                   this.props.handleImageClick(imagine4);
//                 }}
//               >
//                 <img src={imagine4} alt="..." />
//               </a>
//             </li> */}

//             <li className="button-container">
//               <div className="">
//                 <a
//                   href="https://www.creative-tim.com/product/light-bootstrap-dashboard-react?ref=lbdr-fixed-plugin"
//                   target="_blank"
//                   className="btn btn-success btn-block btn-fill"
//                 >
//                   Download free!
//                 </a>
//               </div>
//             </li>
//             <li className="button-container">
//               <div className="">
//                 <a
//                   href="https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react?ref=lbdr-fixed-plugin"
//                   target="_blank"
//                   className="btn btn-warning btn-block btn-fill"
//                 >
//                   Buy Pro
//                 </a>
//               </div>
//             </li>
//             <li className="button-container">
//               <a
//                 href="https://demos.creative-tim.com/light-bootstrap-dashboard-react/#/documentation/getting-started?ref=lbdr-fixed-plugin"
//                 target="_blank"
//                 className="btn btn-fill btn-info"
//               >
//                 Documentation
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     );
//   }
// }

// export default FixedPlugin;
