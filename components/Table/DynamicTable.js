import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const DynamicTable = (props) => {
  const { data, columns } = props;
  const [tableColumns, setTableColumns] = useState([]);
  var dynamicColumns = [];

  useEffect(() => {
    columns.forEach((element) => {
      var column = {
        title: element.title,
        dataIndex: element.dataIndex,
        key: element.name,
      };
      if (element.width) {
        column.width = element.width;
      }
      if (element.align) {
        column.align = element.align;
      }
      dynamicColumns.push(column);
    });
    setTableColumns(dynamicColumns);
  }, []);

  return (
    <div>
      <Table dataSource={data} columns={tableColumns} pagination={false} />
    </div>
  );
};

export default DynamicTable;
