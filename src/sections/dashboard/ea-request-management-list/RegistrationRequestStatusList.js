import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
// @mui
import { LoadingButton } from '@mui/lab';
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
  TableContainer,
  TableRow,
  TableCell, createTheme, ThemeProvider,
} from '@mui/material';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import { fTimestamp, fDate } from '../../../utils/formatTime';
import { useSnackbar } from '../../../components/snackbar';
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
import RegistrationTableToolbar from './RegistrationTableToolbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import { HOG_API } from '../../../config';

// import Condition from 'yup/lib/Condition';

// ----------------------------------------------------------------------

// {Condition=== true && ()}
// {Condition=== true ? () : (else)}

function createData(id, requestDate, courseType, section, registeredCourses, requestedBy, role, receipt) {
  return { id, requestDate, courseType, section, registeredCourses, requestedBy, role, receipt };
}

const TABLE_HEAD_REQUESTS = [
  { id: 'requestId', label: 'Request ID', align: 'left' },
  { id: 'requestDate', label: 'Request Date', align: 'left' },
  // { id: 'courseType', label: 'Course Type', align: 'left' },
  { id: 'section ', label: 'Section', align: 'left', width: 200 },
  { id: 'registredCourses', label: 'Registered Courses(s)', align: 'left', width: 200 },
  { id: 'requestedBy', label: 'Requested by (EP)', align: 'left' },
  { id: 'incomplete' },
  { id: 'moreInfo' },
];

