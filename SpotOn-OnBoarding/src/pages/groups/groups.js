import React from "react";
import { Table, Divider } from "antd";

import { constants } from "../../constants";
import storage from "../../services/localStorage.service";
import "./groups.scss";
import RetailerForm from "../../components/retailer-form/retailer-form";
import { Button } from "spoton-lib";
import Service from "../../services/apolloClient.service";
import utils from "../../common/utils";

class Groups extends React.Component {
    constructor() {
        super();

        this.state = {
            retailers: [],
            view: "table",
            retailer: {},
            loading: true,
        };
    }

    componentDidMount() {
        let user = storage.getUser();
        if (!user) {
            this.props.history.push("/");
        }
        new Service().getAllRetailers().then((retailers) => {
            if (retailers) {
                retailers.forEach((ret) => {
                    ret.retailerProfiles.forEach((rtpf) => {
                        ret[rtpf.retailerprofilename] =
                            rtpf.retailerprofilevalue;
                    });
                    delete ret.retailerProfiles;
                });
                console.log(retailers);
                this.setState({
                    retailers,
                    loading: false,
                });
            }
        });
    }

    handleRetailerForm = (retailer) => {
        this.setState({
            view: "form",
            retailer,
        });
    };

    handleFormSubmit = (values) => {
        const { retailer } = this.state;
        if (retailer.groupId) {
            values.retailerId = retailer.retailerId;
            new Service().updateGroup(JSON.stringify(values)).then((res) => {
                console.log("res...", res);
                this.setState({
                    view: "table",
                    retailer: {},
                });
            });
        } else {
            new Service().createGroup(JSON.stringify(values)).then((res) => {
                console.log("res...", res);
                this.props.history.push("/editor/" + res.retailerId);
            });
        }
    };

    handleFormCancel = () => {
        this.setState({
            view: "table",
            retailer: {},
        });
    };

    getColumns() {
        const columns = [
            {
                title: "Group Id",
                dataIndex: "groupId",
                sorter: (a, b) => a.groupId.localeCompare(b.groupId),
            },
            {
                title: "Group Name",
                dataIndex: "retailername",
                sorter: (a, b) => a.retailername.localeCompare(b.retailername),
                // }, {
                //     title: 'Min Gift Card Value',
                //     dataIndex: 'MinGcValue',
                //     sorter: (a, b) => a.MinGcValue - b.MinGcValue
                // }, {
                //     title: 'Max Gift Card Value',
                //     dataIndex: 'MaxGcValue',
                //     sorter: (a, b) => a.MaxGcValue - b.MaxGcValue
                // }, {
                //     title: 'Max Items',
                //     dataIndex: 'MaxItems',
                //     sorter: (a, b) => a.MaxItems - b.MaxItems
                // }, {
                //     title: 'Max Bag Total',
                //     dataIndex: 'MaxBagTotal',
                //     sorter: (a, b) => a.MaxBagTotal - b.MaxBagTotal
            },
            {
                title: "Action",
                key: "action",
                render: (text, record) => (
                    <span>
                        <a onClick={() => this.handleRetailerForm(record)}>
                            Edit Profile
                        </a>
                    </span>
                ),
            },
        ];

        return columns;
    }

    render() {
        console.log("in group");
        const { view, retailer } = this.state;
        return view === "table" ? (
            <div className="groups">
                <div className="spaceBetween">
                    <h2> &nbsp;Groups </h2>
                    <Button
                        className="createBtn"
                        onClick={() => this.handleRetailerForm({})}
                    >
                        Create Group
                    </Button>
                </div>
                <br />
                <Table
                    columns={this.getColumns()}
                    dataSource={this.state.retailers}
                    loading={this.state.loading}
                    rowKey={(record) => record.retailerId}
                />
            </div>
        ) : (
            <div className="groups">
                <div className="spaceAround">
                    <h2>{retailer.groupId ? "Edit Group" : "Create Group"}</h2>
                </div>
                <br />
                <RetailerForm
                    retailer={retailer}
                    handleSubmit={this.handleFormSubmit}
                    handleCancel={this.handleFormCancel}
                />
            </div>
        );
    }
}

export default Groups;
