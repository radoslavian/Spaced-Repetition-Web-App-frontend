import { useRef } from "react";
import "./loginForm.css";
import { Alert, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

// Form based (with modifications) on:
// https://codesandbox.io/s/login-form-ant-design-demo-rx2qf

export default function LoginForm(
    { setCredentials, authMessages = [], loading }) {
    const loginAttempt = useRef(0);
    const onFinish = values => {
        setCredentials(values);
        loginAttempt.current++;
    };
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
            <div id="login-authentication-messages">
              { authMessages.map(
                  (message, index) => <Alert
                                        key={index + loginAttempt.current}
                                        message={message}
                                        type="error"
                                        closable />) }
            </div>
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

