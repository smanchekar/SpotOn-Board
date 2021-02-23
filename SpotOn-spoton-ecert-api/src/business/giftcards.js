import  MainModel       from '../../data/spoton/models';
import  config          from '../../config/config';
import  Retailer        from './retailers';
import Cryptr from 'cryptr';
import util from './util';
import Sequelize  from 'sequelize';

const cryptr = new Cryptr(config.secret);

let mainmodel           = new MainModel();
let spotonschemamodels  = mainmodel.models;

class GiftCards {
    constructor() {

        /**
         * Function to retrieve giftcards and it's recipient/sender information.
         * @param {*} args      arguments passed in query. 
         */
        this.getAllGiftCards = (args) => {
            return spotonschemamodels.carddet.findAll({
                attributes  : ['carddetid' , 'cardid', 'transid', 'retailerid', 'lineitemid', 'denomination', 'personalmessage'],
                include     : [{
                    model       : spotonschemamodels.card,
                    attributes  : ['carddesc', 'cardimagename', 'cardtemplate']                       
                },
                {
                    model       : spotonschemamodels.cardrecipientinfo,
                    attributes  : ['recipientname', 'recipientemail']                       
                },
                {
                    model       : spotonschemamodels.cardsenderinfo,
                    attributes  : ['sendername', 'senderemail']
                }],
                where : { retailerid: args.retailerid, transid: args.transid }
            });            
        }; 

        /**
         * Function to retrieve giftcard for claim purpose and it's recipient/sender information.
         * This function also updates the claim status for the given card, 
         * so that this card should be picked again by egift card service for mailing.
         * @param {*} args      arguments passed in query. 
         */
        this.getGiftCard = async(args) => {  
            let carddet;
            try {
                carddet = await spotonschemamodels.carddet.findOne({
                    include     : [{
                        model       : spotonschemamodels.cardrecipientinfo,
                        attributes  : ['recipientname', 'recipientemail']                       
                    },
                    {
                        model       : spotonschemamodels.cardsenderinfo,
                        attributes  : ['sendername', 'senderemail']
                    },
                    {
                        model       : spotonschemamodels.invoice,
                        attributes  : ['merchantid', 'groupid']
                    }],
                    where : { 
                        carddetid: args.cardid, 
                        clientcardsrno: args.itemid, 
                        cdstatus: {[Sequelize.Op.in]: [config.status.giftCardFinalStatus, config.status.giftCardClaimStatus]}
                    }
                });
                if (carddet) {
                    let transData = await this.validateTransaction({transId: carddet.transid});
                    let retailer = await Retailer.getRetailer(carddet.retailerid);
                    carddet.retailerid = retailer.retailerid;
                    carddet.retailername = transData.retailerName;
                    carddet.retailerlogo = transData.retailerLogo;
                    carddet.retailerprofiles = retailer.retailerprofiles;
                    let rcn = await spotonschemamodels.retailercardnumbers.findOne({
                        attributes  : ['giftcardnumber', 'cleansedgcnumber'],
                        where : { carddetid: carddet.carddetid, retailerid: carddet.retailerid}
                    });
                    if (rcn) {
                        carddet.cleansedgcnumber = rcn.cleansedgcnumber;
                        carddet.giftcardnumber = cryptr.decrypt(rcn.giftcardnumber);
                        //return carddet;
                    } 
                  
                    await spotonschemamodels.egcreminder.update({                    
                        status  : config.status.giftCardClaimStatus
                    },{where: { carddetid: carddet.carddetid}});

                    carddet.customstyle = await this.getCustomStyle({merchantid: carddet.invoice.merchantid, groupid: carddet.invoice.groupid});
                        
                    return carddet;
                }        
                   
            } catch(err) {
                console.log('errr', err);
                throw config.failedResponse;
            }

            return carddet;
        }; 

        this.getCustomStyle = async ({merchantid, groupid}) => {
            var res = await this.checkForCustomStyle({groupid, merchantid});
            if (!res) res = await this.checkForCustomStyle({groupid, merchantid: null});
            if (!res) res = await this.checkForCustomStyle({groupid: config.defaultGroupId, merchantid: null});
            return res;
        }

        this.checkForCustomStyle = ({groupid, merchantid}) => {
           return spotonschemamodels.customstyle.findOne({
                where: {
                    groupid,
                    merchantid,
                    active: 'Y',
                },
            });
        };
        
        this.getcardidurl = (args) => {              
            return spotonschemamodels.carddet.findOne({
               attributes  : ['cardimage'],
               where : { carddetid: args.carddetid}
           });
       }; 
       
         /**
         * Function to validate if provided transaction is valid or not.
         * Throws failed response object if not found. 
         * @param {*} input  input provided in mutation.
         */
       this.validateTransaction = async (input) => {                     
            if (input) {
                return spotonschemamodels.usertrans.findOne({
                    attributes  : ['usertransid','utdate','retailerid', 'merchantid'],
                    where : { usertransid: input.transId}
                }).then((ut) => {
                    if (ut) {            
                       ut = Retailer.parseMerchantJson(ut); 
                       return ut;
                    }                
                    throw config.failedResponse;
                });
            }
        }; 
        
        /**
         * Function to retrieve giftcard by Id's
         * @param {*} carddetids    array of carddetid's. 
         */
        this.getGiftCardsById = (carddetids) => {
            return spotonschemamodels.carddet.findAll({
                attributes  : ['carddetid' , 'cardid', 'transid', 'retailerid', 'lineitemid', 'denomination', 'personalmessage'],
                include     : [{
                    model       : spotonschemamodels.cardrecipientinfo,
                    attributes  : ['recipientname', 'recipientemail']                       
                },
                {
                    model       : spotonschemamodels.cardsenderinfo,
                    attributes  : ['sendername', 'senderemail']
                }],
                where : { carddetid: { [Sequelize.Op.in]: carddetids }}
            });
        }; 

        /**
         * Function to retrieve giftcard by client serial number
         * @param {*} clientsrno  client serial number. 
         */
        this.getGiftCardByClientSrno = async (invoice, clientsrno) => {
            let invItems = await spotonschemamodels.invlineitems.findAll(
                { where : { invno: invoice.invno}}
            )
            let carddets = []
            for(let i=0; i < invItems.length; i++) {
                carddets.push(invItems[i].carddetid);
            }
            let carddet = await spotonschemamodels.carddet.findOne({
                attributes  : ['carddetid' , 'cardid', 'transid', 'retailerid', 'lineitemid', 'denomination', 'personalmessage'],
                where : { 
                    clientcardsrno: clientsrno, 
                    carddetid: {[Sequelize.Op.in]: carddets}, 
                    cdstatus: config.status.giftCardInitialStatus
                }
            });    
            return carddet;    
        }; 

        /**
         * Function to retrieve giftcard by invoice no.
         * @param {*} invoice  invoice number. 
         */
        this.getGiftCardByInvoice = async (invno) => {
            let carddets=[];

            let invItems = await spotonschemamodels.invlineitems.findAll(
                { where : { invno }});

            if (invItems && invItems.length>0) {
                for(let i=0; i < invItems.length; i++) {
                    carddets.push(invItems[i].carddetid);
                }                
                carddets = await spotonschemamodels.carddet.findAll({
                    attributes  : ['carddetid' , 'cardid', 'transid', 'retailerid', 'lineitemid', 'denomination', 'personalmessage', 'clientcardsrno'],
                    where : {
                        carddetid: {[Sequelize.Op.in]: carddets}, 
                        cdstatus: config.status.giftCardInitialStatus
                    }
                });    
            }
            return carddets;    
        }; 
              
        /**
         * Function to create giftcards and it's respective recipient/sender.
         * @param retailerId retailer id associated with current transaction.
         * @param transId current transaction.
         * @param input arguments input passed in mutation.
         * @param options current transaction.
         */
       
        this.createGiftCards  = async (retailerId, transId, input, options) => {     
            let giftcards = input.giftCards;
            let carddets = [];

            for (let i = 0; i < giftcards.length; i++) {
                let giftcard = giftcards[i];     
                let carddet = await spotonschemamodels.carddet.create({
                    cardid          : giftcard.card.cardid,
                    transid         : transId,
                    retailerid      : retailerId,
                    lineitemid      : (i+1),
                    denomination    : util.formatGCValue(giftcard.denomination),
                    personalmessage : giftcard.personalmessage,
                    cardimage       : giftcard.cardimage,
                    clientid        : 1,
                    merchantid      : giftcard.merchantid,
                    shipdatetime    : giftcard.shipdate,
                    cdstatus        : config.status.giftCardInitialStatus,
                    type            : giftcard.card.type ? giftcard.card.type : config.carddetType.giftcard
                }, options);

                await spotonschemamodels.cardsenderinfo.create({
                    carddetid       : carddet.carddetid,
                    sendername      : giftcard.cardsenderinfo.sendername,
                    senderemail     : input.senderEmail,
                    shiptoself      : giftcard.cardsenderinfo.shiptoself
                }, options);   

                if (giftcard.cardsenderinfo.shiptoself === config.status.active)
                    await spotonschemamodels.cardrecipientinfo.create({
                        carddetid          : carddet.carddetid,
                        recipientname      : giftcard.cardsenderinfo.sendername,
                        recipientemail     : input.senderEmail
                    }, options);
                else
                    await spotonschemamodels.cardrecipientinfo.create({
                        carddetid          : carddet.carddetid,
                        recipientname      : giftcard.cardrecipientinfo.recipientname,
                        recipientemail     : giftcard.cardrecipientinfo.recipientemail
                    }, options);

                carddets.push(carddet);
            }  
            return carddets
        }

        /**
         * Function to update giftcards with respect to items recieved from response.
         * @param invoice  invoice data object
         * @param response response recieved from API calls.
         * @param input input recieved in args.
         */
       
        this.updateGiftCards  = async (invoice, response, input) => { 
            if (response.items && response.items.length>0) {
                let carddets = await this.getGiftCardByInvoice(invoice.invno);
                if (carddets && carddets.length >0) {
                    const items = response.items;
                    for (let i = 0; i < items.length; i++) {
                        let carddet = carddets.filter((cd) => {
                            return (cd.lineitemid === (i+1) 
                                && cd.denomination === util.formatGCValue(items[i].amount))
                        });
                        if (carddet && carddet.length> 0) {
                            await spotonschemamodels.carddet.update({                    
                                clientcardsrno  : items[i].id
                            },{
                                where: {
                                    carddetid: carddet[0].carddetid,
                                    transid: invoice.invtransid,
                                    cdstatus: config.status.giftCardInitialStatus, 
                                    lineitemid:(i+1)
                                }
                            });
                            
                            await spotonschemamodels.cardsenderinfo.update({
                                senderemail     : input.senderEmail
                            },{where: {carddetid: carddet[0].carddetid}});   
            
                        } else {
                            throw {status: false, message:'card not found.'}
                        }
                    }  
                } else {
                    throw {status: false, message:'card not found.'}
                }
            } else {
                throw {status: false, message:'items not found in response message.'}
            }
        }
        
         /**
         * Function to update giftcards based on the invoice.
         * @param invoice invoice data.
         * @param status status to update.
         */
        this.updateGiftCardsStatus  = async (invoice, status, transaction) => {   
            //return sequelize.transaction(t => {
            //    let options = { transaction : t };
                return spotonschemamodels.invlineitems.findAll({
                    attributes  : ['carddetid'],
                    where : {invno: invoice.invno}
                })
                .then((carddets) => {
                    if (carddets){
                        return carddets.reduce((promiseChain, carddet) => {
                            return promiseChain.then(currentresult => {                            
                                return spotonschemamodels.carddet.update({ 
                                    cdstatus: status
                                },
                                {
                                    where: {
                                        transid: invoice.invtransid, 
                                        carddetid: carddet.carddetid,
                                        cdstatus: config.status.giftCardInitialStatus
                                    }
                                },transaction);
                            })
                        }, Promise.resolve([]))
                    }
                    return Promise.resolve([]);                    
                });
            //});         
        }
    }
}

export default new GiftCards();