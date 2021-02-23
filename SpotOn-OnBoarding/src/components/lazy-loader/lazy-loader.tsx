import React, { Component } from "react";
import { showLoader, showToast, ToastVariants } from "../index";
import debounce from "lodash.debounce";
import { constants } from "../../constants";

export interface LazyLoaderState {
    hasMore: boolean;
    isLoading: boolean;
    dataArray: Array<any>;
    searchValue: string;
    pagination: any;
    sorter: any;
}

interface Options {
    key: string;
    query: (filter: any) => any;
}

export default function LazyLoader(
    Suspense: Function,
    { key, query }: Options
) {
    return class WrappedComponent extends Component<any, LazyLoaderState> {
        listRef: React.RefObject<HTMLDivElement>;

        constructor(props: any) {
            super(props);
            this.listRef = React.createRef();
            this.state = {
                hasMore: true,
                isLoading: false,
                dataArray: [],
                searchValue: "",
                pagination: {},
                sorter: {},
            };
        }

        /**
         * Set page size depending on device is mobile or not
         */
        componentDidMount = async () => {
            const isMobile = window.innerWidth < 992; // less than min desktop width
            const { PAGE_SIZE } = constants.PAGINATION;
            const filter: any = {
                current: 1,
                pageSize: PAGE_SIZE * 2,
            };
            if (key === "orders") {
                filter.orderBy = "orderno";
                filter.order = "descend";
            }
            this.loadMore(filter);
            const list: HTMLDivElement | null = this.listRef.current;
            if (isMobile && list) {
                // 200 [ms] is used as a delay
                list.onscroll = debounce(() => this.debounceList(list), 200);
            }
        };

        /**
         * This function will be called every time user take pause while scrolling
         * @param node
         */
        debounceList = (node: HTMLDivElement) => {
            const { hasMore, isLoading } = this.state;
            if (!hasMore || isLoading) return;
            // Checks that the page has scrolled to the bottom
            if (node.offsetHeight + node.scrollTop >= node.scrollHeight) {
                console.log("debounce");
                const { pagination } = this.state;
                const filter = {
                    ...pagination,
                    current: pagination.current + 1,
                    ...(key === "orders"
                        ? { orderBy: "orderno", order: "descend" }
                        : {}),
                };
                this.setState({ isLoading: true }, () =>
                    this.loadMore(filter, true)
                );
            }
        };

        /**
         * This function will be executed when user take pause while typing
         */
        debounceInput = () => {
            const { isLoading, pagination } = this.state;
            if (!isLoading) {
                pagination.current = 1;
                this.setState({ isLoading: true }, () =>
                    this.loadMore(pagination)
                );
            }
        };

        /**
         * Load more content if required
         * @param filter
         * @param append boolean (true for mobile device)
         */
        async loadMore(filter: any, append?: boolean) {
            const { dataArray, searchValue } = this.state;
            const res = await showLoader(
                query({
                    pageNo: filter.current,
                    pageSize: filter.pageSize,
                    orderBy: filter.orderBy,
                    order: filter.order
                        ? filter.order === "ascend"
                            ? "asc"
                            : "desc"
                        : undefined,
                    searchText: searchValue.toLowerCase(),
                    searchType: "any",
                })
            );
            if (!res || res.status) {
                this.setState({ isLoading: false });
                showToast({
                    title: "Failed!",
                    content: res?.message,
                    variant: ToastVariants.DANGER,
                });
                return;
            }
            console.log(res[key]);
            const next = res;
            const { current, pageSize } = filter;
            this.setState({
                isLoading: false,
                dataArray: append ? [...dataArray, ...next] : next,
                pagination: { current, pageSize, total: res.total },
                hasMore: next.length === pageSize,
                sorter: {
                    field: filter.orderBy,
                    order: filter.order,
                },
            });
        }

        /**
         * This function will be passed to table component
         */
        handlePagination = (pagination: any, {}: any, sorter: any) => {
            console.log(pagination, sorter);
            this.setState({ isLoading: true }, () => {
                this.loadMore({
                    ...pagination,
                    orderBy: key === "orders" ? "orderno" : sorter.field,
                    order: key === "orders" ? "descend" : sorter.order,
                });
            });
        };

        handleSearch = (() => {
            // 1500 [ms] is used as a delay
            const callback = debounce(this.debounceInput, 1500);
            // Following function will be passed to input component
            return ({ target: { value } }: any) => {
                const { searchValue } = this.state;
                if (value !== searchValue) {
                    this.setState({
                        searchValue: value,
                    });
                    callback();
                }
            };
        })();

        render() {
            return (
                <Suspense
                    listRef={this.listRef}
                    handlePagination={this.handlePagination}
                    handleSearch={this.handleSearch}
                    {...this.state}
                    {...this.props}
                    setState={(state: LazyLoaderState) => this.setState(state)}
                />
            );
        }
    };
}
