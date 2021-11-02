import React, { useState } from 'react'
import { View } from 'react-native'
import Register from "./forms/Register";
import { SignUpCredentials } from "../utility/models";
import { NetworkFailure, registerUser } from "../utility/firebase";
import { NoticeBar } from "@ant-design/react-native";
import { LoadingControls } from "../App";
// @ts-ignore
import Restart from 'react-native-restart';

type Props = {
    loading: LoadingControls;
}

export default ({ loading }: Props) => {
    const [error, setError] = useState<string | undefined>(undefined)

    const onFinish = async (data: SignUpCredentials) => {
        setError(undefined)
        loading.start()

        const result = await registerUser(data)

        if (result !== undefined) {
            switch (result) {
                case NetworkFailure.EMAIL_IN_USE:
                    setError('A user with given e-mail already exists.')
                    break;
                case NetworkFailure.WEAK_PASSWORD:
                    setError('The provided password is too weak. Try typing special characters.')
                    break;
                case NetworkFailure.SERVER_ERROR:
                    setError('Our backend cannot be reached, please try later.')
                    break;
            }
        } else {
            Restart.Restart()
        }

        loading.stop()
    }

    return (
        <View>
            {error !== undefined &&
            <NoticeBar marqueeProps={{ fps: 200, loop: true }} onPress={() => setError(undefined)}
                       mode='closable'>{error}</NoticeBar>}
            <Register onFinish={onFinish}/>
        </View>
    )
}
