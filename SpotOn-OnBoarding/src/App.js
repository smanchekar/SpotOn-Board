import React from "react";
import Layout from "./pages/layout/layout";
import { BrowserRouter } from "react-router-dom";
import { constants } from "./constants";
import Loader from "./components/loader/loader";
import Confirm from "./components/confirm/confirm";
function App() {
    return (
        <div className="App  h-100">
            {/* <Layout /> */}
            <Loader />
            <Confirm />
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </div>
    );
}

export default App;
