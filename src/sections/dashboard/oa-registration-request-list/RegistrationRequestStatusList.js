import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
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
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
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
import RegistrationTableToolbar from './RegistrationTableToolbar';
import { HOG_API } from '../../../config';

// ----------------------------------------------------------------------

const TABLE_HEAD_REQUESTS = [
  { id: 'requestId', label: 'Request ID', align: 'left' },
  { id: 'requestDate', label: 'Request Date', align: 'left' },
  { id: 'section ', label: 'Section', align: 'left', width: '18%' },
  { id: 'requestedBy', label: 'Requested by (EP)', align: 'left', width: '16%' },
  { id: 'registredCourses', label: 'Registered Courses(s)', align: 'center', width: '18%' },
  { id: 'moreInfo' },
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
  const dataFetchedRef = useRef(false);
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
  // useEffect(() => {
  //   setTableData(TABLE_DATA_REQUESTS);
  // }, []);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterRole, setFilterRole] = useState('PendingOA');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterRole !== '' || filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole);

  const getLengthByStatus = (role) => tableData.filter((item) => item.role === role).length;
  const getLengthByReceipt = (receipt) => tableData.filter((item) => item.receipt === receipt).length;

  const TABS = [
    { value: 'PendingOA', label: 'All', color: 'warning', count: getLengthByStatus('PendingOA') },
    { value: 'Complete', label: 'Completed', count: getLengthByReceipt('Complete'), color: 'success' },
    { value: 'Incomplete', label: 'Incomplete', count: getLengthByReceipt('Incomplete'), color: 'error' },
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
    setFilterRole('');
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
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/course-registration/oa-request-status/${row.id}`)}
                    >
                      <TableCell align="left" sx={{ pl: 5.5 }} > {row.id} </TableCell>
                      <TableCell align="left">{row.requestDate}</TableCell>
                      <TableCell align="left">{row.section}</TableCell>
                      <TableCell align="left">{row.requestedBy}</TableCell>
                      <TableCell align="center">{row.registeredCourses}</TableCell>
                      {/* <TableCell align="left" /> */}
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

  if (filterName) {
    inputData = inputData.filter((request) =>
      request.id === parseInt(filterName, 10) ||
      request.requestDate.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      request.section.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterRole !== '') {
    console.log(inputData);
    if (filterRole === 'Incomplete') {
      inputData = inputData.filter((request) => request.receipt === 'Incomplete');
    } else {
      inputData = inputData.filter((request) => request.role === filterRole);
    }
  }

  return inputData;
}
