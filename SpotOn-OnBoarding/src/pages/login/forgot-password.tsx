import React, { useEffect } from 'react';
import {
    Button,
    ButtonVariants,
    Input,
    showToast,
    ToastVariants,
    Text,
    TextTypes,
    FormWrapper,
    FormWrappedProps,
    InputNames,
} from '../../components/index';
import { Row, Col } from 'react-bootstrap';
import logo_md from '../../assets/favicon-32x32.png';
import logo_sm from '../../assets/poweredBy.png';
import './forgot-password.scss';
import Service from '../../services/apolloClient.service';

interface ForgotPasswordProps extends FormWrappedProps {
    history: any;
}

function ForgotPassword(props: ForgotPasswordProps) {
    /**
     * Initialize form input
     */
    useEffect(() => {
        props.setFormState({
            input: { email: '' },
        });
    }, []);

    /**
     * Handles form submit
     */
    const handleSubmit = async () => {
        const { email } = props.input;
        const res = await new Service().forgotPassword(email);

        if (res?.status === 0) {
            showToast({
                title: 'Email sent',
                content: res.message,
                variant: ToastVariants.SUCCESS,
            });
            props.history.push('/login');
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
        <Row className="forgot justify-content-center">
            <Col md={4} xs={11} sm={11} className="align-self-center">
                <div className="d-none d-md-block">
                    <Row className="justify-content-center align-items-center">
                        <img src={logo_md} alt="" className="logo-md" />
                        <Text type={TextTypes.H4}> E-Gift Cards Portal </Text>
                    </Row>
                    <Row className="justify-content-center forgot-title">
                        <Text type={TextTypes.H2}> Forgot your Password? </Text>
                    </Row>
                    <Row className="justify-content-center forgot-text">
                        <Text type={TextTypes.SUB2}>
                            Enter your registered email address and we will
                            <br />
                            send you the instructions to recover your password.
                        </Text>
                    </Row>
                </div>
                <div className="d-md-none d-sm-block">
                    <Row style={{ marginTop: 100 }}>
                        <img src={logo_sm} alt="" className="logo-sm" />
                    </Row>
                    <Row>
                        <Text type={TextTypes.H4}> E-Gift Cards Portal </Text>
                    </Row>
                    <Row className="forgot-title">
                        <Text type={TextTypes.H4}> Forgot your Password? </Text>
                    </Row>
                    <Row className="forgot-text">
                        <Text type={TextTypes.SUB2}>
                            Enter your registered email address and we will send you the
                            instructions to recover your password.
                        </Text>
                    </Row>
                </div>
                <Row className="justify-content-center">
                    <div className="form">
                        {props.getInputWrapper(InputNames.EMAIL)(
                            <Input type="email" label="Email Address" />
                        )}
                        <Button
                            className="button3"
                            variant={ButtonVariants.TERTIARY}
                            onClick={() => props.history.push('/login')}
                        >
                            Back to login
                        </Button>
                        <div className="d-flex justify-content-center">
                            <Button
                                onClick={handleSubmit}
                                className="button"
                                disabled={!props.isFormValid()}
                            >
                                Send Email
                            </Button>
                        </div>
                    </div>
                </Row>
            </Col>
        </Row>
    );
}

export default FormWrapper(ForgotPassword);
