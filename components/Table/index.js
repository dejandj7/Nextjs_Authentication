import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, message } from "antd";

const PagedTable = (props) => {
  const {
    columns,
    getDataApi,
    collection,
    successMessage,
    errorMessage,
    rowKey,
    filters,
    order,
    expandable,
    selectedRows,
    deleteRow,
  } = props;
  const controller = new AbortController();
  // Loading flag
  const [isLoading, setIsLoading] = useState(false);
  // Selected row keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // Selected rows per page
  const [selectedRowsOnPage, setSelectedRowsOnPage] = useState([]);
  // Selected rows data per page
  const [selectedRowsDataOnPage, setSelectedRowsDataOnPage] = useState([]);
  // Data
  const [data, setData] = useState([]);
  // Pagination data
  const [paginationData, setPaginationData] = useState({
    current: 1,
    pageSize: 10,
  });

  function handleTableChange(pagination, filtersTable, sorter, extra) {
    var tableFilters = filters.map((e, i) => {
      const filter = { name: e.name, include: e.include };
      if (Object.keys(e).indexOf("searchable") > -1) {
        filter.searchable = e.searchable;
        filter.search = e.search;
      }
      return filter;
    });
    Object.keys(filtersTable).forEach((key) => {
      var filterValue = "";
      if (filtersTable[key] !== null && filtersTable[key] !== undefined) {
        const column = filters.filter((f) => f.name === key)[0];
        var regex = column.regex;
        tableFilters = tableFilters.filter((f) => f.name !== key);
        if (column.multi && Array.isArray(filtersTable[key])) {
          filterValue = "[";
          filtersTable[key].forEach(
            (e, i) =>
              (filterValue +=
                (regex ? '"' + e + '"' : e) +
                (i < filtersTable[key].length - 1 ? "," : "]"))
          );
          regex = false;
        } else {
          filterValue = filtersTable[key][0];
        }
        tableFilters.push({
          name: key,
          include: true,
          searchable: true,
          search: {
            value: filterValue,
            regex: regex,
          },
        });
      }
    });
    const pager = { ...paginationData };
    pager.current = pagination.current;
    setIsLoading(true);
    getDataApi({
      draw: 1,
      length: pagination.pageSize,
      start: pagination.current - 1,
      columns: tableFilters,
      order: order,
      collection,
    })
      .then((response) => {
        if (response.status === 200) {
          message.success(successMessage);
          setPaginationData({
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: response.data.info.results,
          });
          setData(
            response.data.results.map((o, i) => {
              o.key = i;
              return o;
            })
          );
          const index = selectedRowsOnPage
            .map((e) => e.index)
            .indexOf(pagination.current - 1);
          if (index === -1) {
            setSelectedRowsOnPage([
              ...selectedRowsOnPage,
              { index: pagination.current - 1, rowKeys: [] },
            ]);
            setSelectedRowKeys([]);
          } else {
            setSelectedRowKeys(
              selectedRowsOnPage.find(
                (page) => page.index === pagination.current - 1
              ).rowKeys
            );
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("handleTableChange : " + error);
        setIsLoading(false);
        message.error(errorMessage);
      });
  }

  useEffect(() => {
    const abortController = new AbortController();
    if (filters.length > 0) {
      setIsLoading(true);
      setSelectedRowsOnPage([
        { index: paginationData.current - 1, rowKeys: [] },
      ]);
      setSelectedRowsDataOnPage([
        { index: paginationData.current - 1, rowsData: [] },
      ]);
      setSelectedRowKeys([]);
      const params = {
        draw: 1,
        length: paginationData.pageSize,
        start: paginationData.current - 1,
        columns: filters.map((e, i) => {
          const filter = { name: e.name, include: e.include };
          if (Object.keys(e).indexOf("searchable") > -1) {
            filter.searchable = e.searchable;
            filter.search = e.search;
          }
          return filter;
        }),
        order: order,
        collection,
      };
      let aborted = abortController.signal.aborted;
      if (aborted === false) {
        getDataApi(params)
          .then((response) => {
            if (response.status === 200) {
              message.success(successMessage);
              setPaginationData({
                current: 1,
                pageSize: 10,
                total: response.data.info.results,
              });
              setData(
                response.data.results.map((o, i) => {
                  o.key = i;
                  return o;
                })
              );
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("getDataApi : " + error);
            setIsLoading(false);
            message.error(errorMessage);
          });
      }
    }

    return () => {
      abortController.abort();
    };
  }, [filters]);

  useEffect(() => {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== deleteRow));
  }, [deleteRow]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
      const index = selectedRowsOnPage
        .map((e) => e.index)
        .indexOf(paginationData.current - 1);
      selectedRowsOnPage[index] = {
        index: paginationData.current - 1,
        rowKeys: selectedRowKeys,
      };
      setSelectedRowsOnPage(selectedRowsOnPage);
      let mappedKeysToRecords = [];
      selectedRowKeys.forEach((key, index) => {
        let mappedData = data.filter((o, i) => {
          return o.key === key;
        });
        mappedKeysToRecords.push(mappedData[0]);
      });
      selectedRowsDataOnPage[index] = {
        index: paginationData.current - 1,
        rowsData: mappedKeysToRecords,
      };
      setSelectedRowsDataOnPage(selectedRowsDataOnPage);
      let rowsData = [];
      selectedRowsDataOnPage.forEach(
        (e) => (rowsData = rowsData.concat(e.rowsData))
      );
      selectedRows(rowsData);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      // Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  return (
    <Table
      rowSelection={rowSelection}
      rowKey={rowKey}
      columns={columns}
      dataSource={data}
      loading={isLoading}
      pagination={paginationData}
      onChange={handleTableChange}
      expandable={expandable}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const successMessage = ownProps.successMessage
    ? ownProps.successMessage
    : false;
  const errorMessage = ownProps.errorMessage ? ownProps.errorMessage : false;
  return {
    successMessage,
    errorMessage,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PagedTable);
