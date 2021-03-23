import React, { useState } from "react";
import { Form, Input } from "antd";
// import { Button } from "spoton-lib";
// import { constants } from "../../constants";
import CardFormData from "../card-form/card-form";
import Service from "../../services/apolloClient.service";
import "./category-form.scss";
import { showLoader, showToast, ToastVariants } from "../index";
import { CategoryCards, Category } from "../../types/graphql-global-types";

export interface CategoryProps {
    form: any;
    handleModalSubmit: (cat: Category) => void;
}

const CategoryForm = (props: CategoryProps) => {
    console.log("in category form", props);
    // const [NewCards, setNewCards] = useState(false);
    var [Category, setCategory] = useState({
        categoryname: "",
        carddesc: [""],
        cardimagename: [""],
    });
    const { getFieldDecorator } = props.form;

    const formItemLayout = {
        labelCol: { xs: { span: 24 }, sm: { span: 8 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
    };

    // const cardDetails = props.form.getFieldValue("cardimage");
    // const cardname = props.form.getFieldValue("names");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        props.form.validateFields(async (err: Error, values: CategoryCards) => {
            if (!err) {
                console.log("Received values of form in category: ", values);

                setCategory({
                    categoryname: values.categoryname,
                    carddesc: Object.values(values.carddesc),
                    cardimagename: values.cardimagenames.map(
                        (item: any) => item.name
                    ),
                });
                Category.categoryname = values.categoryname;

                Category.carddesc = Object.values(values.carddesc);

                Category.cardimagename = values.cardimagenames.map(
                    (item: any) => item.name
                );
                console.log(Category);

                // function handleChange() {
                //     // Here, we invoke the callback with the new value
                //     props.onChange(false);
                // }
                const res = await showLoader(
                    new Service().addCategoryAndCards(Category)
                );

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
                    // props.history.goBack();
                }
            }
        });
    };
    // const handleClick = (e) => {
    //     e.preventDefault();
    // };

    // const clickBtn = (e) => {
    //     e.preventDefault();
    //     setNewCards(true);
    // };
    // const { getFieldValue } = props.form;
    // console.log(
    //     "CategoryName ==",
    //     getFieldValue("CategoryName"),
    //     "Cards ==",
    //     getFieldValue("names"),
    //     "Card Images ==",
    //     getFieldValue("cardimage")
    // );

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
                            })(
                                <Input
                                    onChange={(e: any) => {
                                        setCategory({
                                            categoryname: e.target.value,
                                            cardimagename: [],
                                            carddesc: [],
                                        });
                                        // /console.log(e.target.value);
                                    }}
                                    placeholder="Enter Category Name"
                                />
                            )}
                        </Form.Item>
                    </div>

                    <div>
                        {/* {NewCards && <CardFormData {...props} />} */}

                        {Category.categoryname === "" ? (
                            console.log("invalid")
                        ) : (
                            <CardFormData
                                catdesc={Category.categoryname}
                                carddesc={[]}
                                cardimagename={[]}
                                handleModalSubmit={props.handleModalSubmit}
                            />
                        )}
                        <div>&nbsp;</div>
                        {/* <Button
                            onClick={handleSubmit}
                            style={{ alignItems: "right" }}
                            type="submit"
                            className="submitBtn"
                        >
                            Submit
                        </Button> */}
                    </div>
                </Form>
            </div>
        </div>
    );
};

const WrappedTradeForm = Form.create<CategoryProps>({
    name: "CategoryDetails",
})(CategoryForm);
export default WrappedTradeForm;
