import { useState, useEffect } from 'react';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TableRow,
  TableCell, createTheme, ThemeProvider,
} from '@mui/material';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import StaffTableToolbar from './StaffTableToolbar';
import ConfirmDialog from '../../../components/confirm-dialog';
// import Condition from 'yup/lib/Condition';

// ----------------------------------------------------------------------

function createData(id, requestDate, requestType, fullname, nickname, requestedBy, role) {
  return { id, requestDate, requestType, fullname, nickname, requestedBy, role };
}

const TABLE_HEAD_REQUESTS = [
  { id: 'requestId', label: 'Request ID', align: 'left' },
  { id: 'requestDate', label: 'Request Date', align: 'left' },
  { id: 'requestType', label: 'Request Type', align: 'left' },
  { id: 'fullname ', label: 'Fullname', align: 'left', width: 200 },
  { id: 'registredCourses', label: 'Nickname', align: 'left', width: 200 },
  { id: 'requestedBy', label: 'Role', align: 'left' },
  { id: 'moreInfo' },
];

const TABLE_DATA_REQUESTS = [
  // Table {  RID,    Req Date ,     requestType,     fullname,           regiscourses, requestedBy,      role,   Receipt }
  createData(1, '30-Oct-2022', 'Course Transfering', 'Alpha Zain', 'Zain', 'EP', 'available'),
  createData(2, '16-Nov-2022', 'Course Transfering', 'Thanatuch Lertritsirkul', 'Tar', 'EP', 'myRequest'),
  createData(3, '28-Nov-2022', 'Personal Leaving', 'Saw Zwe Wai Yan', 'Saw', 'Teacher', 'available'),
  createData(4, '30-Nov-2022', 'Personal Leaving', 'Monkey D.', 'Luffy', 'Teacher', 'available'),
  createData(5, '25-Dec-2022', 'Course Transfering', 'Piyaphon Wu', 'Hong', 'EP', 'available'),
  createData(6, '30-Dec-2022', 'Personal Leaving', 'Sigma Jeff', 'Jeff', 'Teacher', 'myRequest'),
  createData(7, '15-Dec-2022', 'Personal Leaving', 'Peter Parker', 'Spider', 'Teacher', 'completed'),
  createData(8, '18-Dec-2022', 'Personal Leaving', 'Fruit Punch', 'Peach', 'Teacher', 'rejected'),
  createData(9, '27-Dec-2022', 'Course Transfering', 'Pan', 'Pancake', 'EP', 'completed', ''),
  createData(10, '02-Dec-2022', 'Personal Leaving', 'Class 80', 'Jane', 'Teacher', 'rejected'),
  createData(11, '02-Dec-2022', 'Course Transfering', 'Tar', 'Shi', 'EP', 'rejected'),

];


const errorTheme = createTheme({
  palette: {
    primary: {
      main: '#D12E24',
    },
    secondary: {
      main: '#D12E24',
    },
  },
});

// ----------------------------------------------------------------------

