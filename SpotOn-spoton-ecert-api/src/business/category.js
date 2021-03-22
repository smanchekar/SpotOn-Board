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
let card = spotonschemamodels.card;
let RetailerCategoryMap = spotonschemamodels.retailercategorymap;
let CatCardMap = spotonschemamodels.catcardmap;

class Category {
    constructor() {
        //Get All Categories
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

        //Get Max Category Id
        const findmaxId = (modelname, colname) => {
            return modelname.findOne({
                attributes: [
                    [sequelize.fn("MAX", sequelize.col(colname)), colname],
                ],
            });
        };

        //Add Cards
        this.addCards = async (args, catid, options) => {
            console.log("adding cards.....", args);
            const { carddesc, cardimagename } = args;
            console.log(carddesc);
            console.log(cardimagename);
            //get max cardid
            let cardObj = await findmaxId(card, "cardid");

            console.log(cardObj.cardid);
            let cardData = [];
            let j = 1;
            for (let i = 0; i < carddesc.length; i++) {
                cardData[i] = {
                    cardid: cardObj.cardid + j,
                    carddesc: carddesc[i],
                    cardimagename: cardimagename[i],
                    cardtemplate: "",
                };
                j++;
            }
            await card.bulkCreate(cardData, {
                transaction: options.transaction,
            });
            console.log("cards addded in db");
            await this.addCatCardMap(cardData, catid, options);
        };

        this.addCatCardMap = async (cards, catid, options) => {
            console.log("in AddCatCardmap");
            console.log(cards, catid);

            let catcardmap = [];
            for (let i = 0; i < cards.length; i++) {
                catcardmap[i] = {
                    cardid: cards[i].cardid,
                    catid: catid,
                    carddisplayorder: i + 1,
                };
            }
            console.log(catcardmap);
            await CatCardMap.bulkCreate(catcardmap, {
                transaction: options.transaction,
            });
            console.log("catcard map successfull");
        };

        //Add data to RetailerCategoryMap
        this.addRetailerCategory = async (retailerId, categoryIds, options) => {
            console.log("ihn addretailercategory", retailerId, categoryIds);
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

        //Create new Category ,Cards
        this.createCategory = async (args) => {
            try {
                let { categoryname, ...other } = args;

                let catObj = await findmaxId(category, "catid");

                let Category = {
                    catid: catObj.catid + 1,
                    catdesc: categoryname[0],
                    catdisplayorder: null,
                };
                console.log("in business", Category);

                await sequelize.transaction(async (t) => {
                    let options = { transaction: t };

                    await category.create(Category, options);

                    //Add Cards
                    await this.addCards(other, Category.catid, options);
                });
                let status = config.successResponse.status;
                let message = config.successResponse.message;
                console.log(status, message);
                return { status, message };
            } catch (error) {
                console.log(error);
                return config.failedResponse;
            }
        };
    }
}

export default new Category();
