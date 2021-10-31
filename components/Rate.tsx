import React, { useState } from 'react'
import { View } from 'react-native'
import { postScore, signOut } from "../utility/firebase";
import { AdMobBanner } from "expo-ads-admob";
import { AdUnitIds } from "../utility/helpers";
import { Slider } from "@ant-design/react-native";
import Button from "@ant-design/react-native/lib/button";

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
    const [score, setScore] = useState(5)
    const [error, setError] = useState<string | undefined>(undefined)

    const doLogout = async () => {
        await signOut()
    }

    const sendRate = async () => {

        const result = await postScore()

        if (result !== undefined) {
            setError('There was an error')
        }

        setScore(5)
    }

    return (
        <View>
            <View style={{ padding: 30 }}>
                <AdMobBanner
                    style={{
                        width: '100%',
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 20
                    }}
                    bannerSize="fullBanner"
                    adUnitID={AdUnitIds.banner}
                    servePersonalizedAds={false}
                />

                <Slider

                    step={1}
                    min={0}
                    max={10}

                    onChange={(value => {
                        if (typeof value !== "number") return
                        setScore(value)
                    })}
                    value={score}
                />

                <Button onPress={sendRate} type="primary">
                    Rate it!
                </Button>

            </View>
        </View>
    )
}
