import React from "react";
import {
    Table,
    Dropdown,
    Icon,
    Text,
    TextTypes,
    colors,
} from "../../components/index";

import { Retailers } from "../../types/graphql-global-types";
import { constants } from "../../constants";
import Options from "../../components/options/options";

interface RetailersTableProps {
    retailers: Array<Retailers>;
    removeRetailer: (retailerid: string) => void;
    handlePagination: any;
    pagination: any;
}

const RetailerTable = ({ retailers, ...props }: RetailersTableProps) => {
    console.log("in retailer table", retailers);
    const columns = [
        {
            title: <Text type={TextTypes.SUB3}>Retailer Id</Text>,
            dataIndex: "retailerId",
            key: "retailerId",
            sorter: true,
            render: (number: any) => <Text type={TextTypes.P}> {number} </Text>,
            ellipsis: true,
            width: "15%",
        },
        {
            title: <Text type={TextTypes.SUB3}>Group Id </Text>,
            dataIndex: "groupId",
            key: "groupId",
            sorter: true,
            render: (number: any) => <Text type={TextTypes.P}> {number} </Text>,
            ellipsis: true,
            width: "15%",
        },
        {
            title: <Text type={TextTypes.SUB3}>Merchant Id </Text>,
            dataIndex: "merchantId",
            key: "merchantId",
            sorter: true,
            render: (number: any) => <Text type={TextTypes.P}> {number} </Text>,
            ellipsis: true,
            width: "25%",
        },
        {
            title: <Text type={TextTypes.SUB3}>Retailer Name</Text>,
            dataIndex: "retailerName",
            key: "retailerName",
            sorter: true,
            render: (text: string) => <Text type={TextTypes.P}> {text} </Text>,
            ellipsis: true,
            width: "35%",
        },

        {
            title: "",
            key: "action",
            render: ({}, record: any) => (
                <Dropdown
                    overlay={
                        <Options
                            retailer={record}
                            removeUser={props.removeRetailer}
                        />
                    }
                    trigger={["click"]}
                >
                    <div>
                        <Icon
                            name="OptionsIcon"
                            alt="options"
                            size={50}
                            color={colors.blue}
                        />
                    </div>
                </Dropdown>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={retailers}
            rowKey={(record: any) => record.retailerid}
            pagination={{
                ...props.pagination,
                showSizeChanger: true,
                pageSizeOptions: constants.PAGINATION.PAGE_SIZE_OPTIONS,
            }}
            onChange={props.handlePagination}
        />
    );
};

export default RetailerTable;
