import 	axios from 'axios';
import  config  from '../../config/config';
import util from './util';

class RestaurantApi {
	constructor() {    
		const headers = {
			"Content-Type": "application/json"
		}

		this.merchantid ='';

		this.createApiData = {
			cards: []
		}

		/**
         * Function to push cards that needs to send to Spoton VTS.
         * @param amount amount of a card
         * 
         */

		this.pushCard = (amount) => {
			this.createApiData.cards.push({"amount" : amount});
		}

		/**
         * Function to push promo card amount that needs to send to Spoton VTS.
         * @param giftcards array of cards
         * 
         */

		this.setPromoCards = (giftcards) => {
			var promoAmount = 0;
			giftcards.forEach(giftcard => {
				if (giftcard.card.type === config.carddetType.promocard)
					promoAmount += util.formatGCValue(giftcard.denomination);
			});
			if (promoAmount > 0) {
				this.createApiData.promoAmount = promoAmount.toString();
				this.createApiData.secretKey = config.cardSecret;
			}
		}

		
		/**
         * Function set merchant id for Spoton VTS.
         * @param id merchant id 
         * 
         */

		this.setMerchant =(id) => {
			this.merchantid = id;
		}

		this.paymentInfo =  {
			vtsPaymentInfo: {
				paymentToken: "", 
				firstName: "", 
				lastName: "", 
				address1: "", 
				address2: "", 
				city: "", 
				state: "", 
				postalCode: "", 
			}
		};

		this.customer =  {
			firstName : "", 
			lastName: "", 
			email: "", 
			phoneNo: ""
		};

		this.ComplateApiData = {
			paymentInfo : this.paymentInfo,
			customer: this.customer
		};

		/**
         * Function set payment info request Spoton VTS.
         * @param input input recieved from mutation.
         * 
         */
		this.setPaymentInfo = (input) => {
			const {
				paymentToken,
				ccFirstName,
				ccLastName,
				postalCode 
			} = {...input};

			this.paymentInfo = {
				vtsPaymentInfo : {
					paymentToken,
					postalCode: postalCode,
					firstName : ccFirstName,
					lastName : ccLastName
				}
			};
			
			console.log(this.merchantid);
			this.ComplateApiData = {
				paymentInfo: this.paymentInfo
			}
			this.setCustomer(input);	
		}

		/**
         * Function set customer info in Spoton VTS request.
         * @param input input recieved from mutation.
         * 
         */
		this.setCustomer = (input) => {
			const {
				senderEmail,
				ccFirstName,
				ccLastName,
				ccTelephone,
			} = {...input};

			this.customer = {
				email:senderEmail,
				firstName: ccFirstName,
				lastName: ccLastName,
				phoneNo:ccTelephone
			};
		}

		/**
         * Function to set order id returned from create call response from Spoton VTS. 
         */

		this.setOrderId = (id) =>{
			this.orderid = id;
		}

		/**
         * Function to call Spoton VTS giftcard complete request. 
         */
		this.completeApi = async () => { 
			try {
				const ReqCompleteapi =
					config.eGiftCardApi + this.merchantid +
					"/egc-orders/"+
					this.orderid + 
					"/complete";        
					
				this.ComplateApiData = {
					paymentInfo: this.paymentInfo,
					customer: this.customer
				}

				let res = await axios.post(ReqCompleteapi          
					,JSON.stringify(this.ComplateApiData)
					,{headers: headers});
				return Promise.resolve(res);
			} catch(err) {
				console.log(err, "======== error");
				return Promise.resolve(err.response);
			}
				
		}

		/**
         * Function to call Spoton VTS giftcard create request. 
		 * This function require cards amount array in request body to be set before this call.
         */
		this.createApi = async () => {
			try {
				console.log(JSON.stringify(this.createApiData));
				const ReqCreateapi = 
					config.eGiftCardApi + this.merchantid +
					"/egc-orders/";   
				console.log(ReqCreateapi);
				let res = await axios.post(ReqCreateapi
					,JSON.stringify(this.createApiData),{headers: headers});
				return Promise.resolve(res);
			} catch (err) {
				console.log("=======error========", err, this.createApiData);			
				return Promise.resolve(err.response);
			}		
		}

		/**
         * Function to call Spoton VTS for valid tokenization key. 
		 * This function require merchant id to be set before calling this.
         */
		this.getPaymentTokenKey = async () => {
			try {
				const ReqTokenKey = 
					config.paymentTokenApi+ this.merchantid
					+ "?json_only";   
				let res = await axios.get(ReqTokenKey);
				return Promise.resolve(res);
			} catch (err) {
				console.log("=======error========", err);			
				return Promise.resolve({data:{nmi_tokenization_key:''}});
			}		
		}

		/**
         * Function to call Spoton API, to pull group data from merchantid.
         */
		this.getMerchantInfo = async () => {
			try {
				const Request = 
					config.groupApi + '?merchantId='+ this.merchantid;
				let res = await axios.get(Request);
				return Promise.resolve(res);
			} catch (err) {
				console.log("=======error========", err);			
				return Promise.resolve(err.response);
			}		
		}
	}  
}

export default RestaurantApi;
