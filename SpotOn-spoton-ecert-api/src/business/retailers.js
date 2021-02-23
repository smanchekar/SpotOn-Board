import MainModel from "../../data/spoton/models";
import config from "../../config/config";
import util from "./util";
import RestaurantApi from "./restaurantapi";
import Sequelize from "sequelize";
import axios from "axios";
import { Op } from "sequelize";
import moment from "moment";
let mainmodel = new MainModel();
let spotonschemamodels = mainmodel.models;
const sequelize = mainmodel.Conn;
let retailers = spotonschemamodels.retailer;
class Retailers {
    constructor() {
        //GET ALL RETAILERS
        this.getAllRetailers = async () => {
            return spotonschemamodels.retailer
                .findAll({
                    include: [
                        {
                            model: spotonschemamodels.retailerprofile,
                        },
                    ],
                })
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    console.log("", err);
                });
        };

        this.getRetailerByMerchantId = (groupid, merchantid) => {
            return spotonschemamodels.retailer.findOne({
                include: [
                    {
                        model: spotonschemamodels.retailerprofile,
                    },
                ],
                where: {
                    groupid,
                    merchantid,
                    retaileractive: config.status.active,
                },
            });
        };

        (this.getRetailerProfile = (args, context) => {
            console.log("getRetailer", args);
            return spotonschemamodels.retailer
                .findOne({
                    include: [
                        {
                            model: spotonschemamodels.retailerprofile,
                        },
                    ],
                    where: {
                        [Op.or]: [
                            {
                                groupid: {
                                    [Op.like]: args.groupid,
                                },
                            },
                            {
                                merchantid: {
                                    [Op.like]: args.merchantid,
                                },
                            },
                            {
                                retailername: {
                                    [Op.like]: args.retailername,
                                },
                            },
                        ],
                    },
                })
                .then((res) => {
                    console.log(res);
                    if (res == null) {
                        return retailer.findAll({
                            include: [
                                {
                                    model: spotonschemamodels.retailerprofile,
                                },
                            ],
                            where: { groupid: config.defaultGroupId },
                        });
                    } else {
                        return res;
                    }
                });
        }),
            /**
             * Function to retrieve retailer and it's profile information.
             * @param {*} args      arguments passed in query.
             */
            // this.getRetailerProfile = (args, context) => {
            //     console.log("getRetailer", args);
            //     return sequelize
            //         .transaction((t) => {
            //             return this.getRetailerByMerchantId(
            //                 args.groupid,
            //                 args.merchantid
            //             )
            //                 .then((data) => {
            //                     return data
            //                         ? data
            //                         : this.getRetailerByMerchantId(
            //                               args.groupid,
            //                               null
            //                           );
            //                 })
            //                 .then((data) => {
            //                     if (!data) {
            //                         // if retailer not found w.r.t group then default to defaultRetailerID
            //                         return this.getDefaultRetailer().then(
            //                             (data) => {
            //                                 data.groupid = args.groupid;
            //                                 return data;
            //                             }
            //                         );
            //                     }
            //                     return data;
            //                 })
            //                 .then((data) => {
            //                     return this.getMerchantData(args.merchantid).then(
            //                         (merchantData) => {
            //                             data.retailerName =
            //                                 merchantData.retailerName;
            //                             data.retailerLogo =
            //                                 merchantData.retailerLogo;
            //                             return data;
            //                         }
            //                     );
            //                 })
            //                 .then((profile) => {
            //                     if (profile) {
            //                         let options = { transaction: t };
            //                         let merchantData = {
            //                             groupId: args.groupid,
            //                             merchantId: args.merchantid,
            //                             retailerName: profile.retailerName,
            //                             retailerLogo: profile.retailerLogo,
            //                         };

            //                         let trans = {
            //                             utdate: util.getTimeStamp(),
            //                             utipaddr: "",
            //                             retailerid: profile.retailerid,
            //                             utrefererurl: context.referer,
            //                             merchantid: JSON.stringify(merchantData),
            //                         };

            //                         return spotonschemamodels.usertrans
            //                             .create(trans, options)
            //                             .then((usertrans) => {
            //                                 profile.transid = usertrans.usertransid;
            //                                 let data = this.parseMerchantJson(
            //                                     usertrans
            //                                 );
            //                                 profile.merchantId = data.merchantId;
            //                                 return profile;
            //                             });
            //                     }
            //                     return profile;
            //                 })
            //                 .then((profile) => {
            //                     if (profile) {
            //                         return this.getTokenKey(args).then((key) => {
            //                             console.log("token----------", key);
            //                             profile.tokenKey = key;
            //                             return profile;
            //                         });
            //                     }
            //                     return profile;
            //                 })
            //                 .then((profile) => {
            //                     return this.checkForCustomStyle(
            //                         args.groupid,
            //                         args.merchantid
            //                     )
            //                         .then((res) => {
            //                             return res
            //                                 ? res
            //                                 : this.checkForCustomStyle(
            //                                       args.groupid,
            //                                       null
            //                                   );
            //                         })
            //                         .then((res) => {
            //                             return res
            //                                 ? res
            //                                 : this.checkForCustomStyle(
            //                                       config.defaultGroupId,
            //                                       null
            //                                   );
            //                         })
            //                         .then((res) => {
            //                             if (res) {
            //                                 profile.customstyle = res;
            //                             }
            //                             return profile;
            //                         });
            //                 })
            //                 .then((profile) => {
            //                     return this.getPromoConfig({
            //                         groupid: args.groupid,
            //                         merchantid: args.merchantid,
            //                         joinDtlTable: false,
            //                     }).then((res) => {
            //                         profile.promoconfig = res;
            //                         return profile;
            //                     });
            //                 });
            //         })
            //         .catch((err) => {
            //             console.log("getRetailerProfile-----", err);
            //             return config.failedResponse;
            //         });
            // };

            (this.checkForCustomStyle = (groupid, merchantid) => {
                return spotonschemamodels.customstyle.findOne({
                    where: {
                        groupid,
                        merchantid,
                        active: "Y",
                    },
                });
            });

        /**
         * Function for fetching row from promoconfig table using any of the following three cases:
         * * merchantid and groupid (1st preference)
         * * groupid                (2nd preference)
         * * default groupid        (3rd preference)
         * @param {*} object - {groupid, merchantid, joinDtlTable, total}
         */
        this.getPromoConfig = async ({
            groupid,
            merchantid,
            joinDtlTable,
            total,
        }) => {
            var res = await this.checkForPromoConfig({
                groupid,
                merchantid,
                joinDtlTable,
                total,
            });
            if (!res)
                res = await this.checkForPromoConfig({
                    groupid,
                    merchantid: null,
                    joinDtlTable,
                    total,
                });
            if (!res)
                res = await this.checkForPromoConfig({
                    groupid: config.defaultGroupId,
                    merchantid: null,
                    joinDtlTable,
                    total,
                });
            return res;
        };

        /**
         * function for fetching data from database
         * filters:
         * * With PromoConfig\active = Y only
         * * With PronoConfig\GroupId = value and (MerchantId is NULL or MerchantId is value) Order by MerchantId
         * * With Today Date (UTC/Local ?) between FromDate (if Null Today) & ToDate(if Null Today).
         * * With  PromoConfigDtl\MinValue  <= Invoice Value
         * @param {*} object - {groupid, merchantid, joinDtlTable, total}
         */
        this.checkForPromoConfig = ({
            groupid,
            merchantid,
            joinDtlTable,
            total,
        }) => {
            var obj = {
                where: {
                    groupid,
                    merchantid,
                    active: true,
                    fromdate: {
                        [Op.lte]: moment().utc().format("YYYY-MM-DD HH:mm"),
                    },
                    todate: {
                        [Op.gte]: moment().utc().format("YYYY-MM-DD HH:mm"),
                    },
                },
            };
            if (joinDtlTable) {
                obj.include = [
                    {
                        model: spotonschemamodels.promoconfigdtl,
                        where: { minvalue: { [Op.lte]: total } },
                    },
                    {
                        model: spotonschemamodels.category,
                        include: [{ model: spotonschemamodels.card }],
                    },
                ];
                obj.order = [
                    [spotonschemamodels.promoconfigdtl, "minvalue", "DESC"],
                ];
            }
            return spotonschemamodels.promoconfig.findOne(obj);
        };

        this.requestStyle = (path) => {
            return axios.get(path).then((res) => path);
        };

        /**
         * Function to retrieve valid tokenization key from Spoton VTS.
         * @param {*} args      arguments passed in query.
         */
        this.getTokenKey = async (args) => {
            let api = new RestaurantApi();
            api.setMerchant(args.merchantid);
            let response = await api.getPaymentTokenKey();
            return response.data.nmi_tokenization_key;
        };

        /**
         * Function to retrieve valid tokenization key from Spoton VTS.
         * @param {*} args      arguments passed in query.
         */
        this.getDefaultRetailer = async () => {
            return spotonschemamodels.retailerprofile
                .findAll({
                    attributes: ["retailerprofilename", "retailerprofilevalue"],
                    where: { retailerid: config.defaultRetailerID },
                })
                .then((data) => {
                    return {
                        retailerid: config.defaultRetailerID,
                        retailerprofiles: data,
                    };
                });
        };

        /**
         * Function to retrieve valid tokenization key from Spoton VTS.
         * @param {*} args      arguments passed in query.
         */
        this.getMerchantData = async (merchantid) => {
            let api = new RestaurantApi();
            //api.setMerchant('5e6afee59adef38d874942d5');
            api.setMerchant(merchantid);
            let response = await api.getMerchantInfo();
            if (response && response.status === 200) {
                if (response.data) {
                    return {
                        retailerName: response.data.name,
                        retailerLogo: response.data.logoUrl,
                    };
                    //console.log('merchant..', response.data.merchants);
                    // if (response.data.merchants) {
                    //     let merchant = response.data.merchants.filter((obj) => {
                    //         return obj.merchantId === merchantid});

                    //     console.log('merchant..', merchant[0].orgName);
                    //     if (merchant.length > 0 && merchant[0].orgName) {
                    //         return {
                    //             retailerName: merchant[0].orgName,
                    //             retailerLogo: response.data.logoUrl
                    //         }
                    //     }
                    // }
                }
            }
            throw {
                status: false,
                message: "failed to fetch retailer data from merchant id",
            };
        };

        /**
         * Function to retrieve retailer and it's profile information.
         * @param {*} retailerid arguments passed in query.
         */
        this.getRetailer = (retailerid) => {
            //console.log('getRetailer', retailerid);
            return spotonschemamodels.retailer
                .findOne({
                    attributes: [
                        "retailerid",
                        "retailername",
                        "retaileractive",
                    ],
                    include: [
                        {
                            model: spotonschemamodels.retailerprofile,
                            attributes: [
                                "retailerprofilename",
                                "retailerprofilevalue",
                            ],
                        },
                    ],
                    where: { retailerid },
                })
                .then((retailer) => {
                    if (!retailer) {
                        return this.getDefaultRetailer();
                    }
                    return retailer;
                });
        };

        /**
         * Function to retrieve retailer card designs.
         * @param {*} args  arguments passed in query.
         */
        this.getCardDesigns = (args) => {
            return spotonschemamodels.retailer
                .findOne({
                    attributes: ["retailername", "retaileractive"],
                    include: [
                        {
                            model: spotonschemamodels.category,
                            as: "retailercategory",
                            attributes: ["catid"],
                        },
                    ],
                    where: { retailerid: args.retailerid },
                })
                .then((data) => {
                    let catIds = data.retailercategory.map((cat) => {
                        return cat.catid;
                    });
                    return spotonschemamodels.category
                        .findAll({
                            attributes: ["catid", "catdesc", "catdisplayorder"],
                            include: [
                                {
                                    model: spotonschemamodels.card,
                                    attributes: [
                                        "cardid",
                                        "carddesc",
                                        "cardimagename",
                                        "cardtemplate",
                                    ],
                                },
                            ],
                            where: {
                                catid: { [Sequelize.Op.in]: catIds },
                            },
                            order: Sequelize.literal(
                                '"cards->catcardmap".carddisplayorder ASC'
                            ),
                        })
                        .then((designs) => {
                            designs = designs.map((obj) => {
                                obj = obj.toJSON();
                                if (obj.cards) {
                                    obj.cards = obj.cards.map((card) => {
                                        card.retailerid = args.retailerid;
                                        return card;
                                    });
                                }
                                return obj;
                            });
                            return designs;
                        });
                })
                .catch((err) => {
                    console.log("getCardDesigns-----", err);
                    return config.failedResponse;
                });
        };

        /**
         * Function to retrieve retailer card design text and styling.
         * @param {*} args  arguments passed in query.
         */
        this.getCardTextDetails = (cardid, retailerid) => {
            return spotonschemamodels.cardtextdetail
                .findAll({
                    attributes: ["ctdtext", "ctdstyle"],
                    where: {
                        cardid,
                        retailerid: { [Sequelize.Op.in]: [retailerid, -1] },
                    },
                })
                .then((data) => {
                    if (data && data.length > 0) {
                        return { ...config.successResponse, data };
                    }
                    return config.failedResponse;
                })
                .catch((err) => {
                    console.log("cardtextdetail error-----", err);
                    return config.failedResponse;
                });
        };

        this.parseMerchantJson = (transObj) => {
            console.log("After parsing1...", transObj.merchantid);
            if (transObj && transObj.merchantid) {
                let data = {};
                try {
                    data = JSON.parse(transObj.merchantid);
                } catch (err) {
                    console.log("parseMerchantJson err", err);
                }
                transObj = transObj.toJSON();
                transObj.merchantId = data.merchantId
                    ? data.merchantId
                    : transObj.merchantid;
                transObj.groupId = data.groupId ? data.groupId : "";
                transObj.retailerName = data.retailerName
                    ? data.retailerName
                    : "";
                transObj.retailerLogo = data.retailerLogo
                    ? data.retailerLogo
                    : "";
                return transObj;
            }
            return transObj;
        };

        this.getStyle = (row) => {
            return this.getCardTextDetails(row.cardid, row.retailerid)
                .then((data) => {
                    let styleArr = [];
                    if (data.data && data.status) {
                        data.data.forEach((cardtextdetail) => {
                            if (cardtextdetail) {
                                let style = JSON.parse(cardtextdetail.ctdstyle);
                                style.text = cardtextdetail.ctdtext;
                                styleArr.push(style);
                            }
                        });
                    }
                    return styleArr;
                })
                .then((styles) => {
                    if (!styles || (styles && styles.length === 0)) {
                        let styleArr = [];
                        let template = row.cardtemplate
                            ? JSON.parse(row.cardtemplate)
                            : row.cardtemplate;
                        if (template) {
                            if (template.style && template.style.amount) {
                                let style = template.style.amount;
                                style.type = "amount";
                                style.text = "Gift Card Amount";
                                styleArr.push(style);
                            }
                            if (template.style && template.style.message) {
                                let style = template.style.message;
                                style.type = "message";
                                style.text =
                                    '"Here goes your personal message"';
                                styleArr.push(style);
                            }
                            if (template.style) {
                                styleArr.push(template.style);
                            }
                        }
                        return JSON.stringify(styleArr);
                    }
                    return JSON.stringify(styles);
                })
                .catch((err) => {
                    console.log("style fetch error", err);
                    throw config.failedResponse;
                });
        };
    }
}

export default new Retailers();
