/**
 * Retailers Resolvers
 * GraphQL Resolver functions for Retailers Schema, Mutations and Queries
 */

import Retailers from "../../business/retailers";
import config from "../../../config/config";
import util from "../../business/util";
export const resolver = {
    Query: {
        //TO GET ALL RETAILERS
        allRetailers(root, args, context) {
            console.log("in args of retailers", args);
            return util.verifyUser(context.token).then((data) => {
                let decoded = data;
                console.log("decoded", decoded);

                return Retailers.getAllRetailers(args.input);
            });
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

    Mutation: {
        addEditRetailer(root, args, context) {
            console.log("in args of create retailers", args);
            // return util.verifyUser(context.token).then((data) => {
            //  let decoded = data;
            // console.log("decoded", decoded);
            // console.log("in createRetailer", args);
            return Retailers.createRetailer(args.input, args.retailerId);
            //});
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
