import React, { useState } from 'react'
import { View } from 'react-native'
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "react-native-screens/native-stack";
import { ScreenTypes } from "../App";
import SignIn from "./forms/SignIn";
import { LoginCredentials, User } from "../utility/models";
import { AuthFailureType, loginUser } from "../utility/firebase";
import { NoticeBar } from "antd-mobile";

type Props = NativeStackScreenProps<ScreenTypes, "Log in">;
type NavigationProp = Props['navigation'];
type RouteProp = Props['route'];

export default () => {
    const { navigate } = useNavigation<NavigationProp>()
    const { params: { startLoading, stopLoading } } = useRoute<RouteProp>()
    const [error, setError] = useState<string | undefined>()

    const onFinish = async (data: LoginCredentials) => {
        startLoading()

        const result = await loginUser(data.email, data.password)

        if (result instanceof User) {
            navigate('Rate ads', { startLoading, stopLoading })
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

        stopLoading()
    }

    return (
        <View>
            {error !== undefined && <NoticeBar content={error} color='alert' closeable={true}/>}
            <SignIn onFinish={onFinish}/>
        </View>
    )
}
