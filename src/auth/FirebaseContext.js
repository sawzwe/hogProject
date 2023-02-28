import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    setPersistence,
    updatePassword,
    browserLocalPersistence
} from 'firebase/auth';

import { getFirestore, collection, doc, getDoc, setDoc, clearIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, deleteObject, listAll, getBlob } from "firebase/storage"
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

const studentAppConfig = {
    apiKey: "AIzaSyBtyBmAPXMLJSuE7Y8mSC9EVUiXqpOFJRI",
    authDomain: "authen-hog-project.firebaseapp.com",
    projectId: "authen-hog-project",
    storageBucket: "authen-hog-project.appspot.com",
    messagingSenderId: "121884697124",
    appId: "1:121884697124:web:f39ec7fd70d1ac3fbcaeb1"
}
const studentApp = initializeApp(studentAppConfig, "studentApp");

const adminAppConfig = {
    apiKey: "AIzaSyCIVrYZVba_34k3M9mBA1JO_Knmw88RfU8",
    authDomain: "houseofgriffin-admin-auth.firebaseapp.com",
    projectId: "houseofgriffin-admin-auth",
    storageBucket: "houseofgriffin-admin-auth.appspot.com",
    messagingSenderId: "528572467703",
    appId: "1:528572467703:web:b1393764b5ffc08b41c6f2"
}

const adminApp = initializeApp(adminAppConfig, "adminApp");

