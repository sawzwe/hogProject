import { useState, useEffect } from 'react';
import sumBy from 'lodash/sumBy';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
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
  Typography
} from '@mui/material';
// utils
import { fTimestamp } from '../../../utils/formatTime';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import LeavingTableToolbar from './LeavingTableToolbar';
import ConfirmDialog from '../../../components/confirm-dialog';


function createData(id, requestDate, fullname, nickname, role) {
  return { id, requestDate, fullname, nickname, role };
}

const TABLE_HEAD_REQUESTS = [
  { id: 'requestId', label: 'Request ID', align: 'left' },
  { id: 'requestDate', label: 'Request Date', align: 'left' },
  { id: 'courseType', label: 'Lecturer Name', align: 'left' },
  { id: 'section ', label: 'Lecturer Nickname', align: 'left', width: 200 },
  { id: 'moreInfo' },
];

// const TABLE_DATA_REQUESTS = [
//   // Table {  RID,    Req Date ,    Fullname , Nickname    role}
//   createData('R302', '28-Nov-2022', 'Piyapat Arunrung', 'Tem ', 'all'),
//   createData('R888', '15-Dec-2022', 'Kanokpong Natapiwat', 'Champ', 'approved'),
//   createData('R345', '28-Nov-2022', 'Chalathip Treewanich', 'Pie', 'all'),
//   createData('R222', '02-Dec-2022', 'Surawat Udompak', 'Tle', 'rejected'),
//   createData('R892', '02-Dec-2022', 'Jaree Jantaraprasert', 'Kun', 'rejected'),
// ];

const TABLE_DATA_REQUESTS = [
  // Table {  RID,    Req Date ,    Fullname , Nickname    role}
  createData(1, '28-Nov-2022', 'Piyapat Arunrung', 'Tem ', 'all'),
  createData(2, '15-Dec-2022', 'Kanokpong Natapiwat', 'Champ', 'approved'),
  createData(3, '28-Nov-2022', 'Chalathip Treewanich', 'Pie', 'all'),
  createData(4, '02-Dec-2022', 'Surawat Udompak', 'Tle', 'rejected'),
  createData(5, '02-Dec-2022', 'Jaree Jantaraprasert', 'Kun', 'rejected'),

];
const errorTheme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#D12E24',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#D12E24',
    },
  },
});

// ----------------------------------------------------------------------

export default function RegistrationRequestStatusList() {

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(TABLE_DATA_REQUESTS);
  }, []);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterRole, setFilterRole] = useState('all');

  const [currentId, setCurrentId] = useState(-1)

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterRole !== 'all' || filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole);

  const getLengthByStatus = (role) => tableData.filter((item) => item.role === role).length;

  const TABS = [
    { value: 'all', label: 'All', color: 'warning', count: getLengthByStatus('all') },
    { value: 'approved', label: 'Approved', count: getLengthByStatus('approved'), color: 'success' },
    { value: 'rejected', label: 'Rejected', count: getLengthByStatus('rejected'), color: 'error' },
  ];


  // const handleOpenConfirm = () => {
  //   setOpenConfirm(true);
  // };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };


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

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selected.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selected.length === dataFiltered.length) {
        setPage(0);
      } else if (selected.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selected.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
  };

  const acceptRequest = (currentId) => {
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
              sx={{ ml: 'auto' }}
              icon={
                <Label color={TABS[1].color} sx={{ mr: 1 }}>
                  {TABS[1].count}
                </Label>
              } />
            <Tab
              key={TABS[2].value}
              value={TABS[2].value}
              label={TABS[2].label}
              icon={
                <Label color={TABS[2].color} sx={{ mr: 1 }}>
                  {TABS[2].count}
                </Label>
              } />
          </Tabs>
          <Divider />

          <LeavingTableToolbar
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
                    >
                      <TableCell align="left" > R{row.id} </TableCell>
                      <TableCell align="left">{row.requestDate}</TableCell>
                      <TableCell align="left">{row.fullname}</TableCell>
                      <TableCell align="left">{row.nickname}</TableCell>
                      <TableCell>
                        <Tooltip title="More Info">
                          {/* <IconButton onClick={() => handleOpenConfirm(row.id)}>
                            <Iconify icon="ic:chevron-right" />
                          </IconButton> */}
                          <IconButton variant="contained" color="success" onClick={() => acceptRequest(row.id)}>
                            <Link to={`/dashboard/leaving-request-office-admin/${parseInt(row.id, 10)}`} style={{ textDecoration: 'none', color: 'black' }}>
                              <Iconify icon="ic:chevron-right" />
                            </Link>
                          </IconButton>
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

          {/* <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Take the Request"
            content="Once the request is taken, only you can see the request and proceed it."
            action={
              <Button variant="contained" color="success" onClick={() => acceptRequest(currentId)}>
                <Link to= {`/dashboard/leaving-request-office-admin/${parseInt(currentId,10)}`} style={{ textDecoration: 'none' ,color:'white'}}>
                Take Request
                </Link>
              </Button>
            }
          /> */}

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
  filterStatus,
  filterRole,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // if (filterName) {
  //   inputData = inputData.filter((request) => request.id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.fullname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.nickname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  // }

  if (filterName) {
    inputData = inputData.filter((request) => request.id === parseInt(filterName, 10) || request.fullname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.nickname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }


  if (filterRole !== '') {
    inputData = inputData.filter((request) => request.role === filterRole);
  }

  return inputData;
}
