import { Button, DatePicker, Form, Input, Selector, } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import { SignUpCredentials } from "../../utility/models";
import { EMAIL_REGEX, NAME_REGEX } from "../../utility/helpers";

interface Props {
    onFinish: (v: SignUpCredentials) => Promise<void>
}

export default ({ onFinish }: Props) => {
    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    const [password, setPassword] = useState('')
    const [pickerVisible, setPickerVisible] = useState(false)

    useEffect(() => {
        forceUpdate({});
    }, []);

    return (
        <Form
            form={form}
            layout="horizontal"
            onFinish={onFinish}
        >
            <Form.Item label="Email" name='email'
                       rules={[{
                           required: true,
                           message: 'Type in a correct email address.',
                           pattern: EMAIL_REGEX
                       }]}>
                <Input/>
            </Form.Item>
            <Form.Item label="Password" name='password'
                       rules={[{
                           required: true,
                           message: 'Type in a password of minimum 8 characters.',
                           len: 8,
                           whitespace: false
                       }]}>
                <Input
                    type="password"
                    onChange={password => setPassword(password)}
                />
            </Form.Item>
            <Form.Item label="Repeat password" name='passwordRetype'
                       rules={[{
                           required: true,
                           message: 'Type again the same password.',
                           len: 2,
                           pattern: NAME_REGEX,
                           validator: (rule, value, callback) => {
                               if (value !== password) callback('Passwords do not match')
                           }
                       }]}>
                <Input
                    type="password"
                />
            </Form.Item>
            <Form.Item label="First name" name='firstName'
                       rules={[{
                           required: true,
                           message: 'Type in your first name, capitalized.',
                           len: 2,
                           pattern: NAME_REGEX
                       }]}>
                <Input/>
            </Form.Item>
            <Form.Item label="Last name" name='lastName'
                       rules={[{
                           required: true,
                           message: 'Type in your last name, capitalized.',
                           len: 2,
                           pattern: NAME_REGEX
                       }]}>
                <Input/>
            </Form.Item>
            <Form.Item label="Sex" name="sex" rules={[{ required: true }]}>
                <Selector
                    columns={3}
                    options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                        { label: 'Non-binary', value: 'nb' },
                    ]}
                />
            </Form.Item>

            <Form.Item label="Date of birth" name="dateOfBirth"
                       rules={[{ required: true, message: 'You have to supply your birth date.' }]}>
                <Button
                    style={{ marginRight: '1rem' }}
                    onClick={() => {
                        setPickerVisible(true)
                    }}>
                    Choose date
                </Button>
                <DatePicker
                    title='Date of birth'
                    visible={pickerVisible}
                    confirmText='Confirm'
                    cancelText='Cancel'
                    onCancel={() => setPickerVisible(false)}
                    onConfirm={() => setPickerVisible(false)}
                >
                    {value => value?.toLocaleDateString()}
                </DatePicker>
            </Form.Item>
            <Form.Item label=" " shouldUpdate>
                {() => (
                    <Button
                        color="primary"
                        onClick={() => onFinish(form.getFieldsValue())}
                        disabled={
                            !form.isFieldsTouched(true) ||
                            !!form.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                    >
                        Sign up
                    </Button>
                )}
            </Form.Item>
        </Form>
    );
};
