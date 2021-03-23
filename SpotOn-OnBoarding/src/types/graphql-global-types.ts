/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface PasswordInput {
    oldPassword?: string | null;
    newPassword?: string | null;
}

interface Response {
    status?: number;
    message?: string;
}

export interface CategoryCards {
    categoryname: string;
    cardimagenames: string[];
    carddesc: string[];
}
export interface RetailerInput {
    // retailerId: string | null;
    MaxBagTotal: string | null;
    MaxGcValue: string | null;
    MaxItems: string | null;
    MinGcValue: string | null;
    ReminderSchedule: string | null;
    groupId: string | null;
    merchantId: string | null;
    retailerName: string | null;
    categoryId: number[] | null;
}

export interface CategoryInput {
    carddesc: string[] | null;
    cardimagename: string[] | null;
    categoryname: string | null;
}
export interface UserInput extends Response {
    uid?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    roleid?: string | number | null;
    password?: PasswordInput | null;
}

export interface PaymentDetails {
    __typename: "PaymentDetails";
    ipdcctype: string | null;
    ipdpcnoquad: string | null;
    ipdpcamt: number | null;
    ipdstatus: number | null;
    ipdmessage: string | null;
    ipdtransid: string | null;
    ipddate: string | null;
}

export interface Merchant {
    merchantId: string | null;
    merchantname: string | null;
}

export interface Group {
    groupId: string | null;
    groupname: string | null;
}

export interface CardDesign {
    cardid: number | null;
    carddesc: string | null;
    cardimagename: string | null;
    carddisplayorder: number | null;
    styles: string | null;
}

export interface CardSenderInfo {
    sendername: string | null;
    senderemail: string | null;
}

export interface CardRecipientInfo {
    recipientname: string | null;
    recipientemail: string | null;
}

interface ReissueCardDet {
    reissuedate: string | null;
    carddetid: string | null;
}

export interface GiftCard {
    carddetid: number | null;
    lineitemid: number | null;
    denomination: number | null;
    personalmessage: string | null;
    cardsenderinfo: CardSenderInfo | null;
    cardrecipientinfo: CardRecipientInfo | null;
    status: boolean | null;
    cleansedgcnumber: string | null;
    emailreminders: Array<string> | null;
    reissuecarddet: ReissueCardDet | null;
    cardimage: string | null;
    balance: number | null;
    clientcardsrno: string | null;
    card: CardDesign | null;
    retailerid: number | null;
    shipdate: Date;
}

export interface Order {
    __typename: "Order";
    orderno: string | null;
    orderdate: string | null;
    ordertotal: number | null;
    paymentdetails: Array<PaymentDetails> | null;
    merchant: Merchant | null;
    group: Group | null;
    lineitems: Array<GiftCard> | null;
    orderstatus: string | null;
}
interface RetailerProfile {
    retailerprofilename: string | null;
    retailerprofilevalue: string | null;
}
export interface Category {
    catid: number | null;
    catdesc: string | null;
}
export interface Retailers {
    __typename: "Retailers";
    retailerId: string | null;
    merchantId: string | null;
    groupId: string | null;
    retailerName: string | null;
    retailerActive: string | null;
    retailerProfile: Array<RetailerProfile> | null;
    categories: Array<Category> | null;
}
export interface Filter {
    searchText: string | null;
    searchType: string | null;
    pageNo: number | null;
    pageSize: number | null;
    orderBy: string | null;
    order: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
