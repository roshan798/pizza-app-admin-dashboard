
import { Layout } from "antd";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AuthLayout = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <Content style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px - 70px)" }}>
                <Outlet />
            </Content>
            <Footer />
        </Layout>
    );
};

export default AuthLayout;
