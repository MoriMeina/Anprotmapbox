import {Tree} from "antd";
import {useEffect, useRef, useState} from "react";
import axios from "axios";


const treeData0 = [{
    title: '全部显示',
    key: 'all',
},];
const treeData = [
    {
        title: '按类显示',
        key: 'class',
        children: [
            {
                title: '哺乳类',
                key: '哺乳类',
            },
            {
                title: '鸟类',
                key: '鸟类',
            },
            {
                title: '爬行类',
                key: '爬行类',
            },
            {
                title: '两栖类',
                key: '两栖类',
            },
            {
                title: '鱼类',
                key: '鱼类',
            },
        ],
    },
];
const treeData1 = [{
    title: '按濒危等级显示',
    key: 'level',
    children: [
        {
            title: 'CR极危',
            key: 'CR极危',
        },
        {
            title: 'EN濒危',
            key: 'EN濒危',
        },
        {
            title: 'VU易危',
            key: 'VU易危',
        },
    ],
},];
const Filter = (props) => {
    //----------------------------------------Class------------------------------------------------------------//
    // const [needtoQuerybyClass, setNeedtoQuerybyClass] = useState([]);
    const needtoQuerybyClassRef= useRef([])

    //设置需要查询的类
    // const [needtoQuerybyLevel, setNeedtoQuerybyLevel] = useState([]);
    const needtoQuerybyLevelRef = useRef([])

    //设置需要查询的濒危等级
    // const [needtoQueryAll, setNeedtoQueryAll] = useState([]);
    const needtoQueryAllRef = useRef([])

    //查询所有
    const [expandedKeys, setExpandedKeys] = useState(['class']);
    const [checkedKeys, setCheckedKeys] = useState(['']);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    //根据类的显示事件
    const onExpand = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };
    const onCheck = (checkedKeysValue) => {
        console.log('onCheck', checkedKeysValue);
        //如果是class，那么就只查询class
        setCheckedKeys(checkedKeysValue);
        //设置自己的状态为checked
        setCheckedKeys0([]);
        //清除all的状态
        setCheckedKeys1([]);
        //清除濒危等级的状态
        // setNeedtoQueryAll([]);
        needtoQueryAllRef.current = [];
        //清除需要查询的ALL
        // setNeedtoQuerybyLevel([]);
        needtoQuerybyLevelRef.current = [];
        //清除需要查询的濒危等级
        if (checkedKeysValue.includes('class')) {
            // setNeedtoQuerybyClass(['class']);
            needtoQuerybyClassRef.current = ['class'];

        } else {
            // setNeedtoQuerybyClass(checkedKeysValue);
            needtoQuerybyClassRef.current = checkedKeysValue
        }
        queryAndMapping();
    };
    const onSelect = (selectedKeysValue, info) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
    };


    //-------------------------------------------level---------------------------------------------------------//
    const [expandedKeys1, setExpandedKeys1] = useState(['level']);
    const [checkedKeys1, setCheckedKeys1] = useState([]);
    const [selectedKeys1, setSelectedKeys1] = useState([]);
    const [autoExpandParent1, setAutoExpandParent1] = useState(true);

    //根据濒危等级的显示事件

    const onExpand1 = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys1(expandedKeysValue);
        setAutoExpandParent1(false);
    };
    const onCheck1 = (checkedKeysValue1) => {
        console.log('onCheck', checkedKeysValue1);
        setCheckedKeys1(checkedKeysValue1);
        //设置自己的状态为checked
        setCheckedKeys0([]);
        //清除all的状态
        setCheckedKeys([]);
        //清除类的状态
        // setNeedtoQuerybyClass([]);
        needtoQuerybyClassRef.current = [];
        //清除需要查询的类
        // setNeedtoQueryAll([]);
        needtoQueryAllRef.current = [];
        //清除需要查询的ALL
        if (checkedKeysValue1.includes('level')) {
            // setNeedtoQuerybyLevel(['level']);
            needtoQuerybyLevelRef.current = ['level'];
        } else {
            // setNeedtoQuerybyLevel(checkedKeysValue1);
            needtoQuerybyLevelRef.current = checkedKeysValue1;
        }
        queryAndMapping();
    };
    const onSelect1 = (selectedKeysValaue1, info) => {
        console.log('onSelect', info);
        setSelectedKeys1(selectedKeysValaue1);
    };


    //----------------------------------------------All--------------------------------------------------------//
    const [expandedKeys0, setExpandedKeys0] = useState(['']);
    const [checkedKeys0, setCheckedKeys0] = useState(['all']);
    const [selectedKeys0, setSelectedKeys0] = useState([]);
    const [autoExpandParent0, setAutoExpandParent0] = useState(true);

    //直接queryall的显示事件
    const onExpand0 = (expandedKeysValue0) => {
        console.log('onExpand', expandedKeysValue0);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys0(expandedKeysValue0);
        setAutoExpandParent0(false);
    };
    const onCheck0 = (checkedKeysValue0) => {
        console.log('onCheck', checkedKeysValue0);
        setCheckedKeys0(checkedKeysValue0);
        //设置自己的状态为checked
        setCheckedKeys([]);
        //清除类的状态
        setCheckedKeys1([]);
        //清除濒危等级的状态
        // setNeedtoQueryAll(['all']);
        needtoQueryAllRef.current = ['all'];
        //设置需要查询all
        // setNeedtoQuerybyLevel([]);
        needtoQuerybyLevelRef.current = [];
        //清除需要查询的濒危等级
        // setNeedtoQuerybyClass([]);
        needtoQuerybyClassRef.current = [];
        //清除需要查询的类
        queryAndMapping();
    };
    const onSelect0 = (selectedKeysValaue0, info) => {
        console.log('onSelect', info);
        setSelectedKeys0(selectedKeysValaue0);
    };


    //-----------------------查询-----------------------------//


    useEffect(() => {
        //根据类查询
        if (needtoQuerybyClassRef.current.length !== 0) {
            console.log('需要查询类', needtoQuerybyClassRef.current);
        }
        //根据濒危等级查询
        if (needtoQuerybyLevelRef.current.length !== 0) {
            console.log('需要查询濒危等级', needtoQuerybyLevelRef.current);
        }
        //查询所有
        if (needtoQueryAllRef.current.length !== 0) {
            console.log('需要查询所有', needtoQueryAllRef.current);
        }
    }, [needtoQuerybyClassRef.current, needtoQuerybyLevelRef.current, needtoQueryAllRef.current]);

    //----------------------查询并标记------------------------------//
    const queryByClass = async () => {
        try {
            if (needtoQuerybyClassRef.current === "class") {
                try {
                    const response = await axios.get('http://localhost:5000/api/location');
                    if (response && response.data && response.data.features) {
                        console.log('请求全部类',response.data.features)
                        //设置markers
                        props.updateMarker(response.data.features)
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            const response = await axios.post('http://localhost:5000/api/byclass', {
                class: needtoQuerybyClassRef.current,
            })
            if (response && response.data && response.data.features) {
                console.log('根据类请求到', response.data.features)
                props.updateMarker(response.data.features)
            }
        } catch (error) {
            console.error(error);
        }
    };
    const queryByLevel = async () => {
        try {
            if (needtoQuerybyLevelRef.current === "level") {
                try {
                    const response = await axios.get('http://localhost:5000/api/location');
                    if (response && response.data && response.data.features) {
                        console.log('请求全部濒危等级',response.data.features)
                        //设置markers
                        props.updateMarker(response.data.features)
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            const response = await axios.post('http://localhost:5000/api/bylevel', {
                level: needtoQuerybyLevelRef.current,
            })
            if (response && response.data && response.data.features) {
                console.log('根据濒危等级请求到', response.data.features)
                props.updateMarker(response.data.features)
            }
        } catch (error) {
            console.error(error);
        }
    };
    const queryAll = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/location');
            if (response && response.data && response.data.features) {
                console.log('全部请求', response.data.features)
                //设置markers值
                props.updateMarker(response.data.features)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const queryAndMapping = () => {
        //如果需要查询的类不为空
        if (needtoQuerybyClassRef.current.length !== 0) {
            queryByClass().catch((error) => {
                console.error(error);
            });
        }
        //如果需要查询的濒危等级不为空
        if (needtoQuerybyLevelRef.current.length !== 0) {
            queryByLevel().catch((error) => {
                console.error(error);
            });
        }
        //如果需要查询的all不为空
        if (needtoQueryAllRef.current.length !== 0) {
            queryAll().catch((error) => {
                console.error(error);
            });
        }
    };



    //监听需要查询值的变化
    useEffect(() => {
        console.log('needtoQuerybyClass', needtoQuerybyClassRef.current);
    }, [needtoQuerybyClassRef]);
    useEffect(() => {
        console.log('needtoQuerybyLevel', needtoQuerybyLevelRef.current);
    }, [needtoQuerybyLevelRef]);
    useEffect(() => {
        console.log('needtoQueryAll', needtoQueryAllRef.current);
    }, [needtoQueryAllRef]);


    return (
        <div>
            <Tree
                ID={0}
                checkable
                onExpand={onExpand0}
                expandedKeys={expandedKeys0}
                autoExpandParent={autoExpandParent0}
                onCheck={onCheck0}
                checkedKeys={checkedKeys0}
                onSelect={onSelect0}
                selectedKeys={selectedKeys0}
                treeData={treeData0}
            />
            <Tree
                ID={1}
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={treeData}
            />
            <Tree
                ID={2}
                checkable
                onExpand={onExpand1}
                expandedKeys={expandedKeys1}
                autoExpandParent={autoExpandParent1}
                onCheck={onCheck1}
                checkedKeys={checkedKeys1}
                onSelect={onSelect1}
                selectedKeys={selectedKeys1}
                treeData={treeData1}
            />
        </div>

    )
        ;
};


export default Filter;