import moment from "moment";
import { Platform } from "react-native";

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NAME_REGEX = /^[A-Z][a-z]*$/;
export const momentYearsAgo = (amount: number) => moment().subtract(amount, 'years')
export const isWeb = () => Platform.OS === 'web'
