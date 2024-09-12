import React from "react";
import Can from "../withAuthorization/Can";
import { connect } from "react-redux";
import dynamic from "next/dynamic";

const SelectAntPrivate = (props) => {
  const Select = dynamic(import("antd"), { ssr: false });

  return (
    <Can
      permissions={props.permissions ? props.permissions : []}
      perform={props.perform}
      yes={() => <Select {...props}>{props.children}</Select>}
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectAntPrivate);
