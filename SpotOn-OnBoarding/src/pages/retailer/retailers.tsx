import React from "react";
import RetailerTable from "./retailer.table";
import "./retailer.scss";
import {
    Search,
    Button,
    Icon,
    // showLoader,
    // showConfirm,
    // showToast,
    // ToastVariants,
    Text,
    TextTypes,
    LazyLoader,
    SuspenseProps,
} from "../../components/index";
import { Container, Row, Col } from "react-bootstrap";
import Service from "../../services/apolloClient.service";
//import { constants } from "../../constants";

interface UsersProps extends SuspenseProps {
    history: any;
}

function Retailers({ handlePagination, ...props }: UsersProps) {
    //   const { dataArray: retailers } = props;

    const { dataArray, searchValue } = props;
    console.log("in retailer.tsx", dataArray);
    /**
     * Handles remove user
     */
    const handleRemove = (uid: string) => {
        console.log(uid);
        // showConfirm({
        //     title: "Remove User",
        //     body: "Are you sure you want to remove this user?",
        //     confirmText: "Remove",
        //     onConfirm: async () => {
        //         const res = await showLoader(new Service().removeUser(uid));
        //         if (!res || res.status) {
        //             showToast({
        //                 title: "Failed!",
        //                 content: res?.message,
        //                 variant: ToastVariants.DANGER,
        //             });
        //             return;
        //         }
        //         if (res.status === 0) {
        //             showToast({
        //                 title: "Success!",
        //                 content: "User has been removed",
        //                 variant: ToastVariants.SUCCESS,
        //             });
        //             const { pageSize } = props.pagination;
        //             if (pageSize === constants.PAGINATION.PAGE_SIZE) {
        //                 handlePagination(props.pagination, {}, props.sorter);
        //                 return;
        //             }
        //             props.setState({
        //                 dataArray: users.filter((x) => x.uid !== uid),
        //             });
        //         }
        //     },
        // });
    };

    //  const { searchValue } = props;

    return (
        <Container fluid className="h-100 retailers" ref={props.listRef}>
            <div className="d-md-flex justify-content-between">
                <Text type={TextTypes.H2} className="d-none d-md-block">
                    Retailers{" "}
                </Text>
                <div className="d-flex align-items-center">
                    <Icon
                        name="AddIcon"
                        className="d-none d-md-block add-icon"
                        alt="add icon"
                        size={50}
                    />
                    <Button
                        className="button add-button"
                        onClick={() => props.history.push("/retailers/add")}
                    >
                        Add New Retailer
                    </Button>
                </div>
            </div>
            <div className="search-bar">
                <Search
                    label={searchValue ? "" : "Search"}
                    value={searchValue}
                    onChange={props.handleSearch}
                />
            </div>
            <Row>
                {/* <Col sm={12} className="list d-md-none d-sm-flex">
                    {users.map((user) => (
                        <UserCard
                            key={user.uid}
                            user={user}
                            removeUser={handleRemove}
                        />
                    ))}
                </Col> */}
                <Col className="table d-none d-md-block">
                    <RetailerTable
                        retailers={dataArray}
                        removeRetailer={handleRemove}
                        handlePagination={handlePagination}
                        pagination={props.pagination}
                    />
                </Col>
            </Row>
        </Container>
    );
}

const options = {
    key: "retailers",
    query: (filter: any) => new Service().getAllRetailers(filter),
    //   query: () => new Service().getAllRetailers(),
};

export default LazyLoader(Retailers, options);
