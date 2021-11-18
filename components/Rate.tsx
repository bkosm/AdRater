import React, { useEffect, useState } from 'react'
import { Image, RefreshControl, SafeAreaView, ScrollView, Text, ToastAndroid } from 'react-native'
import { fetchCurrentUser, getRateCount, NetworkFailure, postScore, signOut } from "../utility/firebase";
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

const showToast = (text: string) =>
    ToastAndroid.showWithGravity(
        text,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
    );

const getBadge = (counter: number): NodeRequire => {
    const rounded = Math.floor(counter / 10)

    switch (rounded) {
        case 1:
            return require('../assets/badge-10.png')
        case 2:
            return require('../assets/badge-20.png')
        case 3:
            return require('../assets/badge-30.png')
        case 4:
            return require('../assets/badge-40.png')
        case 5:
            return require('../assets/badge-50.png')
        case 6:
            return require('../assets/badge-60.png')
        case 7:
            return require('../assets/badge-70.png')
        case 8:
            return require('../assets/badge-80.png')
        case 9:
            return require('../assets/badge-90.png')
        case 10:
            return require('../assets/badge-100.png')
        case 11:
            return require('../assets/badge-110.png')
        case 12:
            return require('../assets/badge-120.png')
        case 13:
            return require('../assets/badge-130.png')
        default:
            return require('../assets/badge-0.png')
    }
}

export default ({ loading }: Props) => {
    const [score, setScore] = useState(0)
    const [error, setError] = useState<string | undefined>(undefined)
    const [user, setUser] = useState<User | undefined>()
    const [ad, setAd] = useState<Ad>(() => randomAd())
    const [refreshing, setRefreshing] = useState(false)
    const [disableRating, setDisableRating] = useState(false)
    const [counter, setCounter] = useState(0)
    const [isInitialRender, setIsInitialRender] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            loading.start()
            const result = await fetchCurrentUser()

            if (result instanceof User) {
                setUser(result)
                await fetchCount(result)
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
            loading.stop()
        }
        fetch()
    }, [setUser])

    useEffect(() => {
        if (!isBanner(ad) && !isInitialRender) {
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

    const fetchCount = async (user: User) => {
        const countResult = await getRateCount(user)
        if (typeof countResult === 'number') {
            setCounter(countResult)
        } else {
            const errorMessage = 'We could not load your ad rate counter :('
            setError(err => err !== undefined ? `${err} | ${errorMessage}` : errorMessage)
        }
    }

    const sendRate = async () => {
        setError(undefined)
        loading.start()

        const result = await postScore(new AdRate(user!!, ad.unitId, ad.name, score, moment()))

        if (result !== undefined) {
            setError('There was an error')
        } else {
            await fetchCount(user!!)
            setDisableRating(true)
            setScore(0)
            showToast("Great job! Pull down to refresh and rate another!")
        }

        loading.stop()
    }


    const onRefresh = async () => {
        setRefreshing(true)
        setIsInitialRender(false)
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

                {isInitialRender &&
                <Text style={{ fontSize: 22, textAlign: 'center' }}>Swipe down to load your first ad!</Text>}

                {isBanner(ad) && !isInitialRender && <AdMobBanner
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
                    renderLabel={() => <Text style={{ textAlign: 'center', padding: 20, color: 'white' }}>
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

                <Button onPress={sendRate}
                        disabled={user === undefined || disableRating || isInitialRender}
                        type="primary">
                    Rate this ad!
                </Button>

                <WhiteSpace size='xl'/>

                <Button onPress={doLogout} type="ghost">Log me out</Button>

                <WhiteSpace size='xl'/>

                <Text style={{ fontSize: 22, textAlign: 'center' }}>Your current badge:</Text>

                <WhiteSpace size='xl'/>

                <Image
                    style={{ height: 250, resizeMode: 'contain', alignSelf: 'center' }}
                    source={getBadge(counter)}
                />

                <WhiteSpace size='xl'/>

                <Text style={{ fontSize: 30, textAlign: 'center' }}>You have rated <Text
                    style={{ fontWeight: 'bold' }}>{counter}</Text> ad{counter == 1 ? '' : 's'}!</Text>

                <WhiteSpace size='xl'/>
                <WhiteSpace size='xl'/>
                <WhiteSpace size='xl'/>

            </ScrollView>
        </SafeAreaView>
    )
}
