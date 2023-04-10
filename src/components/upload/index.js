import React from 'react';
import './upload.css';
import {InboxOutlined} from '@ant-design/icons';
import {message, Upload} from 'antd';

const {Dragger} = Upload;
const props = {
    name: 'file',
    multiple: false,
    action: 'http://localhost:5000/api/upload',
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
        }else if(status === 'fail'){
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};
const UploadComponent = () => {
    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
            </p>
        </Dragger>
    );
}
export default UploadComponent;