require("dotenv").config();
module.exports = {
    secret: process.env.EGC_SECRET,
    assetBasePath: process.env.EGC_ASSET_BASE_PATH
        ? process.env.EGC_ASSET_BASE_PATH
        : "/var/www/",
    webBuildPath: process.env.EGC_WEB_BUILD_DIR
        ? process.env.EGC_WEB_BUILD_DIR
        : "/var/www/",
    trackingID: process.env.EGC_GOOGLE_TRACKING_ID
        ? process.env.EGC_GOOGLE_TRACKING_ID
        : "",

    status: {
        invoiceInitialStatus: "H",
        invoiceFinalStatus: "Y",
        invoiceFailedStatus: "X",
        giftCardInitialStatus: "H",
        giftCardFinalStatus: "Y",
        giftCardClaimStatus: "O",
        giftCardCancelStatus: "X",
        rcnStatus: "A",
        OK: 200,
        active: "Y",
        inactive: "N",
    },

    database: {
        dbusername: process.env.EGC_DB_USERNAME,
        dbpassword: process.env.EGC_DB_PASSWORD,
        dbhost: process.env.EGC_DB_HOSTNAME,
        dbport: process.env.EGC_DB_PORT,
        dbname: process.env.EGC_DB_NAME,
    },

    successMessage: "Success",
    failedMessage: "Something went wrong. Please try again",

    successResponse: {
        message: "Success",
        status: true,
    },

    failedResponse: {
        message: "Something went wrong. Please try again",
        status: false,
    },

    algorithm: process.env.algorithm,
    success: 0,
    failed: 1,
    timeout: process.env.EXP_TIME,
    eGiftCardApi: process.env.EGC_SPOTON_BASE_API,
    paymentTokenApi: process.env.EGC_PAYMENT_TOKEN_KEY_API,
    unavailable: "N/A",
    appPort: process.env.EGC_APP_PORT ? process.env.EGC_APP_PORT : 4040,
    defaultRetailerID: 1001,
    groupApi: process.env.EGC_SPOTON_GROUP_API,
    defaultGroupId: "1001",

    // CARRDET TYPE
    carddetType: {
        giftcard: "C",
        promocard: "P",
    },

    // CARD SECRET KEY
    cardSecret: process.env.EGC_CARD_SECRET,

    //JWT TOKEN
    jwttokenkey: process.env.ACCESS_TOKEN_SECRET,
};
