import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
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
    TableCell,
    createTheme,
    ThemeProvider,
    Typography,
    Box,
    Stack,
    InputAdornment,
    TextField
} from '@mui/material';
// utils
import { fTimestamp, fDate } from '../../utils/formatTime';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
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
// sections
import { HOG_API } from '../../config';

// ----------------------------------------------------------------------

export default function DailyCalendarPage() {
    const { themeStretch } = useSettingsContext();

    const [classes, setClasses] = useState([]);
    const dataFetchedRef = useRef(false);

    const fetchData = async () => {
        try {
            await axios.get(`${HOG_API}/api/Schedule/Get`)
                .then((res) => {
                    const data = res.data.data;
                    data.map((eachSchedule) => (eachSchedule.classes.map((eachClass) => {
                        return setClasses(classes => [...classes, {
                            date: eachClass.date,
                            time: `${eachClass.fromTime}-${eachClass.toTime}`,
                            teacher: eachClass.teacherPrivateClass?.nickname || '',
                            course: `${eachSchedule.course.course} ${eachSchedule.course?.subject} ${eachSchedule.course.level}`,
                            section: eachSchedule.course.section,
                            room: eachClass.room,
                            method: eachClass.method,
                        }])
                    })))
                })
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData();
    }, []);

    if (!dataFetchedRef.current) {
        return <LoadingScreen />
    }

    console.log(classes)

    return (
        <>
            <Helmet>
                <title> Daily Calander</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Daily Calander"
                    links={[
                        {
                            name: 'All Classes',
                        }

                    ]}
                />

                <Typography >Course Transfer Details</Typography>
                <ClassList classes={classes} />
            </Container>
        </>
    );
}

// ----------------------------------------------------------------

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
ClassList.propTypes = {
    classes: PropTypes.array
}

const TABLE_HEAD_REQUESTS = [
    { id: 'classDate', label: 'Class Date', align: 'left' },
    { id: 'classTime', label: 'Class Time', align: 'left' },
    { id: 'teacher ', label: 'Teacher', align: 'left'},
    { id: 'course', label: 'Course', align: 'left'},
    { id: 'section', label: 'Section', align: 'left'},
    { id: 'method', label: 'Method', align: 'left'},
    { id: 'room', label: 'Room', align: 'left'},
    { id: 'action' },
];

export function ClassList({ classes }) {
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

        setTableData(classes)
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
                                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <TableRow
                                            hover
                                            key={index}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell align="left"> {row.date} </TableCell>
                                            <TableCell align="left">{row.time}</TableCell>
                                            <TableCell align="left">{row.teacher}</TableCell>
                                            <TableCell align="left">{row.course}</TableCell>
                                            <TableCell align="left">{row.section}</TableCell>
                                            <TableCell align="left">{_.capitalize(row.method)}</TableCell>
                                            <TableCell align="left">{row.room}</TableCell>
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
    // if (filterName) {
    //     inputData = inputData.filter((request) =>
    //         request.id === parseInt(filterName, 10) ||
    //         request.requestDate.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
    //         request.section.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
    // }

    // if (filterRole !== '') {
    //     inputData = inputData.filter((request) => request.role === filterRole);
    // }



    return inputData;
}

// ----------------------------------------------------------------

RegistrationTableToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onResetFilter: PropTypes.func,
};

export function RegistrationTableToolbar({
    isFiltered,
    filterName,
    onFilterName,
    onResetFilter,
}) {
    return (
        <Stack
            spacing={2}
            alignItems="center"
            direction={{
                xs: 'column',
                md: 'row',
            }}
            sx={{ px: 2.5, py: 3 }}
        >

            <TextField
                fullWidth
                value={filterName}
                onChange={onFilterName}
                placeholder="Search..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Stack>
    );
}
