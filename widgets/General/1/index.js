import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { getAllTendersApi } from "../../../redux/statistic/api";

const General1 = () => {
  const [number, setNumber] = useState();

  useEffect(() => {
    getAllTendersApi()
      .then((result) => {
        setNumber(result.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <div className="text-uppercase text-dark font-weight-bold mb-1">
        <FormattedMessage id="topBar.TotalNumberOfPublishedCalls" />
      </div>
      <p className="text-dark font-size-48 font-weight-bold mb-2">{number}</p>
    </div>
  );
};

export default General1;
