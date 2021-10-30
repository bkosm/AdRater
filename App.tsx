import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import auth from '@react-native-firebase/auth';

import { AdMobBanner } from 'expo-ads-admob';

const androidBannerId = "ca-app-pub-3940256099942544/6300978111";
const androidInterId = "ca-app-pub-3940256099942544/8691691433";
const androidRewardedId = "ca-app-pub-3940256099942544/5224354917";

export default () => {
    const {width, height} = useWindowDimensions();
    const styles = createStyles(width, height)

    useEffect(() => {
        auth()
            .createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }, [])

    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <Text>Does it work? YEAHHH</Text>

            <AdMobBanner
                style={styles.banner}
                bannerSize="fullBanner"
                adUnitID={androidBannerId}
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
