import React, { useMemo } from 'react'
import { StyleSheet, Text, TextStyle, View } from 'react-native'
import { Divider } from "antd-mobile";
import { useTheme } from "@react-navigation/native";
import NamedStyles = StyleSheet.NamedStyles;

export default () => {
    const { colors } = useTheme()
    const styles = useMemo(() => {
        const baseText: TextStyle = { textAlign: 'center', color: colors.text, fontSize: 18, marginBottom: '2rem' }
        return StyleSheet.create({
            header: { ...baseText, fontSize: 30, marginTop: '1rem' },
            text: { ...baseText },
            bold: { ...baseText, fontWeight: 'bold' },
        })
    }, [colors])

    return (
        <View>
            <Text style={styles.header}>Welcome to AdRater!</Text>

            <Divider/>

            <Text style={styles.text}>This is a university project web application designed to make you rate ads!</Text>


            <Text style={styles.bold}> Cool, right?!</Text>


            <Text style={styles.text}>The ads are provided by Google Admob.</Text>

            <Divider/>

            <Text style={styles.text}>Make yourself an account and you're good to go!</Text>
        </View>
    )
}
