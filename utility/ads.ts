import { AdMobInterstitial, AdMobRewarded } from "expo-ads-admob";

const AdUnitIds = {
    banner: "ca-app-pub-3940256099942544/6300978111",
    interstitial: "ca-app-pub-3940256099942544/1033173712",
    interstitialVideo: "ca-app-pub-3940256099942544/8691691433",
    rewarded: "ca-app-pub-3940256099942544/5224354917",
    //rewardedInterstitial: "ca-app-pub-3940256099942544/5354046379", // ERROR_CODE_NO_FILL
    //nativeAdvanced: "ca-app-pub-3940256099942544/2247696110", // ERROR_CODE_NO_FILL
    //nativeAdvancedVideo: "ca-app-pub-3940256099942544/1044960115", // ERROR_CODE_NO_FILL
}

export type Ad = {
    name: string;
    unitId: string;
}

export const randomAd = (): Ad => {
    const entries = Object.entries(AdUnitIds)
    const randomElement = entries[Math.floor(Math.random() * entries.length)];
    const [name, unitId] = randomElement
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
    await AdMobInterstitial.requestAdAsync()
    await AdMobInterstitial.showAdAsync()
}

export const displayRewarded = async (unitId: string) => {
    await AdMobRewarded.setAdUnitID(unitId)
    await AdMobRewarded.requestAdAsync()
    await AdMobRewarded.showAdAsync()
}
