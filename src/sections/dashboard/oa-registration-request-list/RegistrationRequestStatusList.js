import { useState, useEffect } from 'react';
import sumBy from 'lodash/sumBy';
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
import RegistrationTableToolbar from './RegistrationTableToolbar';
// import Condition from 'yup/lib/Condition';

// ----------------------------------------------------------------------

// {Condition=== true && ()}
// {Condition=== true ? () : (else)}

function createData(id, requestDate, courseType, section, paymentType, requestedBy, role, receipt) {
  return { id, requestDate, courseType, section, paymentType, requestedBy, role, receipt };
}

const TABLE_HEAD_REQUESTS = [
  { id: 'requestId', label: 'Request ID', align: 'left' },
  { id: 'requestDate', label: 'Request Date', align: 'left' },
  { id: 'courseType', label: 'Course Type', align: 'left' },
  { id: 'section ', label: 'Section', align: 'left', width: 200 },
  { id: 'paymentType', label: 'Payment Type', align: 'left', width: 200 },
  { id: 'requestedBy', label: 'Requested by (EP)', align: 'left' },
  { id: 'incomplete' },
  { id: 'moreInfo' },
];

const TABLE_DATA_REQUESTS = [
  // Table {  RID,    Req Date ,     courseType,     section,           paymentType, requestedBy,      role,   Receipt }
  createData(222, '28-Nov-2022', 'Private', 'Saw Zwe Wai Yan', "Full Payment", 'Nirawit(Boss)', 'all', 'completeReceipt'),
  createData(125, '15-Dec-2022', 'Group', 'Class 50', "Full Payment", 'Nirawit(Boss)', 'completed', ''),
  createData(128, '28-Nov-2022', 'Private', 'Zain', "Installment", 'Nirawit(Boss)', 'all', 'incompleteReceipt'),
  createData(258, '02-Dec-2022', 'Group', 'Class 80', "Full Payment", 'Nirawit(Boss)', 'rejected', ''),
  createData(545, '02-Dec-2022', 'Private', 'Tar', "Full Payment", 'Nirawit(Boss)', 'rejected', ''),

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
    { value: 'completed', label: 'Completed', count: getLengthByStatus('completed'), color: 'success' },
    { value: 'rejected', label: 'Rejected', count: getLengthByStatus('rejected'), color: 'error' },
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
    setFilterRole('all');
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
                      <TableCell align="left">{row.courseType}</TableCell>
                      <TableCell align="left">{row.section}</TableCell>
                      <TableCell align="center">{row.paymentType}</TableCell>
                      <TableCell align="left">{row.requestedBy}</TableCell>

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
                          <IconButton>
                            <Iconify icon="ic:chevron-right" />
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
  //   inputData = inputData.filter((request) => request.id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.section.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.courseType.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  // }

  if (filterName) {
    inputData = inputData.filter((request) => request.id === parseInt(filterName, 10) || request.section.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || request.courseType.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterRole !== '') {
    inputData = inputData.filter((request) => request.role === filterRole);
  }

  // if (filterStatus !== 'completed') {
  //   inputData = inputData.filter((request) => request.status === filterStatus);
  // }
  // else if (filterRole === 'rejected' || filterRole ==='completed'){
  //   inputData = inputData.filter((request) => request.status === filterStatus);
  // }

  return inputData;
}
