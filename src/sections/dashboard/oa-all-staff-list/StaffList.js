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
import ToolbarStaffSearch from './ToolbarStaffSearch';

// ----------------------------------------------------------------------
function createData(id, fullname, nickname) {
  return { id, fullname, nickname };
}

const TABLE_HEAD = [
  { id: 'id', label: 'Staff ID', align: 'left' },
  { id: 'fullname', label: 'Fullname', align: 'left' },
  { id: 'nickname', label: 'Nickname', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'details', label: '', align: 'left' },
];

// ----------------------------------------------------------------------

StaffList.propTypes = {
  allStaffs: PropTypes.array,
}
export default function StaffList({ allStaffs }) {
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

  const [tableData, setTableData] = useState(allStaffs);
  // const [tableData, setTableData] = useState();
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

  // console.log(dataFiltered)


  return (
    <div>
      <ToolbarStaffSearch
        isFiltered={isFiltered}
        filterValue={filterValue}
        onFilterValue={handleFilterValue}
        isDefault={isDefault}
        open={openFilter}
        onOpen={handleOpenFilter}
        onClose={handleCloseFilter}
        onResetFilter={handleResetFilter}
      />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>


        <Scrollbar>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
            />

            <TableBody>
              {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/account/staff-management/staff/${row.id}`)}
                >
                  <TableCell align="left"> {row.id} </TableCell>
                  <TableCell align="left">{row.fName} {row.lName}</TableCell>
                  <TableCell align="left">{row.nickname}</TableCell>
                  <TableCell align="left">{row.role}</TableCell>
                  <TableCell align="right">
                    <Iconify icon="ic:chevron-right" sx={{ mr: 5 }} />
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
    // inputData = inputData.filter((user) => user.fName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||user.lName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.nickname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.id === parseInt(filterValue, 10));
    // inputData = inputData.filter((user) => user.fullname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.nickname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.id === parseInt(filterValue, 10));
    inputData = inputData.filter((user) => user.fName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
      user.nickname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
      user.lName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
      user.role.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1);

  }

  return inputData;
}
