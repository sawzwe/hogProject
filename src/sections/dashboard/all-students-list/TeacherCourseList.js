import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import ToolbarTeacherSearchCourse from './ToolbarTeacherSearchCourse';

// ----------------------------------------------------------------------

function createData(id, fullname, nickname) {
  return { id, fullname, nickname };
}

const TABLE_DATA = [
  createData(12, 'Saw Zwe Wai Yan', 'ASaw'),
  createData(15, 'Siwach Toprasert', 'APan'),
  createData(879, 'Piyaphon Wu', 'Hong'),
  createData(122, 'Jeffrey Zhi Chi Chong', 'Jeff'),
  createData(2, 'Thanatuch Lertritsirikul', 'Tar'),
  createData(272, 'Zain Ijaz Janpatiew', 'Zain'),
  createData(662, 'Saw Zwe Wai Yan', 'Saw'),
  createData(85, 'Siwach Toprasert', 'Pan'),
  createData(52, 'Piyaphon Wu', 'Hong'),
  createData(162, 'Jeffrey Zhi Chi Chong', 'Jeff'),
  createData(422, 'Thanatuch Lertritsirikul', 'Tar'),
  createData(984, 'Zain Ijaz Janpatiew', 'Zain'),
  createData(155, 'Saw Zwe Wai Yan', 'Saw'),
  createData(468, 'Siwach Toprasert', 'Pan'),
  createData(777, 'Piyaphon Wu', 'Hong'),
  createData(666, 'Jeffrey Zhi Chi Chong', 'Jeff'),
  createData(333, 'Thanatuch Lertritsirikul', 'Tar'),
  createData(222, 'Zain Ijaz Janpatiew', 'Zain'),

];

const TABLE_HEAD = [
  { id: 'id', label: 'Student ID', align: 'left' },
  { id: 'fullname', label: 'Fullname  ', align: 'left' },
  { id: 'nickname', label: 'Nickname  ', align: 'left' },
  { id: 'details', label: ' ', align: 'left' },
];

// ----------------------------------------------------------------------

export default function TeacherCourseList() {
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

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(TABLE_DATA);
  }, []);

  // Search
  const [filterValue, setFilterValue] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterValue,
  });

  // Filter
  const [openFilter, setOpenFilter] = useState(false);

  const isFiltered = filterValue !== '' ;
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


  return (
    <div>
      <ToolbarTeacherSearchCourse 
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
                >
                  <TableCell align="left" > T{row.id} </TableCell>
                  <TableCell align="left">{row.fullname}</TableCell>
                  <TableCell align="left">{row.nickname}</TableCell>
                  <TableCell>
                    <Tooltip title="More Info">
                      <IconButton>
                        <Iconify icon="ic:chevron-right" />
                      </IconButton>
                    </Tooltip>
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
        //
        // dense={dense}
        // onChangeDense={onChangeDense}
      />
    </div>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator,filterValue }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterValue) {
    inputData = inputData.filter((user) => user.fullname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.nickname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||  user.id === parseInt(filterValue,10));
}

  return inputData;
}