import React from "react";
import { Menu, Dropdown } from "antd";
import { connect } from "react-redux";
import styles from "./style.module.scss";
import { disableCustomerEdit } from "../../redux/auth/actions";

const LanguageSwitcher = (props) => {
  const {
    settings: { locale },
    changeLanguage,
  } = props;

  const language = locale.substr(0, 2);
  const items = [
    {
      label: (
        <div>
          <span className="text-uppercase font-size-12 mr-2">EN</span>
          English
        </div>
      ),
      key: "en-US",
    },
    {
      label: (
        <div>
          <span className="text-uppercase font-size-12 mr-2">MK</span>
          Македонски
        </div>
      ),
      key: "mk-MK",
    },
  ];
  const menu = (
    <Menu selectedKeys={[locale]} onClick={changeLanguage}>
      <Menu.Item key="en-US">
        <span className="text-uppercase font-size-12 mr-2">EN</span>
        English
      </Menu.Item>
      <Menu.Item key="mk-MK">
        <span className="text-uppercase font-size-12 mr-2">MK</span>
        Македонски
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown menu={{ items, onClick: changeLanguage }} placement="bottomRight">
      <div className={styles.dropdown}>
        <span className="text-uppercase">{language}</span>
      </div>
    </Dropdown>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    localeOptions: state.localeOptions,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeLanguage: ({ key }) => {
      dispatch({
        type: "settings/CHANGE_SETTING",
        payload: {
          locale: key,
        },
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSwitcher);
