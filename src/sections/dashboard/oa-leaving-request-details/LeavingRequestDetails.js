import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect, Fragment } from 'react';
import { styled } from '@mui/material/styles';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Card,
    Chip,
    Grid,
    Stack,
    Typography,
    TextField,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// utils
import { fData } from '../../../utils/formatNumber';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar/Scrollbar';




// ----------------------------------------------------------------------


const RECORDING_YEAR = [
    { id: 1, name: '2023' },
    { id: 2, name: '2022' },
    { id: 3, name: '2021' }
];

LeavingRequestDetails.propTypes = {
    newRequest: PropTypes.bool,
    currentStaff: PropTypes.object,
};

export default function LeavingRequestDetails({ newRequest = true, currentStaff, Id }) {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.divider,
            color: theme.palette.common.black,
            fontSize: '1vw',
            border: `1px solid ${theme.palette.divider}`,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: '1vw',
            border: `1px solid ${theme.palette.divider}`,

        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        // hide last border
        '&:last-child td, &:last-child th': {
            backgroundColor: theme.palette.divider,
            border: `1px solid ${theme.palette.divider}`,
        },
    }));

    const { enqueueSnackbar } = useSnackbar();

    const [openConfirm, setOpenConfirm] = useState(false);

    const [openConfirmApprove, setOpenConfirmApprove] = useState(false);

    const [openConfirmReject, setOpenConfirmReject] = useState(false);

    const [currentId, setCurrentId] = useState(Id);

    const [tableData, setTableData] = useState([]);

    const [status, setStatus] = useState('');

    const [selectedCourse, setSelectedCourse] = useState({});

    // const [leaveRecord, setLeaveRecord] = useState({})

    const leaveRecord =
    {
        "lecturers": {
            1: {
                "records": {
                    "2023": [
                        {
                            "recordId": 1,
                            "leaveType": "Annual Leave",
                            "fromDate": "2021-01-05",
                            "fromHour": "-",
                            "toDate": "2021-01-07",
                            "toHour": "-",
                            "days": "3",
                            "hours": "-",
                            "status": "Approved",
                            "remark": "Vacation"
                        },
                    ],
                    // "2022": [
                    //     {
                    //         "recordId": 3,
                    //         "leaveType": "Sick Leave",
                    //         "fromDate": "2022-05-01",
                    //         "fromHour": "12:00",
                    //         "toDate": "2022-05-01",
                    //         "toHour": "14:00",
                    //         "days": "-",
                    //         "hours": "2",
                    //         "status": "Pending",
                    //         "remark": "Sick Leave"
                    //     },
                    // ]
                }
            },
            3: {
                "records": {
                    "2023": [
                        {
                            "recordId": 5,
                            "leaveType": "Personal Leave",
                            "fromDate": "2021-08-05",
                            "fromHour": "-",
                            "toDate": "2021-08-07",
                            "toHour": "-",
                            "days": 3,
                            "hours": 16,
                            "status": "Approved",
                            "remark": "Family event"
                        }
                    ],
                    // "2021": [
                    //     {
                    //         "recordId": 6,
                    //         "leaveType": "Sick Leave",
                    //         "fromDate": "2022-03-15",
                    //         "fromHour": "AM",
                    //         "toDate": "2022-03-17",
                    //         "toHour": "PM",
                    //         "days": 3,
                    //         "hours": 16,
                    //         "status": "Approved",
                    //         "remark": "Stomach flu"
                    //     },
                    // ]
                }
            }
        }
    }

    const NewEASchema = Yup.object().shape({
        eaRole: Yup.string().required('Role is required'),
        eaFirstName: Yup.string().required('Firstname is required'),
        eaLastName: Yup.string().required('Lastname is required'),
        eaNickname: Yup.string().required('Nickname is required'),
        eaPhoneNumber: Yup.string().required('Phone number is required'),
        eaLineId: Yup.string().required('Line ID is required'),
        eaEmail: Yup.string().email('Email is invalid').required('Email is required'),
    });

    const defaultValues = {

        eaRole: '2023',
        eaFirstName: '',
        eaLastName: '',
        eaNickname: '',
        eaPhoneNumber: '',
        eaLineId: '',
        eaEmail: '',
        eaRole2: '',

    }

    const methods = useForm({
        resolver: yupResolver(NewEASchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const { eaRole } = values

    // Create staff to Firebase Auth, Firestore, and Azure Database
    const createStaff = () => {
        // Add Logic here

        enqueueSnackbar('Create success!')
    }

    // Update staff data to the database
    const updateStaff = () => {
        // Add Logic here

        enqueueSnackbar('Update success!')
    }

    useEffect(() => {
        if (newRequest && currentStaff) {
            reset(defaultValues);
        }
        if (!newRequest) {
            reset(defaultValues);
        }
    }, [newRequest, currentStaff]);


    const onSubmit = async (data) => {
        try {
            // updateStaff(data);
            if (newRequest) {
                await updateStaff(data);
            } else {
                await createStaff(data);
            }
            // console.log('DATA', JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeeaRole = (event) => {
        reset(defaultValues);
        setValue('eaRole', event.target.value);
    }

    const [submitDialogOpen, setSubmitDialogopen] = useState(false);

    const handleClickSubmitOpen = (event) => {
        event.preventDefault()
        setSubmitDialogopen(true);
    };

    const handleSubmitClose = () => {
        setSubmitDialogopen(false);
    };

    const handleOpenConfirm = () => {
        setCurrentId(currentId);
        setOpenConfirm(true);
    };

    const handleOpenConfirmReject = () => {
        setOpenConfirmReject(true);
    };

    const handleOpenConfirmApprove = () => {
        setOpenConfirmApprove(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleCloseConfirmReject = () => {
        setOpenConfirmReject(false);
    };

    const handleCloseConfirmApprove = () => {
        setOpenConfirmApprove(false);
    };

    const acceptRequest = (currentId, tableData, setTableData) => {
        const newRow = tableData.find(el => (el.id === currentId))
        newRow.role = 'myRequest';
        const newTableData = tableData.filter(el => el.id !== currentId);
        setTableData([...newTableData, newRow])
        setOpenConfirm(false);
    };

    return (
        <>
            <FormProvider methods={methods} onSubmit={(event) => { handleClickSubmitOpen(event) }}>
                <Grid container spacing={3}>
                    <Grid container item xs={12} md={5}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>Lecturer's Name | RID:{currentId}</Typography>
                        <RHFSelect
                            name="eaRole"
                            label="Recording Year"
                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            onChange={handleChangeeaRole}>
                            {RECORDING_YEAR.map((option) => (
                                <MenuItem
                                    key={option.id}
                                    value={option.name}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}
                                >
                                    {option.name}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Grid>


                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>Record of {eaRole}</Typography>
                            {/* <Scrollbar sx={(selectedCourse.availableDays.length > 4 ? { maxHeight: 80 * 6.27, pr: 1.5 } : { maxHeight: 80 * 5.35, pr: 1.5 })}> */}
                            {/* <TableContainer component={Paper} >
                                <Table sx={{ minWidth: 100 }}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">Leave Type</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">From</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">To</StyledTableCell>
                                            <StyledTableCell align="center">Days</StyledTableCell>
                                            <StyledTableCell align="center">Hours</StyledTableCell>
                                            <StyledTableCell align="center">Status</StyledTableCell>
                                            <StyledTableCell align="center">Remark</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(leaveRecord.lecturers).map((lecturerId) => {
                                            if (lecturerId === currentId) {
                                                return (
                                                    <div key={lecturerId}>
                                                        {Object.keys(leaveRecord.lecturers[lecturerId].records).map(

                                                            (year) => (
                                                                <>
                                                                    {leaveRecord.lecturers[lecturerId].records[year].map(
                                                                        (record) => (
                                                                            <>
                                                                                <StyledTableRow key={record.recordId}>
                                                                                    <StyledTableCell align="center">Year: {year} {record.leaveType}</StyledTableCell>
                                                                                    <StyledTableCell sx={{ width: '7%' }} align="center" colSpan={2}>{record.fromDate}</StyledTableCell>
                                                                                    <StyledTableCell sx={{ width: '6%' }} align="center">{record.fromHour}</StyledTableCell>
                                                                                    <StyledTableCell sx={{ width: '7%' }} align="center">{record.toDate}</StyledTableCell>
                                                                                    <StyledTableCell sx={{ width: '6%' }} align="center">{record.toHour}</StyledTableCell>
                                                                                    <StyledTableCell sx={{ width: '6%' }} align="center">{record.days}</StyledTableCell>
                                                                                    <StyledTableCell sx={{ width: '6%' }} align="center">{record.hours}</StyledTableCell>
                                                                                    <StyledTableCell align="center">{record.status}</StyledTableCell>
                                                                                    <StyledTableCell sx={{ width: '35%' }} align="center">{record.remark}</StyledTableCell>
                                                                                </StyledTableRow>

                                                                            </>

                                                                        )
                                                                    )}
                                                                </>
                                                            )
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}

                                        <StyledTableRow>
                                            <StyledTableCell align="center">Vacation leave</StyledTableCell>
                                            <StyledTableCell sx={{ width: '7%' }} align="center">4-Jan</StyledTableCell>
                                            <StyledTableCell sx={{ width: '6%' }} align="center">12:00</StyledTableCell>
                                            <StyledTableCell sx={{ width: '7%' }} align="center">10-Jan</StyledTableCell>
                                            <StyledTableCell sx={{ width: '6%' }} align="center">12:00</StyledTableCell>
                                            <StyledTableCell sx={{ width: '6%' }} align="center">7</StyledTableCell>
                                            <StyledTableCell sx={{ width: '6%' }} align="center">{7 * 8}</StyledTableCell>
                                            <StyledTableCell align="center">Approved</StyledTableCell>
                                            <StyledTableCell sx={{ width: '35%' }} align="center">
                                                To make everything fit in the grid without having a horizontal scroll, you can try the following options:
                                            </StyledTableCell>
                                        </StyledTableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer> */}
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 100 }}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">Leave Type</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">From</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">To</StyledTableCell>
                                            <StyledTableCell align="center">Days</StyledTableCell>
                                            <StyledTableCell align="center">Hours</StyledTableCell>
                                            <StyledTableCell align="center">Status</StyledTableCell>
                                            <StyledTableCell align="center">Remark</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(leaveRecord.lecturers).map((lecturerId) => {
                                            if (lecturerId === currentId) {
                                                return (
                                                    <StyledTableRow key={lecturerId}>
                                                        {Object.keys(leaveRecord.lecturers[lecturerId].records).map((year, index) => (
                                                            <Fragment key={index}>
                                                                {leaveRecord.lecturers[lecturerId].records[year].map((record, index) => (
                                                                    // <StyledTableRow key={record.recordId}>
                                                                    <Fragment key={index}>
                                                                        {/* <StyledTableCell align="center">Year: {year}</StyledTableCell> */}
                                                                        <StyledTableCell align="center">{record.leaveType}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '7%' }} align="center">{record.fromDate}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '6%' }} align="center">{record.fromHour}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '7%' }} align="center">{record.toDate}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '6%' }} align="center">{record.toHour}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '6%' }} align="center">{record.days}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '6%' }} align="center">{record.hours}</StyledTableCell>
                                                                        <StyledTableCell align="center">{record.status}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '35%' }} align="center">{record.remark}</StyledTableCell>
                                                                    </Fragment>
                                                                    // </StyledTableRow>
                                                                ))}
                                                            </Fragment>

                                                        ))}

                                                    </StyledTableRow>

                                                );
                                            }
                                            return null;
                                        })}
                                        <StyledTableRow>
                                            <StyledTableCell align="center">Vacation leave</StyledTableCell>
                                            <StyledTableCell sx={{ width: '7%' }} align="center">4-Jan</StyledTableCell>
                                            <StyledTableCell sx={{ width: '6%' }} align="center">12:00</StyledTableCell>
                                            <StyledTableCell sx={{ width: '7%' }} align="center">10-Jan</StyledTableCell>
                                            <StyledTableCell sx={{ width: '6%' }} align="center">12:00</StyledTableCell>
                                            <StyledTableCell sx={{ width: '6%' }} align="center">7</StyledTableCell>
                                            <StyledTableCell sx={{ width: '6%' }} align="center">{7 * 8}</StyledTableCell>
                                            <StyledTableCell align="center">Approved</StyledTableCell>
                                            <StyledTableCell sx={{ width: '35%' }} align="center">
                                                To make everything fit in the grid without having a horizontal scroll, you can try the following options:
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* </Scrollbar> */}
                        </Card >
                    </Grid >

                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>Request</Typography>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 100 }}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">Leave Type</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">From</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">To</StyledTableCell>
                                            <StyledTableCell align="center">Days</StyledTableCell>
                                            <StyledTableCell align="center">Hours</StyledTableCell>
                                            <StyledTableCell align="center">Status</StyledTableCell>
                                            <StyledTableCell align="center">Remark</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(leaveRecord.lecturers).map((lecturerId) => {
                                            if (lecturerId === "3") {
                                                return (
                                                    <StyledTableRow key={lecturerId}>
                                                        {Object.keys(leaveRecord.lecturers[lecturerId].records).map((year, index) => (
                                                            <Fragment key={index}>
                                                                {leaveRecord.lecturers[lecturerId].records[year].map((record, index) => (
                                                                    // <StyledTableRow key={record.recordId}>
                                                                    <Fragment key={index}>
                                                                        <StyledTableCell align="center">{record.leaveType}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '7%' }} align="center">{record.fromDate}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '6%' }} align="center">{record.fromHour}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '7%' }} align="center">{record.toDate}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '6%' }} align="center">{record.toHour}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '6%' }} align="center">{record.days}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '6%' }} align="center">{record.hours}</StyledTableCell>
                                                                        <StyledTableCell align="center">{record.status}</StyledTableCell>
                                                                        <StyledTableCell sx={{ width: '35%' }} align="center">{record.remark}</StyledTableCell>
                                                                    </Fragment>
                                                                    // </StyledTableRow>
                                                                ))}
                                                            </Fragment>

                                                        ))}
                                                    </StyledTableRow>
                                                );
                                            }
                                            return null;
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* </Scrollbar> */}
                        </Card >
                    </Grid >

                    <Grid item xs={12} md={12}>
                        {newRequest === true && (
                            <>
                                <Stack spacing={2} direction="row-reverse" justifyContent="space-between" alignItems="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 1em' }}>
                                        <LoadingButton type="submit" variant="contained" color="error" onClick={() => handleOpenConfirmReject()} sx={{ height: '3em', width: '8em', mr: 1 }}>
                                            Reject
                                        </LoadingButton>

                                        <LoadingButton type="submit" variant="contained" onClick={() => handleOpenConfirmApprove()} sx={{ height: '3em', width: '8em', ml: 1 }}>
                                            Approve
                                        </LoadingButton>
                                    </Box>

                                    <Box>
                                        <LoadingButton type="submit" variant="outlined" sx={{ height: '3em', width: '8em', ml: 1, color: 'black', border: '1px solid #919EAB', marginLeft: 'auto' }}>
                                            <Link to={`/dashboard/leaving-request-office-admin/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                Back
                                            </Link>
                                        </LoadingButton>
                                    </Box>
                                </Stack>
                            </>
                        )}
                    </Grid>

                </Grid >
            </FormProvider >


            <ConfirmDialog
                open={openConfirmReject}
                onClose={handleCloseConfirmReject}
                title={<>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify icon="ic:cancel" sx={{ fontSize: 40 }} />
                        <Typography variant='h4' sx={{ marginLeft: '1rem' }}>Reject the request</Typography>
                    </div>
                </>}
                content={<>
                    <Typography>Your response will be updated to the system</Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        type="text"
                        margin="dense"
                        variant="outlined"
                        label="*Why is it rejected"
                    />
                </>}
                direction="row-reverse"
                action={
                    <Button variant="contained" color="error" onClick={() => acceptRequest(currentId, tableData, setTableData)}>
                        Reject
                    </Button>
                }
            />

            <ConfirmDialog
                open={openConfirmApprove}
                onClose={handleCloseConfirmApprove}
                title={<>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify icon="ic:check" sx={{ fontSize: 40 }} />
                        <Typography variant='h4' sx={{ marginLeft: '1rem' }}>Approve the leaving</Typography>
                    </div>
                </>}
                content="If you approve, this request will be sent to EA to handle the schedule."
                action={
                    <Button variant="contained" color="success" onClick={() => acceptRequest(currentId, tableData, setTableData)}>
                        Approve
                    </Button>
                }
            />

        </>

    )
}
