import moment from "moment";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AdRate, SignUpCredentials, User } from "./models"


export enum NetworkFailure {
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

export async function fetchCurrentUser(): Promise<User | NetworkFailure> {
    const email = await auth().currentUser!!.email
    return await findUserByEmail(email!!)
}

export async function registerUser(data: SignUpCredentials): Promise<undefined | NetworkFailure> {
    try {
        const user = User.fromSignUpCredentials(data)
        await auth().createUserWithEmailAndPassword(user.email, data.password);
        return await upsertUser(user)
    } catch (error: any) {
        if (error.code !== undefined) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    return NetworkFailure.EMAIL_IN_USE
                case 'auth/weak-password':
                    return NetworkFailure.WEAK_PASSWORD
                default:
                    return NetworkFailure.SERVER_ERROR
            }
        } else {
            return NetworkFailure.SERVER_ERROR
        }
    }
}

export async function loginUser(email: string,
                                password: string,
): Promise<User | NetworkFailure> {
    try {
        await auth().signInWithEmailAndPassword(email, password);
        return await findUserByEmail(email)
    } catch (error: any) {
        if (error.code !== undefined) {
            switch (error.code) {
                case  'auth/wrong-password':
                    return NetworkFailure.WRONG_CREDENTIALS
                case  'auth/user-not-found':
                    return NetworkFailure.EMAIL_NOT_FOUND
                default:
                    return NetworkFailure.SERVER_ERROR
            }
        } else {
            return NetworkFailure.SERVER_ERROR
        }
    }
}

async function upsertUser(user: User): Promise<undefined | NetworkFailure> {
    try {
        await firestore().collection('users').doc(user.getId()).set({
            ...user,
            dateOfBirth: user.dateOfBirth.toDate().toLocaleDateString()
        })
        return undefined
    } catch (_: any) {
        return NetworkFailure.SERVER_ERROR
    }
}

async function findUserByEmail(email: string): Promise<User | NetworkFailure> {
    try {
        const results = await firestore().collection('users').where('email', '==', email).get()
        const doc = results.docs.map(v => v.data())[0]
        return new User(email, doc['firstName'], doc['lastName'], moment(doc['dateOfBirth']), doc['sex'], doc['id'])
    } catch (error: any) {
        if (error instanceof TypeError) {
            return NetworkFailure.EMAIL_NOT_FOUND
        } else {
            return NetworkFailure.SERVER_ERROR
        }
    }
}

export async function postScore(rate: AdRate): Promise<undefined | NetworkFailure> {
    return NetworkFailure.SERVER_ERROR
}
