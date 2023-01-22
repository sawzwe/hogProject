import _mock from '../_mock';
import { randomNumberRange, randomInArray } from '../utils';

// ----------------------------------------------------------------------

// export const _studentList = [...Array(24)].map((_, index) => ({
//     id: _mock.id(index),
//     avatarUrl: _mock.image.avatar(index),
//     name: _mock.name.fullName(index),
//     email: _mock.email(index),
//     phoneNumber: _mock.phoneNumber(index),
//     address: '908 Jack Locks',
//     country: _mock.address.country(index),
//     state: 'Virginia',
//     city: 'Rancho Cordova',
//     zipCode: '85807',
//     company: _mock.company(index),
//     isVerified: _mock.boolean(index),
//     status: randomInArray(['active', 'banned']),
// }));

export const _studentList = [
    {
        id: '1',
        studentTitle: 'Mr.',
        studentFirstName: 'Piyaphon',
        studentLastName: 'Wu',
        studentNickname: 'Hong',
        studentDateOfBirth: '02/05/2002',
        studentPhoneNo: '098-xxx-xxxx',
        studentLineId: 'pnw029',
        studentEmail: 'hong@gmail.com',
        schoolName: 'Assumption College Rayong',
        schoolCountry: 'Thailand',
        levelOfStudy: 'Matthayom 6',
        targetUniversity: 'Assumption University',
        targetScore: 'IELTS 9.0',
        studyProgram: 'Thai Program',
        otherStudyProgram: '',
        address: '2/18 Moo 2 Rd.Sukhumwit',
        subDistrict: 'Nernpra',
        district: 'Mueng Rayong',
        province: 'Rayong',
        zipCode: '21000',
        parentTitle: 'Mr.',
        parentFirstName: 'dadFirstname',
        parentLastName: 'dadLastname',
        parentRelationships: 'Father',
        parentPhoneNo: '097-xxx-xxxx',
        parentEmail: 'dad@gmail.com',
        parentLine: 'dad@line',
        studentHealthInfo: 'Seafood allergy',
        studentSource: 'Know from friends',
        studentImageUrl: {
            "path": "profile_1.jpg",
            "preview": "blob:http://localhost:3033/86ebcd05-d4ba-4cd4-9f75-dfde9838c8ac"
        },
        studentAdditionalFiles: [],
    }
]