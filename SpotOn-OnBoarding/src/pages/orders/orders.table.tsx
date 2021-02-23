import React from "react";
import { Table, Text, TextTypes } from "../../components/index";
import { Order } from "../../types/graphql-global-types";
import moment from "moment";
import { useHistory } from "react-router-dom";
//import RecipientTable from '../../components/recipient/recipient.table';
import { constants } from "../../constants";

interface OrdersDesktopProps {
    orders: Array<Order>;
    getOrderDetail: (order: Order) => any;
    handlePagination: any;
    pagination: any;
}

const OrdersDesktop = ({ orders, ...props }: OrdersDesktopProps) => {
    const history = useHistory();

    const columns = [
        {
            title: <Text type={TextTypes.SUB3}> Order Number </Text>,
            dataIndex: "orderno",
            key: "orderno",
            render: (number: any) => <Text type={TextTypes.P}> {number} </Text>,
            ellipsis: true,
            width: "20%",
        },
        {
            title: <Text type={TextTypes.SUB3}> Sender's Email </Text>,
            dataIndex: "senderemail",
            key: "senderemail",
            render: (text: string) => <Text type={TextTypes.P}> {text} </Text>,
            ellipsis: true,
            width: "20%",
        },
        {
            title: <Text type={TextTypes.SUB3}> Cards Sent </Text>,
            dataIndex: "lineitems",
            key: "lineitems",
            render: (lineitems: string) => (
                <Text type={TextTypes.P}> {lineitems.length} </Text>
            ),
            ellipsis: true,
        },
        {
            title: <Text type={TextTypes.SUB3}> Order Date </Text>,
            dataIndex: "orderdate",
            key: "orderdate",
            render: (record: any) => (
                <Text type={TextTypes.P}>
                    {moment(parseInt(record)).format("MM/DD/YYYY")}
                </Text>
            ),
            ellipsis: true,
        },
        {
            title: <Text type={TextTypes.SUB3}> Total Amount </Text>,
            dataIndex: "ordertotal",
            key: "ordertotal",
            render: (text: any) => (
                <Text type={TextTypes.P}> ${parseFloat(text).toFixed(2)} </Text>
            ),
            ellipsis: true,
        },
        {
            title: "",
            key: "action",
            dataIndex: "orderno",
            render: (text: string, order: any) => (
                <div
                    className="action"
                    onClick={() => {
                        const { pathname } = history.location;
                        history.push({
                            pathname: pathname + "/detail/" + text,
                            state: { order },
                        });
                    }}
                >
                    <Text type={TextTypes.P}>View Details</Text>
                </div>
            ),
            ellipsis: true,
        },
    ];

    const data = orders.map((order) => props.getOrderDetail(order));

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey={(record: any) => record.orderno}
            pagination={{
                ...props.pagination,
                showSizeChanger: true,
                pageSizeOptions: constants.PAGINATION.PAGE_SIZE_OPTIONS,
            }}
            onChange={props.handlePagination}
            // expandedRowRender={(record: any) => <RecipientTable lineitems={record.lineitems} />}
            // expandIcon={({ expanded, onExpand, record }) => {
            //     return expanded ? (
            //         <div onClick={(e) => onExpand(record, e)}>
            //             <Icon
            //                 name="DownIcon"
            //                 alt="expanded"
            //                 size={40}
            //                 className="arrow-icon"
            //                 color={colors.plum70}
            //             />
            //         </div>
            //     ) : (
            //         <div onClick={(e) => onExpand(record, e)}>
            //             <Icon
            //                 name="RightIcon"
            //                 alt="collapsed"
            //                 size={40}
            //                 className="arrow-icon"
            //                 color={colors.aqua70}
            //             />
            //         </div>
            //     );
            //         }}
        />
    );
};

export default OrdersDesktop;
