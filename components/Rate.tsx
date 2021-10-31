import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { postScore, signOut } from "../utility/firebase";
import { AdMobBanner } from "expo-ads-admob";
import { AdUnitIds } from "../utility/helpers";
import { NoticeBar, Slider, Toast, WhiteSpace } from "@ant-design/react-native";
import Button from "@ant-design/react-native/lib/button";
// @ts-ignore
import Restart from 'react-native-restart';
import { LoadingControls } from "../App";

const formatter = (value: number) => {
    switch (value) {
        case 0:
            return 'This is worthless!'
        case 1:
            return 'I knew I will be waisting my time'
        case 2:
            return 'Booooring'
        case 3:
            return 'Come on, do something!'
        case 4:
            return 'That\'s lame.'
        case 5:
            return 'Almost there'
        case 6:
            return 'Hmm, not that bad'
        case 7:
            return 'Gotta say I\'m impressed'
        case 8:
            return 'Now we\'re talking!'
        case 9:
            return 'Wow I actually learned something!'
        case 10:
            return '🔥🔥🔥'
        default:
            return ''
    }
}

type Props = {
    loading: LoadingControls;
}

export default ({ loading }: Props) => {
    const [score, setScore] = useState(5)
    const [error, setError] = useState<string | undefined>(undefined)

    const doLogout = async () => {
        loading.start()
        await signOut()
        Restart.Restart()
    }

    const sendRate = async () => {
        setError(undefined)
        loading.start()

        const result = await postScore()

        if (result !== undefined) {
            setError('There was an error')
        }

        setScore(5)
        loading.stop()
    }

    return (
        <View>
            {error !== undefined && <NoticeBar marqueeProps={{fps: 200, loop: true}} onPress={() => setError(undefined)} mode='closable'>{error}</NoticeBar>}
            <ScrollView style={{ padding: 30 }}>
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
                        Toast.removeAll()
                        Toast.info(formatter(value))
                    })}
                    value={score}
                />

                <WhiteSpace size='xl'/>

                <Button onPress={sendRate} type="primary">
                    Rate it!
                </Button>

                <WhiteSpace size='xl'/>

                <Button onPress={doLogout} type="ghost">
                    Log me out
                </Button>
            </ScrollView>
        </View>
    )
}
