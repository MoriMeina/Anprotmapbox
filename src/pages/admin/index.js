import React, {useState} from 'react';
import {Menu} from "antd";
import {Content} from "antd/es/layout/layout";
import {CheckOutlined, UploadOutlined, UserOutlined} from "@ant-design/icons";


const Admin = () => {
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
        // eslint-disable-next-line react/jsx-no-undef
        getItem('管理', 'personal', <CheckOutlined/>, [
            getItem('用户管理', 'mine', <UserOutlined/>),
            getItem('用户上传审核', 'newUpload', <UploadOutlined/>),
        ]),
    ];
    const [current, setCurrent] = useState('mine');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return (
        <div className="personal">
            <>
                <Menu
                    theme={"light"}
                    onClick={onClick}
                    style={{
                        width: 256,
                        height: '100%',
                    }}
                    defaultOpenKeys={['personal']}
                    selectedKeys={[current]}
                    mode="inline"
                    items={items}
                />
                <Content style={{padding: '16px'}}>
                    {current === 'mine' && <div>我的信息</div>}
                    {current === 'newUpload' && <div>upload</div>}
                </Content>
            </>
        </div>
    )
}
export default Admin;