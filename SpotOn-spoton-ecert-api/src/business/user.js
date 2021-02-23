import MainModel from "../../data/spoton/models";
import config from "../../config/config";
import util from "./util";
import RestaurantApi from "./restaurantapi";
import Sequelize from "sequelize";
import axios from "axios";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");
require("dotenv").config();

let mainmodel = new MainModel();
let spotonschemamodels = mainmodel.models;
const sequelize = mainmodel.Conn;
let users = spotonschemamodels.users;
class Users {
    constructor() {
        this.getAllUser = () => {
            return users.findAll();
        };

        // (this.getUser = (args, password) => {
        //     console.log("in busineess of user", args.email);
        //     //   return users.findAll().then((res) => console.log(res));
        //     console.log(convert_to(args.password, "LATIN1"));
        //     return users.findOne({
        //         where: {
        //             [Op.and]: [
        //                 {
        //                     email: {
        //                         [Op.like]: args.email,
        //                     },
        //                 },
        //                 {
        //                     password: {
        //                         [Op.like]: convert_to(args.password, "LATIN1"),
        //                         //Buffer.from(args.password),
        //                     },
        //                 },
        //             ],
        //         },
        //     });
        // }),
        //     (this.getUserbyid = (args, password) => {
        //         console.log("in busineess of user", args);
        //         return users.findByPk(args.uid);
        //     });

        this.getUser = async ({ email, password }) => {
            try {
                var user = await users.findOne({ where: { email } }); // Step1: User exist check
                if (user != null) {
                    var ismatch = await bcrypt.compare(
                        password,
                        user.password.toString()
                    ); // Step2: Password check
                    if (!ismatch) {
                        console.log("wrong password ");
                        return;
                    }

                    //  JWT token.
                    console.log("SIGNED IN");
                    const accessToken = jwt.sign(
                        user.dataValues,
                        config.jwttokenkey
                    );
                    console.log(accessToken);
                    //console.log(user);
                    //console.log(config.jwttokenkey);
                    user.jwttoken = accessToken;
                    user.status = 0;
                    return user;
                }
                console.log("wrong email");
            } catch (err) {
                console.log(err);
            }
        };
    }
}
export default new Users();
