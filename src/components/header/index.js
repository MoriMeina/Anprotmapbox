import React, {useState} from 'react';
import './header.css';
import LOGO from './logo.jpg';
import axios from 'axios';
import {Drawer, Select} from 'antd';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import PDFShower from '../PDFShower';
// noinspection JSUnresolvedVariable


// 主结构
const Header = (props) => {
    const [type, setType] = useState("all");
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState([]);
    const [open, setOpen] = useState(false);


    //左侧弹出抽屉显示PDF文件内容
    const onClose = () => {
        setOpen(false);
    };

    const onOpen = async (value, label) => {
        PushDot(label);
        console.log('download_file:', value)
        // console.log("label",label.label)
        setOpen(true);
        const response = await axios.get(`/api/pdf/${value}`, {responseType: 'blob'});
        const file = new Blob([response.data], {type: 'application/pdf'});
        const fileUrl = URL.createObjectURL(file);
        console.log('fileUrl:', fileUrl)
        setValue(fileUrl);

    };

    function PushDot(label) {
        axios
            .get('/api/location')
            .then((res) => {
                props.updateMarker(res.data.features)
            })
        axios
            .get(`/api/search?name=${label.label}&type=location`)
            .then((res) => {
                console.log('center', res.data.location[0])
                props.updateCenter(res.data.location[0])
            })
        props.updateZoom(6)
    }

    //搜索框下弹出列表
    const onSearch = (value) => {
        if (value) {
            axios
                .get(`/api/search?name=${value}&type=${type}`)
                .then((res) => {
                    console.log('res', res.data.data)
                    if (res.data.data.label.length > 0) {
                        const labels = Object.values(res.data.data.label)
                        const values = Object.values(res.data.data.value)
                        const option = values.map((value, index) => ({
                            label: labels[index],
                            value: value,
                        }));
                        setOptions(option);
                    } else {
                        setOptions(null);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });

            console.log('options:', options)
            console.log('search:', value);
        }
    };

    const handleChange = (value) => {
        setType(value.key)
        console.log(value);
    };

    return (
        <div className="header">
            <img src={LOGO} className="header_logo" alt="Logo"/>
            <div className="header_right_search">
                <div className="input">
        <span className="typeButton">
            <Select
                labelInValue
                style={{
                    background: "transparent",
                    width: "100%",
                    padding: "0 11px",

                }}
                defaultValue={{
                    value: 'all',
                    label: '全部搜索',
                }}
                onChange={handleChange}
                options={[
                    {
                        value: 'all',
                        label: '全部搜索'
                    },
                    {
                        value: 'Class',
                        label: '搜索类',
                    },
                    {
                        value: 'Order',
                        label: '搜索目',
                    },
                    {
                        value: 'Level',
                        label: '搜索濒危等级',
                    },
                ]}
            />
        </span>
                    <div className="searchbox">
                        <Select style={{
                            position: "absolute",
                            background: "transparent",
                            top: "7",
                            height: "100%",
                            minWidth: "200px",
                        }}
                                className='select' showSearch options={options}
                                filterOption={false} onSelect={onOpen}
                                onSearch={onSearch}></Select>
                    </div>
                </div>
                <Drawer
                    title="详细信息"
                    placement="left"
                    closable={false}
                    onClose={onClose}
                    open={open}
                    width={650}
                >
                    <div>
                        <PDFShower pdfUrl={value}/>
                    </div>
                </Drawer>
            </div>
        </div>
    );
};

export default Header;
