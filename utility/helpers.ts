import moment from "moment";

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NAME_REGEX = /^[A-Z][a-z]*$/;
export const momentYearsAgo = (amount: number) => moment().subtract(amount, 'years')
export const AdUnitIds = {
    banner: "ca-app-pub-3940256099942544/6300978111",
    interstitial: "ca-app-pub-3940256099942544/8691691433",
    rewarded: "ca-app-pub-3940256099942544/5224354917",
}
