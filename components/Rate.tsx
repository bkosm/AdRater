import React, { useEffect, useState } from 'react'
import { RefreshControl, SafeAreaView, ScrollView, Text, ToastAndroid } from 'react-native'
import { fetchCurrentUser, NetworkFailure, postScore, signOut } from "../utility/firebase";
import { AdMobBanner } from "expo-ads-admob";
import { NoticeBar, WhiteSpace } from "@ant-design/react-native";
import Button from "@ant-design/react-native/lib/button";
// @ts-ignore
import Restart from 'react-native-restart';
import { LoadingControls } from "../App";
import { AdRate, User } from "../utility/models";
import moment from "moment";
// @ts-ignore
import BigSlider from 'react-native-big-slider'
import {
    Ad,
    displayInterstitial,
    displayRewarded,
    isBanner,
    isInterstitial,
    isRewarded,
    randomAd
} from "../utility/ads";

const formatter = (value: number) => {
    switch (value) {
        case 0:
            return 'This is worthless!'
        case 1:
            return 'Booooring'
        case 2:
            return 'I knew I will be waisting my time'
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

const showToast = (text: string) => {
    ToastAndroid.showWithGravity(
        text,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
    );
};


export default ({ loading }: Props) => {
    const [score, setScore] = useState(5)
    const [error, setError] = useState<string | undefined>(undefined)
    const [user, setUser] = useState<User | undefined>()
    const [ad, setAd] = useState<Ad>(() => randomAd())
    const [refreshing, setRefreshing] = useState(false)
    const [disableRating, setDisableRating] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            loading.start()
            const result = await fetchCurrentUser()

            if (result instanceof User) {
                setUser(result)
            } else {
                switch (result) {
                    case NetworkFailure.EMAIL_NOT_FOUND:
                        setError('You need to make an account to rate stuff, that won\'t work C:')
                        break
                    default:
                        setError('There was an error while trying to fetch your data.')
                        break
                }
            }

            setAd(randomAd())
            loading.stop()
        }
        fetch()
    }, [setUser])

    useEffect(() => {
        if (!isBanner(ad)) {
            const fetch = async () => {
                loading.start()
                if (isInterstitial(ad)) {
                    await displayInterstitial(ad.unitId)
                } else if (isRewarded(ad)) {
                    await displayRewarded(ad.unitId)
                }
                loading.stop()
            }
            fetch()
        }
    }, [ad])

    const doLogout = async () => {
        loading.start()
        await signOut()
        Restart.Restart()
    }

    const sendRate = async () => {
        setError(undefined)
        loading.start()

        const result = await postScore(new AdRate(user!!, ad.unitId, ad.name, score, moment()))

        if (result !== undefined) {
            setError('There was an error')
        } else {
            showToast("Great job! Pull down to refresh and rate another!")
            setDisableRating(true)
            setScore(5)
        }

        loading.stop()
    }

    const onRefresh = () => {
        setRefreshing(true)
        setAd(randomAd())
        setDisableRating(false)
        setRefreshing(false)
    }

    return (
        <SafeAreaView>
            {error !== undefined && <NoticeBar
                marqueeProps={{ fps: 200, loop: true }}
                onPress={() => setError(undefined)}
                mode='closable'>{error}</NoticeBar>}

            <ScrollView style={{ padding: 30 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

                {isBanner(ad) && <AdMobBanner
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 20
                    }}
                    bannerSize="fullBanner"
                    adUnitID={ad.unitId}
                />}

                <WhiteSpace size='xl'/>

                <BigSlider
                    renderLabel={() => <Text style={{ textAlign: 'center', padding: 20 }}>
                        {formatter(score)}
                    </Text>}
                    trackStyle={{ backgroundColor: 'grey' }}
                    value={score}
                    minimumValue={0}
                    maximumValue={10}
                    onValueChange={(value: any) => {
                        if (typeof value !== "number") return
                        setScore(value | 0)
                    }}
                    style={{
                        height: 200,
                        width: '100%'
                    }}
                />

                <WhiteSpace size='xl'/>

                <Button onPress={sendRate} disabled={user === undefined || disableRating} type="primary">
                    Rate this ad!
                </Button>

                <WhiteSpace size='xl'/>

                <Button onPress={doLogout} type="ghost">
                    Log me out
                </Button>

            </ScrollView>
        </SafeAreaView>
    )
}
