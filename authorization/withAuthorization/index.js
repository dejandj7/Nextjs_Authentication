// withAuth/index.js
import { connect } from "react-redux";
import { compose } from "redux";
import withAuthorization from "./withAuthorization";

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state["auth"],
  };
};

export default compose(connect(mapStateToProps), withAuthorization);
