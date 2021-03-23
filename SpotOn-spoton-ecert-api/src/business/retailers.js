import MainModel from "../../data/spoton/models";
import config from "../../config/config";
import util from "./util";

import Sequelize from "sequelize";
import axios from "axios";
import { Op } from "sequelize";
import moment from "moment";
import { identity } from "lodash";
import { FragmentsOnCompositeTypesRule } from "graphql";
import Category from "./category";
//let category = spotonschemamodels.category;
let mainmodel = new MainModel();
let spotonschemamodels = mainmodel.models;
const sequelize = mainmodel.Conn;
let retailers = spotonschemamodels.retailer;
let retailerprofile = spotonschemamodels.retailerprofile;

class Retailers {
    constructor() {
        //GET ALL RETAILERS
        this.getAllRetailers = async (input, context) => {
            try {
                if (input.searchText === "") {
                    const limit = input.pageSize;
                    const offset = (input.pageNo - 1) * input.pageSize;
                    // console.log("limit", limit);
                    //console.log("offset", offset);

                    let retailers = await spotonschemamodels.retailer.findAll({
                        limit: limit,
                        offset: offset,
                        include: [
                            {
                                model: spotonschemamodels.retailerprofile,
                            },
                            {
                                model: spotonschemamodels.category,
                                as: "retailercategory",
                            },
                        ],
                        order: [["retailerid", "ASC"]],
                    });

                    //  console.log(retailers);

                    if (retailers) {
                        let status = config.successResponse.status;
                        let message = config.successResponse.message;
                        let total = await spotonschemamodels.retailer.count();
                        // console.log(status, message, retailers);
                        return {
                            retailers,
                            total,
                            status,
                            message,
                        };
                    } else {
                        let status = config.failedResponse.status;
                        let message = config.failedResponse.message;
                        return { retailers, total, status, message };
                    }
                } else {
                    console.log("in search retaiers");
                    return this.searchRetailers(input).then((data) => {
                        console.log("in search return", data);
                        return data;
                    });
                }
            } catch (error) {
                console.log(error);
                return config.failedResponse;
            }
        };

        this.searchRetailers = async (input) => {
            //   console.log("searchtext", input.searchText);
            // console.log("searchType", input.searchType);

            if (input.searchType === "any") {
                const limit = input.pageSize;
                const offset = (input.pageNo - 1) * input.pageSize;

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

        this.createEditRetailer = async (args, retailerId) => {
            try {
                console.log(args);

                //if retailerId present then update query
                if (retailerId !== undefined) {
                    //  console.log("update retailer", retailerId);
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
                        console.log(categoryId);
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
            console.log(other);
            const { categoryId, ...profile } = other;
            console.log(categoryId);
            let retailerprofilename = Object.keys(profile);
            let retailerprofilevalue = Object.values(profile);
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
    }
}

export default new Retailers();
