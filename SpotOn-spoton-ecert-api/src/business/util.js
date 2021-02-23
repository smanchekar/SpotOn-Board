//import uuidv4 from "uuid/v4";
import crypto from "crypto";
import config from "../../config/config";

class Utils {

    constructor() {

        this.minutes = 1000 * 60;
        this.hours = this.minutes * 60;
        this.days = this.hours * 24;
        this.years = this.days * 365;
        this.time = function () { return (new Date()).getTime(); }
        
        /**
         * Returns Current Date Time Stamp.
         */
        this.getTimeStamp = () => {
            return (new Date().getTime());
        }

        /**
         * Creates and Returns a Universal Unique Identifier/
         */
        // this.createUUID = () => {
        //     return '{' + uuidv4() + '}';
        // }

        /**
         * Converts the TimeStamp into UTC Date.
         * @param {*} timestamp timestamp when the test was conducted.
         */
        this.getUTCDate = (timestamp) => {
            console.log(timestamp);
            return (new Date(parseInt(timestamp))).toISOString();
        }

        /**
         * Converts the TimeStamp into UTC Date.
         * @param {*} timestamp timestamp when the test was conducted.
         */
        this.getNewUTCDate = () => new Date().toUTCString();
        

        /**
         * Return Time in Milleseconds.
         * @param {*} datetime date object/string passed to function.
         */
        this.getTimeInMilliseconds = datetime => {
            return (new Date(datetime));
        }

        this.getDifferenceInDays = (date1, date2) => {
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }

        /**
         * Checks whether the current user is active or not.
         * @param {*} token JWT Token of the User.
         */
        this.verifyToken = (token) => {
            var decodedToken = jwt.verify(token, config.secret);            
            return Promise.resolve(decodedToken);
        }

        /**
         * This function returns time before 7 days from the current dayin milliseconds.
         */
        this.getLastWeekTime = () => {
            var date = new Date();
            var day = date.getDate() - 7;
            var month = date.getMonth();
            var year = date.getFullYear();

            return (new Date(year, month, day).getTime());
        }

        /**
         * This function returns time before 24 hours from the current dayin milliseconds.
         */
        this.getYesterdayTime = (date) => {
            return new Date(date - 86400000).getTime();
        }

        /**
         * Returns the diffrence in minutes between current time and time passed by the user.
         * @param {*} date
         */
        this.getMinutesDiff = date => {
            let time = this.getTimeStamp();
            let updatedTime = new Date(`'${date}'`);
            let diff = Math.abs(time - updatedTime);
            let minutes = Math.floor((diff / 1000) / 60);
            return minutes;
        }

        /**
         * Use to replace text in email with certain values.
         * @param {*} keyValueMap Key-Value Pair Array
         * @param {*} text        text to be replaced.
         */
        this.replaceText = (keyValueMap, text) => {
            let string = text;
            keyValueMap.map(n => {
                let flags = 'g'; // flag for global search
                var key = new RegExp(n.key, flags); // put key into regex to check multiple occurrences of the key.
                console.log(key);
                string = string.replace(key, n.value);
            });
            string = string.replace(/\\n/g, '\n');
            return string;
        }

        //Creates hash.
        this.createHash = value => {
            var hash = crypto.createHash('md5').update(value).digest('hex');
            return hash;
        }

        // Convert Byte Array to String
        this.byteToString = array => {
            var result = "";
            for (var i = 0; i < array.length; ++i) {
                result += (String.fromCharCode(array[i]));
            }
            return result;
        }

        // Encrypts data.
        this.encryptData = (valuetobeencrypted, key) => {
            var cipher = crypto.createCipher(config.algorithm, key);
            var crypted = cipher.update(valuetobeencrypted, 'utf8', 'hex');
            crypted += cipher.final('hex');
            return crypted;
        }


        // Decrypts data.
        this.decryptData = (valuetobedecrypted, key) => {
            //console.log("decrypt data" +valuetobedecrypted + "  " +  key);
            var decipher = crypto.createDecipher(config.algorithm, key);
            var dec = decipher.update(valuetobedecrypted, 'hex', 'utf8');
            dec += decipher.final('utf8');
            return dec;
        }

        /**
         * Use to handle response object.
         * @param {*} response response object
         */
        this.handleResponse =(invoice, response) => {
            let invoiceRef = this.formatInvoiceNo(invoice.invno,4);
            if (response) {
                let data = response.data ? {...response.data} : ''
                let isObjectData = typeof response.data === "object" ? true : false;
                if (!isObjectData) {
                    data = {message:response.data, referenceNumber: invoiceRef}
                }

                return {
                    status: response.status ? (response.status === config.status.OK ? true : false) : false,
                    message: response.status ? config.successMessage: response.message,
                    ...data,
                    referenceNumber: invoice ? invoiceRef : response.referenceNumber
                }
            }

            return  {
                status: false,
                message: config.failedMessage,
                data : '',
                referenceNumber: invoice ? invoiceRef : 'N/A'
            }
        }

        this.handleError =(invno, data) => {
            let invoiceRef = this.formatInvoiceNo(invno,4);
            if (data) {
                return {
                    ...data,
                    status: false,
                    message: data.message ? data.message : config.failedMessage,
                    referenceNumber: invoiceRef
                }     
            }
            return {
                ...config.failedResponse,
                referenceNumber: invoiceRef
            }            
        }

        this.formatInvoiceNo = (input, length) => {
            if (input) {
                let prefix = 'W';
                if (input.toString().length >= length)
                    return prefix + input;

                return prefix + Array(length - Math.floor(Math.log10(input))).join('0') + input;
            }
            return config.unavailable;
        }

        this.formatGCValue = (denomination) => {
            if (denomination) {
                return parseFloat(denomination);
            }
            return 0;
        }

        /**
         * Use to split names in first and last.
         * @param {*} data fullname
         */
        this.splitNames = (data) => {

            let names = data ? data.split(' ') || [] : undefined;
            let lastName= '';
            let firstName= ''; 
            
            if (names && names.length>1) {
                lastName= names.pop();
                firstName= names.join(' '); 
            } else {
                firstName= names.join(' '); 
            }
            
            return {firstName, lastName};
        }
    }
}

export default new Utils();