import React from "react";
import { Form, Input, Icon, Button, Upload } from "antd";
import "./card-form.scss";
import { Text, TextTypes, colors } from "../../components/index";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";

const CardForm = (props) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                console.log(props);

                const { keys, names, cardimage } = values;
                console.log("Received values of form: ", values);
                console.log(
                    "Merged values:",
                    keys.map((key) => names[key])
                );
                console.log(
                    "Image values:",
                    keys.map((key) => cardimage[key])
                );
            }
        });
    };

    const { getFieldDecorator, getFieldValue } = props.form;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
        },
    };

    // getFieldDecorator("keys", { initialValue: [] });
    // const keys = getFieldValue("keys");
    // console.log(keys);
    const cardDetails = props.form.getFieldValue("cardimage");

    let fileList = [];
    if (cardDetails !== undefined) {
        fileList = cardDetails.fileList;
        //   console.log(fileList);
    }

    return (
        <div className="d-none d-md-flex">
            <div className="cardForm">
                <Form onSubmit={handleSubmit}>
                    <Form.Item>
                        {getFieldDecorator(`cardimage`, {
                            validateTrigger: ["onChange", "onBlur"],
                            rules: [
                                {
                                    required: true,
                                    // whitespace: true,
                                    message:
                                        "Please upload Card image or delete this field.",
                                },
                            ],
                        })(
                            <Upload
                                showPreviewIcon="false"
                                showDownloadIcon="false"
                                showRemoveIcon="false"
                                showUploadList="false"
                            >
                                <Button>
                                    <Icon type="upload" /> Upload Card Image
                                </Button>
                            </Upload>
                        )}
                    </Form.Item>

                    {fileList.map((item) => (
                        <Form.Item>
                            {" "}
                            <span style={{ marginLeft: "10px" }} key={item.uid}>
                                {item.name}
                            </span>
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>
                            {getFieldDecorator(`names[${item.uid}]`, {
                                validateTrigger: ["onChange", "onBlur"],
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: "Please input Card name.",
                                    },
                                ],
                            })(
                                <Input
                                    style={{
                                        width: "45%",
                                        align: "right",
                                    }}
                                    placeholder="Card Name"
                                />
                            )}
                        </Form.Item>
                    ))}
                </Form>
            </div>
        </div>
    );
};

const CardFormData = Form.create({ name: "CardDetails" })(CardForm);

export default CardFormData;
// ReactDOM.render(<WrappedDynamicFieldSet />, mountNode);
