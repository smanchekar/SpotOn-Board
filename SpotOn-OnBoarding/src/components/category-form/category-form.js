import React, { useState } from "react";
import { Form, Input, InputNumber, Icon } from "antd";
import { Button } from "spoton-lib";
import { constants } from "../../constants";
import "./category-form.scss";
import CardFormData from "../card-form/card-form";
const CategoryForm = (props) => {
    const [NewCards, setNewCards] = useState(false);

    const { getFieldDecorator } = props.form;

    const formItemLayout = {
        labelCol: { xs: { span: 24 }, sm: { span: 8 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);

                //props.handleSubmit(values);
            }
        });
    };
    const handleClick = (e) => {
        e.preventDefault();
    };

    const clickBtn = (e) => {
        e.preventDefault();
        setNewCards(true);
    };
    const { getFieldValue } = props.form;
    console.log(
        "CategoryName ==",
        getFieldValue("CategoryName"),
        "Cards ==",
        getFieldValue("names"),
        "Card Images ==",
        getFieldValue("cardimage")
    );

    return (
        <div className="d-none d-md-flex">
            <div className="categoryForm">
                <Form {...formItemLayout} onSubmit={handleSubmit}>
                    <div>
                        {/* <p>
                            Category Name
                            <span style={{ color: "red" }}>*</span>
                        </p> */}
                        <Form.Item>
                            {getFieldDecorator("CategoryName", {
                                rules: [
                                    {
                                        required: true,
                                        message: `Please input Category name!`,
                                    },
                                    { max: 100 },
                                ],
                            })(<Input placeholder="Enter Category Name" />)}
                        </Form.Item>
                    </div>

                    <div
                    // className="spaceAround"
                    // style={{
                    //     position: "absolute",
                    //     bottom: 50,
                    //     width: "45%",
                    //}}
                    >
                        {" "}
                        {/* {NewCards && <CardFormData {...props} />} */}
                        <CardFormData {...props} />
                        {/* <Button onClick={clickBtn}>Add New Cards</Button> */}
                        <div>&nbsp;</div>
                        <Button
                            style={{ alignItems: "right" }}
                            type="submit"
                            className="submitBtn"
                        >
                            Submit{" "}
                            {/* {retailer.groupId ? "Save" : "Save and Edit Cards"} */}
                        </Button>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {/* <Button onClick={props.handleCancel}>Cancel</Button> */}
                        <div>&nbsp;</div>
                    </div>
                </Form>
            </div>
        </div>
    );
};

const WrappedTradeForm = Form.create({ name: "CategoryDetails" })(CategoryForm);
export default WrappedTradeForm;
