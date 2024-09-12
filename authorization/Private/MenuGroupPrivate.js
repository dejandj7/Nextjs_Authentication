import React from "react";
import Can from "../withAuthorization/Can";
import { connect } from "react-redux";
import { Menu } from "antd";
import { useSession } from "next-auth/react";

const MenuGroupPrivate = (props) => {
  const { data: session, status } = useSession();
  return (
    <Can
      permissions={props.permissions ? props.permissions : []}
      perform={props.perform}
      data={{
        currentUserId: session.user.userId,
      }}
      yes={() => <Menu.ItemGroup {...props}>{props.children}</Menu.ItemGroup>}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state["auth"],
    permissions: state["auth"].permissions,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuGroupPrivate);
