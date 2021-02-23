export const constants = {
    // USER_ROLE: {
    //     SUPERADMIN: { id: 1, label: "Super Admin" },
    //     COMPANYADMIN: { id: 2, label: "Company Admin" },
    //     SALESREP: { id: 3, label: "Sales Rep" },
    // },
    // BASE_URL: "http://10.6.6.132:4000/",
    // // BASE_URL : "http://10.6.6.132:5000/",
    // // BASE_URL : "https://10.6.6.106:7000/",
    // MASTERTABLE_ENUMS: {
    //     state: "1",
    // },
    // ERROR_TYPE: {
    //     TOKEN_EXPIRED: 401,
    //     NO_CONNECTION: 0,
    // },
    // CATEGORY_TYPES: {
    //     LANDSCAPING: { type: 1, header: "Landscaping types and quantity" },
    //     HARDSCAPING: { type: 2, header: "Hardscaping types and quantity" },
    //     OUTDOOR_STRUCTURE: {
    //         type: 3,
    //         header: "Outdoor structure types and quantity",
    //     },
    //     OUTDOOR_KITCHEN: {
    //         type: 4,
    //         header: "Outdoor kitchen types and quantity",
    //     },
    //     LANDSCAPING_LIGHTING: {
    //         type: 5,
    //         header: "Landscaping lighting types and quantity",
    //     },
    //     IRRIGATION: { type: 6, header: "Irrigation types and quantity" },
    //     WATER_FEATURE: { type: 7, header: "Water features types and quantity" },
    // },
    // STRINGS: {
    //     SUBCATEGORY: "Service Group",
    //     PRODUCT_ARRAY: "Product Array",
    // },
    // SIDER_WIDTH: "27%",
    // HEADER_BG_COLOR: "white",
    // APP_BG_COLOR: "#FFFFFF",
    // MENU_BG_COLOR: "whhite",
    // MENU_OPTION_COLOR: "#708238",
    // MAX_ALLOWED_PHOTOS: 5,
    // ADD_EDIT_BIT_CUSTOMER: {
    //     add: 1,
    //     edit: 2,
    // },
    // VARIABLE_SPECIFIC_ENUM: {
    //     ADD_PRODUCT: "ADD PRODUCT",
    //     CUSTOM_QTY: "CUSTOM QTY",
    //     FIX_QTY: "FIX QTY",
    //     PERCENTAGE_QTY: "PERCENTAGE QTY",
    //     FIX_PRICE: "FIX PRICE",
    //     CUSTOM_PRICE: "CUSTOM PRICE",
    // },
    // DEFAULT_COMPANY: 86,

    /*********************************************/

    USER_ROLE: {
        ADMIN: 1,
        USER: 2,
    },
    // BASE_URL: "http://10.6.6.132:4040/",
    BASE_URL: "http://192.168.56.1:4040",

    BASE_IMAGE_URL: "https://spoton-test.s3.ap-south-1.amazonaws.com/images/",

    PAGINATION: {
        PAGE_SIZE: 5,
        PAGE_SIZE_OPTIONS: ["5", "10", "15", "20"],
    },

    MIN_PASSWORD_LENGTH: 8,

    ADMIN_ROUTES: [
        { path: "/profile", title: "Profile" },
        { path: "/users", title: "Users Management" },
        { path: "/orders", title: "Orders" },
    ],

    USER_ROUTES: [
        { path: "/profile", title: "Profile" },
        { path: "/orders", title: "Orders" },
    ],

    // if basename is not defined then basename will default to root
    CS_PORTAL_BASENAME: "/customer-service",
};
