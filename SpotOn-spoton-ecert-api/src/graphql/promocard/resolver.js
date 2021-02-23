/**
 * createOrder Resolvers
 * GraphQL Resolver functions for createOrder Schema, Mutations and Queries
 */

import  PromoCard               from '../../business/promocard';
import  Retailers               from '../../business/retailers';
import  config                  from '../../../config/config';
export const resolver = {

    Query: {

        getPromoCard(root, args, context) {
            return PromoCard.getPromoCard(args); 
        },
    },

    PromoCard: {
        promoAmount: (row) => row.dollarvalue,
        quantity   : (row) => row.status ? row.qty : 0,
    },

    PromoCardDesign: {
        styles: (row) => Retailers.getStyle(row),
        type  : (row) => config.carddetType.promocard
    }
};