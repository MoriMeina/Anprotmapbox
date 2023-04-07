import React, {useState} from "react";
import {Button, Input} from "antd";
import {LockOutlined, PauseOutlined, UserOutlined} from '@ant-design/icons';
import {Link} from "react-router-dom";
import md5 from 'js-md5';
import axios from "axios";
import "./login.css";


const Login = () => {
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

    function onClickloginButton() {
        console.log('账号:', username, '密码(加密后):', password);
        axios
            .post('http://localhost:5000/api/login', {
                username: username,
                password: password
            }).then(res => {
                if(res.data.status === "success")
                {
                    alert("登录成功");
                    window.location.replace("#/home");
                } else {
                    alert("登录失败");
                }
        })
    }

    return (
        <div className="login">
            <div className="Title">
                <h1>用户登录</h1>
            </div>
            <div>
                <label>用户名</label>
                <Input size="large" placeholder="请输入用户名" prefix={<UserOutlined/>} onChange={onUsernameChange}/>
                <label>密码</label>
                <Input.Password size="large" placeholder="请输入密码" prefix={<LockOutlined/>}
                                onChange={onPasswordChange}/>
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
    );
}
export default Login;