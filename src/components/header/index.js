import React, {useState} from 'react';
import './header.css';
import LOGO from './logo.png';
import axios from 'axios';
import { Select } from 'antd';

const SearchBox = () => {
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [options,setOptions] = useState([]);
    //     [
    //     {
    //         value: 'jack',
    //         label: 'Jack',
    //     },
    //     {
    //         value: 'lucy',
    //         label: 'Lucy',
    //     },
    //     {
    //         value: 'tom',
    //         label: 'Tom',
    //     },
    // ];

    // const popover = (
    //     <Popover>
    //         <Popover.Body>
    //             {results.length > 0 && (
    //                 <table>
    //                     <thead>
    //                     <tr>
    //                         <th>Class</th>
    //                         <th>Order</th>
    //                         <th>Animal</th>
    //                         <th>SN</th>
    //                         <th>Action</th>
    //                     </tr>
    //                     </thead>
    //                     <tbody>
    //                     {results.map((result) => (
    //                         <tr key={result.id}>
    //                             <td>{result.Class}</td>
    //                             <td>{result.Order}</td>
    //                             <td>{result.Animal}</td>
    //                             <td>{result.SN}</td>
    //                             <td>
    //                                 <button onClick={() => setSelectedAnimal(result.profile)}>查看详情</button>
    //                             </td>
    //                         </tr>
    //                     ))}
    //                     </tbody>
    //                 </table>
    //             )}
    //         </Popover.Body>
    //     </Popover>
    // );

    const onChange = (value) => {
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        if (value) {
            axios
                .get(`http://localhost:5000/search?name=${value}&type=${type}`)
                .then((res) => {
                    setOptions(res.data);
                    setError(null);
                })
                .catch((err) => {
                    console.error(err);
                    setError("出现错误");
                });
            console.log('search:', value);
        };
    };

    const handleChange = (value) => {
        setType(value.key)
        console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
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
                        value: 'class',
                        label: '按类搜索',
                    },
                    {
                        value: 'order',
                        label: '按目搜索',
                    },
                    {
                        value: 'level',
                        label: '濒危等级搜索',
                    },
                ]}
            />
        </span>
                    <Select className='select' showSearch options={options} onChange={onChange} onSearch={onSearch}></Select>
            </div>
            {error ? (
                <p>{error}</p>
            ) : (
                results.length > 0 && (
                    <ul>
                        {results.map((result) => (
                            <li key={result.id}>{result.title}</li>
                        ))}
                    </ul>
                )
            )}

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
