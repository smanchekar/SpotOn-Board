import MainModel from "../../data/spoton/models";
import config from "../../config/config";
// import util from "./util";
// import RestaurantApi from "./restaurantapi";
// import Sequelize from "sequelize";
// import axios from "axios";
// import { Op } from "sequelize";
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

        /**
         * Returns a single user.
         * @param {*} uid Unique ID of user
         */
        this.getUserById = (uid) => users.findOne({ where: { uid } });

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
                        return {
                            status: config.failed,
                            message: config.errors.wrongPassword,
                        };
                    }

                    //  JWT token.
                    console.log("SIGNED IN");
                    const accessToken = jwt.sign(
                        user.dataValues,
                        config.jwttokenkey
                    );
                    // console.log(accessToken);
                    //console.log(user);
                    //console.log(config.jwttokenkey);
                    user.jwttoken = accessToken;
                    user.status = config.successResponse.status;
                    user.message = config.successResponse.message;
                    user.token = accessToken;
                    //console.log(user);
                    return user;
                } else {
                    console.log("wrong email");
                    return {
                        status: config.failed,
                        message: config.errors.invalidEmail,
                    };
                }
            } catch (err) {
                console.log(err);
            }
        };
    }
}
export default new Users();
