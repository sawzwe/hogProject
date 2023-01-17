import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signOut,
    signInWithPopup,
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

const AUTH = getAuth(firebaseApp);
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
    }, [initialize]);

    // UPDATE PASSWORD
    const changePassword = (newPassword) => updatePassword(AUTH.currentUser, newPassword);

    // LOGIN
    const login = (email, password) => signInWithEmailAndPassword(AUTH, email, password);

    // REGISTER
    const register = (email, password, firstName, lastName, role) =>
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
    const logout = () => signOut(AUTH);

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
