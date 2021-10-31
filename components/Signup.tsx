import React, { useState } from 'react'
import { View } from 'react-native'
import Register from "./forms/Register";
import { SignUpCredentials } from "../utility/models";
import { NativeStackScreenProps } from "react-native-screens/native-stack";
import { ScreenTypes } from "../App";
import { useRoute } from "@react-navigation/native";
import { NoticeBar, Toast } from "antd-mobile";
import { AuthFailureType, registerUser } from "../utility/firebase";

type Props = NativeStackScreenProps<ScreenTypes, "Sign up">;
type RouteProp = Props['route'];

export default () => {
    const { params: { startLoading, stopLoading } } = useRoute<RouteProp>()
    const [error, setError] = useState<string | undefined>(undefined)

    const onFinish = async (data: SignUpCredentials) => {
        startLoading()

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
            Toast.show(`Account created. Welcome ${data.firstName}!`)
        }

        stopLoading()
    }

    return (
        <View>
            {error !== undefined && <NoticeBar content={error} color='alert' closeable={true}/>}
            <Register onFinish={onFinish}/>
        </View>
    )
}
