import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from "@react-navigation/native";
import Register from "./forms/Register";
import { SignUpCredentials } from "../utility/models";

export default () => {
    const { colors } = useTheme()
    const styles = useMemo(() => StyleSheet.create({
        text: { textAlign: 'center', color: colors.text, fontSize: 30 }
    }), [colors])

    const onFinish = async (data: SignUpCredentials) => {

    }

    return (
        <View>
            <Register onFinish={onFinish}/>
        </View>
    )
}
