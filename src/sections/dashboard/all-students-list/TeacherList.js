import PropTypes from 'prop-types'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

// @mui
import { Table, Tooltip, TableRow, TableBody, TableCell, IconButton, TableContainer } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
//
import ToolbarTeacherSearch from './ToolbarTeacherSearch';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'id', label: 'Teacher ID', align: 'left' },
  { id: 'fullname', label: 'Fullname  ', align: 'left' },
  { id: 'nickname', label: 'Nickname  ', align: 'left' },
  { id: 'details', label: ' ', align: 'left' },
];

// ----------------------------------------------------------------------

TeacherList.propTypes = {
  teacherTableData: PropTypes.array,
}
export default function TeacherList({teacherTableData}) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'id',
  });

  const navigate = useNavigate();

  const [tableData, setTableData] = useState(teacherTableData);
  const [openConfirm, setOpenConfirm] = useState(false);


  // useEffect(() => {
  //   setTableData(TABLE_DATA);
  // }, []);

  // Search
  const [filterValue, setFilterValue] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterValue,
  });

  // Filter
  const [openFilter, setOpenFilter] = useState(false);

  const isFiltered = filterValue !== '';
  const isNotFound =
    (!dataFiltered.length && !!filterValue);


  const defaultValues = {
    gender: [],
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    formState: { dirtyFields },
  } = methods;

  const isDefault =
    (!dirtyFields.gender) ||
    false;

  const values = watch();

  const handleResetFilter = () => {
    reset();
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleFilterValue = (event) => {
    setFilterValue(event.target.value);
  };

  const acceptRequest = (currentId) => {
    setOpenConfirm(false);
  };


  return (
    <div>
      <ToolbarTeacherSearch
        isFiltered={isFiltered}
        filterValue={filterValue}
        onFilterValue={handleFilterValue}
        isDefault={isDefault}
        open={openFilter}
        onOpen={handleOpenFilter}
        onClose={handleCloseFilter}
        onResetFilter={handleResetFilter} />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>


        <Scrollbar>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
            />

            <TableBody>
              {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  onClick={() => navigate(`/account/teacher-management/teacher/${parseInt(row.id, 10)}`)}
                  sx={{cursor: "pointer"}}
                  >
                  <TableCell align="left" > {row.id} </TableCell>
                  <TableCell align="left">{row.fName} {row.lName}</TableCell>
                  <TableCell align="left">{row.nickname}</TableCell>
                  <TableCell align="right">
                    <Iconify icon="ic:chevron-right" sx={{mr: 5}} />
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </div>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterValue }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterValue) {
    inputData = inputData.filter((user) => user.fName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||user.lName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.nickname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.id === parseInt(filterValue, 10));
  }

  return inputData;
}
