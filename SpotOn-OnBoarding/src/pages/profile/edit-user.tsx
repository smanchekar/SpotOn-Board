import React, { useEffect } from "react";
import {
    // ButtonVariants,
    Input,
    Text,
    TextTypes,
    showToast,
    ToastVariants,
    FormWrapper,
    FormWrappedProps,
    InputNames,
    showLoader,
    Icon,
    colors,
    Button,

    // showConfirm,
} from "../../components/index";
import { Modal, Select } from "antd";

import { Container, Row, Col } from "react-bootstrap";
import "./profile.scss";
import Service from "../../services/apolloClient.service";
import CategoryFormData from "../../components/category-form/category-form";
import "antd/dist/antd.css";
import { useState } from "react";

const { Option } = Select;
interface EditUserProps extends FormWrappedProps {
    history: any;
    match: any;
}

// interface Props {
//     retailers: Array<Retailers>;
//     removeRetailer: (retailerid: string) => void;
//     handlePagination: any;
//     pagination: any;
// }

function EditUser(props: EditUserProps) {
    const [category, setCategories] = useState([]);
    const [categoryId, setCategory] = useState([]);
    var [modal, setmodal] = useState(Boolean);

    const { location } = props.history;
    const { state } = location;
    const { setFormState } = props;

    let profileNames: string[] = [
        "MaxBagTotal",
        "MaxItems",
        "RemaindeSchedule",
        "MaxGcValue",
        "MinGcValue",
    ];
    let profileValues: string[] = [];
    console.log("in edit ", props);
    const mapProfiles = () => {
        state.retailerProfiles.map((item: any) => {
            let index = profileNames.findIndex(
                (name) => name === item.retailerprofilename
            );
            if (index > -1) {
                profileValues[index] = item.retailerprofilevalue;
            }
        });
    };

    /**
     * Initialize form input
     */
    useEffect(() => {
        const { retailerName, groupId, merchantId } = state || {};
        const inputObj: any = {
            retailerName: retailerName || "",
            groupId: groupId || "",
            merchantId: merchantId || "",
        };
        if (state) {
            mapProfiles();
        } else {
            profileNames.forEach(() => {
                profileValues.push("");
            });
        }
        profileNames.forEach((name, i) => {
            inputObj[name] = profileValues[i];
        });
        setFormState({
            input: inputObj,
        });

        new Service().allCategories().then((data: any) => {
            setCategories(data.categories);
        });
    }, []);

    /**
     * Handles form submit
     */
    const handleSubmit = async () => {
        const {
            MaxBagTotal,
            MaxGcValue,
            MaxItems,
            MinGcValue,
            ReminderSchedule,
            groupId,
            merchantId,
            retailerName,
        } = props.input;
        const payload = {
            MaxBagTotal,
            MaxGcValue,
            MaxItems,
            MinGcValue,
            ReminderSchedule,
            groupId,
            merchantId,
            retailerName,
            categoryId,
        };

        const res = await showLoader(
            state
                ? new Service().addEditUser(payload, state.retailerId)
                : new Service().addEditUser(payload)
        );
        // console.log(res);

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
                title: state ? "Changes saved!" : "Retailer added!",
                content: state
                    ? "Your changes have been saved"
                    : "New Retailer has been added",
                variant: ToastVariants.SUCCESS,
            });
            props.history.goBack();
        }
    };

    const { getInputWrapper, isFormValid } = props;

    // /let categoryIdList: any = [];

    const handleSelect = (e: any) => {
        // categoryIdList.push(e);

        setCategory(e);
    };

    const handleCancel = () => {
        setmodal(false);
    };
    const showModal = () => {
        setmodal(true);
    };

    const handleOk = () => {
        setmodal(false);
    };

    function handleChange(newValue: boolean) {
        setmodal(newValue);
    }

    // const handlcallbackFunction = (childData: any) => {
    //     // this.setState({ message: childData });
    //     console.log(childData);
    // };
    let categoryList;
    if (category !== undefined) {
        categoryList = category.map((item: any) => {
            return (
                <Option key={item.catid} value={item.catid}>
                    {item.catdesc}
                </Option>
            );
        });
    }
    return (
        <Container fluid>
            <Col>
                <Row className="justify-content-between">
                    <div className="d-none d-md-flex">
                        <div onClick={() => props.history.goBack()}>
                            <Icon
                                name="BackIcon"
                                className="back-icon"
                                alt="back icon"
                                size={45}
                                color={colors.gray90}
                            />
                        </div>
                        <Text type={TextTypes.H2}>
                            {state ? "Edit Retailer" : "New Retailer"}
                        </Text>
                    </div>
                    <div>
                        <Button
                            className="button"
                            onClick={handleSubmit}
                            disabled={!isFormValid()}
                        >
                            {state ? "Save" : "Add New Retailer"}
                        </Button>
                    </div>
                </Row>
            </Col>
            <Col>
                <Row className="user">
                    <div className="w-50">
                        {getInputWrapper(InputNames.RETAILERNAME)(
                            <Input type="text" label="Retailer Name" />
                        )}
                        {getInputWrapper(InputNames.GROUPID)(
                            <Input type="text" label="GroupId" />
                        )}
                        {getInputWrapper(InputNames.MERCHANTID)(
                            <Input type="text" label="Merchant Id" />
                        )}

                        <Select
                            mode="multiple"
                            style={{ width: "50%" }}
                            placeholder="Please select categories"
                            // defaultValue={["a10", "c12"]}
                            onChange={handleSelect}
                        >
                            {categoryList}
                        </Select>
                        <span style={{ paddingLeft: "40px" }}></span>

                        <Button onClick={showModal}>Add New Category</Button>
                        <Modal
                            title="Category"
                            visible={modal}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            {/* closeModal={handleChange} */}
                            <CategoryFormData closeModal={handleChange} />
                        </Modal>
                    </div>

                    <div style={{ paddingLeft: "40px" }} className="w-50">
                        {profileNames.map((name: string, i: number) => {
                            return (
                                <div className="w-100" key={i}>
                                    {getInputWrapper(name)(
                                        <Input type="text" label={name} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Row>
            </Col>
        </Container>
    );
}

export default FormWrapper(EditUser);
