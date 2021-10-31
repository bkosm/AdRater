import React, { useState } from 'react'
import { View } from 'react-native'
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "react-native-screens/native-stack";
import { ScreenTypes } from "../App";
import { postScore, signOut } from "../utility/firebase";
import { Button, Divider, NoticeBar, Slider, Toast } from "antd-mobile";
import { AdMobBanner } from "expo-ads-admob";
import { AdUnitIds } from "../utility/helpers";

type Props = NativeStackScreenProps<ScreenTypes, "Log in">;
type NavigationProp = Props['navigation'];
type RouteProp = Props['route'];

const formatter = (value: number) => {
    if (0 <= value && value <= 1) {
        return 'This is worthless!'
    } else if (2 <= value && value <= 4) {
        return 'Booooring'
    } else if (5 <= value && value <= 7) {
        return 'Hmm, not that bad'
    } else if (8 <= value && value <= 9) {
        return 'Wow I actually learned something!'
    } else {
        return '🔥🔥🔥'
    }
}

export default () => {
    const { navigate } = useNavigation<NavigationProp>()
    const { params: { startLoading, stopLoading } } = useRoute<RouteProp>()
    const [score, setScore] = useState(5)
    const [error, setError] = useState<string | undefined>(undefined)

    const doLogout = async () => {
        await signOut()
        navigate('Home')
    }

    const sendRate = async () => {
        startLoading()

        const result = await postScore()

        if (result !== undefined) {
            setError('There was an error')
        }

        setScore(5)
        stopLoading()
    }

    return (
        <View>
            {error !== undefined && <NoticeBar content={error} color='alert' closeable={true}/>}

            <View style={{ padding: '3rem' }}>
                <AdMobBanner
                    style={{
                        width: '100%',
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: '5rem'
                    }}
                    bannerSize="fullBanner"
                    adUnitID={AdUnitIds.banner}
                    servePersonalizedAds={false}
                />

                <Slider
                    style={{ marginBottom: '5rem' }}
                    step={1}
                    min={0}
                    max={10}
                    ticks
                    onChange={(value => {
                        if (typeof value !== "number") return
                        setScore(value)
                        Toast.show(formatter(value))
                    })}
                    value={score}
                />

                <Button onClick={sendRate} color="primary" block>
                    Rate it!
                </Button>

                <Divider/>

                <Button onClick={doLogout} color='primary' fill='outline' block>
                    Logout
                </Button>
            </View>
        </View>
    )
}
