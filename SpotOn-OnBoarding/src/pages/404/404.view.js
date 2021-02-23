import React from "react";
import "./404.css";
import { Button } from "antd";

const NoRouteFoundView = (props) => {

    const handleGoBack = () => {
        props.history.goBack();
    }

    return (
        <div className="ErrorMessageContainer">
            <div>
                <h1 className="FourZeroFour">404</h1>
                <hr />
                <h2>Oops! page could not be found</h2>
                <Button onClick={handleGoBack} type="primary"> Go Back </Button>
            </div>
        </div>
    );
}

export default NoRouteFoundView;