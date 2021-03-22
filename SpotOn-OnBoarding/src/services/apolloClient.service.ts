import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import storage from "./localStorage.service";
import { constants } from "../constants";

import {
    UserInput,
    Filter,
    RetailerInput,
    CategoryInput,
} from "../types/graphql-global-types";
const URL = constants.BASE_URL + "/graphql";

const instance = new ApolloClient({
    uri: URL,
    request: async (operation) => {
        const token = storage.getUser()?.token;
        console.log(token);
        if (token) {
            operation.setContext({
                headers: {
                    "x-authorization": token,
                },
            });
        }
    },
});

export default class ApolloClientService {
    _instance: any;
    constructor() {
        this._instance = instance;
        console.log(instance);
    }

    handlException(ex: any) {
        if (ex.graphQLErrors !== undefined && ex.graphQLErrors.length > 0) {
            let error = ex.graphQLErrors[0];
            if (ex.networkError !== undefined) {
                console.log("network error", JSON.stringify(ex));
                if (error.message === "Status.UNAUTHORIZED_ACCESS") {
                    storage.clearAll();
                    window.location.href = window.location.origin;
                }
            }
        }
        return {
            status: 1,
            message: "Something went wrong. Please try again later.",
        };
    }

    async login(email: string, password: string) {
        try {
            console.log("login...");
            let data = await this._instance.query({
                query: gql`
                    query login($email: String!, $password: String!) {
                        login(email: $email, password: $password) {
                            token
                            uid
                            firstname
                            lastname
                            email
                            roleid
                            status
                            message
                        }
                    }
                `,
                variables: {
                    email,
                    password,
                },
                fetchPolicy: "no-cache",
            });
            console.log("login...", data.data);
            return data.data ? data.data.login : { status: 1 };
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async forgotPassword(email: string) {
        try {
            console.log("forgotPassword...");
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation forgotPassword($email: String!) {
                        forgotPassword(email: $email) {
                            status
                            message
                        }
                    }
                `,
                variables: {
                    email,
                },
                fetchPolicy: "no-cache",
            });
            console.log("forgotPassword...", data.data);
            return data.data ? data.data.forgotPassword : { status: 1 };
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async resetPassword(email: string, newPassword: string, token: string) {
        try {
            console.log("resetPassword...", token);
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation changePassword(
                        $email: String!
                        $input: PasswordInput!
                        $token: String!
                    ) {
                        changePassword(
                            email: $email
                            input: $input
                            token: $token
                        ) {
                            status
                            message
                        }
                    }
                `,
                variables: {
                    email,
                    input: { newPassword },
                    token,
                },
                fetchPolicy: "no-cache",
            });
            console.log("resetPassword...", data.data);
            return data.data ? data.data.changePassword : { status: 1 };
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async getRetailerProfile(groupid: number, merchantid: number) {
        try {
            console.log("getRetailerProfile...", groupid);
            let data = await this._instance.query({
                query: gql`
                    query retailer($groupid: String!, $merchantid: String!) {
                        retailer(groupid: $groupid, merchantid: $merchantid) {
                            retailerId
                            groupId
                            merchantId
                            transId
                            retailerName
                            retailerLogo
                            retailerActive
                            retailerProfiles {
                                retailerprofilename
                                retailerprofilevalue
                            }
                            tokenKey
                        }
                    }
                `,
                variables: {
                    groupid,
                    merchantid,
                },
                fetchPolicy: "no-cache",
            });
            return data.data ? data.data.retailer : undefined;
        } catch (ex) {
            console.log("errorrro", typeof ex);
            return this.handlException(ex);
        }
    }

    async getAllRetailers(filter: Filter) {
        try {
            console.log("getAllRetailers...", filter);
            let data = await this._instance.query({
                query: gql`
                    query allRetailers($filter: Filter!) {
                        allRetailers(input: $filter) {
                            retailers {
                                groupId
                                merchantId
                                retailerId
                                retailerName
                                retailerLogo
                                retailerActive
                                retailerProfiles {
                                    retailerprofilename
                                    retailerprofilevalue
                                }
                            }
                            status
                            message
                            total
                        }
                    }
                `,
                variables: {
                    filter,
                },
                fetchPolicy: "no-cache",
            });
            console.log("in getAll retailer", data.data);
            return data.data ? data.data.allRetailers : undefined;
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async updateAccount(input: UserInput) {
        const { password, ...common } = input;
        const { oldPassword, newPassword }: any = password;
        try {
            console.log("updateAccont...");
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation updateAccount($input: UserInput!) {
                        updateAccount(input: $input) {
                            uid
                            firstname
                            lastname
                            email
                            status
                            message
                        }
                    }
                `,
                variables: {
                    input: {
                        ...common,
                        password: { oldPassword, newPassword },
                    },
                },
                fetchPolicy: "no-cache",
            });
            console.log("updateAccount...", data.data);
            return data.data ? data.data.updateAccount : { status: 1 };
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async allCategories() {
        try {
            console.log("in all category appolo");
            let data = await this._instance.query({
                query: gql`
                    query allCategories {
                        allCategories {
                            categories {
                                catid
                                catdesc
                            }
                        }
                    }
                `,
                variables: {},
                fetchPolicy: "no-cache",
            });
            console.log("in getAll Categories");
            return data.data ? data.data.allCategories : undefined;
        } catch (err) {
            return this.handlException(err);
        }
    }
    async addCategoryAndCards(input: CategoryInput) {
        console.log("input", input);
        const { ...common } = input;
        try {
            console.log("addCategoryAndCards...");
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation addCategoryAndCards($input: CategoryInput!) {
                        addCategoryAndCards(input: $input) {
                            status
                            message
                        }
                    }
                `,
                variables: {
                    input: {
                        ...common,
                    },
                },
                fetchPolicy: "no-cache",
            });
            console.log("addCategoryAndCards...", data);
            return data.data ? data.data.addCategoryAndCards : { status: 1 };
        } catch (ex) {
            return this.handlException(ex);
        }
    }

    async addEditUser(input: RetailerInput, retailerId?: number) {
        console.log("retailerId", retailerId);

        const { ...common } = input;
        // const { newPassword }: any = password;
        try {
            console.log("addEditRetailer...");
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation addEditRetailer(
                        $input: RetailerInput!
                        $retailerId: Int
                    ) {
                        addEditRetailer(
                            input: $input
                            retailerId: $retailerId
                        ) {
                            retailerId
                            status
                            message
                        }
                    }
                `,
                variables: {
                    input: {
                        ...common,
                        //  password: { newPassword },
                    },
                    retailerId,
                },
                fetchPolicy: "no-cache",
            });
            console.log("addEditRetailer...");
            return data.data ? data.data.addEditRetailer : { status: 1 };
        } catch (ex) {
            return this.handlException(ex);
        }
    }

    async getUsers(filter: Filter) {
        try {
            console.log("getUsers...");
            let data = await this._instance.query({
                query: gql`
                    query users($filter: Filter!) {
                        users(meta: $filter) {
                            users {
                                uid
                                firstname
                                lastname
                                email
                                roleid
                            }
                            total
                            status
                            message
                        }
                    }
                `,
                variables: {
                    filter,
                },
                fetchPolicy: "no-cache",
            });
            console.log("getUsers...", data.data);
            return data.data ? data.data.users : { status: 1 };
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }
}
