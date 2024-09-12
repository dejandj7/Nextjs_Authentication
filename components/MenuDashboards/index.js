import React from "react";
import { Menu, Dropdown } from "antd";
import Link from "next/link";
import styles from "./style.module.scss";
import { FormattedMessage } from "react-intl";
import { MenuItemPrivate } from "../../authorization/Private";
import dynamic from "next/dynamic";

const MenuDashboards = (props) => {
  const menu = (
    <Menu selectable={false}>
      <Menu.ItemGroup title={<FormattedMessage id="topBar.dashboards" />}>
        <MenuItemPrivate perform="dashboardstatistics:visit" key="1">
          <Link href="/">
            <span>
              <i className="fe fe-home mr-2" />
              <FormattedMessage id="topBar.homePage" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="dashboardstatistics:visit" key="2">
          <Link href="/dashboards/statistics/statistics">
            <>
              <i className="fe fe-activity mr-2" />
              <FormattedMessage id="topBar.statistics" />
            </>
          </Link>
        </MenuItemPrivate>
      </Menu.ItemGroup>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomLeft">
      <div className={styles.dropdown}>
        <i className="fe fe-grid mr-2" />
        <FormattedMessage id="topBar.dashboards" />
      </div>
    </Dropdown>
  );
};

export default MenuDashboards;
