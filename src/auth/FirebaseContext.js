import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updatePassword
} from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';
// config
import { FIREBASE_API } from '../config';

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
    const login = (email, password) =>
        signInWithEmailAndPassword(AUTH_ADMIN, email, password)
            .catch(() => signInWithEmailAndPassword(AUTH, email, password)
                .catch(() => signInWithEmailAndPassword(AUTH_STUDENT, email, password)));

    // REGISTER
    const register = (email, password, firstName, lastName) =>
        createUserWithEmailAndPassword(AUTH, email, password).then(async (res) => {
            const userRef = doc(collection(DB, 'users'), res.user?.uid);

            await setDoc(userRef, {
                uid: res.user?.uid,
                email,
                displayName: `${firstName} ${lastName}`,
                role: "Education Planner"
            });
        });

    // LOGOUT
    const logout = () =>
        signOut(AUTH)
            .then(signOut(AUTH_STUDENT))
            .then(signOut(AUTH_ADMIN));

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'firebase',
                login,
                register,
                logout,
                changePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
