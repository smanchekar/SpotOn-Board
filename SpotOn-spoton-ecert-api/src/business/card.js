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
let CatCardMap = spotonschemamodels.catcardmap;
class Card {
    constructor() {
        // const maxCardId = (modelname, colname) => {
        //     return modelname.findOne({
        //         attributes: [
        //             [sequelize.fn("MAX", sequelize.col(colname)), colname],
        //         ],
        //     });
        // };
        // this.addCategoryCard = async (
        //     cardIds,
        //     categoryId,
        //     carddisplayorder,
        //     options
        // ) => {
        //     console.log("retailercatgeory", cardIds, categoryId);
        //     let categorycardmap = [];
        //     for (let i = 0; i < categoryIds.length; i++) {
        //         categorycardmap[i] = {
        //             cardid: cardIds[i],
        //             catid: categoryId,
        //             carddisplayorder: carddisplayorder[i],
        //         };
        //     }
        //     console.log(categorycardmap);
        //     // await CatCardMap.bulkCreate(categorycardmap, {
        //     //     transaction: options.transaction,
        //     // });
        // };
        // this.createCard = async (args, cardid) => {
        //     try {
        //         console.log(cardid);
        //         //find max cardid
        //         let { catdesc, catid, ...other } = args;
        //         let cardObj = await maxCardId(category, "cardid");
        //         console.log("id", cardObj.cardid);
        //         // let Card = {
        //         //     cardid: cardObj.cardid + 1,
        //         //     carddesc: catdesc,
        //         // };
        //         console.log("in business", Card);
        //         await sequelize.transaction(async (t) => {
        //             let options = { transaction: t };
        //             await category.create(Category, options);
        //             let status = config.successResponse.status;
        //             let message = config.successResponse.message;
        //             return { status, message };
        //         });
        //     } catch (error) {
        //         console.log(error);
        //         return config.failedResponse;
        //     }
        // };
    }
}

export default new Card();
