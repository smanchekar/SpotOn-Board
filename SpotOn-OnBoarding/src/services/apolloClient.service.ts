import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import storage from "./localStorage.service";
import { constants } from "../constants";

import { UserInput, Filter } from "../types/graphql-global-types";
const URL = constants.BASE_URL + "/graphql";

const instance = new ApolloClient({
    uri: URL,
    request: async (operation) => {
        const user = storage.getUser();
        const token = user ? user.jwttoken : "";
        if (token.length > 0) {
            operation.setContext({
                headers: {
                    "x-authorization": "Bearer " + token,
                },
            });
        }
    },
});

export default class ApolloClientService {
    _instance: any;
    constructor() {
        this._instance = instance;
    }

    // handlException(ex:any) {
    //     if (ex.graphQLErrors !== undefined && ex.graphQLErrors.length > 0) {
    //         let error = ex.graphQLErrors[0];
    //         if (ex.networkError !== undefined) {
    //             console.log('network error', ex.networkError);
    //             return undefined;
    //         }
    //         return undefined;
    //     }
    // }

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
                            jwttoken
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

    async getCardDesigns(retailerid: number) {
        try {
            let data = await this._instance.query({
                query: gql`
                    query carddesigns($retailerid: Int!) {
                        carddesigns(retailerid: $retailerid) {
                            catid
                            catdesc
                            cards {
                                cardid
                                carddesc
                                cardimagename
                                carddisplayorder
                                styles
                            }
                        }
                    }
                `,
                variables: {
                    retailerid,
                },
                fetchPolicy: "no-cache",
            });
            return data.data ? data.data.carddesigns : undefined;
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async getAllRetailers() {
        try {
            console.log("getAllRetailers...");
            let data = await this._instance.query({
                query: gql`
                    query {
                        allRetailers {
                            retailerId
                            groupId
                            merchantId
                            retailerName
                            retailerActive
                            retailerProfiles {
                                retailerprofilename
                                retailerprofilevalue
                            }
                        }
                    }
                `,
                fetchPolicy: "no-cache",
            });
            console.log(data.data.allRetailers);
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
    async addEditUser(input: UserInput, uid?: string) {
        const { password, ...common } = input;
        const { newPassword }: any = password;
        try {
            console.log("addEditUser...");
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation addEditUser($input: UserInput!, $uid: String) {
                        addEditUser(input: $input, uid: $uid) {
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
                        password: { newPassword },
                    },
                    uid,
                },
                fetchPolicy: "no-cache",
            });
            console.log("addEditUser...", data.data);
            return data.data ? data.data.addEditUser : { status: 1 };
        } catch (ex) {
            console.log("errorrro", ex);
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

    async getOrders(filter: Filter) {
        try {
            console.log("getOrders...");
            let data = await this._instance.query({
                query: gql`
                    query orders($filter: Filter!) {
                        orders(filter: $filter) {
                            orders {
                                orderno
                                orderdate
                                ordertotal
                                orderstatus
                                paymentdetails {
                                    ipdcctype
                                    ipdpcnoquad
                                    ipdstatus
                                    ipdtransid
                                    ipddate
                                    ipdmessage
                                }
                                merchant {
                                    merchantId
                                    merchantname
                                }
                                group {
                                    groupId
                                    groupname
                                }
                                lineitems {
                                    carddetid
                                    lineitemid
                                    denomination
                                    personalmessage
                                    cardsenderinfo {
                                        sendername
                                        senderemail
                                    }
                                    cardrecipientinfo {
                                        recipientname
                                        recipientemail
                                    }
                                    emailreminders
                                    cardimage
                                    reissuecarddet {
                                        reissuedate
                                        carddetid
                                    }
                                    clientcardsrno
                                    cleansedgcnumber
                                    retailerid
                                    card {
                                        cardimagename
                                    }
                                    shipdate
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
            console.log("getOrders...", data.data);
            return data.data ? data.data.orders : undefined;
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async createGroup(profileInfo: any) {
        try {
            console.log("createGroup...");
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation createGroup($profileInfo: String!) {
                        createGroup(profileInfo: $profileInfo) {
                            retailerId
                            groupId
                        }
                    }
                `,
                variables: {
                    profileInfo,
                },
                fetchPolicy: "no-cache",
            });
            return data.data ? data.data.createGroup : undefined;
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async updateGroup(profileInfo: any) {
        try {
            console.log("updateGroup...");
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation updateGroup($profileInfo: String!) {
                        updateGroup(profileInfo: $profileInfo) {
                            status
                            message
                        }
                    }
                `,
                variables: {
                    profileInfo,
                },
                fetchPolicy: "no-cache",
            });
            return data.data ? data.data.updateGroup : undefined;
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async createCard(cardinfo: any) {
        try {
            console.log("createCard...");
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation createCard($cardinfo: String!) {
                        createCard(cardinfo: $cardinfo) {
                            cardid
                            cardimagename
                        }
                    }
                `,
                variables: {
                    cardinfo,
                },
                fetchPolicy: "no-cache",
            });
            return data.data ? data.data.createCard : undefined;
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }

    async updateCard(cardinfo: any) {
        try {
            console.log("updateCard...");
            let data = await this._instance.mutate({
                mutation: gql`
                    mutation updateCard($cardinfo: String!) {
                        updateCard(cardinfo: $cardinfo) {
                            message
                            status
                        }
                    }
                `,
                variables: {
                    cardinfo,
                },
                fetchPolicy: "no-cache",
            });
            return data.data ? data.data.updateCard : undefined;
        } catch (ex) {
            console.log("errorrro", ex);
            return this.handlException(ex);
        }
    }
}
