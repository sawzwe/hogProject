import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// mui
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
    TableCell,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from '../../components/table';
import Label from '../../components/label'
// sections
// import SortingSelecting from '../../sections/dashboard/ep-all-students-list';
import UserTableRow from '../../sections/dashboard/ep-course-transfer-list/UserTableRow';
import UserTableToolbar from '../../sections/dashboard/ep-course-transfer-list/UserTableToolbar';
// import { UserTableRow, UserTableToolbar} from './TableEA';
// sections
import TransferNewEditForm from '../../sections/dashboard/course-transfer';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = ['all', 'active', 'banned'];
const STATUS_OPTIONS = ['all', 'pending', 'completed'];

const ROLE_OPTIONS = [
    'all',
    'ux designer',
    'full stack designer',
    'backend developer',
    'project manager',
    'leader',
    'ui designer',
    'ui/ux designer',
    'front end developer',
    'full stack developer',
    'full stack developer',
];

const TABLE_HEAD = [
    { id: 'id', label: 'Request ID', align: 'left' },
    { id: 'date', label: 'Request Date', align: 'left' },
    { id: 'fullname', label: 'Student Name', align: 'left' },
    { id: 'nickname', label: 'Nickname', align: 'left' },
    // { id: 'isVerified', label: 'Request Type', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: '' },
];

// Demo Data
function createData(id, requestdate, fullname, nickname, status) {
    return { id, requestdate, fullname, nickname, status };
}

const TABLE_DATA = [
    createData('S012', '22-01-2022', 'Saw Zwe Wai Yan', 'Saw', 'pending'),
    createData('S014', '21-01-2022', 'Siwach Toprasert', 'Pan', 'pending'),
    createData('S002', '18-01-2022', 'Piyaphon Wu', 'Hong', 'completed'),
    createData('S251', '25-01-2022', 'Thanatuch Lertritsirikul', 'Tar', 'pending'),
    createData('S272', '25-01-2022', 'Zain Ijaz Janpatiew', 'Zain', 'completed'),

];
export default function CourseTransferRequestPage() {
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
    } = useTable();

    const { themeStretch } = useSettingsContext();

    const navigate = useNavigate();

    // const [tableData, setTableData] = useState(_userList);
    const [tableData, setTableData] = useState(TABLE_DATA);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterName, setFilterName] = useState('');

    const [filterValue, setFilterValue] = useState('');

    const [filterId, setFilterId] = useState('');

    const [filterStatus, setFilterStatus] = useState('all');

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterValue,
        filterName,
        filterId,
        filterStatus,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 52 : 72;

    const isFiltered = filterName !== '' || filterId !== '' || filterStatus !== 'all';

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterId) ||
        (!dataFiltered.length && !!filterStatus);

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleFilterStatus = (event, newValue) => {
        setPage(0);
        setFilterStatus(newValue);
    };

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleFilterId = (event) => {
        setPage(0);
        setFilterId(event.target.value);
    };

    const handleFilterValue = (event) => {
        setPage(0);
        setFilterValue(event.target.value);
    };

    // const handleFilterRole = (event) => {
    //   setPage(0);
    //   setFilterRole(event.target.value);
    // };

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

    const handleEditRow = (id) => {
        navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
    };

    const handleResetFilter = () => {
        setFilterName('');
        setFilterId('');
        // setFilterRole('all');
        setFilterStatus('all');
    };

    return (
        <>
            <Helmet>
                <title>Course Transfer Request</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Course Transferring Request Status"
                    links={[
                        {
                            name: 'Course transferring',
                            href: PATH_DASHBOARD.courseTransferring.root,
                        },
                        { name: 'Request status' },
                    ]}
                />
                <Card>
                    <Tabs
                        value={filterStatus}
                        onChange={handleFilterStatus}
                        sx={{
                            px: 2,
                            bgcolor: 'background.neutral',
                        }}
                    >
                        {STATUS_OPTIONS.map((tab) => (
                            <Tab key={tab} label={tab} value={tab} />
                        ))}
                    </Tabs>

                    <Divider />

                    <UserTableToolbar
                        isFiltered={isFiltered}
                        filterValue={filterValue}
                        onFilterValue={handleFilterValue}
                        // filterName={filterName}
                        // filterId={filterId}
                        // filterRole={filterRole}
                        // optionsRole={ROLE_OPTIONS}
                        // onFilterName={handleFilterName}
                        // onFilterId={handleFilterId}
                        // onFilterRole={handleFilterRole}
                        onResetFilter={handleResetFilter}
                    />

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={tableData.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    tableData.map((row) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={handleOpenConfirm}>
                                        <Iconify icon="eva:trash-2-outline" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />

                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                                {/* <TableHeadCustom
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={tableData.length}
                        numSelected={selected.length}
                        onSort={onSort}
                        onSelectAllRows={(checked) =>
                          onSelectAllRows(
                            checked,
                            tableData.map((row) => row.id)
                          )
                        }
                      /> */}
                                <TableHeadCustom
                                    headLabel={TABLE_HEAD}
                                />

                                <TableBody>

                                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow hover>
                                            {/* <UserTableRow
                            key={row.id}
                            row={row}
                            // selected={selected.includes(row.id)}
                            // onSelectRow={() => onSelectRow(row.id)}
                            // onDeleteRow={() => handleDeleteRow(row.id)}
                            // onEditRow={() => handleEditRow(row.name)}
                          /> */}

                                            <TableCell align="left" sx={{ textTransform: 'capitalize' }}> {row.id} </TableCell>
                                            <TableCell align="left">{row.requestdate}</TableCell>
                                            <TableCell align="left" sx={{ textTransform: 'capitalize' }}>{row.fullname}</TableCell>
                                            <TableCell align="left" sx={{ textTransform: 'capitalize' }}>{row.nickname}</TableCell>
                                            <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
                                                {row.status}
                                            </TableCell>
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
                        dense={dense}
                        onChangeDense={onChangeDense}
                    />
                </Card>
            </Container>
        </>
    );
}





// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterId, filterValue }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterValue) {
        inputData = inputData.filter((user) => user.fullname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.nickname.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || user.id.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1);
    }

    // if (filterName) {
    //   inputData = inputData.filter((user) => user.fullname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
    // }

    // if (filterId) {
    //   inputData = inputData.filter((user) => user.id.toLowerCase().indexOf(filterId.toLowerCase()) !== -1);
    // }

    // if (filterId || filterName) {
    //   inputData = inputData.filter((user) => (user.id.toLowerCase().indexOf(filterId.toLowerCase()) || user.id.toLowerCase().indexOf(filterId.toLowerCase())) !== -1);
    // }

    if (filterStatus !== 'all') {
        inputData = inputData.filter((user) => user.status === filterStatus);
    }

    // if (filterRole !== 'all') {
    //   inputData = inputData.filter((user) => user.role === filterRole);
    // }

    return inputData;
}
