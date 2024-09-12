import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getAllApplicationsApi } from '../../../../../redux/statistic/api';

const General1v3 = () => {
  const [number, setNumber] = useState();

  useEffect(() => {
    getAllApplicationsApi().then((result) => {
      setNumber(result.count);
    });
  }, []);

  return (
    <div>
      <div className="text-uppercase text-dark font-weight-bold mb-1">
        <FormattedMessage id="title.TotalNumberOfApplicationsSubmitted" />
      </div>
      <p className="text-dark font-size-48 font-weight-bold mb-2">{number}</p>
    </div>
  );
};

export default General1v3;
