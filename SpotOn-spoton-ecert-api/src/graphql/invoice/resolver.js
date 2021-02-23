/**
 * createOrder Resolvers
 * GraphQL Resolver functions for createOrder Schema, Mutations and Queries
 */

import  Invoices               from '../../business/invoices';
export const resolver = {

    Mutation: {

        createOrder(root, args, context) {
            return Invoices.createOrder(args); 
        },
    },
};