const AUTH = getAuth(firebaseApp);
const AUTH_STUDENT = getAuth(studentApp);
const AUTH_ADMIN = getAuth(adminApp);

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
                                // role: 'admin',
                            },
                        },
                    });
                } else {
                    onAuthStateChanged(AUTH_STUDENT, async (user) => {
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
                                        // role: 'admin',
                                    },
                                },
                            });
                        } else {
                            onAuthStateChanged(AUTH_ADMIN, async (user) => {
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
                                                // role: 'admin',
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
                            })
                        }
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
    const login = async (email, password) => (
        signInWithEmailAndPassword(AUTH_ADMIN, email, password)
            .catch(() => signInWithEmailAndPassword(AUTH, email, password)
                .catch(() => signInWithEmailAndPassword(AUTH_STUDENT, email, password)))
    )

    // REGISTER STUDENT
    const registerStudent = async (data) =>
        createUserWithEmailAndPassword(AUTH_STUDENT, data.studentEmail, '123456')
            .then(async (res) => {
                const userRef = doc(collection(DB, 'users'), res.user?.uid);
                return setDoc(userRef, {
                    uid: res.user?.uid,
                    email: data.studentEmail,
                    displayName: `${data.studentFirstName} ${data.studentLastName}`,
                    role: "Student"
                })
                    .catch((error) => console.error(error))
                    .then(() => {
                        const file = data.studentImageURL
                        const storageProfileRef = ref(storage, `users/students/${res.user?.uid}/Avatar/${file.name}`);
                        uploadBytes(storageProfileRef, file)
                            .then((snapshot) => { console.log("uploaded!") })
                            .catch((error) => console.error(error));
                    })
                    .catch((error) => console.error(error))
                    .then(() => {
                        data.studentAdditionalFiles.map((file, index) => {
                            const storageAdditionalFilesRef = ref(storage, `users/students/${res.user?.uid}/Files/${file.name}`);
                            return uploadBytes(storageAdditionalFilesRef, file)
                                .then((snapshot) => console.log("Additional File uploaded!"))
                                .catch((error) => console.error(error));
                        })
                    })
                    .then(() => signOut(AUTH_STUDENT))
                    .then(() => {
                        const nameAdditionalFiles = data.studentAdditionalFiles.map((file) => ({ file: file.name }))
                        axios.post(`${HOG_API}/api/Student/Post`, {
                            firebaseId: res.user?.uid,
                            title: data.studentTitle,
                            fName: data.studentFirstName,
                            lName: data.studentLastName,
                            nickname: data.studentNickname,
                            profilePicture: data.studentImageURL.name,
                            additionalFiles: nameAdditionalFiles || [],
                            dob: data.studentDateOfBirth,
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
                        })
                            .then((res) => console.log(res))
                            .catch((error) => console.error(error))
                    })
            })

    // UPDATE STUDENT
    const updateStudent = async (currentStudent, data) => {

        // Display name to Firestore
        // const displayNameRef = DB.collection('users').doc(currentStudent.firebaseId);
        // console.log(currentStudent.firebaseId)
        // console.log(DB.collection('users'));
        // await displayNameRef.update({ displayName: `${data.studentFirstName} ${data.studentLastName}` })
        //     .catch((error) => console.error(error))

        // console.log('studentImageURL', data.studentImageURL)


        // Image to Firebase Storage (I need to enable CORS to use getBlob)
        // const lastImageRef = ref(storage, `users/students/${currentStudent.firebaseId}/Avatar/${currentStudent.profilePicture}`);
        // const newImageRef = ref(storage, `users/students/${currentStudent.firebaseId}/Avatar/${data.studentImageURL.name}`);
        // const newImage = data.studentImageURL
        // const metadata = {
        //     contentType: newImage.type
        // };

        // console.log(getBlob(newImage.preview))

        // console.log(new File([newImage.preview.blob(), newImage.name, metadata]))
        // if (newImage instanceof File) {
        //     console.log("File type!")
        //     await deleteObject(lastImageRef)
        //     await uploadBytes(newImageRef, newImage)
        //         .then(() => deleteObject(lastImageRef))
        //         .catch((error) => console.error(error))
        // } else {
        //     console.log("Not file type!")
        //     await deleteObject(lastImageRef)
        //     const data = new File([newImage.preview.blob(), newImage.name, metadata]);
        //     await uploadBytes(newImageRef, data)
        //         .catch((error) => console.error(error))
        // }


        // Files to Firebase Storage
        // const filesRef = ref(storage, `users/students/${currentStudent.firebaseId}/Files`);
        // await listAll(filesRef)
        //     .then((res) => {
        //         res.items.forEach((itemRef) => {
        //             deleteObject(itemRef)
        //         });
        //     })
        //     .catch((error) => console.error(error))

        // await data.studentAdditionalFiles.map((file) => {
        //     const fileRef = ref(storage, `users/students/${currentStudent.firebaseId}/Files/${file.name}`)
        //     const metadata = {
        //         contentType: file.type,
        //     };
        //     return uploadBytes(fileRef, file, metadata)
        //         .catch((error) => console.error(error));
        // })

        // // Axios to Azure
        // const nameAdditionalFiles = data.studentAdditionalFiles.map((file) => ({ file: file.name }))
        // await axios.put(`${HOG_API}/api/Student/Put`, {
        //     id: currentStudent.id,
        //     firebaseId: currentStudent.firebaseId,
        //     title: data.studentTitle,
        //     fName: data.studentFirstName,
        //     lName: data.studentLastName,
        //     nickname: data.studentNickname,
        //     profilePicture: data.studentImageURL.name,
        //     additionalFiles: nameAdditionalFiles || [],
        //     dob: fDate(data.studentDateOfBirth, 'dd MMMM yyyy'),
        //     phone: data.studentPhoneNo,
        //     line: data.studentLineId,
        //     email: data.studentEmail,
        //     school: data.schoolName,
        //     countryOfSchool: data.schoolCountry,
        //     levelOfStudy: data.levelOfStudy,
        //     program: data.studyProgram,
        //     targetUni: data.targetUniversity,
        //     targetScore: data.targetScore,
        //     hogInfo: data.studentSource,
        //     healthInfo: data.studentHealthInfo,
        //     parent: {
        //         fName: data.parentFirstName,
        //         lName: data.parentLastName,
        //         relationship: data.parentRelationships,
        //         phone: data.parentPhoneNo,
        //         email: data.parentEmail,
        //         line: data.parentLineId,
        //     },
        //     address: {
        //         address: data.address,
        //         subdistrict: data.subDistrict,
        //         district: data.district,
        //         province: data.province,
        //         zipcode: data.zipCode,
        //     }
        // }).catch((error) => console.error(error))
    }


    // LOGOUT
    const logout = async () => {
        try {
            await signOut(AUTH_STUDENT)
            await signOut(AUTH)
            await signOut(AUTH_ADMIN)
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
                logout,
                changePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
