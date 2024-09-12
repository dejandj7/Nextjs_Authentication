import React from "react";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Radio, Tooltip } from "antd";
import classNames from "classnames";
import style from "./style.module.scss";
import { changeSetting } from "../../../redux/settings/actions";

const Sidebar = ({
  dispatch,
  isSidebarOpen,
  menuLayoutType,
  changeSomeSetting,
}) => {
  const toggleSettings = (e) => {
    e.preventDefault();
    const payload = { isSidebarOpen: !isSidebarOpen };
    changeSomeSetting(payload);
  };

  const selectMenuLayoutType = (e) => {
    const { value } = e.target;
    const layoutPayload = { menuLayoutType: value };
    changeSomeSetting(layoutPayload);
    const payload = { isSidebarOpen: !isSidebarOpen };
    changeSomeSetting(payload);
  };

  return (
    <div>
      <div
        className={classNames(style.air__sidebar, {
          [style.air__sidebar__toggled]: isSidebarOpen,
        })}
      >
        <PerfectScrollbar>
          <div className={style.air__sidebar__inner}>
            <a
              href="#"
              className={`fe fe-x-circle ${style.air__sidebar__close}`}
              onClick={toggleSettings}
            />
            <h5>
              <strong>UI Settings</strong>
            </h5>
            <div
              className="air__utils__line border-0"
              style={{ marginTop: 25, marginBottom: 30 }}
            />
            <div>
              <div className={style.air__sidebar__type}>
                <div className={style.air__sidebar__type__title}>
                  <span>Menu Layout</span>
                </div>
                <div className={style.air__sidebar__type__items}>
                  <Radio.Group
                    onChange={selectMenuLayoutType}
                    defaultValue={menuLayoutType}
                  >
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-2">
                          <Radio value="left">Left Menu</Radio>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-2">
                          <Radio value="top">Top Menu</Radio>
                        </div>
                      </div>
                    </div>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>
        </PerfectScrollbar>
      </div>
      <Tooltip title="Settings" placement="left">
        <a
          role="button"
          tabIndex="0"
          onFocus={(e) => {
            e.preventDefault();
          }}
          onClick={toggleSettings}
          style={{ bottom: "calc(20% + 120px)" }}
          className={style.air__sidebar__toggleButton}
        >
          <i className="fe fe-settings" />
        </a>
      </Tooltip>
    </div>
  );
};

const mapStateToProps = ({ settings }) => ({
  isSidebarOpen: settings.isSidebarOpen,
  menuLayoutType: settings.menuLayoutType,
});

const mapDispatchToProps = (dispatch) => {
  return {
    changeSomeSetting: (payload) => dispatch(changeSetting(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
