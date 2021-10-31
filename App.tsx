import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import Home from "./components/Home";
import Rate from "./components/Rate";
import Login from "./components/Login";
import { Provider, Tabs } from "@ant-design/react-native";
import { isLoggedIn } from "./utility/firebase";
import Signup from "./components/Signup";
import Spinner from "react-native-loading-spinner-overlay";

export type LoadingControls = {
    start: () => void;
    stop: () => void;
}

export default () => {
    const [isLoading, setIsLoading] = useState(false)

    const controls: LoadingControls = useMemo(() => ({
        start: () => setIsLoading(true),
        stop: () => setIsLoading(false),
    }), [setIsLoading])

    const tabs = useMemo(() => {
        if (isLoggedIn()) {
            return [{ title: 'Home', render: (key: number) => <Home key={key}/> },
                { title: 'Rate ads', render: (key: number) => <Rate key={key} loading={controls}/> }]
        } else {
            return [{ title: 'Home', render: (key: number) => <Home key={key}/> },
                { title: 'Log in', render: (key: number) => <Login key={key} loading={controls}/> },
                { title: 'Sign up', render: (key: number) => <Signup key={key} loading={controls}/> }]
        }
    }, [controls])

    return (
        <Provider>
            <Spinner
                visible={isLoading}
                textContent='Please wait a second...'
                size='large'
                animation='fade'
                overlayColor='#FFFE'
            />

            <View style={{ flex: 1, marginTop: 30 }}>
                <Tabs
                    tabs={tabs}
                    renderTabBar={tabProps => (
                        <View
                            style={{
                                paddingHorizontal: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                            }}>
                            {tabProps.tabs.map((tab, i) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    key={tab.key || i}
                                    style={{ padding: 6, }}
                                    onPress={() => tabProps.goToTab(i)}>
                                    <Text style={{ color: tabProps.activeTab === i ? 'blue' : undefined }}>
                                        {tab.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}>
                    {tabs.map((t, i) => t.render(i))}
                </Tabs>
            </View>
        </Provider>
    )
}
