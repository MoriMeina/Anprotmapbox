import React, {useState} from "react";
import {LockOutlined, PauseOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Input, message, Modal} from "antd";
import "./userpop.css"
// import Login from "../../pages/login";
import Personal from "../personal";
import md5 from "js-md5";
import axios from "axios";
import {Link} from "react-router-dom";
import Cookie from "react-cookies";


const Userpop = () => {

    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [size] = useState('large');
    const onUsernameChange = (e) => {
        setUsername(e.target.value);
    }
    const onPasswordChange = (e) => {
        const encrypt = md5(e.target.value);
        setPassword(encrypt);
    }

    const onClickloginButton = async () => {
        console.log('账号:', username, '密码(加密后):', password);
        try {
            const res = await axios.post('/api/login', {
                username: username,
                password: password,
            });
            if (res.data.status === "success") {
                Cookie.save('token', res.data.token, {path: '/'});
                setOpen(false);
                setOpen1(true);
            } else {
                message.info("登录失败");
            }
        } catch (error) {
            message.error("网络请求出错，请稍后再试！");
        }
    }

    function openDOM() {
        if (Cookie.load('token') === undefined) {
            setOpen(true);
        } else {
            setOpen1(true);
        }
    }

    return (
        <>
            <Button type="primary" onClick={openDOM}
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
                title="用户登录"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
            >

                <div className="login">
                    <div className="Title">
                        <h1>用户登录</h1>
                    </div>
                    <div>
                        <label>用户名</label>
                        <Input size="large" placeholder="请输入用户名" prefix={<UserOutlined/>}
                               onChange={onUsernameChange}/>
                        <label>密码</label>
                        <Input.Password size="large" placeholder="请输入密码" prefix={<LockOutlined/>}
                                        onChange={onPasswordChange} onPressEnter={onClickloginButton}/>
                        <br/>
                        <div className="Button-area">
                            <Link to={"/register"}>
                                <Button type="default" size={size} className="regist-button">注册</Button>
                            </Link>
                            <Button type="primary" size={size} className="Login-button"
                                    onClick={onClickloginButton}>登录</Button>
                        </div>
                    </div>
                    <div className="ChangePass">
                        <Link to={"/changePassword"}>
                            <Button type="link" size={size}>修改密码</Button>
                        </Link>
                        <PauseOutlined/>
                        <Link to={"/forgotPassword"}>
                            <Button type="link" size={size}>忘记密码</Button>
                        </Link>
                    </div>
                </div>
            </Modal>
            <Modal
                title="信息管理"
                centered
                open={open1}
                onOk={() => setOpen1(false)}
                onCancel={() => setOpen1(false)}
                width={1000}>
                <Personal/>
            </Modal>
        </>

    );
}
export default Userpop;