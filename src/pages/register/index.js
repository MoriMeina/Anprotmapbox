import React, {useState} from "react";
import {Button, Input} from "antd";
import {FontSizeOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import md5 from "js-md5";
import axios from "axios";
import "./register.css";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState("");
    const [size] = useState('large');
    const [mailAddress, setMailaddress] = useState("");
    const [nickname, setNickname] = useState("");
    const [phone, setPhone] = useState("");
    const onPhoneChange = (e) => {
        setPhone(e.target.value);
    }

    const onNickChange = (e) => {
        setNickname(e.target.value);
    }
    const onMailChange = (e) => {
        setMailaddress(e.target.value);
    }
    const onUsernameChange = (e) => {
        setUsername(e.target.value);
    }
    const onPasswordChange = (e) => {
        const encrypt = md5(e.target.value);
        setPassword(encrypt);
    }
    const onPasswordMatchChange = (e) => {
        const encrypt = md5(e.target.value);
        setPasswordMatch(encrypt);
    }

    function onClickRegButton() {
            if (password !== passwordMatch) {
            alert("两次密码不一致");
        } else {
            console.log('账号:', username, '密码(加密后):', password);
            axios
                .post('http://localhost:5000/api/register', {
                    nickname:nickname,
                    email: mailAddress,
                    username: username,
                    password: password,
                    phone:phone
                }).then(res => {
                if (res.data.status === "success") {
                    alert("注册成功");
                    window.location.replace("#/login");
                } else {
                    alert("注册失败，账户已经存在");
                }
            })
        }
    }

    return (
        <div className="register">
            <div className="Title">
                <h1>用户注册</h1>
            </div>
            <div>
                <label>昵称</label> <label style={{color:"red"}}>*</label>
                <Input size="large" placeholder="请输入昵称" prefix={<FontSizeOutlined />} onChange={onNickChange}/>
                <label>邮箱</label> <label style={{color:"red"}}>*</label>
                <Input size="large" placeholder="请输入邮箱" prefix={<MailOutlined />} onChange={onMailChange}/>
                <label>用户名</label> <label style={{color:"red"}}>*</label>
                <Input size="large" placeholder="请输入用户名" prefix={<UserOutlined/>} onChange={onUsernameChange}/>
                <label>密码</label> <label style={{color:"red"}}>*</label>
                <Input.Password size="large" placeholder="请输入密码" prefix={<LockOutlined/>}
                                onChange={onPasswordChange}/>
                <label>确认密码</label> <label style={{color:"red"}}>*</label>
                <Input.Password size="large" placeholder="请再次输入密码" prefix={<LockOutlined/>}
                                onChange={onPasswordMatchChange}/>
                <label>手机</label> <label style={{color:"red"}}>*</label>
                <Input size="large" placeholder="请输入手机号" prefix={<PhoneOutlined />} onChange={onPhoneChange}/>
                <br/>
                <div className="Button-area">
                    <Button type="default" size={size} className="Regist-button"
                            onClick={onClickRegButton}>注册</Button>
                </div>
            </div>
            <div className="BackLogin">
                已经有账户？返回
                <Link to={"/login"}>
                    <Button type="link" size={size}>登录</Button>
                </Link>
            </div>
        </div>
    );
};
export default Register;