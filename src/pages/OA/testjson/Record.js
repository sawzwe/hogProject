// import React from 'react';

// const LecturerRecordsTable = ({ data }) => {
//   const rows = [];

//   // Loop through each lecturer in the data object
//   Object.keys(data.lecturers).forEach(lecturerId => {
//     const lecturer = data.lecturers[lecturerId];

//     // Loop through each record for the lecturer
//     Object.keys(lecturer.records).forEach(year => {
//       const records = lecturer.records[year];

//       // Loop through each record in the year
//       records.forEach(record => {
//         rows.push(
//           <tr key={record.recordId}>
//             <td>{lecturerId}</td>
//             <td>{year}</td>
//             <td>{record.leaveType}</td>
//             <td>{record.fromDate} {record.fromHour}</td>
//             <td>{record.toDate} {record.toHour}</td>
//             <td>{record.days}</td>
//             <td>{record.hours}</td>
//             <td>{record.status}</td>
//             <td>{record.remark}</td>
//           </tr>
//         );
//       });
//     });
//   });

//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Lecturer ID</th>
//           <th>Year</th>
//           <th>Leave Type</th>
//           <th>From</th>
//           <th>To</th>
//           <th>Days</th>
//           <th>Hours</th>
//           <th>Status</th>
//           <th>Remark</th>
//         </tr>
//       </thead>
//       <tbody>
//         {rows}
//       </tbody>
//     </table>
//   );
// }

// export default LecturerRecordsTable;



// //----------------------------------------------------------------

// import React, { useState } from "react";

// const LecturerRecordsTable = ({ lecturers }) => {
//   const [selectedLecturerId, setSelectedLecturerId] = useState("1001");
//   const [selectedYear, setSelectedYear] = useState("2021");

//   const handleLecturerChange = (event) => {
//     setSelectedLecturerId(event.target.value);
//   };

//   const handleYearChange = (event) => {
//     setSelectedYear(event.target.value);
//   };

//   const selectedRecords = lecturers[selectedLecturerId].records[selectedYear];

//   return (
//     <div>
//       <div>
//         <label htmlFor="lecturer-select">Select lecturer:</label>
//         <select
//           id="lecturer-select"
//           value={selectedLecturerId}
//           onChange={handleLecturerChange}
//         >
//           {Object.keys(lecturers).map((lecturerId) => (
//             <option key={lecturerId} value={lecturerId}>
//               {lecturerId}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label htmlFor="year-select">Select year:</label>
//         <select
//           id="year-select"
//           value={selectedYear}
//           onChange={handleYearChange}
//         >
//           {Object.keys(lecturers[selectedLecturerId].records).map((year) => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>Record ID</th>
//             <th>Leave Type</th>
//             <th>From Date</th>
//             <th>To Date</th>
//             <th>Days</th>
//             <th>Hours</th>
//             <th>Status</th>
//             <th>Remark</th>
//           </tr>
//         </thead>
//         <tbody>
//           {selectedRecords.map((record) => (
//             <tr key={record.recordId}>
//               <td>{record.recordId}</td>
//               <td>{record.leaveType}</td>
//               <td>{record.fromDate}</td>
//               <td>{record.toDate}</td>
//               <td>{record.days}</td>
//               <td>{record.hours}</td>
//               <td>{record.status}</td>
//               <td>{record.remark}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LecturerRecordsTable;


// With MUI---------------------------------------------

import React, { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";

const LecturerRecordsTable = ({ lecturers = {} }) => {
  const [selectedLecturerId, setSelectedLecturerId] = useState("1001");
  const [selectedYear, setSelectedYear] = useState("2021");

  const handleLecturerChange = (event) => {
    setSelectedLecturerId(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const selectedRecords = lecturers[selectedLecturerId]?.records?.[selectedYear] || [];

  return (
    <div>
      <div>
        <FormControl>
          <InputLabel id="lecturer-select-label">Select lecturer:</InputLabel>
          <Select
            labelId="lecturer-select-label"
            id="lecturer-select"
            value={selectedLecturerId}
            onChange={handleLecturerChange}
          >
            {Object.keys(lecturers).map((lecturerId) => (
              <MenuItem key={lecturerId} value={lecturerId}>
                {lecturerId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <FormControl>
          <InputLabel id="year-select-label">Select year:</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {Object.keys(lecturers[selectedLecturerId].records).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Record ID</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Remark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedRecords.map((record) => (
              <TableRow key={record.recordId}>
                <TableCell>{record.recordId}</TableCell>
                <TableCell>{record.leaveType}</TableCell>
                <TableCell>{record.fromDate}</TableCell>
                <TableCell>{record.toDate}</TableCell>
                <TableCell>{record.days}</TableCell>
                <TableCell>{record.hours}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{record.remark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LecturerRecordsTable;
