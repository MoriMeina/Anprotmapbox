import React, {useState} from 'react';
import './header.css';
import LOGO from './logo.png';
import axios from 'axios';
import {Drawer, Select} from 'antd';
import {Document,Page} from "react-pdf";

const SearchBox = () => {
    const [type, setType] = useState("all");
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [options, setOptions] = useState([]);
    const [visible, setVisible] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    //左侧弹出抽屉显示PDF文件内容
const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
};

const onPageChange = ({ pageNumber }) => {
    setPageNumber(pageNumber);
};
    const showDrawer = async (value) => {
        console.log('download_file:',value)
        setVisible(true);
        const response = await axios.get(`http://localhost:5000/pdf/${value}`, { responseType: 'blob' });
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);
        };

    const onClose = () => {
        setVisible(false);
    }

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
                <Select className='select' showSearch options={options} filterOption={false} onChange={showDrawer} onSearch={onSearch}></Select>
                {/*<DebounceSelect mode="multiple" value={value} placeholder="Select Animals" fetchOptions={fetchUserList} onChange={(newValue) => {setValue(newValue);}} style={{width: '100%',}}*/}
                {/*/>*/}
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
                title="Basic Drawer"
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
            >
                <div>
                        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={pageNumber} onPageChange={onPageChange} />
                        </Document>
                        <p>
                            Page {pageNumber} of {numPages}
                        </p>
                </div>
            </Drawer>
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
