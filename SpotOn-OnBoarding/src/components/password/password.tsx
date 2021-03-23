import React, { useState } from "react";
import "./password.scss";
import { Input, AntIcon, InputProps } from "../index";

interface PasswordProps extends InputProps {
    onPressEnter?: () => void;
}

const Password = ({ onPressEnter, ...props }: PasswordProps) => {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className="password"
            onKeyPress={(event) => {
                if (event.key === "Enter" && onPressEnter) {
                    event.preventDefault();
                    onPressEnter();
                }
            }}
        >
            <Input type={visible ? "text" : "password"} {...props} />
            {visible ? (
                <AntIcon
                    type="eye"
                    theme="filled"
                    onClick={() => setVisible(false)}
                />
            ) : (
                <AntIcon
                    type="eye-invisible"
                    theme="filled"
                    onClick={() => setVisible(true)}
                />
            )}
        </div>
    );
};

export default Password;
