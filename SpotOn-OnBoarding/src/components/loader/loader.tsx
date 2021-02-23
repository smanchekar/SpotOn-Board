import React, { useState } from "react";
import { LoadingOverlay } from "../index";

export var showLoader: Function;

function Loader() {
    const [loading, setLoading] = useState(false);

    showLoader = (promise: Promise<any>) => {
        setLoading(true);
        return new Promise((resolve, reject) => {
            promise
                .then((res: any) => {
                    setLoading(false);
                    console.log("in loader");
                    resolve(res);
                })
                .catch((err: any) => {
                    setLoading(false);
                    reject(err);
                });
        });
    };

    return loading ? <LoadingOverlay className="loader" /> : null;
}

export default Loader;
