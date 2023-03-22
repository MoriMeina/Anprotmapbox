import React, {useState} from 'react';
import './header.css';
import LOGO from './logo.png';
import axios from 'axios';
import { Select } from 'antd';

const SearchBox = () => {
    const [type, setType] = useState("all");
    const [error, setError] = useState(null);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [options,setOptions] = useState([]);
    const [result,setResult] = useState(null)

    const onChange = (value) => {
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        if (value) {
            axios
                .get(`http://localhost:5000/search?name=${value}&type=${type}`)
                .then((res) => {
                    if (res.data.length > 0) {
                        setOptions(res.data);
                    } else {
                        setOptions(null);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
            console.log('options:',options)
            console.log('search:', value);
        };
    };

    const handleChange = (value) => {
        setType(value.key)
        console.log(value);
    };

    return (
        <div className="header_right_search">
            <div className="input">
        <span>
          {/*<DropdownButton*/}
          {/*    id="dropdown-basic-button"*/}
          {/*    title={type || "all"}*/}
          {/*    onSelect={(e) => setType(e)}*/}
          {/*>*/}
          {/*  <Dropdown.Item eventKey="all">全部搜索</Dropdown.Item>*/}
          {/*  <Dropdown.Item eventKey="Class">按类搜索</Dropdown.Item>*/}
          {/*  <Dropdown.Item eventKey="Order">按目搜索</Dropdown.Item>*/}
          {/*  <Dropdown.Item eventKey="Level">濒危等级搜索</Dropdown.Item>*/}
          {/*</DropdownButton>*/}
            <Select
                labelInValue
                defaultValue={{
                    value: 'all',
                    label: '全部搜索',
                }}
                style={{
                    width: 80,background:"transparent",border:"none"
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
                    <Select className='select' showSearch options={options} onChange={onChange} onSearch={onSearch}></Select>
            </div>

            {selectedAnimal && (
                <div className="profile-overlay">
                    <button className="close-btn" onClick={() => setSelectedAnimal(null)}>
                        关闭
                    </button>
                    <img className="profile-image" src={selectedAnimal} alt="Animal Profile"/>
                </div>
            )}

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
