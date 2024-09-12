import React from "react";
import Can from "../withAuthorization/Can";
import Link from "next/link";
import { connect } from "react-redux";

const NavLinkPrivate = (props) => {
  return (
    <Can
      permissions={props.permissions ? props.permissions : []}
      perform={props.perform}
      yes={() => (
        <Link {...props}>
          <span>{props.children}</span>
        </Link>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(NavLinkPrivate);
