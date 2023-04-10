import React from "react";
import "./upload.css";
import UploadComponent from "../../components/upload"

const UploadPage = () => {
    return (
        <div className="upload_form">
            <div className="upload_form_header">
                <h1>新档案上传</h1>
            </div>
            <div className="upload_render">
                <div className="left_upload">
                    <UploadComponent/>
                </div>
                <div className="right-fillup"></div>
            </div>
        </div>
    )

}
export default UploadPage;