import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react';
import sumBy from 'lodash/sumBy';
import axios from 'axios';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
  Typography,
  Box
} from '@mui/material';
// utils
import { fTimestamp, fDate } from '../../../utils/formatTime';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
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
import RegistrationTableToolbar from './RegistrationTableToolbar';
import { HOG_API } from '../../../config';

function createData(id, requestDate, courseType, section, registeredCourses, requestedBy, role, receipt) {
  return { id, requestDate, courseType, section, registeredCourses, requestedBy, role, receipt };
}

const TABLE_HEAD_REQUESTS = [
  { id: 'requestId', label: 'Request ID', align: 'left' },
  { id: 'requestDate', label: 'Request Date', align: 'left' },
  { id: 'section ', label: 'Section', align: 'left', width: '18%' },
  { id: 'requestedBy', label: 'Requested by (EP)', align: 'left', width: '16%' },
  { id: 'registredCourses', label: 'Registered Courses(s)', align: 'center', width: '18%' },
  { id: 'incomplete' },
  { id: 'moreInfo' },
];

const TABLE_DATA_REQUESTS = [
  // Table {  RID,    Req Date ,     courseType,     section,           regiscourses, requestedBy,      role,   Receipt }
  createData(222, '30-Oct-2022', 'Group', 'Class 20', 1, 'Nirawit(Boss)', 'PendingEA', 'None'),
  createData(102, '16-Nov-2022', 'Private', 'Thanatuch Lertritsirkul', 2, 'Nirawit(Boss)', 'PendingEP', 'Incomplete'),
  createData(545, '28-Nov-2022', 'Private', 'Saw Zwe Wai Yan', 1, 'Nirawit(Boss)', 'PendingEA', 'Pending'),
  createData(565, '30-Nov-2022', 'Semi Private', 'Semi Group 20', 1, 'Nirawit(Boss)', 'PendingOA', 'Complete'),
  createData(585, '25-Dec-2022', 'Private', 'Piyaphon Wu', 2, 'Nirawit(Boss)', 'PendingOA', 'Complete'),
  createData(458, '30-Dec-2022', 'Group', 'Class 23', 1, 'Nirawit(Boss)', 'PendingEP', 'Complete'),
  createData(123, '15-Dec-2022', 'Group', 'Class 50', 1, 'Nirawit(Boss)', 'Complete', 'Complete'),
  createData(451, '18-Dec-2022', 'Private', 'Zain', 1, 'Nirawit(Boss)', 'Reject', 'None'),
  createData(111, '27-Dec-2022', 'Private', 'Pan', 1, 'Nirawit(Boss)', 'Complete', 'Complete'),
  createData(333, '02-Dec-2022', 'Group', 'Class 80', 1, 'Nirawit(Boss)', 'Reject', 'None'),
  createData(845, '02-Dec-2022', 'Private', 'Tar', 1, 'Nirawit(Boss)', 'Reject', 'None'),
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
RegistrationRequestStatusList.propTypes = {
  registrationRequests: PropTypes.array
}


export default function RegistrationRequestStatusList({ registrationRequests }) {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const dataFetchedRef = useRef(false);

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

  // / Table {  RID,    Req Date ,     courseType,     section,           regiscourses, requestedBy,      role,   Receipt }
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    registrationRequests.map((request) => {
      return axios.get(`${HOG_API}/api/EP/Get/${request.request.takenByEPId}`)
        .then((res) => {
          const newData = {
            id: request.request.id,
            requestDate: fDate(request.request.dateCreated, 'dd-MMM-yyyy'),
            courseType: request.request.courseType,
            section: request.request.section,
            registeredCourses: request.information.length,
            requestedBy: `${res.data.data.fName} (${res.data.data.nickname})`,
            role: request.request.status,
            receipt: request.request.paymentStatus,
          }
          setTableData(tableData => [...tableData, newData])
        })
    })
  }, []);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterRole, setFilterRole] = useState('PendingEA');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterRole !== 'pendingEA' || filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole);

  const getLengthByStatus = (role) => tableData.filter((item) => item.role === role).length;

  const TABS = [
    { value: 'PendingEA', label: 'Pending EA', count: getLengthByStatus('PendingEA') },
    { value: 'PendingEP', label: 'Pending Payment', color: 'warning', count: getLengthByStatus('PendingEP') },
    { value: 'PendingOA', label: 'Pending OA', count: getLengthByStatus('PendingOA') },
    { value: 'Complete', label: 'Completed', count: getLengthByStatus('Complete'), color: 'success' },
    { value: 'Reject', label: 'Rejected', count: getLengthByStatus('Reject'), color: 'error' },
  ];


  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

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
    setFilterRole('pendingEA');
  };

  if (!dataFetchedRef.current) return (
    <LoadingScreen />
  )

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
              icon={
                <Label color={TABS[2].color} sx={{ mr: 1 }}>
                  {TABS[2].count}
                </Label>
              } />
            <Tab
              key={TABS[3].value}
              value={TABS[3].value}
              label={TABS[3].label}
              sx={{ ml: 'auto' }}
              icon={
                <Label color={TABS[3].color} sx={{ mr: 1 }}>
                  {TABS[3].count}
                </Label>
              } />
            <Tab
              key={TABS[4].value}
              value={TABS[4].value}
              label={TABS[4].label}
              icon={
                <Label color={TABS[4].color} sx={{ mr: 1 }}>
                  {TABS[4].count}
                </Label>
              } />
          </Tabs>
          <Divider />

          <RegistrationTableToolbar
            filterName={filterName}
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
                      onClick={() => navigate(`/course-registration/ep-request-status/${row.id}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="left" sx={{ pl: 5.5 }} > {row.id} </TableCell>
                      <TableCell align="left">{row.requestDate}</TableCell>
                      <TableCell align="left">{row.section}</TableCell>
                      <TableCell align="left">{row.requestedBy}</TableCell>
                      <TableCell align="center">{row.registeredCourses}</TableCell>

                      {row.receipt === 'Incomplete' ? (
                        <TableCell align="left">
                          <Tooltip title="Incomplete Payment">
                            <IconButton>
                              <Iconify icon="ic:error" color="#FF3030" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      ) :
                        <TableCell align="left" />
                      }

                      <TableCell>
                        <Iconify icon="ic:chevron-right" />
                      </TableCell>

                    </TableRow>
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
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
  //   inputData = inputData.filter((request) => request.id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.section.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.courseType.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  // }
  if (filterName) {
    inputData = inputData.filter((request) =>
      request.id === parseInt(filterName, 10) ||
      request.requestDate.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      request.section.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterRole !== '') {
    inputData = inputData.filter((request) => request.role === filterRole);
  }



  return inputData;
}
