import React, { Component } from 'react';
import { InputNames } from '../index';
import { constants } from '../../constants';
import util from '../../util';

export interface FormWrapperState {
    initial: { [key: string]: string };
    input: { [key: string]: string };
    valid: { [key: string]: boolean };
    message: { [key: string]: string };
    required: { [key: string]: boolean };
    validation: boolean[];
}

export default function FormWrapper(Form: Function) {
    return class FormWrapped extends Component<any, FormWrapperState> {
        constructor(props: any) {
            super(props);

            this.state = {
                initial: {},
                input: {}, // input values
                valid: {}, // booleans
                message: {}, // error messages
                required: {}, // booleans (true if undefined)
                validation: [
                    // Password validation
                    false, // minimum length
                    false, // common words
                    false, // repetitive words
                    false, // continuous characters
                ],
            };
        }

        validateEmail(email: string) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }

        /**
         * Get input type by input name
         */
        getInputType(name: string) {
            var lc = (value: string) => value.toLowerCase();

            if (lc(name).indexOf('email') > -1) {
                return 'email';
            }
            if (lc(name).indexOf('password') > -1) {
                return 'password';
            }
            return 'name';
        }

        /**
         * Handles input change
         */
        handleChange = (name: string, value: string) => {
            this.setState((state: FormWrapperState) => {
                let { input, validation } = state;
                input[name] = value;
                if (name === InputNames.NEW_PASSWORD) {
                    validation = this.validatePassword(value);
                }
                return { input, validation };
            });
        };

        validatePassword = (value: string) => {
            const validation = [false, false, false, false];
            if (value.length < 3) return validation;
            validation[0] = value.length >= constants.MIN_PASSWORD_LENGTH;
            validation[1] = true;
            const characters = value.split('');

            // will be used for next validations
            const callback = (ch: string, i: number, cb: Function) => {
                if (i > 0 && i < value.length - 1) {
                    const curr = ch.charCodeAt(0),
                        prev = characters[i - 1].charCodeAt(0),
                        next = characters[i + 1].charCodeAt(0);
                    return cb(curr, prev, next);
                }
                return true;
            };
            // check for repeatative words
            validation[2] = characters.every((ch, i) => {
                return callback(ch, i, (curr: number, prev: number, next: number) => {
                    return curr !== prev || curr !== next;
                });
            });

            const between = (code: number, ch1: string, ch2: string) => {
                return code >= ch1.charCodeAt(0) && code <= ch2.charCodeAt(0);
            };
            // check for continuous characters
            validation[3] = characters.every((ch, i) => {
                return callback(ch, i, (curr: number, prev: number, next: number) => {
                    if (
                        between(curr, 'A', 'Z') ||
                        between(curr, 'a', 'z') ||
                        between(curr, '0', '9')
                    )
                        return curr !== next - 1 || curr !== prev + 1;
                    return true;
                });
            });

            return validation;
        };

        /**
         * Check if input value is valid or not
         * @param name input name
         * @param value input value
         */
        isInputValid = (name: string, value: string) => {
            const { input, required } = this.state;
            let isValid = true;
            if (value && value.trim()) {
                switch (name) {
                    case InputNames.EMAIL:
                        isValid = this.validateEmail(value);
                        break;
                    case InputNames.CONFIRM_PASSWORD:
                        const { newPassword } = input;
                        isValid = value === newPassword;
                        break;
                    case InputNames.NEW_PASSWORD:
                        const validation = this.validatePassword(value);
                        isValid = validation.every((key) => key);
                        break;
                    default:
                        isValid = true;
                }
            } else if (required[name] !== false) {
                isValid = false;
            }
            return isValid;
        };

        /**
         * Validate input value by input name
         */
        handleBlur = (name: string, value: string) => {
            const { input, valid, message, required } = this.state;
            const type = this.getInputType(name);
            valid[name] = true;
            message[name] = '';

            if (value && value.trim()) {
                switch (name) {
                    case InputNames.EMAIL:
                        valid.email = this.validateEmail(value);
                        if (!valid.email) {
                            message[name] = 'Please input valid email';
                        }
                        break;
                    case InputNames.CONFIRM_PASSWORD:
                        valid[name] = value === input[InputNames.NEW_PASSWORD];
                        if (!valid[name]) {
                            message[name] = 'Password does not match';
                        }
                        break;
                    case InputNames.NEW_PASSWORD:
                        const validation = this.validatePassword(value);
                        valid[name] = validation.every((key) => key);
                        break;
                    default:
                        valid[name] = true;
                        message[name] = '';
                }
            } else if (required[name] !== false) {
                valid[name] = false;
                message[name] = 'Please input valid ' + type;
            }

            this.setState({ valid, message });
        };

        /**
         * Check if form is valid to submit
         */
        isFormValid = () => {
            const { input, initial } = this.state;
            const isValid = Object.keys(input).every((key) => {
                return this.isInputValid(key, input[key]);
            });
            return isValid && !util.isEmpty(initial) && !util.shallowEqual(initial, input);
        };

        /**
         * Get input props by input name
         */
        getInputProps = (name: string) => {
            const { input, valid, message, required } = this.state;
            return {
                name: name,
                value: input[name],
                onChange: (e: any) => this.handleChange(name, e.target.value),
                onBlur: (e: any) => {
                    const { value, name } = e.target;
                    this.handleBlur(name, value);
                },
                isValid: valid[name],
                errorMessage: message[name],
                required: required[name] !== false,
            };
        };

        /**
         * Get input wrapper with generic props
         */
        getInputWrapper = (name: string) => {
            return (Input: React.ReactElement) => {
                return React.cloneElement(Input, {
                    ...this.getInputProps(name),
                    className: 'form-input ' + (Input.props.className || ''),
                });
            };
        };

        setFormState = (state: FormWrapperState, callback?: () => void) => {
            if (state.input) {
                const { initial } = this.state;
                if (util.isEmpty(initial)) {
                    const newState = {
                        ...state,
                        initial: { ...state.input },
                    };
                    this.setState(newState, callback);
                    return;
                }
            }
            this.setState(state, callback);
        };

        render() {
            return (
                <Form
                    {...this.props}
                    {...this.state}
                    isFormValid={this.isFormValid}
                    setFormState={this.setFormState}
                    getInputWrapper={this.getInputWrapper}
                />
            );
        }
    };
}
