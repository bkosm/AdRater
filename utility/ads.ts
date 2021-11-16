import { AdMobInterstitial, AdMobRewarded } from "expo-ads-admob";

const AdUnitIds = {
    banner: "ca-app-pub-3940256099942544/6300978111",
    interstitial: "ca-app-pub-3940256099942544/1033173712",
    interstitialVideo: "ca-app-pub-3940256099942544/8691691433",
    rewarded: "ca-app-pub-3940256099942544/5224354917",
    rewardedInterstitial: "ca-app-pub-3940256099942544/5354046379",
    appOpen: "ca-app-pub-3940256099942544/3419835294",
    nativeAdvanced: "ca-app-pub-3940256099942544/2247696110",
    nativeAdvancedVideo: "ca-app-pub-3940256099942544/1044960115",
}

export type Ad = {
    name: string;
    unitId: string;
}

export const initAd = () => ({})

export const randomAd = (force: string | null = null): Ad => {
    let randomElement: string[];
    if (force != null) {
        // @ts-ignore
        randomElement = [force, AdUnitIds[force]]
    } else {
        const entries = Object.entries(AdUnitIds)
        randomElement = entries[Math.floor(Math.random() * entries.length)];
    }
    const [name, unitId] = randomElement
    console.log({ name, unitId })
    return { name, unitId }
}

export const isBanner = (ad: Ad) =>
    ["banner", "appOpen"].includes(ad.name)

export const isInterstitial = (ad: Ad) =>
    ["interstitial", "interstitialVideo", "rewardedInterstitial", "nativeAdvanced", "nativeAdvancedVideo"].includes(ad.name)

export const isRewarded = (ad: Ad) =>
    ["rewarded"].includes(ad.name)

export const displayInterstitial = async (unitId: string) => {
    await AdMobInterstitial.setAdUnitID(unitId)
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true })
    await AdMobInterstitial.showAdAsync()
}

export const displayRewarded = async (unitId: string) => {
    await AdMobRewarded.setAdUnitID(unitId)
    await AdMobRewarded.requestAdAsync()
    await AdMobRewarded.showAdAsync()
}
