import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';
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
    status: PropTypes.string,
};

export default function LeavingRequestDetails({ currentStatus = "rejected", newRequest = true, currentStaff, Id }) {
    const [status, setStatus] = useState(currentStatus);
    return (
        <>
            {status === "myRequest" ?
                (
                    // Can Edit, Approve, Reject and Withdraw
                    <LeaveRequestEdit Id={Id} newRequest={newRequest} currentStaff={currentStaff} />
                )
                :
                (   
                    // Can only view the result
                    <LeavingRequestStatus Id={Id} status={status} />
                )}
        </>

    )
}


LeavingRequestStatus.propTypes = {
    status: PropTypes.string,
    currentId: PropTypes.string,
};

export function LeavingRequestStatus({ status, Id }) {
    const [currentId, setCurrentId] = useState(Id);
    const navigate = useNavigate();

    return (
        <>
            <Grid container spacing={3}>
                <Grid container item xs={12} md={12}>
                    <Card sx={{ p: 3, width: "100%", display: "flex", justifyContent: 'space-between', alignItems: 'center', }} >
                        <Typography variant="h5"
                            sx={{
                                display: 'block',
                            }}>Teacher Personal Leaving </Typography>
                        {
                            status === "rejected" ? (
                                <Box sx={{
                                    backgroundColor: '#FF5630',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    display: 'inline-block',
                                }}>
                                    <Typography variant='button' >Rejected</Typography>
                                </Box>
                            ) : (
                                <Box sx={{
                                    backgroundColor: '#00AB55',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    display: 'inline-block',
                                }}>
                                    <Typography variant='button' >Completed</Typography>
                                </Box>

                            )
                        }
                    </Card>
                </Grid>



                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>
                            Teacher: KEEN - Chaipod Suktip ID: {currentId}
                        </Typography>
                        <Typography variant="body"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>
                            Course: SAT VERBAL INTENSIVE (Semi Private)
                        </Typography>
                        <Typography variant="body"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>
                            Leaving Date:  17-Oct-2022
                        </Typography>


                    </Card >
                </Grid >

                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>
                            Cancel Class
                        </Typography>
                        <Grid container direction="row" spacing={2} justifyContent="flex-end">
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth disabled label="Course" defaultValue={"SAT"} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth disabled label="Course Type" defaultValue={"Semi-Private"} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth disabled label="Section" defaultValue={"403"} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth disabled label="Primary Teacher" defaultValue={"KEEN"} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth disabled label="Start Date" defaultValue={"17-Feb-2023"} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth disabled label="End Date" defaultValue={"17-Jun-2023"} />
                            </Grid>
                        </Grid>

                    </Card >
                </Grid >

                <Grid item xs={12} md={12}>

                    <>
                        <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Button onClick={() => navigate(-1)} type="submit" variant="outlined" sx={{ height: '3em', width: '8em', ml: 1, color: 'black', border: '1px solid #919EAB', marginLeft: 'auto' }}>
                                    Back
                                </Button>
                            </Box>
                        </Stack>
                    </>

                </Grid>

            </Grid >
        </>
    )
}


LeaveRequestEdit.propTypes = {
    newRequest: PropTypes.bool,
    currentStaff: PropTypes.object,
    Id: PropTypes.string,
};

export function LeaveRequestEdit({ Id, newRequest, currentStaff }) {
    const navigate = useNavigate();

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

    const [selectedCourse, setSelectedCourse] = useState({});

    const [editClass, setEditClass] = useState(false);;

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
            console.log('DATA', JSON.stringify(data, null, 2));
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
                    <Grid container item xs={12} md={12}>
                        <Card sx={{ p: 3, width: "100%", display: "flex", justifyContent: 'space-between', alignItems: 'center', }} >
                            <Typography variant="h5"
                                sx={{
                                    display: 'block',
                                }}>Teacher Personal Leaving </Typography>
                            <Button variant="outlined" color="error" size="large">Withdraw from request</Button>
                        </Card>
                    </Grid>



                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>
                                Teacher: KEEN - Chaipod Suktip ID: {currentId}
                            </Typography>
                            <Typography variant="body"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>
                                Course: SAT VERBAL INTENSIVE (Semi Private)
                            </Typography>
                            <Typography variant="body"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>
                                Leaving Date:  17-Oct-2022
                            </Typography>


                        </Card >
                    </Grid >

                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>
                                Cancel Class
                            </Typography>
                            <Grid container direction="row" spacing={2} justifyContent="flex-end">
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth disabled label="Course" defaultValue={"SAT"} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth disabled label="Course Type" defaultValue={"Semi-Private"} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth disabled label="Section" defaultValue={"403"} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth disabled label="Primary Teacher" defaultValue={"KEEN"} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth disabled label="Start Date" defaultValue={"17-Feb-2023"} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth disabled label="End Date" defaultValue={"17-Jun-2023"} />
                                </Grid>

                                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" size="large" sx={{ ml: 1, color: 'black', border: '1px solid #919EAB' }}>
                                        <Iconify icon="mdi:lead-pencil" sx={{ fontSize: 40, marginRight: 1 }} />
                                        Edit Class
                                    </Button>
                                </Grid>
                            </Grid>

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
                                        <LoadingButton onClick={() => navigate(-1)} type="submit" variant="outlined" sx={{ height: '3em', width: '8em', ml: 1, color: 'black', border: '1px solid #919EAB', marginLeft: 'auto' }}>
                                            Back
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
