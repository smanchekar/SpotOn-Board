import React, { useState } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { Button } from 'spoton-lib';
import { constants } from '../../constants';
import './retailer-form.scss';

const RetailerForm = (props) => {
    const { getFieldDecorator } = props.form;
    const formItemLayout = {
        labelCol: { xs: { span: 24 }, sm: { span: 8 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                props.handleSubmit(values);
            }
        });
    };

    const retailer = props.retailer;

    return (
        <div className="retailerForm">
            <Form {...formItemLayout} onSubmit={handleSubmit}>
                <div className="spaceBetween">
                    <p>
                        Group Name<span style={{ color: 'red' }}>*</span>
                    </p>
                    <Form.Item>
                        {getFieldDecorator('retailerName', {
                            initialValue: retailer.retailername,
                            rules: [
                                { required: true, message: `Please input group name!` },
                                { max: 100 },
                            ],
                        })(<Input placeholder="Enter Group Name" />)}
                    </Form.Item>
                </div>
                <div className="spaceBetween">
                    <p>
                        Group Id<span style={{ color: 'red' }}>*</span>
                    </p>
                    <Form.Item>
                        {getFieldDecorator('groupId', {
                            initialValue: retailer.groupId,
                            rules: [
                                { required: true, message: `Please input group id!` },
                                { max: 100 },
                            ],
                        })(<Input placeholder="Enter Group Id" />)}
                    </Form.Item>
                </div>
                <div className="spaceBetween">
                    <p>
                        Minimum Gift Card Value<span style={{ color: 'red' }}>*</span>
                    </p>
                    <Form.Item>
                        {getFieldDecorator('MinGcValue', {
                            initialValue: retailer.MinGcValue || 10,
                            rules: [{ required: true, message: `This field is required!` }],
                        })(<InputNumber min={1} formatter={(value) => '$ ' + value} />)}
                    </Form.Item>
                </div>
                <div className="spaceBetween">
                    <p>
                        Maximum Gift Card Value<span style={{ color: 'red' }}>*</span>
                    </p>
                    <Form.Item>
                        {getFieldDecorator('MaxGcValue', {
                            initialValue: retailer.MaxGcValue || 500,
                            rules: [{ required: true, message: `This field is required!` }],
                        })(<InputNumber min={1} formatter={(value) => '$ ' + value} />)}
                    </Form.Item>
                </div>
                <div className="spaceBetween">
                    <p>
                        Maximum Items<span style={{ color: 'red' }}>*</span>
                    </p>
                    <Form.Item>
                        {getFieldDecorator('MaxItems', {
                            initialValue: retailer.MaxItems || 10,
                            rules: [{ required: true, message: `This field is required!` }],
                        })(<InputNumber min={1} />)}
                    </Form.Item>
                </div>
                <div className="spaceBetween">
                    <p>
                        Maximum Bag Total<span style={{ color: 'red' }}>*</span>
                    </p>
                    <Form.Item>
                        {getFieldDecorator('MaxBagTotal', {
                            initialValue: retailer.MaxBagTotal || 500,
                            rules: [{ required: true, message: `This field is required!` }],
                        })(<InputNumber min={1} formatter={(value) => '$ ' + value} />)}
                    </Form.Item>
                </div>
                <br />
                <div
                    className="spaceAround"
                    style={{ position: 'absolute', bottom: 50, width: '45%' }}
                >
                    <Button type="submit" className="submitBtn">
                        {retailer.groupId ? 'Save' : 'Save and Edit Cards'}
                    </Button>
                    <Button onClick={props.handleCancel}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
};

const WrappedTradeForm = Form.create({ name: 'retailer' })(RetailerForm);
export default WrappedTradeForm;
