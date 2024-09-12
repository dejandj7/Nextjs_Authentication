import React from "react";
import PropTypes from "prop-types";

const HeaderApp = (props) => {
  return (
    <header className="air__layout__header air__layout__fixedHeader air__layout__headerGray ant-layout-header">
      {props.children}
    </header>
  );
};

HeaderApp.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default HeaderApp;
