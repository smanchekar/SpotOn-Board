import MainModel from "../../data/spoton/models";
import config from "../../config/config";
import util from "./util";
import RestaurantApi from "./restaurantapi";
import Sequelize from "sequelize";
import axios from "axios";
import { Op } from "sequelize";
import moment from "moment";
import { identity } from "lodash";
import { FragmentsOnCompositeTypesRule } from "graphql";
import Category from "./category";
let mainmodel = new MainModel();
let spotonschemamodels = mainmodel.models;
const sequelize = mainmodel.Conn;
let retailers = spotonschemamodels.retailer;
let retailerprofile = spotonschemamodels.retailerprofile;

class Retailers {
    constructor() {
        //GET ALL RETAILERS
        this.getAllRetailers = async (input, context) => {
            if (input.searchText === "") {
                const limit = input.pageSize;
                const offset = (input.pageNo - 1) * input.pageSize;
                console.log("limit", limit);
                console.log("offset", offset);

                let retailers = await spotonschemamodels.retailer.findAll({
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: spotonschemamodels.retailerprofile,
                        },
                    ],
                    order: [["retailerid", "ASC"]],
                });
                if (retailers) {
                    let status = config.successResponse.status;
                    let message = config.successResponse.message;
                    let total = await spotonschemamodels.retailer.count();
                    console.log(status, message);
                    return { retailers, total, status, message };
                } else {
                    let status = config.failedResponse.status;
                    let message = config.failedResponse.message;
                    return { retailers, total, status, message };
                }

                // .then((data) => {
                //     const count = spotonschemamodels.retailer
                //         .count()
                //         .then((res) => console.log(res));
                //     total: count;
                //     console.log(data);
                //     return data;
                // })
                // .catch((err) => {
                //     console.log("", err);
                // });
            } else {
                console.log("in search retaiers");
                return this.searchRetailers(input).then((data) => {
                    console.log("in search return", data);
                    return data;
                });
            }
        };

        this.searchRetailers = async (input) => {
            //   console.log("searchtext", input.searchText);
            // console.log("searchType", input.searchType);

            if (input.searchType === "any") {
                const limit = input.pageSize;
                const offset = (input.pageNo - 1) * input.pageSize;
                console.log("limit", limit);
                console.log("offset", offset);

                let retailers = await spotonschemamodels.retailer.findAll({
                    limit: limit,
                    offset: offset,
                    include: [
                        {
                            model: spotonschemamodels.retailerprofile,
                        },
                    ],
                    order: [["retailerid", "ASC"]],
                    where: {
                        [Op.or]: [
                            {
                                groupid: input.searchText,
                            },
                            {
                                merchantid: input.searchText,
                            },
                            {
                                retailername: {
                                    [Sequelize.Op.iLike]:
                                        input.searchText + "%",
                                },
                            },
                        ],
                    },
                });
                if (retailers.length != 0) {
                    let total = await retailers.length;
                    let status = config.successResponse.status;
                    let message = config.successResponse.message;
                    return { retailers, total, status, message };
                } else {
                    let total = await retailers.length;
                    let status = config.failedResponse.status;
                    let message = config.failedResponse.message;
                    return { retailers, total, status, message };
                }
                // .then((res) => {
                //     console.log(res);
                //     if (res.length === 0) {
                //         return [];
                //         // return spotonschemamodels.retailer.findAll({
                //         //     include: [
                //         //         {
                //         //             model:
                //         //                 spotonschemamodels.retailerprofile,
                //         //         },
                //         //     ],
                //         //     where: { groupid: config.defaultGroupId },
                //         // });
            } else {
                return res;
            }
            // });
        };
        const maxRetailerId = (modelname, colname) => {
            return modelname.findOne({
                attributes: [
                    [sequelize.fn("MAX", sequelize.col(colname)), colname],
                ],
            });
        };

        this.createRetailer = async (args, retailerId) => {
            try {
                console.log(retailerId);

                //if retailerId present then update query
                if (retailerId !== undefined) {
                    console.log("update retailer", retailerId);
                    await this.updateRetailer(retailerId, args);
                    let status = config.successResponse.status;
                    let message = config.successResponse.message;
                    return { status, message };
                } else {
                    //find max retailerid
                    let {
                        retailerName,
                        groupId,
                        merchantId,
                        categoryId,
                        ...other
                    } = args;

                    let retailerObj = await maxRetailerId(
                        retailers,
                        "retailerid"
                    );

                    console.log("id", retailerObj.retailerid);

                    let retailer = {
                        retailerid: retailerObj.retailerid + 1,
                        retailername: retailerName,
                        groupid: groupId,
                        merchantid: merchantId,
                        retaileractive: "Y",
                    };
                    console.log("in business", retailer);

                    await sequelize.transaction(async (t) => {
                        let options = { transaction: t };
                        await retailers.create(retailer, options);

                        await this.updateRetailerProfile(
                            retailerObj.retailerid + 1,
                            other,
                            options
                        );

                        await Category.addRetailerCategory(
                            retailerObj.retailerid + 1,
                            categoryId,
                            options
                        );
                    });
                    let status = config.successResponse.status;
                    let message = config.successResponse.message;
                    return { status, message };
                }
            } catch (error) {
                console.log(error);
                return config.failedResponse;
            }
        };

        this.updateRetailer = async (retailerId, args) => {
            console.log("retailerId", retailerId);
            console.log("args", args);

            let { retailerName, groupId, merchantId, ...other } = args;

            const result = await sequelize.transaction(async (t) => {
                let options = { transaction: t };
                await retailers.update(
                    {
                        retailername: retailerName,
                        groupid: groupId,
                        merchantid: merchantId,
                        retaileractive: "Y",
                    },
                    {
                        where: {
                            retailerid: retailerId,
                        },
                    }
                );
                await this.updateRetailerProfile(retailerId, other, options);
            });
        };

        this.updateRetailerProfile = async (retailerId, other, options) => {
            let retailerprofilename = Object.keys(other);
            let retailerprofilevalue = Object.values(other);
            // console.log("Key", retailerprofilename);
            //console.log("Value", retailerprofilevalue);

            let retailerProfile = [];
            for (let i = 0; i < retailerprofilename.length; i++) {
                retailerProfile[i] = {
                    retailerid: retailerId,
                    retailerprofilename: retailerprofilename[i],
                    retailerprofilevalue: retailerprofilevalue[i],
                };
            }
            console.log(retailerProfile);
            await retailerprofile.bulkCreate(retailerProfile, {
                updateOnDuplicate: ["retailerid"],
                transaction: options.transaction,
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
                    // attributes: [
                    //     "retailerid",
                    //     "retailername",
                    //     "retaileractive",
                    // ],
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
