import { SignUpCredentials } from "../../utility/models";
import { Formik, FormikErrors, FormikValues } from "formik";
import { KeyboardAvoidingView, ScrollView, Text, TextInput } from "react-native";
import Button from "@ant-design/react-native/lib/button";
import React from "react";
import RadioItem from "@ant-design/react-native/lib/radio/RadioItem";
import { DatePicker, List } from "@ant-design/react-native";
import { EMAIL_REGEX, momentYearsAgo } from "../../utility/helpers";

interface Props {
    onFinish: (v: SignUpCredentials) => Promise<void>
}

export default ({ onFinish }: Props) => {
    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                passwordRetype: '',
                firstName: '',
                lastName: '',
                sex: '',
                dateOfBirth: momentYearsAgo(13)
            }}
            validate={(values) => {
                const errors: FormikErrors<FormikValues> = {}

                if (!EMAIL_REGEX.test(values.email)) {
                    errors.email = "Provide a valid email address!"
                }
                if (values.password.length < 8) {
                    errors.password = "The password must have at least 8 characters!"
                }
                if (values.password === values.passwordRetype) {
                    errors.passwordRetype = "Passwords do not match!"
                }
                if (!values.firstName.trim().length) {
                    errors.firstName = "First name is required."
                }
                if (!values.lastName.trim().length) {
                    errors.lastName = "Last name is required."
                }
                if (!values.sex.trim().length) {
                    errors.sex = "Gender is required."
                }

                return errors
            }}
            onSubmit={values => onFinish({ ...values } as SignUpCredentials)}>
            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
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
                        <TextInput
                            placeholder='Repeat password...'
                            secureTextEntry={true}
                            onChangeText={handleChange('passwordRetype')}
                            onBlur={handleBlur('passwordRetype')}
                            value={values.passwordRetype}
                        />
                        <TextInput
                            placeholder='First name...'
                            onChangeText={handleChange('firstName')}
                            onBlur={handleBlur('firstName')}
                            value={values.firstName}
                        />
                        <TextInput
                            placeholder='Last name...'
                            onChangeText={handleChange('lastName')}
                            onBlur={handleBlur('lastName')}
                            value={values.lastName}
                        />

                        <List style={{ marginTop: 12 }}>
                            <Text style={{ marginTop: 12 }}>
                                Gender
                            </Text>
                            <RadioItem
                                checked={values.sex === 'male'}
                                onPress={() => setFieldValue('sex', 'male')}>
                                Male
                            </RadioItem>
                            <RadioItem
                                checked={values.sex === 'female'}
                                onPress={() => setFieldValue('sex', 'female')}>
                                Female
                            </RadioItem>
                            <RadioItem
                                checked={values.sex === 'nb'}
                                onPress={() => setFieldValue('sex', 'nb')}>
                                Non-binary
                            </RadioItem>
                        </List>

                        <List>
                            <DatePicker
                                value={values.dateOfBirth.toDate()}
                                mode="date"
                                minDate={momentYearsAgo(100).toDate()}
                                maxDate={momentYearsAgo(12).toDate()}
                                onChange={value => setFieldValue('dateOfBirth', value)}
                                format="YYYY-MM-DD"
                            >
                                <List.Item arrow="horizontal">Select Date</List.Item>
                            </DatePicker>
                        </List>

                        <Button onPress={() => handleSubmit()}>Create an account</Button>
                    </KeyboardAvoidingView>
                </ScrollView>
            )}
        </Formik>
    );
};
