import React, {useEffect, useState} from 'react';
import './personal.css';
import {Button, Input, Menu, message} from "antd";
import {MailOutlined, PhoneOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";
import {Content} from "antd/es/layout/layout";
import axios from "axios";
import cookie from "react-cookies";
import Upload from "../upload"

const Personal = () => {
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    const items = [
        getItem('信息管理', 'personal', <UserOutlined/>, [
            getItem('我的信息', 'mine', <MailOutlined/>),
            getItem('新物种上传', 'newUpload', <UploadOutlined/>),
        ]),
    ];
    const [current, setCurrent] = useState('mine');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    const Mine = () => {

        const onClickloginButton = () => {
            const token = cookie.load('token')
            axios
                .post('/api/updatepersonal', {
                    'token': token,
                    'nickname': Newnick,
                    'phone': Newphone,
                    'email': Newemail
                })
                .then(response => {
                    if (response.data.status === 'success') {
                        message.info('修改成功')
                        window.location.reload()
                    } else {
                        message.info('请重新登录后修改')
                    }
                })

            console.log('修改')
        }
        const [nickname, setNickname] = useState('昵称')
        const [Newnick, setNewnick] = useState('')
        const [username, setUsername] = useState('用户名')
        const [phone, setPhone] = useState('手机号')
        const [Newphone, setNewphone] = useState('')
        const [email, setEmail] = useState('邮箱')
        const [Newemail, setNewemail] = useState('')


        useEffect(() => {
            const token = cookie.load('token')
            console.log('token:', token)
            if (token.trim() !== '') {
                // 在组件渲染后发送网络请求
                axios.post('/api/personal', {
                    'token': token
                }) // 替换成实际的后端接口地址

                    .then(response => {
                        if (response.data.status === 'success') {
                            // 处理返回的数据并更新 state
                            setNickname(response.data.nickname);
                            setUsername(response.data.username);
                            setPhone(response.data.phone);
                            setEmail(response.data.email);
                        } else {
                            message.info('错误')
                            cookie.remove('token');
                        }
                    })
                    .catch(error => {
                        // 处理错误
                        console.error('Error fetching user data:', error);
                    });
            } else {
                message.info('请先登录')
                window.location.replace('#/login')
            }
        }, []);
        const UpdateNickname = (e) => {
            setNewnick(e.target.value)
        }
        const UpdatePhone = (e) => {
            setNewphone(e.target.value)
        }
        const UpdateEmail = (e) => {
            setNewemail(e.target.value)
        }
        return (
            <div className="Mine">
                <label>昵称</label>
                <Input size="large" placeholder={nickname} prefix={<UserOutlined/>} onChange={UpdateNickname}/>
                <label>用户名</label>
                <Input size="large" disabled={true} prefix={<UserOutlined/>} value={username}/>
                <label>手机号</label>
                <Input size="large" placeholder={phone} prefix={<PhoneOutlined/>} onChange={UpdatePhone}/>
                <label>邮箱</label>
                <Input size="large" placeholder={email} prefix={<MailOutlined/>} onChange={UpdateEmail}/>
                <Button type="primary" size={"large"} className="Change-button"
                        onClick={onClickloginButton}>修改</Button>
            </div>

        )
    }
    return (
        <div className="personal">
            <>
                <Menu
                    theme={"light"}
                    onClick={onClick}
                    style={{
                        width: 256,
                        height: '500px',
                    }}
                    defaultOpenKeys={['personal']}
                    selectedKeys={[current]}
                    mode="inline"
                    items={items}
                />
                <Content style={{padding: '16px'}}>
                    {current === 'mine' && <Mine/>}
                    {current === 'newUpload' && <Upload/>}
                </Content>
            </>
        </div>
    )
}
export default Personal