import React, { useState } from "react";
import { connect } from "react-redux";
import { signOut } from "next-auth/react";
import { Dropdown, Avatar, Menu, Layout } from "antd";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";
import PerfectScrollbar from "react-perfect-scrollbar";
import { UserOutlined } from "@ant-design/icons";
import LanguageSwitcher from "../LanguageSwitcher";
import {
  NavLinkPrivate,
  MenuItemPrivate,
  MenuGroupPrivate,
} from "../../authorization/Private";
import Link from "next/link";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import { deleteCookie } from "../../utilities/Utils";

const { Sider } = Layout;

const mapStateToProps = (state) => {
  return {
    auth: state["auth"],
    settings: state["settings"],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    switchProfile: (profile) => {
      message
        .loading("Switching your profile ...", 2.5)
        .then(() =>
          message.success("Profile switched to " + profile.fullName, 2.5)
        );
    },
    logout: () => {
      deleteCookie("profile");
      signOut();
    },
  };
};

const MainMenuLeft = (props) => {
  const {
    dispatch,
    menuData = [],
    settings,
    flyoutActive,
    auth,
    logout,
  } = props;

  const [activeSubmenu, setActiveSubmenu] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const [renderedFlyoutItems, setRenderedFlyoutItems] = useState({});
  const { data: session, status } = useSession();

  const applications = (
    <Menu selectable={false}>
      <Menu.ItemGroup title={<FormattedMessage id="topBar.apps" />}>
        <MenuItemPrivate perform="applications:list" key="5">
          <Link href="/apps/applications">
            <>
              <i className="fe fe-target mr-2" />
              <FormattedMessage id="topBar.applications" />
            </>
          </Link>
        </MenuItemPrivate>
        <Menu.Item key="6">
          <Link href="/apps/activetenders">
            <>
              <i className="fe fe-package mr-2" />
              <FormattedMessage id="topBar.activeGrants" />
            </>
          </Link>
        </Menu.Item>
        <MenuItemPrivate perform="customerapplication:list" key="17">
          <Link href="/apps/customerapplications">
            <>
              <i className="fe fe-triangle mr-2" />
              <FormattedMessage id="topBar.myapplications" />
            </>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="processes:view" key="19">
          <Link href="/apps/processes">
            <>
              <i className="fe fe-cpu mr-2" />
              <FormattedMessage id="topBar.processes" />
            </>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="donor:list" key="7">
          <Link href="/apps/donors">
            <>
              <i className="fe fe-archive mr-2" />
              <FormattedMessage id="topBar.donorProjects" />
            </>
          </Link>
        </MenuItemPrivate>
      </Menu.ItemGroup>
      <Menu.ItemGroup title={<FormattedMessage id="topBar.grants" />}>
        <MenuItemPrivate perform="grants:list" key="15">
          <Link href="/grants">
            <>
              <i className="fe fe-grid mr-2" />
              <FormattedMessage id="topBar.grants" />
            </>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="customergrants:list" key="18">
          <Link href="/apps/customergrants">
            <>
              <i className="fe fe-square mr-2" />
              <FormattedMessage id="topBar.mygrants" />
            </>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="reports:list" key="21">
          <Link href="/reports">
            <>
              <i className="fe fe-grid mr-2" />
              <FormattedMessage id="topBar.reports" />
            </>
          </Link>
        </MenuItemPrivate>
      </Menu.ItemGroup>
      <Menu.ItemGroup title={<FormattedMessage id="topBar.userTasks" />}>
        <Menu.Item key="6">
          <NavLinkPrivate perform="userTasks:visit" href="/usertask">
            <i className="fa fa-users mr-2" />
            <FormattedMessage id="topBar.userTasks" />
          </NavLinkPrivate>
        </Menu.Item>
      </Menu.ItemGroup>
      <MenuGroupPrivate
        perform="profilemenu:view"
        title={<FormattedMessage id="topBar.profiles" />}
      >
        <MenuItemPrivate perform="customerprofile:list" key="7">
          <Link href="/customer">
            <>
              <i className="fa fa-users mr-2" />
              <FormattedMessage id="topBar.customerManagement" />
            </>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="userManagement:visit" key="5">
          <Link href="/users">
            <>
              <i className="fa fa-users mr-2" />
              <FormattedMessage id="topBar.userManagement" />
            </>
          </Link>
        </MenuItemPrivate>
      </MenuGroupPrivate>
      <MenuGroupPrivate
        perform="administrationmenu:view"
        title={<FormattedMessage id="topBar.administration" />}
      >
        <MenuItemPrivate perform="notificationtemplate:list" key="6">
          <Link href="/apps/notification/list">
            <>
              <i className="fe fe-briefcase mr-2" />
              <FormattedMessage id="topBar.notifications" />
            </>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="budget:view" key="1">
          <Link href="/apps/budget">
            <>
              <i className="fe fe-briefcase mr-2" />
              <FormattedMessage id="topBar.budget" />
            </>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="grantdefinition:list" key="16">
          <Link href="/tenders">
            <>
              <i className="fe fe-list mr-2" />
              <FormattedMessage id="topBar.GrantDefinitions" />
            </>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="applicationtemplates:list" key="3">
          <Link href="/apps/applicationtemplates">
            <>
              <i className="fe fe-copy mr-2" />
              <FormattedMessage id="topBar.grantApplicationTemplates" />
            </>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="applicationreview:list" key="4">
          <Link href="/apps/applicationreview">
            <>
              <i className="fe fe-clipboard mr-2" />
              <FormattedMessage id="topBar.applicationReview" />
            </>
          </Link>
        </MenuItemPrivate>
      </MenuGroupPrivate>
    </Menu>
  );
  const usermenu = (
    <Menu selectable={false}>
      <Menu.Item>
        <strong>
          Welcome, {status === "authenticated" ? session.user.name : "N/A"}
        </strong>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <div>
          <strong>Email: </strong>{" "}
          {status === "authenticated" ? session.user.email : "N/A"}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Link href={"/profile/update"}>
          <>
            <i className={`${style.menuIcon} fe fe-user`} />
            <FormattedMessage id="topBar.profileMenu.editProfile" />
          </>
        </Link>
      </Menu.Item>
      <MenuItemPrivate perform="profileupdate:visit">
        <a
          href="#"
          onClick={() => {
            setSwitchProfileModalVisible(true);
          }}
        >
          <i className={`${style.menuIcon} fa fa-exchange`} />
          <FormattedMessage id="topBar.profileMenu.switchProfile" />
        </a>
      </MenuItemPrivate>
      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={() => logout()}>
          <span className={`${style.menuIcon} fe fe-log-out`}></span>
          <FormattedMessage id="topBar.logout" />
        </a>
      </Menu.Item>
    </Menu>
  );

  const toggleMobileMenu = (e) => {
    e.preventDefault();
    const { isMobileMenuOpen } = settings;
    dispatch({
      type: "settings/CHANGE_SETTING",
      payload: {
        isMobileMenuOpen: !isMobileMenuOpen,
      },
    });
  };

  return (
    <Sider width="auto">
      <div
        className={classNames(style.air__menuLeft, {
          [style.air__menuLeft__mobileToggled]: settings.isMobileMenuOpen,
          [style.air__menuLeft__toggled]: settings.isMenuCollapsed,
          [style.air__menuLeft__unfixed]: settings.isMenuUnfixed,
          [style.air__menuLeft__shadow]: settings.isMenuShadow,
          [style.air__menuLeft__flyout]: settings.menuType === "flyout",
          [style.air__menuLeft__compact]: settings.menuType === "compact",
          [style.air__menuLeft__blue]: settings.menuColor === "blue",
          [style.air__menuLeft__white]: settings.menuColor === "white",
          [style.air__menuLeft__gray]: settings.menuColor === "gray",
          [style.air__menuFlyout__black]:
            settings.flyoutMenuColor === "dark" &&
            settings.menuType !== "default",
          [style.air__menuFlyout__white]:
            settings.flyoutMenuColor === "white" &&
            settings.menuType !== "default",
          [style.air__menuFlyout__gray]:
            settings.flyoutMenuColor === "gray" &&
            settings.menuType !== "default",
        })}
      >
        <div className={style.air__menuLeft__outer}>
          <a
            href="#"
            className={style.air__menuLeft__mobileToggleButton}
            onClick={toggleMobileMenu}
          >
            <span />
          </a>
          <div className={`${style.air__menuLeft__logo} menuLeftLogo`}>
            <Link
              exact
              href="/"
              role="navigation button"
              className="air__logo d-flex"
            >
              <>
                <img
                  src="logo.png"
                  alt="Grant Management Application"
                  title="Grant Management Application"
                  width="32"
                />
                <span className="d-flex flex-column">
                  <span className="logo__name text-uppercase text-light font-size-21">
                    <FormattedMessage id="topBar.mainTitle" />
                  </span>
                  <span className="logo__descr text-uppercase font-size-12 text-gray-6">
                    <FormattedMessage id="topBar.subTitle" />
                  </span>
                </span>
              </>
            </Link>
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={`${style.air__menuLeft__user} mt-5 mb-4`}
          >
            <Dropdown overlay={usermenu} trigger={["click"]}>
              <div className={style.dropdown + " avatar-shadow"}>
                <Avatar
                  className={style.air__menuLeft__user__avatar}
                  shape="square"
                  size="large"
                  icon={<UserOutlined />}
                />
                <div className={style.air__menuLeft__user__name}>
                  {status === "authenticated" ? session.user.email : "N/A"}
                </div>
                <div className={style.air__menuLeft__user__role}>
                  {status === "authenticated" ? session.user.name : "N/A"}
                </div>
              </div>
            </Dropdown>
          </a>
          <div className={`${style.air__menuLeft__user} mt-5 mb-4`}>
            <LanguageSwitcher />
          </div>
          <PerfectScrollbar>
            <div
              id="menu-left-container"
              className={style.air__menuLeft__container}
            >
              <ul className={style.air__menuLeft__list}>{applications}</ul>
            </div>
          </PerfectScrollbar>
        </div>
      </div>
      <a
        href="#"
        className={style.air__menuLeft__backdrop}
        onClick={toggleMobileMenu}
      />
    </Sider>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenuLeft);
