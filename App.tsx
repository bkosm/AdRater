import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import Home from "./components/Home";
import Rate from "./components/Rate";
import Login from "./components/Login";
import { Provider, Tabs } from "@ant-design/react-native";
import { isLoggedIn } from "./utility/firebase";
import Signup from "./components/Signup";


const getTabs = () => {
    if (isLoggedIn()) {
        return [{ title: 'Home', render: () => <Home/> },
            { title: 'Rate ads', render: () => <Rate/> }]
    } else {
        return [{ title: 'Home', render: () => <Home/> },
            { title: 'Log in', render: () => <Login/> },
            { title: 'Sign up', render: () => <Signup/> }]
    }
}

export default () => {
    const tabs = getTabs()
    return (
        <Provider>
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
                            {tabProps.tabs.filter(t => t.title !== 'Rate ads').map((tab, i) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    key={tab.key || i}
                                    style={{ padding: 6, }}
                                    onPress={() => tabProps.goToTab(i)}>
                                    <Text style={{ color: tabProps.activeTab === i ? 'green' : undefined, }}>
                                        {tab.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}>
                    {tabs.map(t => t.render())}
                </Tabs>
            </View>
        </Provider>
    )
}
