import moment from "moment";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from "./models"


export enum AuthFailureType {
    EMAIL_NOT_FOUND,
    WRONG_CREDENTIALS,
    SERVER_ERROR,
    EMAIL_IN_USE,
    WEAK_PASSWORD
}

export function isLoggedIn() {
    return auth().currentUser != null
}

export async function signOut() {
    if (isLoggedIn()) {
        await auth().signOut()
    }
}

export async function registerUser(user: User,
                                   password: string
): Promise<undefined | AuthFailureType> {
    try {
        await auth().createUserWithEmailAndPassword(user.email, password);
        return await upsertUser(user)
    } catch (error: any) {
        if (error.code !== undefined) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    return AuthFailureType.EMAIL_IN_USE
                case 'auth/weak-password':
                    return AuthFailureType.WEAK_PASSWORD
                default:
                    return AuthFailureType.SERVER_ERROR
            }
        } else {
            return AuthFailureType.SERVER_ERROR
        }
    }
}

export async function loginUser(email: string,
                                password: string,
): Promise<User | AuthFailureType> {
    try {
        await auth().signInWithEmailAndPassword(email, password);
        return await findUserByEmail(email)
    } catch (error: any) {
        if (error.code !== undefined) {
            switch (error.code) {
                case  'auth/wrong-password':
                    return AuthFailureType.WRONG_CREDENTIALS
                case  'auth/user-not-found':
                    return AuthFailureType.EMAIL_NOT_FOUND
                default:
                    return AuthFailureType.SERVER_ERROR
            }
        } else {
            return AuthFailureType.SERVER_ERROR
        }
    }
}

async function upsertUser(user: User): Promise<undefined | AuthFailureType> {
    try {
        await firestore().collection('users').doc(user.getId()).set({
            ...user,
            dateOfBirth: user.dateOfBirth.toDate().toLocaleDateString()
        })
        return undefined
    } catch (_: any) {
        return AuthFailureType.SERVER_ERROR
    }
}

async function findUserByEmail(email: string): Promise<User | AuthFailureType> {
    try {
        const results = await firestore().collection('users').where('email', '==', email).get()
        const doc = results.docs.map(v => v.data())[0]
        return new User(email, doc['firstName'], doc['lastName'], moment(doc['dateOfBirth']), doc['sex'], doc['id'])
    } catch (error: any) {
        if (error instanceof TypeError) {
            return AuthFailureType.EMAIL_NOT_FOUND
        } else {
            return AuthFailureType.SERVER_ERROR
        }
    }
}
