import React, { useState } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { showConfirm } from "../../components/index";
import "./layout.scss";

import Login from "../login/login";
import ForgotPassword from "../login/forgot-password";
import ResetPassword from "../login/reset-password";

import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";

import Retailers from "../retailer/retailers";

import Profile from "../profile/Profile";
import EditUser from "../profile/edit-user";

import NoRouteFound from "../404/404.view";
import storage from "../../services/localStorage.service";
import util from "../../util";

function Layout({ history }: any) {
    const { pathname } = history.location;
    const [user, setUser] = useState(storage.getUser());

    const login = (res: any) => {
        console.log(res);
        storage.setUser(res);
        console.log("in layout");
        history.push("/retailers");
        setUser(res);
    };

    const logout = () => {
        console.log("in logout");
        showConfirm({
            title: "Logout",
            body: "Are you sure you want to logout?",
            confirmText: "Logout",
            onConfirm: () => {
                storage.clearAll(); // clear storage
                history.push("/login");
                setUser(null);
            },
        });
    };

    const handlePathChange = (path: string) => {
        path === "/login" ? logout() : history.push(path);
    };

    const hasFooter = pathname.indexOf("orders") === -1;
    const hasCards = pathname.indexOf("orders/detail/") > -1;
    // to handle header view
    const isDashboard = pathname.indexOf("set-password") === -1;

    return (
        <Container fluid className="h-100 overflow-hidden">
            <Route
                exact
                path={["/", "/login"]}
                render={(props) => {
                    return user !== null ? (
                        <Redirect to="/retailers" />
                    ) : (
                        <Login {...props} login={login} />
                    );
                }}
            />
            <Route
                exact
                path="/forgot-password"
                render={(props) => <ForgotPassword {...props} />}
            />
            {(user !== null || !isDashboard) && (
                <React.Fragment>
                    <Header
                        history={history}
                        handlePathChange={handlePathChange}
                        isDashboard={isDashboard}
                    />
                    <Row
                        className={
                            "layout" +
                            ((!hasFooter ? " no-footer" : "") +
                                (!isDashboard ? " no-header" : ""))
                        }
                    >
                        {isDashboard && (
                            <Sidebar
                                links={util.getRoutes(user?.roleid)}
                                onSelectLink={handlePathChange}
                                footerLink={{ path: "/login", title: "Logout" }}
                                currentPath={pathname}
                            />
                        )}
                        <Col
                            className={
                                "h-100 content" + (hasCards ? " has-cards" : "")
                            }
                        >
                            <Switch>
                                <Route
                                    exact
                                    path="/reset-password/:token"
                                    render={(props: any) => (
                                        <ResetPassword {...props} />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/set-password/:token"
                                    render={(props: any) => (
                                        <ResetPassword {...props} />
                                    )}
                                />

                                <Route
                                    path="/retailers"
                                    exact
                                    render={(props) => <Retailers {...props} />}
                                />

                                <Route
                                    path="/profile"
                                    exact
                                    render={(props) => <Profile {...props} />}
                                />
                                <Route
                                    path="/retailers/add"
                                    exact
                                    render={(props) => <EditUser {...props} />}
                                />
                                <Route
                                    path="/retailers/edit/:uid"
                                    exact
                                    render={(props) => <EditUser {...props} />}
                                />
                                <Route
                                    path="/retailers"
                                    exact
                                    render={(props) => <Retailers {...props} />}
                                />
                                <Route
                                    render={(props) => (
                                        <NoRouteFound {...props} />
                                    )}
                                />
                            </Switch>
                        </Col>
                    </Row>
                </React.Fragment>
            )}
            <NoRouteFound history={history} />
        </Container>
    );
}

export default withRouter(Layout);
