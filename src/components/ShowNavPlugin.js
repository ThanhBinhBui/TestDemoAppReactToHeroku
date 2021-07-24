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
import React, { useState } from "react";
import { TiThMenu } from 'react-icons/ti';


function ShowNavPlugin(props) {
  const [classOpen, setClassOpen] = useState("dropdown show-dropdown"); 

  return <div className="show-nav-plugin">
    <div id="" className={classOpen}>
      <div onClick={() => {
        props.functionSetShowNavBar();
      }} style={{ margin: 'auto' }}>
        <TiThMenu size={60} />
      </div>
      </div>
  </div>
}

export default ShowNavPlugin;
