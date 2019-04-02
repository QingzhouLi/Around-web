import React from 'react';
import { Form, Input, Upload, Icon } from 'antd'
    ;
class NormalCreatPostForm extends React.Component {
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    beforeUpload = () => false;

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <Form {...formItemLayout} >

                <Form.Item
                    label="Message"
                >
                    {getFieldDecorator('message', {
                        rules: [{
                            required: true, message: "Please input your message!",
                        }],
                    })(
                        <Input placeholder="Pleace input your message!" />
                    )}
                </Form.Item>

                <Form.Item
                    label="Image"
                >
                    <div className="dropbox">
                        {getFieldDecorator('image', {
                            rules: [{
                                required: true, message: "Please select an image!",
                            }],
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                        })(
                            <Upload.Dragger name="files" beforeUpload={this.beforeUpload}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        )}
                    </div>
                </Form.Item>

            </Form>
        )
    }
}

export const CreatePostForm = Form.create({ name: 'CreatePostForm' })(NormalCreatPostForm);