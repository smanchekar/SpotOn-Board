import Users from "../../business/user";
import config from "../../../config/config";

//const bcrypt = require("bcryptjs");

// const passwordEnteredByUser = "Wwse@123";
// const hash = "$2b$12$RWuUD34tMd6gZ9kwLopVFuHr34xf9FwUeMjKbxFBM0nrTf8Hylse.";

// //(password = bcrypt.hash(self.create_random_string()).encode("utf-8")),

// bcrypt.compare(passwordEnteredByUser, hash, function (err, isMatch) {
//     if (err) {
//         throw err;
//     } else if (!isMatch) {
//         console.log("Password doesn't match!");
//     } else {
//         console.log("Password matches!");
//     }
// });

export const resolver = {
    Query: {
        login(root, args, context) {
            console.log("inside user");

            console.log(args);

            return Users.getUser(args);
        },

        getUserbyid(root, args, context) {
            console.log("inside user");
            return Users.getUserbyid(args, context);
        },

        getAllUser() {
            return Users.getAllUser();
        },
    },
};
