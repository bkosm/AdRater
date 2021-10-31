import React from "react";
import { LoginCredentials } from "../../utility/models";
import Button from "@ant-design/react-native/lib/button";
import { Formik, FormikErrors, FormikValues } from "formik";
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TextStyle, ViewStyle } from "react-native";
import { EMAIL_REGEX } from "../../utility/helpers";


interface Props {
    onFinish: (v: LoginCredentials) => Promise<void>;
}

export default ({ onFinish }: Props) => {
    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validate={(values) => {
                const errors: FormikErrors<FormikValues> = {}

                if (!EMAIL_REGEX.test(values.email)) {
                    errors.email = "Provide a valid email address!"
                }
                if (!values.password.trim().length) {
                    errors.password = "A password is needed to log in."
                }

                return errors
            }}
            onSubmit={onFinish}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <ScrollView>
                    <KeyboardAvoidingView enabled>
                        <TextInput
                            placeholder='Email...'
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={inputStyle}
                        />
                        <Text style={errorStyle}>{touched.email && errors.email}</Text>
                        <TextInput
                            placeholder='Password...'
                            secureTextEntry={true}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            style={inputStyle}
                        />
                        <Text style={errorStyle}>{touched.password && errors.password}</Text>
                        <Button style={{margin: 10}} type='primary' onPress={() => handleSubmit()}>Log me in</Button>
                    </KeyboardAvoidingView>
                </ScrollView>
            )}
        </Formik>
    );
};


const inputStyle: ViewStyle = {
    height: 50,
    padding: 10,
}

const errorStyle: TextStyle = {
    margin: 10,
    color: 'red'
}
