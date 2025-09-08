
import { Form, Input, Button, Typography } from "antd";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../http/auth";
import { useUserStore } from "../store/userStore";

const { Title } = Typography;

const Login = () => {
    const [form] = Form.useForm();
    const { setId } = useUserStore();
    const navigate = useNavigate();

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            const response = await login(values);
            setId(response.data.id);
            navigate("/");
        } catch (err) {
            console.error(err);
            // Optionally show AntD error message
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5" }}>
            <Form
                form={form}
                onFinish={handleLogin}
                layout="vertical"
                style={{ background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px #f0f1f2", width: 350 }}
            >
                <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>Login</Title>
                <Form.Item
                    // label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Invalid email!" },
                    ]}
                >
                    <Input type="email" placeholder="Enter your email" prefix={<MailOutlined style={{ color: '#f65f42' }} />} />
                </Form.Item>
                <Form.Item
                    // label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please input your password!" },
                        { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                >
                    <Input.Password placeholder="Enter your password" prefix={<LockOutlined style={{ color: '#f65f42' }} />} />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        icon={<LoginOutlined />}
                        style={{ background: '#f65f42', borderColor: '#f65f42' }}
                    >
                        Login
                    </Button>
                </Form.Item>
                <div style={{ textAlign: "center" }}>
                    Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </div>
            </Form>
        </div>
    );
};

export default Login;
