import React, { useState } from 'react'
import { View,Text } from 'react-native'
import SignIn from "./forms/SignIn";
import { LoginCredentials, User } from "../utility/models";
import { AuthFailureType, loginUser } from "../utility/firebase";

export default () => {
    const [error, setError] = useState<string | undefined>()

    const onFinish = async (data: LoginCredentials) => {

        const result = await loginUser(data.email, data.password)

        if (result instanceof User) {
        } else {
            switch (result) {
                case AuthFailureType.EMAIL_NOT_FOUND:
                    setError('A user with given e-mail does not exist.')
                    break;
                case AuthFailureType.WRONG_CREDENTIALS:
                    setError('The provided credentials are invalid.')
                    break;
                case AuthFailureType.SERVER_ERROR:
                    setError('Our backend cannot be reached, please try again later.')
                    break;
            }
        }

    }

    return (
        <View>
            {error !== undefined && <Text>{error}</Text>}
            <SignIn onFinish={onFinish}/>
        </View>
    )
}
