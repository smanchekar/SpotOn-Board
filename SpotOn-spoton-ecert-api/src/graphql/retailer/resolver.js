/**
 * Retailers Resolvers
 * GraphQL Resolver functions for Retailers Schema, Mutations and Queries
 */

import Retailers from "../../business/retailers";
import config from "../../../config/config";
export const resolver = {
    Query: {
        //TO GET ALL RETAILERS
        allRetailers() {
            return Retailers.getAllRetailers();
        },

        retailer(root, args, context) {
            console.log("inside retailer");
            return Retailers.getRetailerProfile(args, context);
        },

        carddesigns(root, args, context) {
            console.log("inside carddesigns");
            return Retailers.getCardDesigns(args);
        },

        analytics() {
            console.log("config.trackingID", config.trackingID);
            return { trackingID: config.trackingID };
        },

        merchant(root, args) {
            return Retailers.getMerchantData(args);
        },
    },

    Retailer: {
        retailerId: (row) => row.retailerid,
        groupId: (row) => row.groupid,
        merchantId: (row) => row.merchantid,
        transId: (row) => row.transid,
        retailerName: (row) => row.retailername,
        retailerActive: (row) => row.retaileractive,
        retailerProfiles: (row) => row.retailerprofiles,
        bannerName: ({ promoconfig }) =>
            promoconfig && promoconfig.showbanner
                ? promoconfig.bannername
                : null,
        customStyle: ({ customstyle }) => {
            if (customstyle) {
                const { groupid, merchantid } = customstyle;
                if (customstyle.merchantid) {
                    return `merchant/${merchantid}/style.css`;
                }
                return `group/${groupid}/style.css`;
            }
            return null;
        },
    },

    CardDesign: {
        cardid: (row) => row.cardid,
        carddesc: (row) => row.carddesc,
        cardimagename: (row) => row.cardimagename,
        carddisplayorder: (row) => row.carddisplayorder,
        styles: (row) => Retailers.getStyle(row),
    },
};
