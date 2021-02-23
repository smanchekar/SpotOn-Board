import React, { useEffect } from 'react';
import {
    Button,
    Input,
    Password,
    showToast,
    ToastVariants,
    Text,
    TextTypes,
    FormWrapper,
    FormWrappedProps,
    InputNames,
    showLoader,
    Validation,
} from '../../components/index';
import { Container, Row, Col } from 'react-bootstrap';
import logo_sm from '../../assets/poweredBy.png';
import './reset-password.scss';
import Service from '../../services/apolloClient.service';
import Storage from '../../services/localStorage.service';
import { constants } from '../../constants';

interface ResetPasswordProps extends FormWrappedProps {
    history: any;
    match: any;
}

function ResetPassword(props: ResetPasswordProps) {
    const { params, path } = props.match;
    const isNewUser = path.indexOf('/set-password') > -1;

    /**
     * Initialize form input
     */
    useEffect(() => {
        const input = {
            email: '',
            newPassword: '',
            confirmPassword: '',
        };
        props.setFormState({ input });
    }, []);

    /**
     * Handles form submit
     */
    const handleSubmit = async () => {
        const { email, newPassword } = props.input;
        const res = await showLoader(new Service().resetPassword(email, newPassword, params.token));
        if (res?.status === 0) {
            showToast({
                title: 'Success!',
                content: 'Password has been created',
                variant: ToastVariants.SUCCESS,
            });
            Storage.clearAll(); // clear storage
            window.location.href = window.location.origin + constants.CS_PORTAL_BASENAME;
            return;
        }
        if (res?.status) {
            showToast({
                title: 'Failed!',
                content: res.message,
                variant: ToastVariants.DANGER,
            });
        }
    };

    return (
        <Container fluid>
            <Row className="reset justify-content-center">
                <Col md={3} xs={11} sm={11} className="align-self-center">
                    <div className="d-none d-md-block">
                        <Row className="justify-content-center">
                            <Text type={TextTypes.H2}>
                                {isNewUser ? 'Set Password' : 'Set New Password'}
                            </Text>
                        </Row>
                        <Row className="justify-content-center reset-text">
                            <Text type={TextTypes.SUB2}>
                                Enter your email to create a {isNewUser ? '' : 'new'} password
                            </Text>
                        </Row>
                    </div>
                    <div className="d-md-none d-sm-block">
                        <Row style={{ marginTop: 50 }}>
                            <img src={logo_sm} alt="" className="logo-sm" />
                        </Row>
                        <Row className="d-md-none d-sm-block">
                            <Text type={TextTypes.H4}> E-Gift Cards Portal </Text>
                        </Row>
                        <Row className="reset-title">
                            <Text type={TextTypes.H4}>
                                {isNewUser ? 'Set Password' : 'Set New Password'}
                            </Text>
                        </Row>
                        <Row className="reset-text">
                            <Text type={TextTypes.SUB2}>
                                Enter your email to create a {isNewUser ? '' : 'new'} password
                            </Text>
                        </Row>
                    </div>
                    <Row>
                        <div className="w-100">
                            {props.getInputWrapper(InputNames.EMAIL)(
                                <Input type="email" label="Email Address" />
                            )}
                            {props.getInputWrapper(InputNames.NEW_PASSWORD)(
                                <Password label="New Password" clearable={false} />
                            )}
                            <Validation validation={props.validation} />

                            {props.getInputWrapper(InputNames.CONFIRM_PASSWORD)(
                                <Password label="Confirm Password" clearable={false} />
                            )}
                            <div
                                className="d-flex justify-content-center"
                                style={{ marginTop: 40 }}
                            >
                                <Button
                                    onClick={handleSubmit}
                                    className="button"
                                    disabled={!props.isFormValid()}
                                >
                                    {isNewUser ? 'Create Password' : 'Set Password'}
                                </Button>
                            </div>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default FormWrapper(ResetPassword);
