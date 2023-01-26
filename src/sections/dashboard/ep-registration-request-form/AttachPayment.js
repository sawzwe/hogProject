// import PropTypes from 'prop-types';
// import * as Yup from 'yup';
// import { useCallback, useEffect, useMemo, useState } from 'react';
// // form
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// // @mui
// import { Box, Card, Typography } from '@mui/material';
// // components
// import { RHFUpload } from '../../../components/hook-form';

// // ----------------------------------------------------------------------

// const MAX_FILE_SIZE = 2 * 1000 * 1000; // 2 Mb

// const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

// // ----------------------------------------------------------------------

// AttachPayment.propTypes = {
//     currentRegistrationRequest: PropTypes.object,
// };

// // ----------------------------------------------------------------------

// export default function AttachPayment(currentRegistrationRequest) {

//     return (
//         <Card sx={{ p: 3 }}>
//             <Typography variant="h5"
//                 sx={{
//                     mb: 2,
//                     display: 'block',
//                 }}>Additional Files</Typography>
//             <Box
//                 rowGap={3}
//                 columnGap={2}
//                 display="grid"
//                 gridTemplateColumns={{
//                     xs: 'repeat(1, 1fr)',
//                     sm: 'repeat(1, 1fr)',
//                 }}
//             >
//                 <RHFUpload
//                     multiple
//                     thumbnail
//                     name="PaymentAttachmentFiles"
//                     maxSize={3145728}
//                     onDrop={handleDropFiles}
//                     onRemove={handleRemoveFile}
//                     onRemoveAll={handleRemoveAllFiles}
//                     onUpload={() => console.log('ON UPLOAD')}
//                 />
//             </Box>
//         </Card>
//     )
// }