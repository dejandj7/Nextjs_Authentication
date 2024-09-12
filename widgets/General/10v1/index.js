import React from 'react';

class General10v1 extends React.Component {
  render() {
    return (
      <div className="d-flex flex-wrap flex-column align-items-center">
        <div className="air__utils__avatar air__utils__avatar--size64 mb-3">
          <img src="resources/images/avatars/5.jpg" alt="Dejan Gjorgjevikj" />
        </div>
        <div className="text-center">
          <div className="text-dark font-weight-bold font-size-18">Dejan Gjorgjevikj</div>
          <div className="text-uppercase font-size-12 mb-3">Administrator</div>
          <button type="button" className="btn btn-primary btn-with-addon">
            <span className="btn-addon">
              <i className="btn-addon-icon fe fe-edit" />
            </span>
            Edit Profile
          </button>
        </div>
      </div>
    );
  }
}

export default General10v1;
