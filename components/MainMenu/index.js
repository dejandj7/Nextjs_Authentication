import React, { useState } from "react";
import { connect } from "react-redux";
import { signOut } from "next-auth/react";
import MenuDashboards from "../MenuDashboards";
import {
  Menu,
  Dropdown,
  Avatar,
  Badge,
  Empty,
  List,
  Modal,
  Button,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { PropTypes } from "prop-types";
import Link from "next/link";
import LanguageSwitcher from "../LanguageSwitcher";
import Actions from "../Actions";
import styles from "./style.module.scss";
import Logo from "../Logo";
import { FormattedMessage } from "react-intl";
import {
  NavLinkPrivate,
  MenuItemPrivate,
  MenuGroupPrivate,
} from "../../authorization/Private";
import { responseCustomerProfileById } from "../../redux/customer/actions";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { deleteCookie } from "../../utilities/Utils";

const MainMenu = (props) => {
  const {
    auth,
    switchProfile,
    connectionStatus,
    profileEditable,
    profileChanged,
  } = props;

  const [switchProfileModalVisible, setSwitchProfileModalVisible] =
    useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (profileChanged) {
      message.success("Profile switched to " + auth.myprofile.fullName, 3);
    }
  }, [profileChanged]);

  const logout = () => {
    deleteCookie("profile");
    signOut();
  };

  const applications = (
    <Menu selectable={false}>
      <Menu.ItemGroup title={<FormattedMessage id="topBar.apps" />}>
        <MenuItemPrivate perform="applications:list" key="1">
          <Link href="/apps/applications">
            <span>
              <i className="fe fe-target mr-2" />
              <FormattedMessage id="topBar.applications" />
            </span>
          </Link>
        </MenuItemPrivate>
        <Menu.Item key="2">
          <Link href="/apps/activetenders">
            <span>
              <i className="fe fe-package mr-2" />
              <FormattedMessage id="topBar.activeGrants" />
            </span>
          </Link>
        </Menu.Item>
        <MenuItemPrivate perform="customerapplication:list" key="3">
          <Link href="/apps/customerapplications">
            <span>
              <i className="fe fe-triangle mr-2" />
              <FormattedMessage id="topBar.myapplications" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="processes:view" key="4">
          <Link href="/processes/all">
            <span>
              <i className="fe fe-cpu mr-2" />
              <FormattedMessage id="topBar.processes" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="meetings:view" key="5">
          <Link href="/meetings/all">
            <span>
              <i className="fe fe-calendar mr-2" />
              <FormattedMessage id="topBar.meetings" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="donor:list" key="6">
          <Link href="/apps/donors">
            <span>
              <i className="fe fe-archive mr-2" />
              <FormattedMessage id="topBar.donorProjects" />
            </span>
          </Link>
        </MenuItemPrivate>
      </Menu.ItemGroup>
      <Menu.ItemGroup title={<FormattedMessage id="topBar.grants" />}>
        <MenuItemPrivate perform="grants:list" key="7">
          <Link href="/grants">
            <span>
              <i className="fe fe-grid mr-2" />
              <FormattedMessage id="topBar.grants" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="customergrants:list" key="8">
          <Link href="/apps/customergrants">
            <span>
              <i className="fe fe-square mr-2" />
              <FormattedMessage id="topBar.mygrants" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="reports:list" key="9">
          <Link href="/reports">
            <span>
              <i className="fa fa-file mr-2" />
              <FormattedMessage id="topBar.reports" />
            </span>
          </Link>
        </MenuItemPrivate>
      </Menu.ItemGroup>
      <Menu.ItemGroup title={<FormattedMessage id="topBar.userTasks" />}>
        <Menu.Item key="10">
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
        <MenuItemPrivate perform="customerprofile:list" key="11">
          <Link href="/customer">
            <span>
              <i className="fa fa-users mr-2" />
              <FormattedMessage id="topBar.customerManagement" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="userManagement:visit" key="12">
          <Link href="/users">
            <span>
              <i className="fa fa-users mr-2" />
              <FormattedMessage id="topBar.userManagement" />
            </span>
          </Link>
        </MenuItemPrivate>
      </MenuGroupPrivate>
      <MenuGroupPrivate
        perform="administrationmenu:view"
        title={<FormattedMessage id="topBar.administration" />}
      >
        <MenuItemPrivate perform="notificationtemplate:list" key="13">
          <Link href="/apps/notification/list">
            <span>
              <i className="fe fe-briefcase mr-2" />
              <FormattedMessage id="topBar.notifications" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="budget:view" key="14">
          <Link href="/apps/budget">
            <span>
              <i className="fe fe-briefcase mr-2" />
              <FormattedMessage id="topBar.budget" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="grantdefinition:list" key="15">
          <Link href="/tenders">
            <span>
              <i className="fe fe-list mr-2" />
              <FormattedMessage id="topBar.GrantDefinitions" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="applicationtemplates:list" key="16">
          <Link href="/apps/applicationtemplates">
            <span>
              <i className="fe fe-copy mr-2" />
              <FormattedMessage id="topBar.grantApplicationTemplates" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="applicationreview:list" key="17">
          <Link href="/apps/applicationreview">
            <span>
              <i className="fe fe-clipboard mr-2" />
              <FormattedMessage id="topBar.applicationReview" />
            </span>
          </Link>
        </MenuItemPrivate>
        <MenuItemPrivate perform="forms:list" key="18">
          <Link href="/apps/formio/list">
            <span>
              <i className="fe fe-file-plus mr-2" />
              <FormattedMessage id="topBar.formio" />
            </span>
          </Link>
        </MenuItemPrivate>
      </MenuGroupPrivate>
    </Menu>
  );
  const usermenu = (
    <Menu selectable={false}>
      <Menu.Item key="um1">
        <strong>
          <FormattedMessage id="topBar.welcome" />{" "}
          {status === "authenticated" ? session.user.fullName : "N/A"}
        </strong>
      </Menu.Item>
      <Menu.Item key="um2">
        <div className="mb-0 mr-4 d-xl-block">
          <FormattedMessage id="topBar.roles" />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {auth.role &&
              auth.role.map((item, i) => (
                <span
                  className="ml-2 p-1 badge bg-success text-white font-size-12 text-uppercase"
                  key={i}
                >
                  {item.name}
                </span>
              ))}
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="um3">
        <div>
          <strong>Email: </strong>{" "}
          {status === "authenticated" ? session.user.email : "N/A"}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="um4">
        <Link href="/profile/update">
          <span>
            <i className={`${styles.menuIcon} fe fe-user`} />
            <FormattedMessage id="topBar.profileMenu.editProfile" />
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="um5">
        <a
          href="#"
          onClick={() => {
            setSwitchProfileModalVisible(true);
          }}
        >
          <i className={`${styles.menuIcon} fa fa-exchange`} />
          <FormattedMessage id="topBar.profileMenu.switchProfile" />
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="um6">
        <a href="#" onClick={() => logout()}>
          <span className={`${styles.menuIcon} fe fe-log-out`}></span>
          <FormattedMessage id="topBar.logout" />
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark top-bar">
      <Logo />
      {session && session.user ? (
        <div className="d-flex">
          <div className="mr-3 d-block">
            <MenuDashboards />
          </div>
          <div className="mr-auto d-block">
            <Dropdown
              overlay={applications}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <div className={styles.dropdown}>
                <i className={`${styles.icon} fe fe-menu`} />
                <FormattedMessage id="topBar.options" />
              </div>
            </Dropdown>
          </div>
          <div className="mb-0 mr-4 d-xl-block">
            <span>
              <FormattedMessage id="topBar.profile" />
              <span> </span>
              {auth.myprofile && auth.myprofile.isLegalEntity ? (
                <span>
                  <i className={`${styles.menuIcon} fe fe-users`} />
                  <span className="ml-2 p-1 badge bg-warning text-white font-size-12 text-uppercase">
                    {auth.myprofile.shortName
                      ? auth.myprofile.shortName
                      : "N/A"}
                  </span>
                </span>
              ) : (
                <span>
                  <i className={`${styles.menuIcon} fe fe-user`} />
                  <span className="ml-2 p-1 badge bg-success text-white font-size-12 text-uppercase">
                    {auth.myprofile && auth.myprofile.shortName
                      ? auth.myprofile.shortName
                      : "N/A"}
                  </span>
                </span>
              )}
            </span>
          </div>
          <div className="mr-4 d-md-block">
            <LanguageSwitcher />
          </div>
          <div className="d-md-block">
            <Badge size="small" count={0} className={styles.badge}>
              <Actions />
            </Badge>
          </div>
          <div className="d-md-block">
            <Dropdown overlay={usermenu} trigger={["click"]}>
              <div className={styles.dropdown + " avatar-shadow"}>
                <Badge
                  size="small"
                  dot={true}
                  className={styles.badge}
                  status={
                    connectionStatus === "Connected" ? "success" : "error"
                  }
                >
                  <Avatar
                    className={styles.avatar}
                    shape="square"
                    size="large"
                    icon={<UserOutlined />}
                  />
                </Badge>
              </div>
            </Dropdown>
          </div>
        </div>
      ) : (
        <div className="mr-4 d-md-block">
          <LanguageSwitcher />
        </div>
      )}
      <Modal
        title={<FormattedMessage id="topBar.Selectnewprofile" />} //"Select new profile"
        centered
        className="modal-no-footer"
        open={switchProfileModalVisible}
        onOk={() => setSwitchProfileModalVisible(false)}
        onCancel={() => setSwitchProfileModalVisible(false)}
      >
        {auth ? (
          <List
            itemLayout="horizontal"
            dataSource={auth && auth.user ? auth.user.userCustomers : []}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type={
                      item.id === auth.myprofile._id ? "outline" : "primary"
                    }
                    onClick={() => {
                      switchProfile(item, auth.user.id);
                      setSwitchProfileModalVisible(false);
                    }}
                    disabled={item.id === auth.myprofile._id}
                    key="list-switch-profile"
                  >
                    {item.id === auth.myprofile._id ? (
                      <FormattedMessage id="topBar.profile" />
                    ) : (
                      <FormattedMessage id="topBar.profileThis" />
                    )}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar size={55} icon={<UserOutlined />} />}
                  title={<strong>{item.fullName}</strong>}
                  description={item.id}
                />
              </List.Item>
            )}
          />
        ) : (
          <span>
            <Empty description={<strong>No accounts to switch</strong>} />
          </span>
        )}
      </Modal>
    </nav>
  );
};

MainMenu.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const connectionStatus = state.signalR;
  return {
    auth: state["auth"],
    connectionStatus,
    profileEditable: state.auth.profileEditable,
    profileChanged: state.auth.profileChanged,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    switchProfile: (profile, userId) => {
      dispatch(responseCustomerProfileById(profile.id, userId));
      message.loading("Switching your profile ...", 3).then(() => {});
    },
    logout: (logoutRedirect) => {
      dispatch(
        logout(
          `${process.env.NEXT_PUBLIC_API_URL}/user/logout`,
          getApiFetchClient()
        )
      );
      logoutRedirect();
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
