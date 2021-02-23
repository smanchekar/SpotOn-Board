import  MainModel       from '../../data/spoton/models';
import  config          from '../../config/config';
import  util            from './util';
import GiftCards        from './giftcards';
import RetailerCardNumbers from './retailercardnumbers';
import RestaurantApi from './restaurantapi';

let mainmodel           = new MainModel();
let spotonschemamodels  = mainmodel.models;
const sequelize         = mainmodel.Conn;

class Invoices {
    constructor() {
       
        /**
         * Function to create invoice and process order recieved through Spoton VTS.
         * 1. Validate transaction
         * 2. Create invoice data information.
         * 3. Create giftcard and lineitems.
         * 4. Call spoton VTS API and store data recieved in respective tables.
         * @param {*} args      arguments passed in mutation. 
         */
        this.createOrder = (args) => {
            return GiftCards.validateTransaction(args.input)
            .then((ut) => {
                return sequelize.transaction(t => {
                    let options = { transaction : t };
                    return this.getInvoice(ut, args.input, options)
                    .then((invoice) => {
                        return this.transactionTree(ut,invoice, args.input, options);    
                    });                     
                })
                .then((res) => {
                    return this.processTransaction(ut,args.input, res)
                    .then((trans) => {
                        if (!trans.status) {
                            console.log('error...', trans);
                            return util.handleError(res.invoice.invno,trans)
                        }
                        return {...args.input,...trans};
                    })
                    .catch((err) => {
                        console.log('catch err1',err);
                        let error = {status: false, message:err.message ? err.message : config.failedMessage}
                        return util.handleError(res.invoice.invno,error);
                    });
                });
            })
            .catch(err => {
                console.log('catch err2-----', err);
                return util.handleError();
            });
        };    

         /**
         * Function to get the invoice data. 
         * If input order timestamp doesn't change then use the same invoice. 
         * Else invalidate the invoice in hold status and create new invoice (as order has been modified)
         * @param ut user trans object.
         * @param input input recieved from mutation.
         * @param options current transaction. 
         */

        this.getInvoice = async (ut, input, options) => {

            let invoice = await spotonschemamodels.invoice.findOne(
                            { where : { 
                                invtransid: input.transId, 
                                invdate: input.orderTimestamp,
                                invstatus: config.status.invoiceInitialStatus
                            }}
                            ,options);
           
            if (invoice) { //found invoice ..return same as basket haven't changed.
                console.log('updating invoice...', invoice);
                // await spotonschemamodels.invoice.update(
                //     {invstatus: config.status.invoiceInitialStatus},
                //     {where : { invtransid: input.transId, invdate: input.orderTimestamp}},
                //     options
                // );
                return invoice;
            } 
            
            //not found ..means shopping basket has been modified.
            // previous invoice without order timestamp
            let previousInv = await spotonschemamodels.invoice.findOne(
                { where : { invtransid: input.transId, invstatus: config.status.invoiceInitialStatus}
            },options);

            if (previousInv) { 
                //invalidate giftcard in previous invoice.
                await GiftCards.updateGiftCardsStatus(previousInv, 'X', options);
                //invalidate previous invoice 
                await spotonschemamodels.invoice.update(
                    {invstatus: config.status.invoiceFailedStatus},
                    {where : { invtransid: input.transId, invstatus: config.status.invoiceInitialStatus}},
                    options
                );
            }               

            console.log('creating invoice...');
            let inv = {
                invtransid      : ut.usertransid,
                invdate         : input.orderTimestamp ? input.orderTimestamp: util.getTimeStamp(),
                invtotal        : this.totalGcValue(input),
                invstatus       : config.status.invoiceInitialStatus,
                groupid         : ut.groupId,
                merchantid      : ut.merchantId,
                retailername    : ut.retailerName,
                retailerlogo    : ut.retailerLogo
            };

            invoice = await spotonschemamodels.invoice.create(inv, options);            

            return invoice;          
        };  

         /**
         * Function to create giftcard and invoice items without Spoton VTS information.
         * @param ut user trans object. 
         * @param invoice invoice data to be inserted
         * @param input args input recieved in mutation.  
         * @param options current transaction
         */

        this.transactionTree = async (ut, invoice, input, options) => {
            //if cards already created, then use same.
            let carddets = await GiftCards.getGiftCardByInvoice(invoice.invno);
            if (!carddets || (carddets && carddets.length !== input.giftCards.length)) {
                console.log('creating createGiftCards...')
                let carddets = await GiftCards.createGiftCards(ut.retailerid,invoice.invtransid ,input, options); 
                console.log('creating createInvoiceItems...')    
                await this.createInvoiceItems(invoice, carddets, options);        
            }
            return {invoice, carddets};        
        }
        
        /**
         * Function to update the required data based on response.
         * This function
         * 1. calls Spoton VTS complete/create
         * 2. If success insert/update giftcard and invoice information recieved from API.
         * 3. If API failed return processed response returned from API.
         * @param ut user trans data object
         * @param input args input passed in mutation
         * @param data object containing invoice and card data. 
         */

        this.processTransaction = async (ut, input, data) => {
            console.log('processTransaction..');
            let response = await this.tryOrderCreation(ut, data.invoice, input);            
            let where = { invno: data.invoice.invno}
            if (response.status) {               
                const transaction = await sequelize.transaction();
                try {                    
                    //if invoice total does not match with response total from API.
                    if (util.formatGCValue(response.totalAmount) !== util.formatGCValue(data.invoice.invtotal)) {
                        console.log('processTransaction failed..', response);
                        throw {status: false, message:'Invoice total does not match.'};
                    }

                    await GiftCards.updateGiftCards(data.invoice, response, input);//update giftcard clientcardsrno

                    await RetailerCardNumbers.createRCN(data.invoice, response, transaction); 
                    console.log('updating carddet status...')
                    await GiftCards.updateGiftCardsStatus(data.invoice
                        , config.status.giftCardFinalStatus, transaction);

                    console.log('updating invoice...')
                    await spotonschemamodels.invoice.update({
                        invordernum: response.orderNumber,
                        clientordersrno: response.id,
                        invstatus: config.status.invoiceFinalStatus,
                        invtotal: response.totalAmount
                    }, { where: where }, transaction);

                    await transaction.commit();
                } catch (ex) {
                    console.log('processTransaction err', ex);
                    await transaction.rollback();
                    let error = {status: false, message:ex.message ? ex.message : config.failedMessage}
                    error = util.handleError(data.invoice.invno,error);
                    let invPayment = {  //internal error                              
                        ipdinvno            : data.invoice.invno,
                        ipdpcamt            : data.invoice.invtotal,
                        ipdpaymentstatus    : config.failed,
                        ipdpcfname          : input.ccFirstName,
                        ipdpclname          : input.ccLastName,
                        ipdemailid          : input.senderEmail,
                        ipdpcresponsemsg    : error.message ? error.message : config.failedMessage,
                        ipdpcauthreceiptno  : error.referenceNumber ? error.referenceNumber : config.unavailable,
                        ipdinvpaymenttoken  : input.paymentToken
                    }
                    await spotonschemamodels.invpaymentdetails.create(invPayment);
                    
                    return error;
                }
            } 
            return response;
        }
        
         /**
         * Function to try egiftcard create/complete API and record response in invoice transaction table.
         * @param invoice invoice table data. 
         * @param input args input passed in mutation
         */

        this.tryOrderCreation = async (ut, invoice, input) => {
            let api = new RestaurantApi();
            const giftCards = input.giftCards;            
            giftCards.forEach(card => {                
                api.pushCard(card.denomination);                
            });
            api.setPromoCards(giftCards)
            api.setMerchant(ut.merchantId);
            api.setPaymentInfo(input);

            let response = await api.createApi(); //create order
            response = util.handleResponse(invoice, response);
            if (response.status) {
                api.setOrderId(response.id);  
				console.log("orderId: " +  response.id);
                let completeRes = await api.completeApi(); //complete order
                response = util.handleResponse(invoice, completeRes);
            }

            let invPayment = {                                
                ipdinvno            : invoice.invno,
                ipdpcamt            : invoice.invtotal,
                ipdpaymentstatus    : response.status ? config.success : config.failed,
                ipdpcfname          : response.status ? response.customer.firstName: input.ccFirstName,
                ipdpclname          : response.status ? response.customer.lastName: input.ccLastName,
                ipdemailid          : input.senderEmail,
                ipdpcresponsemsg    : response.status ? config.successResponse.message: response.message,
                ipdpcnoquad         : response.status ? response.payment.cardNumber: config.unavailable,
                ipdpcauthreceiptno  : response.status ? response.id : response.referenceNumber,
                ipdcctype           : response.status ? response.payment.cardType: config.unavailable,
                ipdinvpaymenttoken  : input.paymentToken
            }
            await spotonschemamodels.invpaymentdetails.create(invPayment);
            
            return response;
        }

        /**
         * Function to record the invoice items.
         * @param invdata invoice table data. 
         * @param carddets egiftcard created.
         * @param options current trasaction.
         */

        this.createInvoiceItems = async (invdata, carddets, options) => {
            for (let i = 0; i < carddets.length; i++) {
                let invItems = {
                    invno           : invdata.invno,
                    carddetid       : carddets[i].carddetid
                };       
                await spotonschemamodels.invlineitems.create(invItems, options);
            }
        }

        /**
         * Function to calculate total value from input gc list.
         * @param input input passed in mutation
         */

        this.totalGcValue = (input) => {
            let giftcards = input.giftCards;
            let total = 0.00;            
            for (let i = 0; i< giftcards.length; i++ ) {
                if (giftcards[i].card.type !== config.carddetType.promocard) // promo card does not needs to be added in invtotal
                    total += util.formatGCValue(giftcards[i].denomination);
            }
            //console.log(total.toFixed(2));
            return total.toFixed(2);
        };

        /**
         * Function to get invoice from gift card id.
         * @param id carddet id 
         */

        this.getInvoiceByCardId = async (id) => {
            try {
                let invItem = await spotonschemamodels.invlineitems.findOne(
                    { where : { carddetid: id}});

                let invoice;
                if (invItem) {
                    invoice = await spotonschemamodels.invoice.findOne(
                        { where : {invno: invItem.invno}}
                    )
                    return {
                        invno: invoice.invno, 
                        invtransid: invoice.invtransid, 
                        ...config.successResponse
                    };
                }
            } catch (err) {
                console.log(err);
            }
            return {...config.failedResponse};
        };
    }
}

export default new Invoices();