export default function StaffRequestStatusList() {

  const navigate = useNavigate();

  const { themeStretch } = useSettingsContext();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(TABLE_DATA_REQUESTS);
  }, []);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('available');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openConfirmLeave, setOpenConfirmLeave] = useState(false);

  const [openConfirmTransfer, setOpenConfirmTransfer] = useState(false);


  const [currentId, setCurrentId] = useState(-1);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  // const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterRole !== 'available' || filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole);

  const getLengthByStatus = (role) => tableData.filter((item) => item.role === role).length;

  const TABS = [
    { value: 'available', label: 'Staffs', color: 'warning', count: getLengthByStatus('available') },
    { value: 'myRequest', label: 'My Requests', color: 'warning', count: getLengthByStatus('myRequest') },
    { value: 'completed', label: 'Completed', count: getLengthByStatus('completed'), color: 'success' },
    { value: 'rejected', label: 'Rejected', count: getLengthByStatus('rejected'), color: 'error' },
  ];


  const handleFilterRole = (event, newValue) => {
    setPage(0);
    setFilterRole(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpenConfirm = (currentId) => {
    setCurrentId(currentId);
    setOpenConfirm(true);
  };

  const navigateTo = (requestType, currentId) => {
    if (requestType === 'Course Transfering') {
      navigate(`/dashboard/request-management/staff-request/transfer-req/${currentId}`)
    } else {
      navigate(`/dashboard/request-management/staff-request/leave-req/${currentId}`);
    }
  }

  const openDialog = (requestType, currentId) => {
    if (requestType === 'Course Transfering') {
      setOpenConfirmTransfer(true);
    }
    else{
      setOpenConfirmLeave(true);
    }
  };

  const handleClickRequest = (currentId, requestType, role) => {
    setCurrentId(currentId);
    if (role === 'available') { 
      openDialog(requestType, currentId);
    } 
     else {
      navigateTo(requestType, currentId);
    };
  }


  const handleCloseConfirm = () => {
    setOpenConfirmTransfer(false);
    setOpenConfirmLeave(false);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('available');
  };

  const acceptRequest = (currentId, tableData, setTableData) => {
    const newRow = tableData.find(el => (el.id === currentId))
    newRow.role = 'myRequest';
    const newTableData = tableData.filter(el => el.id !== currentId);
    setTableData([...newTableData, newRow])
    setOpenConfirm(false);
  };
  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <Tabs
            value={filterRole}
            onChange={handleFilterRole}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
            scrollButtons={false}
          >
            <Tab
              key={TABS[0].value}
              value={TABS[0].value}
              label={TABS[0].label}
              icon={
                <Label color={TABS[0].color} sx={{ mr: 1 }}>
                  {TABS[0].count}
                </Label>
              } />
            <Tab
              key={TABS[1].value}
              value={TABS[1].value}
              label={TABS[1].label}
              icon={
                <Label color={TABS[1].color} sx={{ mr: 1 }}>
                  {TABS[1].count}
                </Label>
              } />
            <Tab
              key={TABS[2].value}
              value={TABS[2].value}
              label={TABS[2].label}
              sx={{ ml: 'auto' }}
              icon={
                <Label color={TABS[2].color} sx={{ mr: 1 }}>
                  {TABS[2].count}
                </Label>
              } />
            <Tab
              key={TABS[3].value}
              value={TABS[3].value}
              label={TABS[3].label}
              icon={
                <Label color={TABS[3].color} sx={{ mr: 1 }}>
                  {TABS[3].count}
                </Label>
              } />
          </Tabs>
          <Divider />

          <StaffTableToolbar
            filterName={filterName}
            isFiltered={isFiltered}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD_REQUESTS}
                />
                  
                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow
                      hover
                      key={row.id}
                      onClick={() => handleClickRequest(row.id, row.requestType, row.role)}
                      sx={{ textDecoration: 'none' }}
                    >
                      <TableCell align="left" > {row.id} </TableCell>
                      <TableCell align="left">{row.requestDate}</TableCell>
                      <TableCell align="left">{row.requestType}</TableCell>
                      <TableCell align="left">{row.fullname}</TableCell>
                      <TableCell align="left">{row.nickname}</TableCell>
                      <TableCell align="left">{row.requestedBy}</TableCell>
                      <TableCell>
                        <Tooltip title="More Info">
                          {row.role === 'available' ? (
                            <IconButton onClick={() => handleOpenConfirm(row.id, row.requestType)}>
                              <Iconify icon="ic:chevron-right" />
                            </IconButton>) : (
                            <IconButton>
                              <Iconify icon="ic:chevron-right" />
                            </IconButton>
                          )}
                        </Tooltip>
                      </TableCell>

                    </TableRow>
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />

                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <ConfirmDialog
            open={openConfirmLeave}
            onClose={handleCloseConfirm}
            title="Take the Leave Request"
            content="Once the request is taken, only you can see the request and proceed it."
            action={
              <Button variant="contained" color="success" onClick={() => acceptRequest(currentId, tableData, setTableData)}>
                <Link to={`/dashboard/request-management/staff-request/leave-req/${parseInt(currentId, 10)}`} style={{ textDecoration: 'none', color: 'white' }}>
                  Take Request
                </Link>
              </Button>
            }
          />

          <ConfirmDialog
            open={openConfirmTransfer}
            onClose={handleCloseConfirm}
            title="Take the Transfer Request"
            content="Once the request is taken, only you can see the request and proceed it."
            action={
              <Button variant="contained" color="success" onClick={() => acceptRequest(currentId, tableData, setTableData)}>
                <Link to={`/dashboard/request-management/staff-request/transfer-req/${parseInt(currentId, 10)}`} style={{ textDecoration: 'none', color: 'white' }}>
                  Take Request
                </Link>
              </Button>
            }
          />
          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>


    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterRole,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((request) =>
      request.id === parseInt(filterName, 10) ||
      // request.id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      request.fullname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      request.nickname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterRole !== '') {
    inputData = inputData.filter((request) => request.role === filterRole);
  }

  return inputData;
}

