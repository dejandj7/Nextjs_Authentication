import React from 'react';

class General1v1 extends React.Component {
  render() {
    return (
      <div className="text-center">
        <p className="text-dark font-size-48 font-weight-bold mb-2">$29,931</p>
        <p className="text-uppercase text-muted mb-3">Revenue today</p>
        <p className="mb-4">
          Lorem ipsum dolor sit amit,consectetur eiusmdd tempory incididunt ut labore et dolore
          magna elit
        </p>
        <a href="#" onClick={e => e.preventDefault()} className="btn btn-outline-primary mb-1">
          View history
        </a>
      </div>
    );
  }
}

export default General1v1;
