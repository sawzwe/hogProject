import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import sumBy from 'lodash/sumBy';
import axios from 'axios';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
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
import { EditClassDialog } from '../../sections/dashboard/EditClassDialog';

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
                    if (data.length === 0) {
                        setClasses([])
                    } else {
                        data.map((eachSchedule) => (eachSchedule.classes.map((eachClass) => {
                            return setClasses(classes => [...classes, {
                                id: eachClass.id,
                                date: eachClass.date,
                                fromTime: eachClass.fromTime,
                                toTime: eachClass.toTime,
                                time: `${eachClass.fromTime}-${eachClass.toTime}`,
                                teacherNickname: eachClass.teacherPrivateClass?.nickname || '',
                                course: `${eachSchedule.course.course} ${eachSchedule.course?.subject} ${eachSchedule.course.level}`,
                                section: eachSchedule.course.section,
                                room: eachClass.room,
                                method: _.capitalize(eachClass.method),
                                students: eachClass.studentPrivateClasses,
                                teacher: {
                                    id: eachClass.teacherPrivateClass?.teacherId || null,
                                    status: eachClass.teacherPrivateClass?.status
                                },
                                hourPerClass: Math.abs(parseInt(eachClass.fromTime.slice(0, 2), 10) - parseInt(eachClass.toTime.slice(0, 2), 10))
                            }])
                        })))
                    }
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
    { id: 'classTime', label: 'Class Time', align: 'left' },
    { id: 'teacher ', label: 'Teacher', align: 'left' },
    { id: 'course', label: 'Course', align: 'left' },
    { id: 'section', label: 'Section', align: 'left' },
    { id: 'method', label: 'Method', align: 'left' },
    { id: 'room', label: 'Room', align: 'left' },
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

    const [filterDate, setFilterDate] = useState(new Date());

    const [selectedClass, setSelectedClass] = useState({});
    const [openEditClassDialog, setOpenEditClassDialog] = useState(false);

    const [deletedClass, setDeletedClass] = useState({});
    const [openDeleteClassDialog, setOpenDeleteClassDialog] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterDate,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 56 : 76;

    const isFiltered = filterName !== '';

    const isNotFound =
        (!dataFiltered.length && !!filterName);

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleFilterDate = (value) => {
        setPage(0);
        setFilterDate(value)
    }

    if (!dataFetchedRef.current) return (
        <LoadingScreen />
    )

    const handleSelectClass = (selectedClass) => {
        setSelectedClass(selectedClass);
        setOpenEditClassDialog(true);
    }

    const handleCloseEditClassDialog = () => {
        setSelectedClass({});
        setOpenEditClassDialog(false);
    }

    const handleEditClass = async (newClass) => {
        setIsSubmitting(true);
        try {
            console.log('newClass', newClass);
            console.log('SelectedClass', selectedClass);
            const formattedData = {
                id: newClass.id,
                room: newClass.room,
                method: newClass.method,
                date: fDate(newClass.date, 'dd-MMM-yyyy'),
                fromTime: newClass.fromTime,
                toTime: newClass.toTime,
                studentPrivateClasses: selectedClass.students.map((student) => ({
                    id: student.id,
                    studentId: student.studentId,
                    attendance: student.attendance
                })),
                teacherPrivateClass: {
                    id: selectedClass.id,
                    teacherId: newClass.teacher.id,
                    workType: newClass.teacher.workType,
                    status: selectedClass.teacher.status
                }
            }

            // console.log(formattedData);
            await axios.put(`${HOG_API}/api/Schedule/Put`, formattedData)
                .then((res) => console.log(res))
                .catch((error) => {
                    throw error
                })
            setIsSubmitting(false);
            // navigate(0)
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    }

    const handleOpenDeleteClassDialog = (deletedClass) => {
        setDeletedClass(deletedClass);
        setOpenDeleteClassDialog(true);
    }

    const handleCloseDeleteDialog = () => {
        setDeletedClass({});
        setOpenDeleteClassDialog(false);
    }

    const handleDeleteClass = async () => {
        setIsSubmitting(true)
        try {
            await axios.delete(`${HOG_API}/api/Schedule/Class/Delete/${deletedClass.id}`)
                .then((res) => console.log(res))
                .catch((error) => {
                    throw error;
                })
            setIsSubmitting(false)
            navigate(0);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false)
        }
    }


    return (
        <>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Card>
                    <RegistrationTableToolbar
                        filterName={filterName}
                        filterDate={filterDate}
                        onFilterName={handleFilterName}
                        onFilterDate={handleFilterDate}
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
                                            onClick={() => handleSelectClass(row)}
                                        >
                                            <TableCell align="left">{row.time}</TableCell>
                                            <TableCell align="left">{row.teacherNickname}</TableCell>
                                            <TableCell align="left">{row.course}</TableCell>
                                            <TableCell align="left">{row.section}</TableCell>
                                            <TableCell align="left">{row.method}</TableCell>
                                            <TableCell align="left">{row.room === '' ? '-' : row.room}</TableCell>
                                            <TableCell>
                                                <EditIcon fontSize="small" color="action" />
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

                {Object.keys(selectedClass).length > 0 && (
                    <EditClassDialog
                        open={openEditClassDialog}
                        close={handleCloseEditClassDialog}
                        schedule={selectedClass}
                        students={selectedClass.students}
                        hourPerClass={selectedClass.hourPerClass}
                        onEdit={handleEditClass}
                        onDelete={handleOpenDeleteClassDialog}
                        isSubmitting={isSubmitting}
                        courseCustom
                    />
                )}

                {Object.keys(deletedClass).length > 0 && (
                    <Dialog open={openDeleteClassDialog} onClose={handleCloseDeleteDialog}>
                        <DialogTitle>
                            Delete Class?
                        </DialogTitle>
                        <DialogContent>
                            {`Once deleted, ${deletedClass.course} on ${fDate(deletedClass.date, 'dd-MMM-yyyy')} (${deletedClass.fromTime} - ${deletedClass.toTime}) will be removed from the system.`}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" color="inherit" onClick={handleCloseDeleteDialog}>Cancel</Button>
                            <LoadingButton loading={isSubmitting} variant="contained" color="error" onClick={handleDeleteClass}>
                                Delete
                            </LoadingButton>
                        </DialogActions>
                    </Dialog>
                )}
            </Container>
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterDate,
}) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterDate) {
        inputData = inputData.filter((eachClass) => eachClass.date.toLowerCase().indexOf(fDate(filterDate, 'dd-MMMM-yyyy').toLowerCase()) !== -1)
    }

    if (filterName) {
        inputData = inputData.filter((eachClass) => eachClass.time.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            eachClass.teacherNickname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            eachClass.course.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            eachClass.section.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            eachClass.method.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            eachClass.room.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
    }

    return inputData;
}

// ----------------------------------------------------------------

RegistrationTableToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onFilterDate: PropTypes.func,
    onResetFilter: PropTypes.func,
};

export function RegistrationTableToolbar({
    isFiltered,
    filterName,
    filterDate,
    onFilterName,
    onFilterDate,
    onResetFilter,
}) {

    const onKeyDown = (e) => {
        e.preventDefault();
    };

    return (
        <Stack
            spacing={2}
            alignItems="center"
            direction={{
                xs: 'row',
                md: 'row',
            }}
            sx={{ px: 2.5, py: 3 }}
        >

            <DatePicker
                label="Date"
                minDate={new Date()}
                value={filterDate}
                onChange={onFilterDate}
                renderInput={(params) => (
                    <TextField onKeyDown={onKeyDown} {...params} />
                )}
                disableMaskedInput
                inputFormat="dd-MMM-yyyy"
            />

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
