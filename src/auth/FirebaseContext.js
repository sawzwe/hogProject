import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import _ from 'lodash';
import {
    getAuth,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
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
    const changePassword = async (oldPassword, newPassword) => {

        const credential = EmailAuthProvider.credential(
            AUTH.currentUser.email,
            oldPassword
        )

        const result = await reauthenticateWithCredential(
            AUTH.currentUser,
            credential
        ).catch((error) => {
            throw error;
        })

        if (result.user.accessToken === AUTH.currentUser.accessToken) {
            updatePassword(AUTH.currentUser, newPassword)
            .catch((error) => {
                throw error;
            })
        }
    };

    // LOGIN
    const login = async (email, password) => (signInWithEmailAndPassword(AUTH, email, password))

    const registerStudent = async (data, config) => {
        const nameAdditionalFiles = data.studentAdditionalFiles.map((file) => ({ file: file.name }))
        const formattedData = {
            title: data.studentTitle,
            fName: _.capitalize(data.studentFirstName),
            lName: _.capitalize(data.studentLastName),
            nickname: _.capitalize(data.studentNickname),
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
                fName: _.capitalize(data.parentFirstName),
                lName: _.capitalize(data.parentLastName),
                relationship: _.capitalize(data.parentRelationships),
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

        return axios.post(`${HOG_API}/api/Student/Post`, formattedData, config)
            .then(async (res) => {
                const uid = res.data.data.firebaseId;
                const userRef = doc(collection(DB, 'users'), uid);
                await setDoc(userRef, {
                    uid,
                    id: res.data.data.id,
                    email: data.studentEmail,
                    displayName: `${data.studentFirstName} ${data.studentLastName}`,
                    role: "Student"
                })
                    .catch((error) => {
                        throw error;
                    })

                // Upload Avatar
                const file = data.studentImageURL
                const storageProfileRef = ref(storage, `users/students/${uid}/Avatar/${file.name}`);
                await uploadBytes(storageProfileRef, file)
                    .catch((error) => {
                        throw error;
                    });

                // Upload Additional Files
                await Promise.all(data.studentAdditionalFiles.map(async file => {
                    const storageAdditionalFilesRef = ref(storage, `users/students/${uid}/Files/${file.name}`);
                    await uploadBytes(storageAdditionalFilesRef, file)
                        .catch((error) => {
                            throw error;
                        });
                }))

            })
            .catch((error) => {
                throw error;
            })
    }

    // UPDATE STUDENT
    const updateStudent = async (currentStudent, data, config) => {

        // Axios to Azure
        const nameAdditionalFiles = data.studentAdditionalFiles.map((file) => ({ file: file.name }))
        await axios.put(`${HOG_API}/api/Student/Put`, {
            id: currentStudent.id,
            firebaseId: currentStudent.firebaseId,
            title: data.studentTitle,
            fName: _.capitalize(data.studentFirstName),
            lName: _.capitalize(data.studentLastName),
            nickname: _.capitalize(data.studentNickname),
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
                fName: _.capitalize(data.parentFirstName),
                lName: _.capitalize(data.parentLastName),
                relationship: _.capitalize(data.parentRelationships),
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
        }, config).catch((error) => {
            throw error;
        })



        // Change display name to Firestore if name has been changed
        if (data.studentFirstName !== currentStudent.firstName || data.studentLastName !== currentStudent.lastName) {
            const studentRef = doc(DB, "users", currentStudent.firebaseId);
            await updateDoc(studentRef, {
                "displayName": `${_.capitalize(data.studentFirstName)} ${_.capitalize(data.studentLastName)}`
            })
                .catch((error) => {
                    throw error;
                });
        }

        // Delete old image and add new if user editted profile picture
        if (data.studentImageURL instanceof File) {
            const lastImageRef = ref(storage, `users/students/${currentStudent.firebaseId}/Avatar/${currentStudent.profilePicture}`);
            const newImageRef = ref(storage, `users/students/${currentStudent.firebaseId}/Avatar/${data.studentImageURL.name}`);
            deleteObject(lastImageRef)
            await uploadBytes(newImageRef, data.studentImageURL)
                .catch((error) => {
                    throw error;
                });
        }

        // Delete additional files on changes
        const filesRef = ref(storage, `users/students/${currentStudent.firebaseId}/Files`);
        const additionalFiles = data.studentAdditionalFiles.filter((file) => file.ref !== undefined);
        const uploadingFiles = data.studentAdditionalFiles.filter((file) => file instanceof File)
        const originalAdditionalFiles = additionalFiles.map((file) => file.ref);

        if (additionalFiles.length === 0) {
            // console.log("All deleted")
            await listAll(filesRef)
                .then((res) => {
                    res.items.forEach((itemRef) => {
                        deleteObject(itemRef)
                    });
                })
                .catch((error) => {
                    throw error;
                });

            // console.log("Uploading files...")
            await Promise.all(uploadingFiles.map(async file => {
                const fileRef = ref(storage, `users/students/${currentStudent.firebaseId}/Files/${file.name}`)
                await uploadBytes(fileRef, file)
                    // .then((snapshot) => console.log('uploaded'))
                    .catch((error) => {
                        throw error;
                    });
            }))

            // console.log("finished uploading files")
        } else {
            await listAll(filesRef)
                .then(async (res) => {
                    await res.items.forEach((itemRef) => {
                        if (originalAdditionalFiles.some((ref) => ref._location.path_ === itemRef._location.path_)) {
                            return null;
                        }
                        return deleteObject(itemRef)
                    });
                })
                .catch((error) => {
                    throw error;
                });

            await Promise.all(uploadingFiles.map(async file => {
                const fileRef = ref(storage, `users/students/${currentStudent.firebaseId}/Files/${file.name}`)
                await uploadBytes(fileRef, file)
                    // .then((snapshot) => console.log('uploaded'))
                    .catch((error) => {
                        throw error;
                    });
            }))
        }

        // Add new additional files on changes
    }

    // CREATE TEACHER
    const registerTeacher = async (data) => {
        await axios.post(`${HOG_API}/api/Teacher/Post`, data)
            .catch((error) => {
                throw error;
            })
    }

    // CREATE EP, EA, OA
    const registerStaff = async (data) => {
        await axios.post(`${HOG_API}/api/Staff/Post`, data)
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
                registerStaff,
                registerTeacher,
                logout,
                changePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
