import React from "react";
import './changePassword.css';
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Input} from "antd";
import md5 from 'js-md5';
import axios from "axios";
import {Link} from "react-router-dom";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [username, setUsername] = React.useState('');
    const onOldPasswordChange = (e) => {
        const encrypt = md5(e.target.value)
        setOldPassword(encrypt);
    }
    const onNewPasswordChange = (e) => {
        const encrypt = md5(e.target.value)
        setNewPassword(encrypt);
    }
    const onUsernameChange = (e) => {
        setUsername(e.target.value);
    }
    const onClickChangeButton = () => {
        if (username === '' || oldPassword === '' || newPassword === '') {
            alert("请填写完整信息");
        } else {
            console.log('记录到信息:', username, oldPassword, newPassword)
            axios
                .post("http://localhost:5000/api/changepass", {
                        username: username,
                        oldPassword: oldPassword,
                        newPassword: newPassword
                    }
                ).then((res) => {
                    if(res.data.status === "success"){
                        alert("修改成功");
                    }else {
                        alert("修改失败，错误");
                    }
                console.log('返回状态',res.data);
            })
        }
    }
    return <div className="changePassword">
        <div className="Title">
            <h1>更改密码</h1>
        </div>
        <div>
            <label>用户名</label>
            <Input size="large" placeholder="请输入用户名" prefix={<UserOutlined/>} onChange={onUsernameChange}/>
            <label>原密码</label>
            <Input.Password size="large" placeholder="请输入原密码" prefix={<LockOutlined/>}
                            onChange={onOldPasswordChange}/>
            <label>新密码</label>
            <Input.Password size="large" placeholder="请输入新密码" prefix={<LockOutlined/>}
                            onChange={onNewPasswordChange} onPressEnter={onClickChangeButton}/>
            <Button type="primary" size={"large"} className="Change-button"
                    onClick={onClickChangeButton}>修改密码</Button>
            <Link to={"/login"}>
                <Button type="default" size={"large"} className="BackLogin-button">返回登录</Button>
            </Link>
        </div>
    </div>
}
export default ChangePassword;