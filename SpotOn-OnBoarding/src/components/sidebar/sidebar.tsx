import React from "react";
import { Row, Col } from "react-bootstrap";
import { Text, TextTypes, Button, ButtonVariants } from "../index";
import "./sidebar.scss";

interface SidebarProps {
    links: Array<any>;
    onSelectLink: (path: string) => void;
    footerLink: any;
    currentPath: string;
    visible?: boolean;
}

const Sidebar = ({
    links,
    onSelectLink,
    footerLink,
    currentPath,
    visible,
}: SidebarProps) => {
    return (
        <Col
            md={2}
            className={"sidebar h-100 " + (!visible ? "d-none d-md-block" : "")}
        >
            <Row className="side-header d-md-none d-sm-flex">
                <div className="logo">
                    <div />
                </div>
                <Text type={TextTypes.SUB3} color="white">
                    &nbsp; E-Gift Cards Portal
                </Text>
            </Row>
            <div className="options">
                <div>
                    {links.map(({ path, title }: any) => (
                        <Row key={path}>
                            <Col
                                className="current"
                                style={{
                                    backgroundColor:
                                        currentPath.indexOf(path) > -1
                                            ? "white"
                                            : "",
                                }}
                            />
                            <Col className="align-self-center">
                                <Button
                                    variant={ButtonVariants.SECONDARY}
                                    className="link"
                                    onClick={() => onSelectLink(path)}
                                >
                                    {title}
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </div>
                {footerLink && (
                    <Row className="footer">
                        <Col className="current" />
                        <Col className="align-self-center">
                            <Button
                                variant={ButtonVariants.SECONDARY}
                                className="link"
                                onClick={() => onSelectLink(footerLink.path)}
                            >
                                {footerLink.title}
                            </Button>
                        </Col>
                    </Row>
                )}
            </div>
        </Col>
    );
};

export default Sidebar;
