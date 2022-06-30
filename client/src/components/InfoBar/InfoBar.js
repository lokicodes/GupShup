import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room }) => (

  <div className="infoBar">
    <div className="leftInnerContainer">
      <h3>Room : {room.toUpperCase()}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/">EXIT</a>
    </div>
  </div>
);

export default InfoBar;