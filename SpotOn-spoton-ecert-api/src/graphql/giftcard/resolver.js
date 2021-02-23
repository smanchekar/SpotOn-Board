/**
 * GiftCards Resolvers
 * GraphQL Resolver functions for GiftCards Schema, Mutations and Queries
 */

import  GiftCards from '../../business/giftcards';

export const resolver = {

    Query: {
        giftcards(root, args, context) {           
            return GiftCards.getAllGiftCards(args);     
        },

        giftcard(root, args, context) {           
            return GiftCards.getGiftCard(args);  
        },

        getcardidurl(root, args, context) {   
            console.log(args);        
            return GiftCards.getcardidurl(args);     
        },
    },

    ClaimGiftCard: {
        customStyle: (row) => {
            if (!row.customstyle) return null;
            if (row.customstyle.merchantid) return `merchant/${row.customstyle.merchantid}/style.css`;
            return `group/${row.customstyle.groupid}/style.css`;
        },
    }

};