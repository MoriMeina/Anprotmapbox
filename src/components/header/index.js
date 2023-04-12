import React, {useState} from 'react';
import './header.css';
import LOGO from './logo.png';
import axios from 'axios';
import {Drawer, Select} from 'antd';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import {pdfjs} from 'react-pdf';
import PDFShower from '../PDFShower';
// noinspection JSUnresolvedVariable
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const SearchBox = () => {
    const [type, setType] = useState("all");
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState([]);
    const [open, setOpen] = useState(false);
    // const [numPages, setNumPages] = useState(null);


    //左侧弹出抽屉显示PDF文件内容
    const onClose = () => {
        setOpen(false);
    };

    const onOpen = async (value) => {
        console.log('download_file:', value)
        setOpen(true);
        const response = await axios.get(`http://localhost:5000/pdf/${value}`, {responseType: 'blob'});
        const file = new Blob([response.data], {type: 'application/pdf'});
        const fileUrl = URL.createObjectURL(file);
        console.log('fileUrl:', fileUrl)
        setValue(fileUrl);
    };


    //搜索框下弹出列表
    const onSearch = (value) => {
        if (value) {
            axios
                .get(`http://localhost:5000/search?name=${value}&type=${type}`)
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
        <div className="header_right_search">
            <div className="input">
        <span className="typeButton">
            <Select
                labelInValue
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
                        label: '按类搜索',
                    },
                    {
                        value: 'Order',
                        label: '按目搜索',
                    },
                    {
                        value: 'Level',
                        label: '濒危等级搜索',
                    },
                ]}
            />
        </span>
                <div className="searchbox">
                    <Select style={{position: "absolute", top: "7"}} className='select' showSearch options={options}
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
    );
};
// 主结构
const Header = () => {
    return (<div className="header">
        <img src={LOGO} className="header_logo" alt="Logo"/>
        <SearchBox/>
    </div>);
};

export default Header;
