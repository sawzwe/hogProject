import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
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

// function createData(id, fullname, nickname) {
//   return { id, fullname, nickname };
// }

// const TABLE_DATA = [
//   createData(12, 'Saw Zwe Wai Yan', 'ASaw'),
//   createData(15, 'Siwach Toprasert', 'APan'),
//   createData(879, 'Piyaphon Wu', 'Hong'),
//   createData(122, 'Jeffrey Zhi Chi Chong', 'Jeff'),
//   createData(2, 'Thanatuch Lertritsirikul', 'Tar'),
//   createData(272, 'Zain Ijaz Janpatiew', 'Zain'),
//   createData(662, 'Saw Zwe Wai Yan', 'Saw'),
//   createData(85, 'Siwach Toprasert', 'Pan'),
//   createData(52, 'Piyaphon Wu', 'Hong'),
//   createData(162, 'Jeffrey Zhi Chi Chong', 'Jeff'),
//   createData(422, 'Thanatuch Lertritsirikul', 'Tar'),
//   createData(984, 'Zain Ijaz Janpatiew', 'Zain'),
//   createData(155, 'Saw Zwe Wai Yan', 'Saw'),
//   createData(468, 'Siwach Toprasert', 'Pan'),
//   createData(777, 'Piyaphon Wu', 'Hong'),
//   createData(666, 'Jeffrey Zhi Chi Chong', 'Jeff'),
//   createData(333, 'Thanatuch Lertritsirikul', 'Tar'),
//   createData(222, 'Zain Ijaz Janpatiew', 'Zain'),

// ];

const TABLE_HEAD = [
  { id: 'id', label: 'Teacher ID', align: 'left' },
  { id: 'fullname', label: 'Fullname  ', align: 'left' },
  { id: 'nickname', label: 'Nickname  ', align: 'left' },
  { id: 'ongoing', label: 'Ongoing Courses', align: 'center' },
  { id: 'details', label: ' ', align: 'left' },
];

// ----------------------------------------------------------------------
TeacherCourseList.propTypes = {
  teacherCourseData: PropTypes.array,
};

export default function TeacherCourseList({ teacherCourseData }) {
  const navigate = useNavigate();
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

  const [tableData, setTableData] = useState(teacherCourseData);

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
        open={openFilter}
        onOpen={handleOpenFilter}
        onClose={handleCloseFilter}
      />

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
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/account/teacher-management/teacher-course/${row.id}`)}
                >
                  <TableCell align="left" align="left" sx={{ pl: 5.5 }}> {row.id} </TableCell>
                  <TableCell align="left">{row.fullName}</TableCell>
                  <TableCell align="left">{row.nickname}</TableCell>
                  <TableCell align="center">{row.courseCount}</TableCell>
                  <TableCell>
                    <Iconify icon="ic:chevron-right" />
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
    // inputData = inputData.filter((user) => user.fullname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.nickname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||  user.id === parseInt(filterValue,10));
    inputData = inputData.filter((user) =>
      user.fullName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
      user.nickname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
      user.id === parseInt(filterValue, 10));
  }

  return inputData;
}
