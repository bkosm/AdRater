import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { NativeStackScreenProps } from "react-native-screens/native-stack";
import { ScreenTypes } from "../App";
import { Button } from "antd-mobile";
import SignIn from "./forms/SignIn";
import { LoginCredentials } from "../utility/models";

type Props = NativeStackScreenProps<ScreenTypes, "Log in">;
type NavigationProp = Props['navigation'];
type RouteProp = Props['route'];

export default () => {
    const { navigate } = useNavigation<NavigationProp>()
    const { params: { startLoading, stopLoading } } = useRoute<RouteProp>()

    const { colors } = useTheme()
    const styles = useMemo(() => StyleSheet.create({
        text: { textAlign: 'center', color: colors.text, fontSize: 30 }
    }), [colors])

    const onFinish = async (data: LoginCredentials) => {
        console.log(data)
        startLoading()
    }

    return (
        <View>
            <Text style={styles.text}>Login</Text>
            <Button onClick={() => navigate('Rate ads', { startLoading, stopLoading })}>GO!</Button>
            <SignIn onFinish={onFinish}/>
        </View>
    )
}
