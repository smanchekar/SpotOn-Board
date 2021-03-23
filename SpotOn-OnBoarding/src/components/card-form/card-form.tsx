import React from "react";
import { Form, Input, Icon, Upload, Button } from "antd";
//import { Button } from "../index";
import { FormComponentProps } from "antd/lib/form/Form";
import "./card-form.scss";
import { showLoader, showToast, ToastVariants } from "../index";
import Service from "../../services/apolloClient.service";
import { Category as Cat_Type } from "../../types/graphql-global-types";

export interface CardProps extends FormComponentProps {
    catdesc: string;
    carddesc: string[];
    cardimagename: string[];
    handleModalSubmit: (cat: Cat_Type) => void;
    form: any;
}

const CardForm = (props: CardProps) => {
    const handleSubmit = (e: any) => {
        console.log("in cards submit");
        e.preventDefault();
        props.form.validateFields(async (err: any, values: any) => {
            if (!err) {
                console.log("Received values of form: ", values);
                var Category = {
                    categoryname: props.catdesc,
                    carddesc: Object.values(values.names) as string[],
                    cardimagename: values.cardimage.fileList.map(
                        (item: any) => item.name
                    ),
                };

                console.log(Category);

                const res = await showLoader(
                    new Service().addCategoryAndCards(Category)
                );
                props.handleModalSubmit(res.category);

                if (!res || res.status) {
                    showToast({
                        title: "Failed!",
                        content: res?.message,
                        variant: ToastVariants.DANGER,
                    });
                    return;
                }
                if (res.status === 0) {
                    showToast({
                        title: " Added Category",
                        content: "New Category has been added",

                        variant: ToastVariants.SUCCESS,
                    });
                }
            }
        });
    };

    // const { getFieldDecorator, getFieldValue } = props.form;
    const { getFieldDecorator } = props.form;

    // const formItemLayout = {
    //     labelCol: {
    //         xs: { span: 24 },
    //         sm: { span: 4 },
    //     },
    //     wrapperCol: {
    //         xs: { span: 24 },
    //         sm: { span: 20 },
    //     },
    // };
    // const formItemLayoutWithOutLabel = {
    //     wrapperCol: {
    //         xs: { span: 24, offset: 0 },
    //         sm: { span: 20, offset: 4 },
    //     },
    // };

    // getFieldDecorator("keys", { initialValue: [] });
    // const keys = getFieldValue("keys");
    // console.log(keys);
    const cardDetails = props.form.getFieldValue("cardimage");

    let fileList = [];
    if (cardDetails !== undefined) {
        fileList = cardDetails.fileList;
        //console.log(fileList);
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
                            <Upload>
                                <Button style={{ marginLeft: "10px" }}>
                                    <Icon type="upload" /> Upload Card Image
                                </Button>
                            </Upload>
                        )}
                    </Form.Item>

                    {fileList.map((item: any) => (
                        <Form.Item>
                            {" "}
                            <span className="cardName" key={item.uid}>
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
                                    className="cardInput"
                                    style={{
                                        width: "45%",
                                    }}
                                    placeholder="Card Name"
                                />
                            )}
                        </Form.Item>
                    ))}

                    <Button
                        onClick={handleSubmit}
                        style={{ alignItems: "right" }}
                        //type="submit"
                        className="submitBtn"
                    >
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Form.create<CardProps>({ name: "CardDetails" })(CardForm);
