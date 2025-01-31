import React from 'react';
import { FormattedMessage } from 'react-intl';

class General12v3 extends React.Component {
  render() {
    return (
      <div>
        <div className="h-100 pt-5 pb-5 text-center">
          <i className="fe fe-at-sign font-size-50" />
        </div>
        <div className="d-flex mb-1">
          <div className="text-uppercase font-weight-bold text-dark mr-auto">
            <FormattedMessage id="statistics.newUsers" />
          </div>
          <div>
            20% <FormattedMessage id="statistics.goalReached" />
          </div>
        </div>
        <div className="d-flex mb-2">
          <div className="font-size-24 font-weight-bold text-success mr-auto">
            +3,125
          </div>
          <div className="font-size-24 text-gray-4">5,000</div>
        </div>
        <div className="progress">
          <div
            className="progress-bar bg-success"
            style={{
              width: '50%',
            }}
            role="progressbar"
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    );
  }
}

export default General12v3;
