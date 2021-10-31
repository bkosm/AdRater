import React, { useState } from 'react'
import { View } from 'react-native'
import Register from "./forms/Register";
import { SignUpCredentials } from "../utility/models";
import { AuthFailureType, registerUser } from "../utility/firebase";

export default () => {
    const [error, setError] = useState<string | undefined>(undefined)

    const onFinish = async (data: SignUpCredentials) => {

        const result = await registerUser(data)

        if (result !== undefined) {
            switch (result) {
                case AuthFailureType.EMAIL_IN_USE:
                    setError('A user with given e-mail already exists.')
                    break;
                case AuthFailureType.WEAK_PASSWORD:
                    setError('The provided password is too weak. Try typing special characters.')
                    break;
                case AuthFailureType.SERVER_ERROR:
                    setError('Our backend cannot be reached, please try later.')
                    break;
            }
        } else {
        }

    }

    return (
        <View>
            <Register onFinish={onFinish}/>
        </View>
    )
}
