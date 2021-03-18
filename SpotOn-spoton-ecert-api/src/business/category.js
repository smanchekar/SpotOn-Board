import MainModel from "../../data/spoton/models";
import config from "../../config/config";
import util from "./util";
import Sequelize from "sequelize";
import axios from "axios";
import { Op } from "sequelize";

let mainmodel = new MainModel();
let spotonschemamodels = mainmodel.models;
const sequelize = mainmodel.Conn;
let retailers = spotonschemamodels.retailer;
let retailerprofile = spotonschemamodels.retailerprofile;
let category = spotonschemamodels.category;
let RetailerCategoryMap = spotonschemamodels.retailercategorymap;
class Category {
    constructor() {
        this.getCategory = async () => {
            try {
                let categories = await category.findAll();
                let status = config.successResponse.status;
                let message = config.successResponse.message;

                return { categories, status, message };
            } catch (err) {
                let status = config.failedResponse.status;
                let message = config.failedResponse.message;
                return { categories, status, message };
            }
        };

        const maxCategoryId = (modelname, colname) => {
            return modelname.findOne({
                attributes: [
                    [sequelize.fn("MAX", sequelize.col(colname)), colname],
                ],
            });
        };

        this.addRetailerCategory = async (retailerId, categoryIds, options) => {
            console.log("retailercatgeory", retailerId, categoryIds);

            let retailercategorymap = [];
            for (let i = 0; i < categoryIds.length; i++) {
                retailercategorymap[i] = {
                    retailerid: retailerId,
                    catid: categoryIds[i],
                };
            }
            console.log(retailercategorymap);
            await RetailerCategoryMap.bulkCreate(retailercategorymap, {
                transaction: options.transaction,
            });
        };

        // this.createCategory = async (args, catid) => {
        //     try {
        //         console.log(catid);
        //         //find max catid
        //         let { catdesc, catid, ...other } = args;
        //         let catObj = await maxCategoryId(category, "catid");
        //         console.log("id", catObj.catid);
        //         let Category = {
        //             catid: catObj.catid + 1,
        //             catdesc: catdesc,
        //         };
        //         console.log("in business", Category);
        //         await sequelize.transaction(async (t) => {
        //             let options = { transaction: t };
        //             await category.create(Category, options);

        //         //         let status = config.successResponse.status;
        //         //         let message = config.successResponse.message;
        //         //         return { status, message };
        //         //     }
        //     } catch (error) {
        //         console.log(error);
        //         return config.failedResponse;
        //     }
        // };
    }
}

export default new Category();
