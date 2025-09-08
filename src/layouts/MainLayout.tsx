
import { useState } from "react";
import { Layout } from "antd";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const MainLayout = () => {
    const [sideCollapsed, setSideCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <Layout>
                <Sider
                    collapsible
                    collapsed={sideCollapsed}
                    onCollapse={setSideCollapsed}
                    style={{ background: "#001529" }}
                >
                    <Sidebar />
                </Sider>
                <Layout style={{ background: "#fff" }}>
                    <Content style={{ margin: 24, minHeight: 280 }}>
                        <Outlet />
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
