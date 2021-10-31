import React from "react";
import { LoginCredentials } from "../../utility/models";
import Button from "@ant-design/react-native/lib/button";
import { Formik } from "formik";
import { KeyboardAvoidingView, ScrollView, TextInput } from "react-native";


interface Props {
    onFinish: (v: LoginCredentials) => Promise<void>;
}

export default ({ onFinish }: Props) => {
    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={onFinish}>
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <ScrollView>
                    <KeyboardAvoidingView enabled>
                        <TextInput
                            placeholder='Email...'
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        <TextInput
                            placeholder='Password...'
                            secureTextEntry={true}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />
                        <Button onPress={() => handleSubmit()}>Submit</Button>
                    </KeyboardAvoidingView>
                </ScrollView>
            )}
        </Formik>
    );
};
