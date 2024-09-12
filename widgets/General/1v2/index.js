import React from 'react';

class General1v2 extends React.Component {
  render() {
    const className = `${this.props.customClass} font-weight-bold font-size-24 mb-0`;
    return (
      <div className="d-flex flex-wrap align-items-center">
        <div className='mr-auto'>
          <p className="text-uppercase text-dark font-weight-bold mb-1">{this.props.title}</p>
        </div>
        <p className={className}>{this.props.number}</p>
      </div>
    );
  }
}

export default General1v2;
