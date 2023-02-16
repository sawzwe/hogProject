// import React, { useState } from "react";

// export default function Record2() {
//   const data = {
//     "lecturers": {
//       "1001": {
//         "records": {
//           "2021": [
//             {
//               "recordId": "R001",
//               "leaveType": "Annual Leave",
//               "fromDate": "2021-01-05",
//               "fromHour": "AM",
//               "toDate": "2021-01-07",
//               "toHour": "PM",
//               "days": 3,
//               "hours": 16,
//               "status": "Approved",
//               "remark": "Vacation"
//             },
//             {
//               "recordId": "R002",
//               "leaveType": "Sick Leave",
//               "fromDate": "2021-02-15",
//               "fromHour": "AM",
//               "toDate": "2021-02-17",
//               "toHour": "PM",
//               "days": 3,
//               "hours": 16,
//               "status": "Approved",
//               "remark": "Flu"
//             }
//           ],
//           "2022": [
//             {
//               "recordId": "R003",
//               "leaveType": "Annual Leave",
//               "fromDate": "2022-05-01",
//               "fromHour": "AM",
//               "toDate": "2022-05-05",
//               "toHour": "PM",
//               "days": 5,
//               "hours": 32,
//               "status": "Pending",
//               "remark": "Vacation"
//             },
//             {
//               "recordId": "R004",
//               "leaveType": "Maternity Leave",
//               "fromDate": "2022-11-01",
//               "fromHour": "AM",
//               "toDate": "2023-01-31",
//               "toHour": "PM",
//               "days": 91,
//               "hours": 488,
//               "status": "Approved",
//               "remark": "Childbirth"
//             }
//           ]
//         }
//       },
//       "1002": {
//         "records": {
//           "2021": [
//             {
//               "recordId": "R005",
//               "leaveType": "Personal Leave",
//               "fromDate": "2021-08-05",
//               "fromHour": "AM",
//               "toDate": "2021-08-07",
//               "toHour": "PM",
//               "days": 3,
//               "hours": 16,
//               "status": "Approved",
//               "remark": "Family event"
//             }
//           ],
//           "2022": [
//             {
//               "recordId": "R006",
//               "leaveType": "Sick Leave",
//               "fromDate": "2022-03-15",
//               "fromHour": "AM",
//               "toDate": "2022-03-17",
//               "toHour": "PM",
//               "days": 3,
//               "hours": 16,
//               "status": "Approved",
//               "remark": "Stomach flu"
//             },
//             {
//               "recordId": "R007",
//               "leaveType": "Maternity Leave",
//               "fromDate": "2022-10-01",
//               "fromHour": "AM",
//               "toDate": "2022-12-31",
//               "toHour": "PM",
//               "days": 92,
//               "hours": 480,
//               "status": "Pending",
//               "remark": "Childbirth"
//             }
//           ]
//         }
//       }
//     }
//   }

//   const LecturerRecords = ({ data }) => {
//     const [selectedId, setSelectedId] = useState('');
//     const [selectedYear, setSelectedYear] = useState('');
//     const [selectedRecords, setSelectedRecords] = useState([]);

//     const handleIdChange = (event) => {
//       setSelectedId(event.target.value);
//       setSelectedRecords([]);
//     };

//     const handleYearChange = (event) => {
//       setSelectedYear(event.target.value);
//       setSelectedRecords([]);
//     };

//     const handleSubmit = (event) => {
//       event.preventDefault();

//       const records = data[selectedId].records[selectedYear];
//       setSelectedRecords(records);
//     };

//     return (
//       <div>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="lecturerId">Select lecturer ID:</label>
//           <select id="lecturerId" value={selectedId} onChange={handleIdChange}>
//             <option value="">-- Select lecturer ID --</option>
//             {Object.keys(data).map((id) => (
//               <option key={id} value={id}>
//                 {id}
//               </option>
//             ))}
//           </select>

//           <label htmlFor="year">Select year:</label>
//           <select id="year" value={selectedYear} onChange={handleYearChange}>
//             <option value="">-- Select year --</option>
//             {selectedId &&
//               Object.keys(data[selectedId].records).map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//           </select>

//           <button type="submit" disabled={!selectedId || !selectedYear}>
//             Show Records
//           </button>
//         </form>

//         {selectedRecords.length > 0 && (
//           <table>
//             <thead>
//               <tr>
//                 <th>Record ID</th>
//                 <th>Leave Type</th>
//                 <th>From Date</th>
//                 <th>From Hour</th>
//                 <th>To Date</th>
//                 <th>To Hour</th>
//                 <th>Days</th>
//                 <th>Hours</th>
//                 <th>Status</th>
//                 <th>Remark</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedRecords.map((record) => (
//                 <tr key={record.recordId}>
//                   <td>{record.recordId}</td>
//                   <td>{record.leaveType}</td>
//                   <td>{record.fromDate}</td>
//                   <td>{record.fromHour}</td>
//                   <td>{record.toDate}</td>
//                   <td>{record.toHour}</td>
//                   <td>{record.days}</td>
//                   <td>{record.hours}</td>
//                   <td>{record.status}</td>
//                   <td>{record.remark}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     );
//   };
// }

