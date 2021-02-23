import React from "react";
import {
    Search,
    Text,
    TextTypes,
    LazyLoader,
    SuspenseProps,
} from "../../components/index";
import { Container, Row, Col } from "react-bootstrap";
import "./orders.scss";
import { Order } from "../../types/graphql-global-types";
import OrdersTable from "./orders.table";
//import OrderCard from "../../components/order-card/order-card";
import Service from "../../services/apolloClient.service";

interface OrderProps extends SuspenseProps {
    history: any;
}

function Orders(props: OrderProps) {
    console.log("in orders");

    const getOrderDetail = (order: Order) => {
        const { lineitems, merchant, group }: any = order;
        const { cardsenderinfo, cardrecipientinfo } = lineitems[0] || {};
        const { sendername, senderemail } = cardsenderinfo || {};
        const { recipientname, recipientemail } = cardrecipientinfo || {};
        return {
            ...order,
            sendername,
            senderemail,
            recipientname,
            recipientemail,
            merchant,
            group,
        };
    };

    const { dataArray, searchValue } = props;
    console.log(dataArray);
    return (
        <Container fluid className="h-100 orders" ref={props.listRef}>
            <Text type={TextTypes.H2} className="d-none d-md-block">
                Orders
            </Text>
            <div className="search-bar sb-md d-none d-md-block">
                <Search
                    label={
                        searchValue
                            ? ""
                            : "Search by Order, Sender's or Recipient's Information, Last 4 CC digits"
                    }
                    value={searchValue}
                    onChange={props.handleSearch}
                />
            </div>
            <div className="search-bar sb-sm d-md-none d-sm-block">
                <Search
                    label={searchValue ? "" : "Search"}
                    value={searchValue}
                    onChange={props.handleSearch}
                />
            </div>
            <Row>
                {/* <Col sm={12} className="list d-md-none d-sm-flex">
                    {dataArray.map((order) => (
                        <OrderCard
                            key={order.orderno}
                            order={getOrderDetail(order)}
                        />
                    ))}
                </Col> */}
                <Col className="table d-none d-md-block">
                    <OrdersTable
                        orders={dataArray}
                        getOrderDetail={getOrderDetail}
                        handlePagination={props.handlePagination}
                        pagination={props.pagination}
                    />
                </Col>
            </Row>
        </Container>
    );
}

const options = {
    key: "orders",
    query: (filter: any) => new Service().getOrders(filter),
};

export default LazyLoader(Orders, options);
