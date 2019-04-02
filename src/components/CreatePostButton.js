import React from 'react';
import { Modal, Button, message } from 'antd';
import { CreatePostForm } from './CreatePostForm';
import { API_ROOT, POS_KEY, TOKEN_KEY , AUTH_HEADER} from "../constants";

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        

        this.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                const formData = new FormData();
                const token = localStorage.getItem(TOKEN_KEY);

                formData.set("message", values.message);
                formData.set("image", values.image[0].originFileObj);
                formData.set("lat", lat);
                formData.set("lon", lon)

                this.setState({
                    confirmLoading: true,
                });

                // Fire API
                fetch(`${API_ROOT}/post`, {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`
                    }
                })
                    .then((response) => {
                        if (response.ok) {
                            this.form.resetFields();
                            this.setState({
                                confirmLoading: false,
                                visible: false,
                            });
                            this.props.loadNearByPosts();
                            return response;
                        }
                        throw new Error(response.statusText);
                    })
                    .then(() => {
                        message.success("Post create successfully! ");
                    })
                    .catch((err) => {
                        message.error('Failed to create the post.');
                        this.setState({
                            confirmLoading: false,
                        });
                    })
            }
        })
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }

    getFormRef = (formInstance) => {
        this.form = formInstance;
    }

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="Creat"
                >
                    <CreatePostForm ref={this.getFormRef} />
                </Modal>
            </div>
        );
    }
}