import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AdMobBanner } from 'expo-ads-admob';
import { registerUser } from "./utility/firebase";
import { User } from "./utility/models";
import moment from "moment";
import { AdUnitIds } from "./utility/helpers";

export default () => {
    const { width, height } = useWindowDimensions();
    const styles = createStyles(width, height)

    useEffect(() => {
        const onLoad = async () => {
            const result = await registerUser(
                new User("dupadupa@gmail.com", "Bart", "Kos", moment(), "dk"),
                "asdfasdf"
            )

            console.log(result === undefined ? "Account created" : `Could not create account: ${result}`)
        }

        onLoad()
    }, [])

    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <Text>Does it work? YEAHHH</Text>

            <AdMobBanner
                style={styles.banner}
                bannerSize="fullBanner"
                adUnitID={AdUnitIds.banner}
                servePersonalizedAds={false}
            />
            <StatusBar style="auto"/>
        </View>
    );
}

const createStyles = (width: number, height: number) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    banner: {
        width: width / 2,
        justifyContent: "center",
        alignItems: "center",
    },
});
