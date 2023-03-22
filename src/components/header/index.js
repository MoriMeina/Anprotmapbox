import React, { useState, useEffect } from "react";
import axios from "axios";
import LOGO from './logo.png';
import {Popover, DropdownButton, Dropdown, OverlayTrigger} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SearchBox.css";
const SearchBox = () => {
    const [type, setType] = useState('all');  // 修改默认筛选项的文本
    const [name, setName] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    useEffect(() => {
        if (name) {
            // 将查询参数放到一个对象中，并将对象作为 config 参数传递给 axios 请求
            const config = {
                params: { name, type }
            };
            axios
                .get("http://localhost:5000/search", config)
                .then((res) => {
                    // 修改 JSON 字段的命名和渲染结果的方式
                    const newResults = res.data.map(({ class: c, order: o, sn, animal }) => ({ c, o, sn, animal }));
                    setResults(newResults);
                    setError(null);
                })
                .catch((err) => {
                    console.error(err);
                    setError("出现错误");
                });
        } else {
            setResults([]);
            setError(null);
        }
    }, [name, type]);
    // 定义用于显示搜索结果的弹出框
    const popover = (
        <Popover>
            <Popover.Body>
                {results.length > 0 && (
                    <table className="search-table">  // 添加 className
                        <thead>
                        <tr>
                            <th style={{ width: "100px" }}>Class</th>  // 设置固定宽度
                            <th style={{ width: "100px" }}>Order</th>
                            <th style={{ width: "100px" }}>Animal</th>
                            <th style={{ width: "100px" }}>SN</th>
                            <th style={{ width: "100px" }}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((result) => (
                            <tr key={result.sn}>
                                <td>{result.c}</td>
                                <td>{result.o}</td>
                                <td>{result.animal}</td>
                                <td>{result.sn}</td>
                                <td>
                                    <button
                                        onClick={() => setSelectedAnimal(result.animal)}
                                    >
                                        查看详情
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </Popover.Body>
        </Popover>
    );
    // 处理筛选下拉列表选项的点击事件
    const handleFilterClick = (eventKey, event) => {
        setType(eventKey);
        event.target.innerHTML = eventKey;  // 修改点击筛选项的文本反馈
    };
    return (
        <div className="header_right_search">
            <div className="input">
        <span>
          <DropdownButton
              id="dropdown-basic-button"
              title={type === "all" ? "全部搜索" : type}  // 修改默认文本和文本反馈
          >
            <Dropdown.Item
                eventKey="all"
                onSelect={handleFilterClick}
            >
              全部搜索
            </Dropdown.Item>
            <Dropdown.Item
                eventKey="Class"
                onSelect={handleFilterClick}
            >
              按类搜索
            </Dropdown.Item>
            <Dropdown.Item
                eventKey="Order"
                onSelect={handleFilterClick}
            >
              按目搜索
            </Dropdown.Item>
            <Dropdown.Item
                eventKey="Level"
                onSelect={handleFilterClick}
            >
              按等级搜索
            </Dropdown.Item>
          </DropdownButton>
        </span>
                <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </OverlayTrigger>
            </div>
            {error ? (
                <p>{error}</p>
            ) : (
                results.length > 0 && (
                    <table className="search-table">  // 添加 className
                        <thead>
                        <tr>
                            <th style={{ width: "100px" }}>Class</th>  // 设置固定宽度
                            <th style={{ width: "100px" }}>Order</th>
                            <th style={{ width: "100px" }}>Animal</th>
                            <th style={{ width: "100px" }}>SN</th>
                            <th style={{ width: "100px" }}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((result) => (
                            <tr key={result.sn}>
                                <td>{result.c}</td>
                                <td>{result.o}</td>
                                <td>{result.animal}</td>
                                <td>{result.sn}</td>
                                <td>
                                    <button
                                        onClick={() => setSelectedAnimal(result.animal)}
                                    >
                                        查看详情
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )
            )}
            {selectedAnimal && (
                <div className="profile-overlay">
                    <button
                        className="close-btn"
                        onClick={() => setSelectedAnimal(null)}
                    >
                        关闭
                    </button>
                    <img
                        className="profile-image"
                        src={selectedAnimal}
                        alt="Animal Profile"
                    />
                </div>
            )}
            <div className="filter-button">按</div>
        </div>
    );
};

const Header = () => {
    return (<div className="header">
        <img src={LOGO} className="header_logo" alt="Logo"/>
        <SearchBox/>
    </div>);
};
export default Header;