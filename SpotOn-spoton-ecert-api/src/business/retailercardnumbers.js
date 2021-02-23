import  MainModel       from '../../data/spoton/models';
import  config          from '../../config/config';
import  util            from './util';
import Cryptr from 'cryptr';
import GiftCards        from './giftcards';

const cryptr = new Cryptr(config.secret);

let mainmodel           = new MainModel();
let spotonschemamodels  = mainmodel.models;

class RetailerCardNumbers {
    constructor() {
        
        /**
         * Function to create Retailercardnumbers
         * @param invoice invoice data object
         * @param response response recieved from giftcards complete request.
         */
        this.createRCN  = async (invoice, response, transaction) => {         
            const items = response.items;
            let carddets = await GiftCards.getGiftCardByInvoice(invoice.invno);
            for (let i = 0; i< items.length; i++ ) {
                let item = items[i];
                let carddet = carddets.filter((cd) => { return cd.clientcardsrno === item.id});
                if (carddet && carddet.length >0) {
                    let rcn = {
                        serialnumber    : item.id,
                        retailerid      : carddet[0].retailerid,
                        carddetid       : carddet[0].carddetid,
                        giftcardnumber  : cryptr.encrypt(item.giftCardNumber),
                        amount          : item.amount,
                        cleansedgcnumber: item.name,
                        receivedate     : util.getTimeStamp(),
                        status          : config.status.rcnStatus
                    };                        
                    await spotonschemamodels.retailercardnumbers.create(rcn, transaction);
                } else {
                    throw {...config.failedResponse};
                }
            }
        }
    }
    
}

export default new RetailerCardNumbers();