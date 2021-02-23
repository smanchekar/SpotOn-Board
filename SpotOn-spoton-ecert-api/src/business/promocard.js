
import MainModel from '../../data/spoton/models';
import config from '../../config/config';
import Retailer from './retailers';

let mainmodel = new MainModel();
let spotonschemamodels = mainmodel.models;
const sequelize = mainmodel.Conn;

class PromoCard {
    constructor() {

        /**
         * Function for returning the promocards with promoConfigDtl\MinValue  <= invtotal 
         * @param {*} args - graphql request body  
         */
        this.getPromoCard = async ({input}) => {
            try {
                var {groupid, merchantid, total} = input;
                var promoconfig = await Retailer.getPromoConfig({ groupid, merchantid, total, joinDtlTable: true});
                if ( !promoconfig ) return config.failedResponse;
                return { 
                    ...promoconfig.promoconfigdtls[0].toJSON(), // select the largest minvalue
                    ...config.successResponse,
                    cards: promoconfig.category.cards,
                };
            } catch(err) {
                console.log(err);
                return config.failedResponse;
            }
        }

    }
}

export default new PromoCard();