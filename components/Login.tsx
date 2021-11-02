import React, { useState } from 'react'
import { View } from 'react-native'
import SignIn from "./forms/SignIn";
import { LoginCredentials, User } from "../utility/models";
import { NetworkFailure, loginUser } from "../utility/firebase";
// @ts-ignore
import Restart from 'react-native-restart';
import { NoticeBar } from "@ant-design/react-native";
import { LoadingControls } from "../App";

type Props = {
    loading: LoadingControls;
}

export default ({ loading }: Props) => {
    const [error, setError] = useState<string | undefined>()

    const onFinish = async (data: LoginCredentials) => {
        setError(undefined)
        loading.start()

        const result = await loginUser(data.email, data.password)
        if (result instanceof User) {
            Restart.Restart()
        } else {
            switch (result) {
                case NetworkFailure.EMAIL_NOT_FOUND:
                    setError('A user with given e-mail does not exist.')
                    break;
                case NetworkFailure.WRONG_CREDENTIALS:
                    setError('The provided credentials are invalid.')
                    break;
                case NetworkFailure.SERVER_ERROR:
                    setError('Our backend cannot be reached, please try again later.')
                    break;
            }
        }

        loading.stop()
    }

    return (
        <View>
            {error !== undefined &&
            <NoticeBar marqueeProps={{ fps: 200, loop: true }} onPress={() => setError(undefined)}
                       mode='closable'>{error}</NoticeBar>}
            <SignIn onFinish={onFinish}/>
        </View>
    )
}
