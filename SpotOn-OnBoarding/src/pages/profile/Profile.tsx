import React, { useEffect, useState } from "react";
import {
    Button,
    ButtonVariants,
    Input,
    Password,
    Text,
    TextTypes,
    showLoader,
    showToast,
    ToastVariants,
    FormWrapper,
    FormWrappedProps,
    InputNames,
    Validation,
} from "../../components/index";
import { Container, Row, Col } from "react-bootstrap";
import "./profile.scss";
import Storage from "../../services/localStorage.service";
import Service from "../../services/apolloClient.service";

interface ProfileProps extends FormWrappedProps {
    history: any;
    match: any;
}

function Profile(props: ProfileProps) {
    const [expanded, setExpanded] = useState(false);
    const { setFormState } = props;

    /**
     * Initialize form input
     */
    useEffect(() => {
        const user = Storage.getUser();
        const { firstname, lastname, email } = user;
        const input = {
            firstname,
            lastname,
            email,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        };
        const required = {
            newPassword: false,
            oldPassword: false,
            confirmPassword: false,
        };
        setFormState({ input, required });
    }, []);

    /**
     * Expand or collapse form view
     */
    const handleExpand = (expanded: boolean) => {
        const { input, valid, message, required } = props;
        const { OLD_PASSWORD, NEW_PASSWORD, CONFIRM_PASSWORD } = InputNames;
        const keys = [OLD_PASSWORD, NEW_PASSWORD, CONFIRM_PASSWORD];

        if (!expanded) {
            keys.forEach((key) => {
                input[key] = "";
                valid[key] = true;
                message[key] = "";
                required[key] = false;
            });
        } else {
            keys.forEach((key) => {
                required[key] = true;
            });
        }

        setFormState({ input, valid, message, required });
        setExpanded(expanded);
    };

    /**
     * Handles form submit
     */
    const handleSubmit = async () => {
        const { firstname, lastname, email, ...password } = props.input;
        const payload = { firstname, lastname, email, password };
        const res = await showLoader(new Service().updateAccount(payload));
        if (!res || res.status) {
            showToast({
                title: "Failed!",
                content: res?.message,
                variant: ToastVariants.DANGER,
            });
            return;
        }
        if (res.status === 0) {
            console.log("in profile component");
            showToast({
                title: "Changes saved",
                content: "Your changes have been saved",
                variant: ToastVariants.SUCCESS,
            });
            setFormState({ initial: {} }, () => handleExpand(false));
            const user = Storage.getUser();
            Storage.setUser({ ...user, ...res });
        }
    };

    const { getInputWrapper, isFormValid } = props;

    return (
        <Container fluid>
            <Col className="d-none d-md-block">
                <Row className="justify-content-between">
                    <Text type={TextTypes.H2}>My Profile</Text>
                    <Button
                        className="button save-btn"
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                    >
                        Save
                    </Button>
                </Row>
            </Col>
            <Col md={4} sm={12}>
                <Row className="profile">
                    <div className="w-100">
                        {getInputWrapper(InputNames.FIRSTNAME)(
                            <Input type="text" label="First Name" />
                        )}
                        {getInputWrapper(InputNames.LASTNAME)(
                            <Input type="text" label="Last Name" />
                        )}
                        {getInputWrapper(InputNames.EMAIL)(
                            <Input
                                type="email"
                                label="Email Address"
                                className="disabled"
                            />
                        )}
                        <Button
                            variant={ButtonVariants.TERTIARY}
                            className={
                                expanded ? "button3 expanded" : "button3"
                            }
                            onClick={() => handleExpand(!expanded)}
                        >
                            Change Password
                        </Button>
                        {expanded && (
                            <React.Fragment>
                                {getInputWrapper(InputNames.OLD_PASSWORD)(
                                    <Password
                                        label="Old Password"
                                        clearable={false}
                                    />
                                )}
                                {getInputWrapper(InputNames.NEW_PASSWORD)(
                                    <Password
                                        label="New Password"
                                        clearable={false}
                                    />
                                )}
                                <Validation validation={props.validation} />
                                {getInputWrapper(InputNames.CONFIRM_PASSWORD)(
                                    <Password
                                        label="Confirm Password"
                                        clearable={false}
                                    />
                                )}
                            </React.Fragment>
                        )}
                        <Button
                            className="button d-md-none d-sm-block"
                            onClick={handleSubmit}
                            disabled={!isFormValid()}
                        >
                            Save
                        </Button>
                    </div>
                </Row>
            </Col>
        </Container>
    );
}

export default FormWrapper(Profile);
