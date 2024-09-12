import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getAllGrandsApi } from '../../../../../redux/statistic/api';

const General2v2 = () => {
  const [number, setNumber] = useState();

  useEffect(() => {
    getAllGrandsApi().then((result) => {
      setNumber(result.count);
    });
  }, []);

  return (
    <div className="d-flex flex-wrap align-items-center">
      <div className="mr-auto">
        <div className="text-uppercase text-dark font-weight-bold mb-1">
          <FormattedMessage id="topBar.TotalNumberOfGrantsAwarded" />
        </div>
        <div className="text-gray-5 mb-0">
          <FormattedMessage id="topBar.NumberOfCallsForGrants" />
        </div>
      </div>
      <p className="text-primary font-weight-bold font-size-24 mb-0">
        {number}
      </p>
    </div>
  );
};

export default General2v2;
