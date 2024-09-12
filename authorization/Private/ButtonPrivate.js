import React from "react";
import Can from "../withAuthorization/Can";
import { connect } from "react-redux";

const ButtonPrivate = (props) => {
  return (
    <Can
      permissions={props.permissions ? props.permissions : []}
      perform={props.perform}
      yes={() => <button {...props}>{props.children}</button>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ButtonPrivate);
