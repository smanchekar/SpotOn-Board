import React, { useState, useEffect } from 'react';
import {
    Modal,
    Text,
    TextTypes,
    Button,
    ButtonVariants,
    FormWrapper,
    FormWrappedProps,
    Input,
} from '../index';
import { Row, Col } from 'react-bootstrap';
import './confirm.scss';

export var showConfirm: Function;

function PopConfirm(props: FormWrappedProps) {
    const [options, setOptions]: any = useState({});

    showConfirm = (options: any) => {
        setOptions(options);
        if (options.input) {
            const { name } = options.input;
            // initialize form input
            props.setFormState({
                input: { [name]: '' },
                valid: { [name]: true },
                message: { [name]: '' },
            });
        }
    };

    useEffect(() => {
        if (options.title) {
            setTimeout(() => {
                // DOM method is used because modal component was not receiving ref
                const modal: HTMLDivElement | null = document.querySelector('.confirm');
                if (modal) {
                    const style = window.getComputedStyle(modal);
                    const position = style.getPropertyValue('position');
                    console.log('position', position);
                    if (position === 'fixed') {
                        // modal border radius is 8px
                        modal.style.top = `calc(100% - ${modal.clientHeight - 8}px)`;
                    }
                }
            }, 100);
        }
    }, [options]);

    const handleConfirm = () => {
        options.onConfirm();
        setOptions({});
    };

    return (
        <Modal
            isOpen={options.title !== undefined}
            onRequestClose={() => setOptions({})}
            className="confirm"
        >
            <Row>
                <Col>
                    <Text type={TextTypes.H4} className="title">
                        {options.title}
                    </Text>
                    <div className="body">
                        <Text type={TextTypes.P}> {options.body} </Text>
                    </div>
                    {options.input &&
                        (() => {
                            const { name, label } = options.input;
                            return (
                                <div className="input">
                                    {props.getInputWrapper(name)(
                                        <Input type="email" label={label} />
                                    )}
                                </div>
                            );
                        })()}
                    <div className="d-flex w-100 footer">
                        {!options.hideCancel &&
                            <Button variant={ButtonVariants.TERTIARY} onClick={() => setOptions({})}>
                                Cancel
                            </Button>
                        }
                        <Button
                            onClick={handleConfirm}
                            disabled={options.input ? !props.isFormValid() : false}
                        >
                            {options.confirmText}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}

export default FormWrapper(PopConfirm);