const TABLE_DATA_REQUESTS = [
  // Table {  RID,    Req Date ,     courseType,     section,           regiscourses, requestedBy,      role,   Receipt }
  createData(999, '30-Oct-2022', 'Group', 'Class 20', 1, 'Nirawit(Boss)', 'available', 'completeReceipt'),
  createData(15, '16-Nov-2022', 'Private', 'Thanatuch Lertritsirkul', 2, 'Nirawit(Boss)', 'myRequest', 'incompleteReceipt'),
  createData(488, '28-Nov-2022', 'Private', 'Saw Zwe Wai Yan', 1, 'Nirawit(Boss)', 'available', ''),
  createData(459, '30-Nov-2022', 'Semi Private', 'Semi Group 20', 1, 'Nirawit(Boss)', 'available', ''),
  createData(721, '25-Dec-2022', 'Private', 'Piyaphon Wu', 2, 'Nirawit(Boss)', 'available', ''),
  createData(123, '30-Dec-2022', 'Group', 'Class 23', 1, 'Nirawit(Boss)', 'myRequest', 'completeReceipt'),
  createData(341, '15-Dec-2022', 'Group', 'Class 50', 1, 'Nirawit(Boss)', 'completed', ''),
  createData(122, '18-Dec-2022', 'Private', 'Zain', 1, 'Nirawit(Boss)', 'rejected', ''),
  createData(114, '27-Dec-2022', 'Private', 'Pan', 1, 'Nirawit(Boss)', 'completed', ''),
  createData(10, '02-Dec-2022', 'Group', 'Class 80', 1, 'Nirawit(Boss)', 'rejected', ''),
  createData(111, '02-Dec-2022', 'Private', 'Tar', 1, 'Nirawit(Boss)', 'rejected', ''),
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


RegistrationRequestStatusList.propTypes = {
  privateRegistrationRequest: PropTypes.array,
  educationAdminId: PropTypes.number,
};

export default function RegistrationRequestStatusList({ privateRegistrationRequest, educationAdminId }) {
  // console.log('RegistrationRequestStatusList', privateRegistrationRequest);
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

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
  // const [tableData, setTableData] = useState(privateRegistrationRequest);
  useEffect(() => {
    const formattedData = privateRegistrationRequest.map((request) => {
      return {
        id: request.request.id,
        requestDate: fDate(request.request.dateCreated, 'dd-MMM-yyyy'),
        courseType: request.request.courseType,
        section: request.request.section,
        registeredCourses: request.information.length,
        requestedBy: request.request.takenByEPId,
        takenByEAId: request.request.takenByEAId,
        eaStatus: request.request.eaStatus,
        status: request.request.status,
        receipt: request.request.paymentStatus,
        epRemark1: request.request.epRemark1,
      }
    })

    setTableData(formattedData);
  }, []);
  // useEffect(() => {
  //   setTableData(TABLE_DATA_REQUESTS);
  // }, []);

  // console.log(tableData);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('InProgress');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [currentId, setCurrentId] = useState({});

  const [selectedRow, setSelectedRow] = useState({});

  const [isTakingRequest, setIsTakingRequest] = useState(false);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    educationAdminId
  });

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterRole !== 'InProgress' || filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole);

  const getLengthByStatus = (eaStatus) => tableData.filter((item) => item.eaStatus === eaStatus).length;
  const getLengthByInProgress = () => tableData.filter((item) => (item.eaStatus === 'InProgress' && item.takenByEAId === 0)).length;
  const getLengthByTakenInProgress = () => tableData.filter((item) => (item.eaStatus === 'InProgress' && item.takenByEAId === educationAdminId)).length;

  const TABS = [
    { value: "InProgress", label: 'Available Requests', color: 'warning', count: getLengthByInProgress() },
    { value: 'MyRequests', label: 'My Requests', color: 'warning', count: getLengthByTakenInProgress() },
    { value: 'Complete', label: 'Completed', count: getLengthByStatus('Complete'), color: 'success' },
    { value: 'Reject', label: 'Rejected', count: getLengthByStatus('Reject'), color: 'error' },
  ];


  const handleFilterRole = (event, newValue) => {
    setPage(0);
    setFilterRole(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpenConfirm = (row) => {
    setSelectedRow(row);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setSelectedRow({});
    setOpenConfirm(false);
  };

  const handleOpenRequest = (row) => {
    navigate(`/course-registration/ea-request-status/${row.id}`)
  }

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('available');
  };
  // console.log('After', tableData)
  const takeRequest = async () => {
    setIsTakingRequest(true);
    try {
      await axios.put(`${HOG_API}/api/PrivateRegistrationRequest/Put`, {
        request: {
          id: selectedRow.id,
          status: selectedRow.status,
          eaStatus: selectedRow.eaStatus,
          paymentStatus: selectedRow.receipt,
          epRemark1: selectedRow.epRemark1,
          epRemark2: "",
          eaRemark: "",
          oaRemark: "",
          takenByEPId: selectedRow.requestedBy,
          takenByEAId: educationAdminId,
          takenByOAId: 0
        }
      })
        .then((res) => console.log(res))
        .catch((error) => {
          throw error;
        })
      navigate(0)
      setIsTakingRequest(false);
      setOpenConfirm(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      setIsTakingRequest(false);
      setOpenConfirm(false);
    }
    // const newRow = tableData.find(el => (el.id === currentId))
    // newRow.role = 'myRequest';
    // const newTableData = tableData.filter(el => el.id !== currentId);
    // setTableData([...newTableData, newRow])
    setOpenConfirm(false);
  };
  // console.log("tabledata",tableData)
  // console.log("data",dataFiltered)

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

          <RegistrationTableToolbar
            filterName={filterName}
            // isFiltered={isFiltered}
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
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow
                        hover
                        key={row.id}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (row.eaStatus === "InProgress" && row.takenByEAId === 0) {
                            handleOpenConfirm(row)
                          } else {
                            handleOpenRequest(row)
                          }
                        }}
                      >
                        <TableCell align="left" > {row.id} </TableCell>
                        <TableCell align="left">{row.requestDate}</TableCell>
                        <TableCell align="left">{row.section}</TableCell>
                        <TableCell align="center">{row.registeredCourses}</TableCell>
                        <TableCell align="center">{row.requestedBy}</TableCell>
                        <TableCell align="left" />
                        <TableCell>
                          <Iconify icon="ic:chevron-right" />
                        </TableCell>
                      </TableRow>)
                  })}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />

                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Take the Request"
            content="Once the request is taken, only you can see and proceed the request."
            action={
              <LoadingButton loading={isTakingRequest} variant="contained" color="success" onClick={takeRequest}>
                Take Request
              </LoadingButton>
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
  educationAdminId
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  // console.log("inut",inputData)

  if (filterName) {
    // console.log('filterName')
    inputData = inputData.filter((eachRequest) =>
      eachRequest.id === parseInt(filterName, 10) ||
      eachRequest.section.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
      eachRequest.requestDate.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      // eachRequest.request.courseType.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterRole !== '') {
    if (filterRole === 'MyRequests') {
      inputData = inputData.filter((eachRequest) => (eachRequest.eaStatus === 'InProgress' && eachRequest.takenByEAId === educationAdminId));
      return inputData;
    }
    if (filterRole === 'InProgress') {
      inputData = inputData.filter((eachRequest) => eachRequest.eaStatus === 'InProgress' && eachRequest.takenByEAId === 0);
      return inputData;
    }

    if (filterRole === 'Complete') {
      inputData = inputData.filter((eachRequest) => eachRequest.eaStatus === 'Complete');
      return inputData;
    }

    if (filterRole === 'Reject') {
      inputData = inputData.filter((eachRequest) => eachRequest.eaStatus === 'Reject');
      return inputData;
    }
  }

  return inputData;
}

