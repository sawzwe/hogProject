import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updatePassword
} from 'firebase/auth';

import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, deleteObject, listAll } from "firebase/storage"
import axios from 'axios';
// utils
import { fDate } from '../utils/formatTime';
// config
import { FIREBASE_API, HOG_API } from '../config';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
};

const reducer = (state, action) => {
    if (action.type === 'INITIAL') {
        return {
            isInitialized: true,
            isAuthenticated: action.payload.isAuthenticated,
            user: action.payload.user,
        };
    }

    return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);
const AUTH = getAuth(firebaseApp);
const DB = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const initialize = useCallback(() => {
        try {
            onAuthStateChanged(AUTH, async (user) => {
                if (user) {
                    const userRef = doc(DB, 'users', user.uid);
                    const docSnap = await getDoc(userRef);
                    const profile = docSnap.data();

                    dispatch({
                        type: 'INITIAL',
                        payload: {
                            isAuthenticated: true,
                            user: {
                                ...user,
                                ...profile,
                            },
                        },
                    });
                } else {
                    dispatch({
                        type: 'INITIAL',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        initialize();
    }, []);

    // UPDATE PASSWORD
    const changePassword = (newPassword) => updatePassword(AUTH.currentUser, newPassword);

    // LOGIN
    const login = async (email, password) => (signInWithEmailAndPassword(AUTH, email, password))

    // REGISTER STUDENT
    // const registerStudent = async (data) =>
    //     createUserWithEmailAndPassword(AUTH_STUDENT, data.studentEmail, '123456')
    //         .then(async (res) => {
    //             const userRef = doc(collection(DB, 'users'), res.user?.uid);
    //             return setDoc(userRef, {
    //                 uid: res.user?.uid,
    //                 email: data.studentEmail,
    //                 displayName: `${data.studentFirstName} ${data.studentLastName}`,
    //                 role: "Student"
    //             })
    //                 .catch((error) => console.error(error))
    //                 .then(() => {
    //                     const file = data.studentImageURL
    //                     const storageProfileRef = ref(storage, `users/students/${res.user?.uid}/Avatar/${file.name}`);
    //                     uploadBytes(storageProfileRef, file)
    //                         .then((snapshot) => { console.log("uploaded!") })
    //                         .catch((error) => console.error(error));
    //                 })
    //                 .catch((error) => console.error(error))
    //                 .then(() => {
    //                     data.studentAdditionalFiles.map((file, index) => {
    //                         const storageAdditionalFilesRef = ref(storage, `users/students/${res.user?.uid}/Files/${file.name}`);
    //                         return uploadBytes(storageAdditionalFilesRef, file)
    //                             .then((snapshot) => console.log("Additional File uploaded!"))
    //                             .catch((error) => console.error(error));
    //                     })
    //                 })
    //                 .then(() => signOut(AUTH_STUDENT))
    //         })

    const registerStudent = async (data) => {
        const nameAdditionalFiles = data.studentAdditionalFiles.map((file) => ({ file: file.name }))
        const formattedData = {
            title: data.studentTitle,
            fName: data.studentFirstName,
            lName: data.studentLastName,
            nickname: data.studentNickname,
            profilePicture: data.studentImageURL.name,
            additionalFiles: nameAdditionalFiles || [],
            dob: fDate(data.studentDateOfBirth, 'dd-MMMM-yyyy'),
            phone: data.studentPhoneNo,
            line: data.studentLineId,
            email: data.studentEmail,
            school: data.schoolName,
            countryOfSchool: data.schoolCountry,
            levelOfStudy: data.levelOfStudy,
            program: data.studyProgram,
            targetUni: data.targetUniversity,
            targetScore: data.targetScore,
            hogInfo: data.studentSource,
            healthInfo: data.studentHealthInfo,
            parent: {
                fName: data.parentFirstName,
                lName: data.parentLastName,
                relationship: data.parentRelationships,
                phone: data.parentPhoneNo,
                email: data.parentEmail,
                line: data.parentLineId,
            },
            address: {
                address: data.address,
                subdistrict: data.subDistrict,
                district: data.district,
                province: data.province,
                zipcode: data.zipCode,
            }
        }

        axios.post(`${HOG_API}/api/Student/Post`, formattedData)
            .then(async (res) => {
                const uid = res.data.data.firebaseId;
                const userRef = doc(collection(DB, 'users'), uid);
                return setDoc(userRef, {
                    uid,
                    id: res.data.data.id,
                    email: data.studentEmail,
                    displayName: `${data.studentFirstName} ${data.studentLastName}`,
                    role: "Student"
                })
                    .catch((error) => console.error(error))
                    .then(() => {
                        const file = data.studentImageURL
                        const storageProfileRef = ref(storage, `users/students/${uid}/Avatar/${file.name}`);
                        uploadBytes(storageProfileRef, file)
                            .then((snapshot) => { console.log("uploaded!") })
                            .catch((error) => console.error(error));
                    })
                    .catch((error) => console.error(error))
                    .then(() => {
                        data.studentAdditionalFiles.map((file, index) => {
                            const storageAdditionalFilesRef = ref(storage, `users/students/${uid}/Files/${file.name}`);
                            return uploadBytes(storageAdditionalFilesRef, file)
                                .then((snapshot) => console.log("Additional File uploaded!"))
                                .catch((error) => console.error(error));
                        })
                    })
            })
            .catch((error) => console.error(error))
    }

    // UPDATE STUDENT
    const updateStudent = async (currentStudent, data) => {

        // Change display name to Firestore if name has been changed
        if (data.studentFirstName !== currentStudent.firstName || data.studentLastName !== currentStudent.lastName) {
            const studentRef = doc(DB, "users", currentStudent.firebaseId);
            await updateDoc(studentRef, {
                "displayName": `${data.studentFirstName} ${data.studentLastName}`
            })
        }

        // Delete old image and add new if user editted profile picture
        if (data.studentImageURL instanceof File) {
            const lastImageRef = ref(storage, `users/students/${currentStudent.firebaseId}/Avatar/${currentStudent.profilePicture}`);
            const newImageRef = ref(storage, `users/students/${currentStudent.firebaseId}/Avatar/${data.studentImageURL.name}`);
            deleteObject(lastImageRef)
            await uploadBytes(newImageRef, data.studentImageURL)
                .catch((error) => console.error(error))
        }

        // Delete additional files on changes
        const filesRef = ref(storage, `users/students/${currentStudent.firebaseId}/Files`);
        const additionalFiles = data.studentAdditionalFiles.filter((file) => file.ref !== undefined);
        const originalAdditionalFiles = additionalFiles.map((file) => file.ref);
        await listAll(filesRef)
            .then((res) => {
                res.items.forEach((itemRef) => {
                    if (originalAdditionalFiles.some((ref) => ref._location.path_ === itemRef._location.path_)) {
                        return null;
                    }
                    return deleteObject(itemRef)
                });
            })
            .catch((error) => console.error(error))
        // Add new additional files on changes
        await data.studentAdditionalFiles.map((file) => {
            const fileRef = ref(storage, `users/students/${currentStudent.firebaseId}/Files/${file.name}`)
            if (file instanceof File) {
                return uploadBytes(fileRef, file)
                    .catch((error) => console.error(error));
            }
            return null;
        })


        // Axios to Azure
        const nameAdditionalFiles = data.studentAdditionalFiles.map((file) => ({ file: file.name }))
        await axios.put(`${HOG_API}/api/Student/Put`, {
            id: currentStudent.id,
            firebaseId: currentStudent.firebaseId,
            title: data.studentTitle,
            fName: data.studentFirstName,
            lName: data.studentLastName,
            nickname: data.studentNickname,
            profilePicture: data.studentImageURL.name,
            additionalFiles: nameAdditionalFiles || [],
            dob: fDate(data.studentDateOfBirth, 'dd-MMMM-yyyy'),
            phone: data.studentPhoneNo.toString(),
            line: data.studentLineId,
            email: data.studentEmail,
            school: data.schoolName,
            countryOfSchool: data.schoolCountry,
            levelOfStudy: data.levelOfStudy,
            program: data.studyProgram,
            targetUni: data.targetUniversity,
            targetScore: data.targetScore,
            hogInfo: data.studentSource,
            healthInfo: data.studentHealthInfo,
            parent: {
                fName: data.parentFirstName,
                lName: data.parentLastName,
                relationship: data.parentRelationships,
                phone: data.parentPhoneNo.toString(),
                email: data.parentEmail,
                line: data.parentLineId,
            },
            address: {
                address: data.address,
                subdistrict: data.subDistrict,
                district: data.district,
                province: data.province,
                zipcode: data.zipCode,
            }
        }).catch((error) => console.error(error))
    }

    // CREATE TEACHER
    const registerTeacher = async (data) => {
        await axios.post(`${HOG_API}/api/Teacher/Post`, data)
            .then((res) => {
                const uid = res.data.data.firebaseId;
                const databaseId = res.data.data.id;
                const userRef = doc(collection(DB, 'users'), uid);
                setDoc(userRef, {
                    uid,
                    id: databaseId,
                    email: res.data.data.email,
                    displayName: `${res.data.data.fName} ${res.data.data.lName}`,
                    role: "Teacher"
                })
                .catch((error) => {
                    throw error;
                })
            })
            .catch((error) => {
                throw error;
            })
    }

    // CREATE EP
    const registerEP = async (data) => {
        await axios.post(`${HOG_API}/api/EP/Post`, data)
            .then((res) => {
                const uid = res.data.data.firebaseId;
                const databaseId = res.data.data.id;
                const userRef = doc(collection(DB, 'users'), uid);
                setDoc(userRef, {
                    uid,
                    id: databaseId,
                    email: res.data.data.email,
                    displayName: `${res.data.data.fName} ${res.data.data.lName}`,
                    role: "Education Planner"
                })
                    .catch((error) => {
                        throw error;
                    })
            })
            .catch((error) => {
                throw error;
            })
    }

    // CREATE EA
    const registerEA = async (data) => {
        await axios.post(`${HOG_API}/api/EA/Post`, data)
            .then(async (res) => {
                const uid = res.data.data.firebaseId;
                const databaseId = res.data.data.id;
                const userRef = doc(collection(DB, 'users'), uid);
                setDoc(userRef, {
                    uid,
                    id: databaseId,
                    email: res.data.data.email,
                    displayName: `${res.data.data.fName} ${res.data.data.lName}`,
                    role: "Education Admin"
                })
                    .then(() => 'Success')
                    .catch((error) => {
                        throw error;
                    })
            })
            .catch((error) => {
                throw error;
            })
    }


    // LOGOUT
    const logout = async () => {
        try {
            await signOut(AUTH)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'firebase',
                login,
                registerStudent,
                updateStudent,
                registerEA,
                registerEP,
                registerTeacher,
                logout,
                changePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
