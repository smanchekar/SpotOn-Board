// /**
//  * Retailers Resolvers
//  * GraphQL Resolver functions for Retailers Schema, Mutations and Queries
//  */

// import Retailers from "../../business/retailers";
// import Category from "../../business/category";
// import config from "../../../config/config";
// import util from "../../business/util";
// export const resolver = {
//     Query: {
//         allCategories() {
//             return Category.getCategory();
//         },
//     },

//     // Mutation: {
//     //     addCategory(root, args, context) {
//     //         console.log("in args of create category", args);
//     //         // return util.verifyUser(context.token).then((data) => {
//     //         //  let decoded = data;
//     //         // console.log("decoded", decoded);
//     //         // console.log("in createRetailer", args);
//     //         return Category.createCategory(args.input, args.retailerId);
//     //         //  });
//     //     },
//     // },

//     // Retailer: {
//     //     retailerId: (row) => row.retailerid,
//     //     groupId: (row) => row.groupid,
//     //     merchantId: (row) => row.merchantid,
//     //     transId: (row) => row.transid,
//     //     retailerName: (row) => row.retailername,
//     //     retailerActive: (row) => row.retaileractive,
//     //     retailerProfiles: (row) => row.retailerprofiles,
//     //     bannerName: ({ promoconfig }) =>
//     //         promoconfig && promoconfig.showbanner
//     //             ? promoconfig.bannername
//     //             : null,
//     //     customStyle: ({ customstyle }) => {
//     //         if (customstyle) {
//     //             const { groupid, merchantid } = customstyle;
//     //             if (customstyle.merchantid) {
//     //                 return `merchant/${merchantid}/style.css`;
//     //             }
//     //             return `group/${groupid}/style.css`;
//     //         }
//     //         return null;
//     //     },
//     // },

//     // CardDesign: {
//     //     cardid: (row) => row.cardid,
//     //     carddesc: (row) => row.carddesc,
//     //     cardimagename: (row) => row.cardimagename,
//     //     carddisplayorder: (row) => row.carddisplayorder,
//     //     styles: (row) => Retailers.getStyle(row),
//     // },
// };
