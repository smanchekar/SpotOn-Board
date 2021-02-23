import React from 'react';
import './password.scss';
import { Icon, Text, TextTypes, colors } from '../index';
import { Row } from 'react-bootstrap';

interface ValidationProps {
    validation: any;
}

const conditions = [
    'Password must be at least 8 characters long',
    'Avoid common words',
    'Avoid repetitive words like AAA',
    'Avoid sequential characters like 123',
];

const Validation = ({ validation }: ValidationProps) => {
    return (
        <div className="validation">
            {validation.map((value: boolean, index: any) => (
                <Row className="align-items-center">
                    <Icon
                        name="SuccessIcon"
                        alt="success"
                        size={40}
                        className={value ? '' : 'hidden'}
                    />
                    <Text type={TextTypes.P} color={colors.gray70}>
                        {conditions[index]}
                    </Text>
                </Row>
            ))}
        </div>
    );
};

export default Validation;
