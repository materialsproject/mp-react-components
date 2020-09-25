import React, { useState } from 'react';
import { useMaterialsSearch } from './MaterialsSearchProvider';
import DataTable from 'react-data-table-component';

interface Props {
  className: string
}

export const MaterialsDataTable: React.FC<Props> = (props) => {
  const { state, actions } = useMaterialsSearch();
  const [data, setData] = useState(state.results);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const columns = [
    {
      name: 'Material Id',
      selector: 'task_id',
      sortable: true
    },
    {
      name: 'Formula',
      selector: 'formula_pretty',
      sortable: true
    },
    {
      name: 'Volume',
      selector: 'volume',
      sortable: true
    }
  ];

  const handlePageChange = async page => {
    console.log(page);
    actions.getData(page);
  }

  // const handlePerRowsChange = async (perPage, page) => {
  //   this.setState({ loading: true });

  //   const response = await axios.get(
  //     `https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`,
  //   );

  //   this.setState({
  //     loading: false,
  //     data: response.data.data,
  //     perPage,
  //   });
  // }
  return (
    <DataTable
      className={props.className}
      title="Materials"
      theme="material"
      columns={columns}
      data={state.results}
      selectableRows
      highlightOnHover
      pagination
      paginationServer
      onChangePage={handlePageChange}
      progressPending={state.loading}
      paginationTotalRows={state.totalResults}
    />
  );
}
