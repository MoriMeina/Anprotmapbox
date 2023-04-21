import React, {useState} from "react";
import "./upload.css";
import {Button, Input, message, Radio, Upload} from "antd";
import {BranchesOutlined, FileWordOutlined, GlobalOutlined, InboxOutlined, NodeExpandOutlined} from "@ant-design/icons";
import axios from "axios";

const UploadPage = () => {
    const [level, setLevel] = useState('');
    const [value, setValue] = useState('CR极危');
    const [Classname, setClassname] = useState('');
    const [Animalname, setAnimalname] = useState('');
    const [SN, setSN] = useState('');
    const [Lat, setLat] = useState('');
    const [filename, setFileName] = useState('');
    const [order, setOrder] = useState('');

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value)
        setLevel(e.target.value);
    };
    const uploadClassname = (e) => {
        setClassname(e.target.value);
    }
    const uploadAnimalname = (e) => {
        setAnimalname(e.target.value);
    }
    const uploadSN = (e) => {
        setSN(e.target.value);
    }
    const uploadLat = (e) => {
        setLat(e.target.value);
    }
    const uploadOrder = (e) => {
        setOrder(e.target.value);
    }
    const onSubmitButtonClick = () => {
        console.log(Classname);
        console.log(Animalname);
        console.log(level);
        console.log(SN);
        console.log(Lat);
        console.log(filename);
        console.log(order)
        axios
            .post('/api/uploadfile', {
                Class: Classname,
                Order: order,
                Animal: Animalname,
                level: level,
                SN: SN,
                Lat: Lat,
                profile: filename
            })
            .then((res) => {
                console.log(res);
                if (res.data.status === 'success') {
                    message.success('上传成功,请等待管理员审核');
                    setLevel('');
                    setValue('CR极危');
                    setClassname('');
                    setAnimalname('');
                    setSN('');
                    setLat('');
                    setOrder('');
                } else {
                    message.error('上传失败');
                }
            })

    }
    const {Dragger} = Upload;
    const props = {
        name: 'file',
        multiple: false,
        action: '/api/upload',
        onChange(info) {
            const {status} = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.file.response && info.file.response.status === 'success') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else {
                    message.error(`${info.file.name} file upload failed.`);
                }
            } else if (status === 'fail') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
            setFileName(e.dataTransfer.files[0].name);
        },
    };
    const UploadComponent = () => {
        return (
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">点击选择或拖拽到此处上传</p>
                <p className="ant-upload-hint">
                    请上传单个PDF动物介绍，支持单个或批量上传，严禁上传公司内部资料或其他违规文件
                </p>
            </Dragger>
        );
    }

    return (<div className="upload_form">
        <div className="upload_form_header">
            <h1>新档案上传</h1>
        </div>
        <div className="upload_render">
            <div className="left_upload">
                <UploadComponent/>
            </div>
            <div className="right-fillup">
                <label>类</label>
                <Input size="large" placeholder="请输入用户名" prefix={<BranchesOutlined/>} onChange={uploadClassname}
                />
                <label>目</label>
                <Input size="large" placeholder="请输入目" prefix={<NodeExpandOutlined/>} onChange={uploadOrder}
                />
                <label>动物名</label>
                <Input size="large" placeholder="请输入动物名" prefix={<NodeExpandOutlined/>}
                       onChange={uploadAnimalname}
                />
                <label>濒危等级</label>
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={"CR极危"}>CR极危</Radio>
                    <Radio value={"EN濒危"}>EN濒危</Radio>
                    <Radio value={"VU易危"}>VU易危</Radio>
                </Radio.Group>
                <br/>
                <label>学名</label>
                <Input size="large" placeholder="请输入学名" prefix={<FileWordOutlined/>} onChange={uploadSN}
                />
                <label>经纬度</label>
                <Input size="large" placeholder="请输入经纬度" prefix={<GlobalOutlined/>} onChange={uploadLat}
                />
                <Button type="primary" size={"large"} className="submit-button" onClick={onSubmitButtonClick}
                >上传</Button>

            </div>
        </div>
    </div>)

}
export default UploadPage;