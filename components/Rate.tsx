import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from "@react-navigation/native";

export default () => {
    const { colors } = useTheme()
    const styles = useMemo(() => StyleSheet.create({
        text: { textAlign: 'center', color: colors.text, fontSize: 30 }
    }), [colors])

    return (
        <View>
            <Text style={styles.text}>Rate</Text>
        </View>
    )
}
