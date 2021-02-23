import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Drawer, Icon, Text, TextTypes, colors } from '../index';
import Sidebar from '../sidebar/sidebar';
import './header.scss';
import logo_md from '../../assets/favicon-32x32.png';
import storage from '../../services/localStorage.service';
import util from '../../util';

interface HeaderProps {
    history: any;
    handlePathChange: (path: string) => void;
    isDashboard: boolean;
}

const Header = ({ history, handlePathChange, isDashboard }: HeaderProps) => {
    const { pathname } = history.location;
    const [visible, setVisible] = useState(false);
    const user = storage.getUser();

    const getTitle = () => {
        if (pathname.indexOf('users/edit/') > -1) {
            return 'Edit User';
        }
        if (pathname.indexOf('orders/detail/') > -1) {
            return 'Order #' + pathname.split('/').slice(-1)[0];
        }
        switch (pathname) {
            case '/profile':
                return 'My Profile';
            case '/users':
                return 'Users Management';
            case '/orders':
                return 'Orders';
            case '/users/add':
                return 'New User';
            default:
                return '';
        }
    };

    const isMainPage = () => {
        return pathname.split('/').length === 2;
    };

    return (
        <Container fluid className={'header d-md-block' + (isDashboard ? '' : ' d-none')}>
            <Row className="header-md d-none d-md-flex">
                <img src={logo_md} alt="" className="logo" />
                <Text type={TextTypes.H4} className="align-self-center">
                    E-Gift Cards Portal
                </Text>
            </Row>
            <Row className="header-sm d-md-none d-sm-flex">
                <div onClick={() => setVisible(true)} className={!isMainPage() ? 'd-none' : ''}>
                    <Icon name="MenuIcon" alt="menu icon" size={50} color={colors.aqua} />
                </div>
                <div className={isMainPage() ? 'd-none' : ''} onClick={() => history.goBack()}>
                    <Icon name="BackIcon" alt="back icon" size={50} color={colors.aqua} />
                </div>
                <div className="title d-flex align-self-center">
                    <Text type={TextTypes.H3} className="align-self-center">
                        {getTitle()}
                    </Text>
                </div>
            </Row>
            <Drawer
                title={null}
                placement="left"
                closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
                className="d-md-none d-sm-block"
            >
                <Sidebar
                    links={util.getRoutes(user?.roleid)}
                    onSelectLink={(path: string) => {
                        setVisible(false);
                        handlePathChange(path);
                    }}
                    footerLink={{ path: '/login', title: 'Logout' }}
                    currentPath={pathname}
                    visible={true}
                />
            </Drawer>
        </Container>
    );
};

export default Header;
