import React from "react";
import Can from "../withAuthorization/Can";
import { connect } from "react-redux";
import { Button } from "antd";

const ButtonAntPrivate = (props) => {
  return (
    <Can
      permissions={props.permissions ? props.permissions : []}
      perform={props.perform}
      yes={() => <Button {...props}>{props.children}</Button>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ButtonAntPrivate);
