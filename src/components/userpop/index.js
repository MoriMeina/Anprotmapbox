import React, {useState} from "react";
import {UserOutlined} from "@ant-design/icons";
import {Button, Modal} from "antd";
import Login from "../../pages/login";

const Userpop = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}
                    style={{
                        background: "#a8a8a8",
                        border: "none",
                        height: "50px",
                        width: "50px",
                        borderRadius: "50px",
                        position: "absolute",
                        top: "83%",
                        left: "3%",
                        zIndex: "1000"
                    }}>
                <UserOutlined/>
            </Button>
            <Modal
                title="Modal 1000px width"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
            >
                <Login/>
            </Modal>
        </>
    );
}
export default Userpop;