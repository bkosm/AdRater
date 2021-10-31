import React, { useMemo } from 'react'
import { StyleSheet, Text, TextStyle, View } from 'react-native'

export default () => {
    const styles = useMemo(() => {
        const baseText: TextStyle = { textAlign: 'center', color: 'white', fontSize: 18, marginBottom: 20 }
        return StyleSheet.create({
            header: { ...baseText, fontSize: 30, marginTop: 20 },
            text: { ...baseText },
            bold: { ...baseText, fontWeight: 'bold' },
        })
    }, [])

    return (
        <View>
            <Text style={styles.header}>Welcome to AdRater!</Text>

            <Text style={styles.text}>This is a university project web application designed to make you rate ads!</Text>

            <Text style={styles.bold}> Cool, right?!</Text>

            <Text style={styles.text}>The ads are provided by Google Admob.</Text>

            <Text style={styles.text}>Make yourself an account and you're good to go!</Text>
        </View>
    )
}
