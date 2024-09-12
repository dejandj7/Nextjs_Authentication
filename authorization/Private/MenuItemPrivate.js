import React from "react";
import Can from "../withAuthorization/Can";
import { Menu } from "antd";
import { connect } from "react-redux";
import { useSession } from "next-auth/react";

const MenuItemPrivate = (props) => {
  const { data: session, status } = useSession();
  return (
    <Can
      permissions={props.permissions ? props.permissions : []}
      perform={props.perform}
      data={{
        currentUserId: session.user.userId,
      }}
      yes={() => <Menu.Item {...props}>{props.children}</Menu.Item>}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    permissions: state["auth"].permissions,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemPrivate);
