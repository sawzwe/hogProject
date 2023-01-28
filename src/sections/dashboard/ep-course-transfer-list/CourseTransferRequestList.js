import { useState } from 'react';
// mui
import {
    Tab,
    Tabs,
    Card,
    Table,
    Tooltip,
    Divider,
    TableBody,
    IconButton,
    TableContainer,
    TableRow,
    TableCell,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
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
import UserTableToolbar from './UserTableToolbar';

//-------------------------------------------------------------------------
const STATUS_OPTIONS = ['all', 'pending', 'completed'];


const TABLE_HEAD = [
    { id: 'id', label: 'Request ID', align: 'left' },
    { id: 'date', label: 'Request Date', align: 'left' },
    { id: 'fullname', label: 'Student Name', align: 'left' },
    { id: 'nickname', label: 'Nickname', align: 'left' },
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
    createData('S272', '25-02-2022', 'Zain Ijaz Janpatiew', 'Zain', 'completed'),

];

export default function CourseTransferRequestList() {
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
        onSelectAllRows,
        //
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable();

    const [tableData, setTableData] = useState(TABLE_DATA);

    const [filterValue, setFilterValue] = useState('');

    const [filterStatus, setFilterStatus] = useState('all');

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterValue,
        filterStatus,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 52 : 72;

    const isFiltered = filterValue !== '' || filterStatus !== 'all';

    const isNotFound =
        (!dataFiltered.length && !!filterValue) ||
        (!dataFiltered.length && !!filterStatus);


    const handleFilterStatus = (event, newValue) => {
        setPage(0);
        setFilterStatus(newValue);
    };

    const handleFilterValue = (event) => {
        setPage(0);
        setFilterValue(event.target.value);
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


    const handleResetFilter = () => {
        setFilterValue('');
        setFilterStatus('all');
    };
    return (
        <>
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
                                <IconButton color="primary">
                                    <Iconify icon="eva:trash-2-outline" />
                                </IconButton>
                            </Tooltip>
                        }
                    />

                    <Scrollbar>
                        <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>

                            <TableHeadCustom
                                headLabel={TABLE_HEAD}
                            />

                            <TableBody>

                                {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.id} hover>
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
        </>
    )
}

// Filtering The Search
function applyFilter({ inputData, comparator, filterStatus, filterValue }) {
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

    if (filterStatus !== 'all') {
        inputData = inputData.filter((user) => user.status === filterStatus);
    }

    return inputData;
}


