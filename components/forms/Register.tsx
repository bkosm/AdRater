import { SignUpCredentials } from "../../utility/models";
import { Formik, FormikErrors, FormikValues } from "formik";
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import RadioItem from "@ant-design/react-native/lib/radio/RadioItem";
import { DatePicker, List } from "@ant-design/react-native";
import { EMAIL_REGEX, momentYearsAgo } from "../../utility/helpers";
import Button from "@ant-design/react-native/lib/button";
import moment from "moment";

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
                dateOfBirth: undefined
            }}
            validate={(values) => {
                const errors: FormikErrors<FormikValues> = {}

                if (!EMAIL_REGEX.test(values.email)) {
                    errors.email = "Provide a valid email address!"
                }
                if (values.password.length < 8) {
                    errors.password = "The password must have at least 8 characters!"
                }
                if (values.password !== values.passwordRetype) {
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
                if (!values.dateOfBirth) {
                    errors.dateOfBirth = "Date of birth is required."
                }

                return errors
            }}
            onSubmit={values => onFinish({
                ...values,
                dateOfBirth: values.dateOfBirth!!,
                passwordRetype: undefined
            } as SignUpCredentials)}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
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
                        <TextInput
                            placeholder='Repeat password...'
                            secureTextEntry={true}
                            onChangeText={handleChange('passwordRetype')}
                            onBlur={handleBlur('passwordRetype')}
                            value={values.passwordRetype}
                            style={inputStyle}
                        />
                        <Text style={errorStyle}>{touched.passwordRetype && errors.passwordRetype}</Text>
                        <TextInput
                            placeholder='First name...'
                            onChangeText={handleChange('firstName')}
                            onBlur={handleBlur('firstName')}
                            value={values.firstName}
                            style={inputStyle}
                        />
                        <Text style={errorStyle}>{touched.firstName && errors.firstName}</Text>
                        <TextInput
                            placeholder='Last name...'
                            onChangeText={handleChange('lastName')}
                            onBlur={handleBlur('lastName')}
                            value={values.lastName}
                            style={inputStyle}
                        />
                        <Text style={errorStyle}>{errors.lastName && touched.lastName && errors.lastName}</Text>
                        <List>
                            <RadioItem
                                checked={values.sex === 'male'}
                                onChange={() => setFieldValue('sex', 'male')}>
                                Male
                            </RadioItem>
                            <RadioItem
                                checked={values.sex === 'female'}
                                onChange={() => setFieldValue('sex', 'female')}>
                                Female
                            </RadioItem>
                            <RadioItem
                                checked={values.sex === 'nb'}
                                onChange={() => setFieldValue('sex', 'nb')}>
                                Non-binary
                            </RadioItem>
                            <Text style={errorStyle}>{errors.sex && touched.sex && errors.sex}</Text>
                        </List>

                        <List>
                            <DatePicker
                                value={values.dateOfBirth?.toDate()} //@tsignore
                                mode="date"
                                minDate={momentYearsAgo(100).toDate()}
                                maxDate={momentYearsAgo(12).toDate()}
                                onChange={value => setFieldValue('dateOfBirth', moment(value))}
                                format="YYYY-MM-DD"
                                locale={{
                                    okText: 'Confirm',
                                    dismissText: 'Cancel',
                                    extra: '',
                                    DatePickerLocale: {
                                        year: '',
                                        month: '',
                                        day: '',
                                        hour: '',
                                        minute: ''
                                    }
                                }}
                            >
                                <List.Item arrow="horizontal">Date of birth</List.Item>
                            </DatePicker>
                            <Text
                                style={errorStyle}>{errors.dateOfBirth && touched.dateOfBirth && errors.dateOfBirth}</Text>
                        </List>

                        <Button style={{margin: 10}} type='primary' onPress={() => handleSubmit()}>Create an account</Button>

                        <View style={{ marginBottom: 100 }}/>
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
