import {Tree} from "antd";
import {DownOutlined, UserOutlined, UserSwitchOutlined,} from '@ant-design/icons';

const treeData = [
    {
        title: '个人信息',
        key: 'person-manage',
        icon: <UserOutlined />,
    },
];
const treeData1 = [
    {
        title: '用户管理',
        key: 'manager',
        icon: <UserSwitchOutlined />,
    }
]
const Userpop = () => {
    const onSelect = () => {
        window.location.replace('#/personal')
    };
    const  onSelect1 = () =>{
        window.location.replace('#/admin')
    }

    return (
        <div>
            <Tree
                showIcon
                defaultExpandAll
                switcherIcon={<DownOutlined/>}
                onSelect={onSelect}
                treeData={treeData}
            />
            <Tree
                showIcon
                defaultExpandAll
                switcherIcon={<DownOutlined/>}
                treeData={treeData1}
                onSelect={onSelect1}
            />
        </div>
    );
};


export default Userpop;