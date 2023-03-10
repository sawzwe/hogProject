import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
import axios from 'axios';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import { fTimestamp, fDate } from '../../../utils/formatTime';
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
};

export default function RegistrationRequestStatusList({ privateRegistrationRequest }) {
  // console.log('RegistrationRequestStatusList', privateRegistrationRequest);
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
  // const [tableData, setTableData] = useState(privateRegistrationRequest);
  useEffect(() => {
    const formattedData = privateRegistrationRequest.map((request) => {
      return {
        id: request.request.id,
        requestDate: fDate(request.request.dateCreated, 'dd-MMM-yyyy'),
        courseType: request.request?.courseType || 'Private',
        section: request.information[0]?.section || '-',
        registeredCourses: request.information.length,
        requestedBy: request.request.takenByEPId,
        eaStatus: request.request.eaStatus,
        receipt: request.request.paymentStatus,
      }
    })

    setTableData(formattedData);
  }, []);
  // useEffect(() => {
  //   setTableData(TABLE_DATA_REQUESTS);
  // }, []);

  // console.log(tableData);
  let eachEP;

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('InProgress');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [currentId, setCurrentId] = useState(-1);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterRole !== 'InProgress' || filterName !== '';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole);

  const getLengthByStatus = (eaStatus) => tableData.filter((item) => item.eaStatus === eaStatus).length;  

  const TABS = [
    { value: "InProgress", label: 'Available Requests', color: 'warning', count: getLengthByStatus("InProgress") },
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

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('available');
  };
  // console.log('After', tableData)
  const acceptRequest = (currentId, tableData, setTableData) => {
    // console.log('Before',tableData)
    // console.log('Accept',currentId)
    const newRow = tableData.find(el => (el.id === currentId))
    newRow.role = 'myRequest';
    const newTableData = tableData.filter(el => el.id !== currentId);
    setTableData([...newTableData, newRow])
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
                    return (<TableRow
                      hover
                      key={row.id}
                      sx={{cursor:'pointer'}}
                    // onClick={() => handleOpenConfirm(row.id)}
                    >
                      <TableCell align="left" > {row.id} </TableCell>
                      <TableCell align="left">{row.requestDate}</TableCell>
                      <TableCell align="left">{row.section}</TableCell>
                      <TableCell align="center">{row.registeredCourses}</TableCell>
                      <TableCell align="center">{row.requestedBy}</TableCell>

                      {/* {
                      
                      axios.get(`${HOG_API}/api/EP/Get`)
                        .then(response => {
                          // console.log(response.data.data)
                          const EP= (response.data.data);
                          const eachEP = EP.filter(eachEP => eachEP.id===row.request.takenByEPId);
                          // console.log("API table" ,response.data.data);
                        })
                        .catch(error => {
                          console.log(error);
                        }) &&
                      <TableCell align="left">{eachEP}</TableCell>
                      } */}
                      {row.receipt === 'incompleteReceipt' ? (
                        <ThemeProvider theme={errorTheme}>
                          <TableCell align="left">
                            <Tooltip title="Incomplete Reciept">
                              <IconButton color='primary'>
                                <Iconify icon="ic:error" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </ThemeProvider>
                      ) :
                        <TableCell align="left" />
                      }

                      <TableCell>
                        <Tooltip title="More Info">
                          {row.role === 'available' ? (
                            <IconButton onClick={() => handleOpenConfirm(row.id)}>
                              <Iconify icon="ic:chevron-right" />
                            </IconButton>) : (
                            <IconButton>
                              <Iconify icon="ic:chevron-right" />
                            </IconButton>
                          )}
                        </Tooltip>
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
            content="Once the request is taken, only you can see the request and proceed it."
            action={
              <Button variant="contained" color="success" onClick={() => acceptRequest(currentId, tableData, setTableData)}>
                <Link to={`/course-registration/ea-request-status/${parseInt(currentId, 10)}`} style={{ textDecoration: 'none', color: 'white' }}>
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
    // console.log('filterRole')
    inputData = inputData.filter((eachRequest) => eachRequest.eaStatus === filterRole);
  }

  return inputData;
}

