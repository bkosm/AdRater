import React, { useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";

import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Rate from './components/Rate'
import { isLoggedIn } from "./utility/firebase";
import { isWeb } from "./utility/helpers";
import Spinner from 'react-native-loading-spinner-overlay';

type LoadingControls = {
    startLoading: () => void;
    stopLoading: () => void;
}

export type ScreenTypes = {
    "Home": undefined;
    "Log in": LoadingControls;
    "Sign up": LoadingControls;
    "Rate ads": LoadingControls;
};

const Tab = createBottomTabNavigator<ScreenTypes>();

export default () => {
    const scheme = useColorScheme();
    const [isLoading, setIsLoading] = useState(false)

    const controls: LoadingControls = useMemo(() => ({
        startLoading: () => setIsLoading(true),
        stopLoading: () => setIsLoading(false)
    }), [setIsLoading])

    return (
        <NavigationContainer
            theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Spinner visible={isLoading}
                     textStyle={{ color: 'white', marginTop: '7rem' }}
                     textContent='Please wait...'
                     size='large'
                     animation='fade'/>
            <Tab.Navigator initialRouteName="Home">
                <Tab.Screen name="Home" component={Home}/>
                {isWeb() && <Tab.Screen name="Log in" component={Login} initialParams={controls}/>}
                {isWeb() && <Tab.Screen name="Sign up" component={Signup} initialParams={controls}/>}
                {isWeb() && <Tab.Screen name="Rate ads" component={Rate} initialParams={controls}/>}
                {!isWeb() && !isLoggedIn() && <Tab.Screen name="Log in" component={Login} initialParams={controls}/>}
                {!isWeb() && !isLoggedIn() && <Tab.Screen name="Sign up" component={Signup} initialParams={controls}/>}
                {!isWeb() && isLoggedIn() && <Tab.Screen name="Rate ads" component={Rate} initialParams={controls}/>}
            </Tab.Navigator>
        </NavigationContainer>
    );
}

