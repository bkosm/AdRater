import React, { useEffect, useState } from "react";
import { LoginCredentials } from "../../utility/models";
import { Button, Form, Input } from "antd-mobile";
import { EMAIL_REGEX } from "../../utility/helpers";


interface Props {
    onFinish: (v: LoginCredentials) => Promise<void>;
}

export default ({ onFinish }: Props) => {
    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});

    useEffect(() => {
        forceUpdate({});
    }, []);

    return (
        <Form form={form} name="login" onFinish={onFinish}>
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email address!', pattern: EMAIL_REGEX }]}
            >
                <Input placeholder="Email"/>
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!', min: 8 }]}
            >
                <Input
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item shouldUpdate>
                {() => (
                    <Button
                        color="primary"
                        disabled={
                            !form.isFieldsTouched(true) ||
                            !!form.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                        onClick={() => onFinish(form.getFieldsValue())}
                    >
                        Log in
                    </Button>
                )}
            </Form.Item>
        </Form>
    );
};
