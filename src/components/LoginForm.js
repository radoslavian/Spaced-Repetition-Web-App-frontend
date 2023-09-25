import React from "react";
import "./loginForm.css";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

// Form based on:
// https://codesandbox.io/s/login-form-ant-design-demo-rx2qf

export default function LoginForm({ setCredentials, authMessage, loading }) {
    const onFinish = values => setCredentials(values);
    const componentStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    };

    return (
        <div style={componentStyle}>
          <Form name="normal_login"
                title="Provide credentials"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
          >
            <h2>Enter credentials:</h2>
            <h4 id="login-authentication-message">
              { authMessage }
            </h4>
            <Form.Item
              name="username"
              rules={[
                  {
                      required: true,
                      message: 'Please input your Username!',
                  },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />}
                     placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                  {
                      required: true,
                      message: 'Please input your Password.',
                  },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
    );
};

