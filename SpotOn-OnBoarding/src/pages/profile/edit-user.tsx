import React, { useEffect } from "react";
import {
    Button,
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
    // showConfirm,
} from "../../components/index";
import { Container, Row, Col } from "react-bootstrap";
import "./profile.scss";
import Service from "../../services/apolloClient.service";
// import { constants } from "../../constants";

interface EditUserProps extends FormWrappedProps {
    history: any;
    match: any;
}

function EditUser(props: EditUserProps) {
    const { location } = props.history;
    const { state } = location;
    const { setFormState } = props;
    console.log("in edit profile", props);
    /**
     * Initialize form input
     */
    useEffect(() => {
        if (state) {
            console.log(state.retailerProfiles);
            const {
                retailerName,
                retailerActive,
                retailerProfiles,
                email,
                roleid,
                groupId,
                merchantId,
                retailerId,
            } = state;
            console.log("in edit user profile", retailerProfiles);
            setFormState({
                input: {
                    retailerName,
                    retailerActive,
                    email,
                    groupId,
                    merchantId,
                    retailerId,
                    retailerProfiles,
                    roleid: "" + roleid,
                },
            });
        } else {
            setFormState({
                input: { firstname: "", lastname: "", email: "", roleid: "" },
            });
        }
    }, []);

    /**
     * Handles form submit
     */
    const handleSubmit = async () => {
        const { firstname, lastname, email, roleid } = props.input;
        const payload = {
            firstname,
            lastname,
            email,
            roleid,
            password: { newPassword: "" },
        };

        const res = await showLoader(
            state
                ? new Service().addEditUser(payload, state.uid)
                : new Service().addEditUser(payload)
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
                title: state ? "Changes saved!" : "User added!",
                content: state
                    ? "Your changes have been saved"
                    : "New user has been added",
                variant: ToastVariants.SUCCESS,
            });
            props.history.goBack();
        }
    };

    // const resetPassword = async () => {
    //     showConfirm({
    //         title: "Reset Password",
    //         body:
    //             "Are you sure you want to send an email\nto the user to set his password?",
    //         confirmText: "Confirm",
    //         onConfirm: async () => {
    //             const res = await showLoader(
    //                 new Service().forgotPassword(state.email)
    //             );
    //             if (!res || res.status) {
    //                 showToast({
    //                     title: "Failed!",
    //                     content: res?.message,
    //                     variant: ToastVariants.DANGER,
    //                 });
    //                 return;
    //             }
    //             if (res.status === 0) {
    //                 showToast({
    //                     title: "Email sent",
    //                     content: "Reset password link sent to requested email",
    //                     variant: ToastVariants.SUCCESS,
    //                 });
    //             }
    //         },
    //     });
    // };

    const { getInputWrapper, isFormValid } = props;
    console.log(isFormValid);
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
                            {state ? "Save" : "Add New User"}
                        </Button>
                    </div>
                </Row>
            </Col>
            <Col md={4} sm={12}>
                <Row className="user">
                    <div className="w-100">
                        {getInputWrapper(InputNames.RETAILERID)(
                            <Input type="text" label="Retailer Id" />
                        )}

                        {getInputWrapper(InputNames.RETAILERNAME)(
                            <Input type="text" label="Retailer Name" />
                        )}
                        {getInputWrapper(InputNames.RETAILERACTIVE)(
                            <Input type="text" label="Retailer Active" />
                        )}
                        {getInputWrapper(InputNames.GROUPID)(
                            <Input type="text" label="GroupId" />
                        )}
                        {getInputWrapper(InputNames.MERCHANTID)(
                            <Input type="text" label="Merchant Id" />
                        )}

                        {state.retailerProfiles.map((item: any) => {
                            return (
                                <div className="w-100">
                                    <Input
                                        type="text"
                                        label={item.retailerprofilename}
                                        value={item.retailerprofilevalue}
                                    />
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
