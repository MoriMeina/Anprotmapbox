import React, {useState} from 'react';
import './header.css';
import LOGO from './logo.png';
import axios from 'axios';
import {Drawer, Select} from 'antd';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { pdfjs } from 'react-pdf';
import PDFShower from '../PDFShower';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



const SearchBox = () => {
    const [type, setType] = useState("all");
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState([]);
    const [open, setOpen] = useState(false);
    // const [pdfUrl, setPdfUrl] = useState(null);
    // const [numPages, setNumPages] = useState(null);
    //左侧弹出抽屉显示PDF文件内容
    const onClose = () => {
        setOpen(false);
    };

    const onOpen = async (value) => {
        console.log('download_file:',value)
        setOpen(true);
        const response = await axios.get(`http://localhost:5000/pdf/${value}`, { responseType: 'blob' });
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        setValue(fileUrl);
    };


    // const onOpen = () => {
    //     console.log('download_file:',value)
    //     setValue(value)
    //     setOpen(true);
    // };

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
        <span>
            <Select
                labelInValue
                defaultValue={{
                    value: 'all',
                    label: '全部搜索',
                }}
                style={{
                    width: 80, background: "transparent", border: "none"
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
                <Select className='select' showSearch options={options} filterOption={false} onSelect={onOpen} onSearch={onSearch}></Select>
            </div>

            {selectedAnimal && (
                <div className="profile-overlay">
                    <button className="close-btn" onClick={() => setSelectedAnimal(null)}>
                        关闭
                    </button>
                    <img className="profile-image" src={selectedAnimal} alt="Animal Profile"/>
                </div>
            )}
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

            {/*<Drawer*/}
            {/*    title="详细信息"*/}
            {/*    placement="left"*/}
            {/*    closable={false}*/}
            {/*    onClose={onClose}*/}
            {/*    open={open}*/}
            {/*    width={650}*/}
            {/*>*/}
            {/*    <Document*/}
            {/*        file={pdfUrl}*/}
            {/*        onLoadSuccess={({ numPages }) => {*/}
            {/*            setNumPages(numPages);*/}
            {/*        }}*/}
            {/*        error={(error) => console.error('Error while loading PDF:', error)}*/}
            {/*    >*/}
            {/*        {Array.from(new Array(numPages), (el, index) => (*/}
            {/*            <Page*/}
            {/*                key={`page_${index + 1}`}*/}
            {/*                pageNumber={index + 1}*/}
            {/*                onLoadError={(error) => console.error('Error while loading page:', error)}*/}

            {/*            />*/}
            {/*        ))}*/}
            {/*    </Document>*/}
            {/*</Drawer>*/}
            <div className="filter-button">按</div>
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
