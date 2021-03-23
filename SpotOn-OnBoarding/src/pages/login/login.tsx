import React, { useEffect } from "react";
import {
    Button,
    // ButtonVariants,
    Input,
    Password,
    Text,
    TextTypes,
    colors,
    showToast,
    ToastVariants,
    showLoader,
    FormWrapper,
    FormWrappedProps,
    InputNames,
} from "../../components/index";
import { Row, Col } from "react-bootstrap";
import logo_md from "../../assets/favicon-32x32.png";
import logo_sm from "../../assets/poweredBy.png";
import "./login.scss";
import Service from "../../services/apolloClient.service";

interface LoginProps extends FormWrappedProps {
    history: any;
    login: (res: any) => void;
}

function Login(props: LoginProps) {
    /**
     * Initialize form input
     */
    useEffect(() => {
        const input = { email: "", password: "" };
        props.setFormState({ input });
    }, []);

    /**
     * Handles form submit
     */
    const handleSubmit = async () => {
        console.log("in login", props.input);

        const { email, password } = props.input;
        const res = await showLoader(new Service().login(email, password));

        if (res?.status === 0) {
            props.login(res);
            return;
        }
        if (res?.status) {
            showToast({
                title: "Failed!",
                content: res.message,
                variant: ToastVariants.DANGER,
            });
        }
    };

    return (
        <Row className="login justify-content-center">
            <Col md={3} xs={11} sm={11} className="align-self-center">
                <div className="d-none d-md-block">
                    <Row className="justify-content-center align-items-center">
                        <img src={logo_md} alt="" className="logo-md" />
                        <Text type={TextTypes.H4}>
                            {" "}
                            SpotOn-OnBoarding Portal
                        </Text>
                    </Row>
                    <Row className="justify-content-center welcome-md">
                        <Text type={TextTypes.H2}> Welcome </Text>
                    </Row>
                    <br />
                    <Row className="justify-content-center login-text">
                        <Text type={TextTypes.SUB2}>Login to your account</Text>
                    </Row>
                </div>
                <div className="d-md-none d-sm-block">
                    <Row style={{ marginTop: 100 }}>
                        <img src={logo_sm} alt="" className="logo-sm" />
                    </Row>
                    <Row className="d-md-none d-sm-block">
                        <Text type={TextTypes.H4}>
                            {" "}
                            SpotOn-OnBoarding Portal
                        </Text>
                    </Row>
                    <Row className="welcome-sm">
                        <Text type={TextTypes.H4} color={colors.gray70}>
                            Welcome!
                        </Text>
                    </Row>
                </div>
                <Row>
                    <div className="w-100">
                        {props.getInputWrapper(InputNames.EMAIL)(
                            <Input type="email" label="Email Address" />
                        )}
                        {props.getInputWrapper(InputNames.PASSWORD)(
                            <Password
                                label="Password"
                                clearable={false}
                                onPressEnter={handleSubmit}
                            />
                        )}

                        <div className="d-flex justify-content-center">
                            <Button
                                className="button"
                                onClick={handleSubmit}
                                disabled={!props.isFormValid()}
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                </Row>
            </Col>
        </Row>
    );
}

export default FormWrapper(Login);
