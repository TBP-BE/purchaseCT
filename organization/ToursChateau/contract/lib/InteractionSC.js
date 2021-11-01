/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const CombinedTicket = require('./ticket.js');
const TicketList = require('./ticketlist.js');

/**
 * A custom context provides easy access to list of all tickets
 */
class CombinedTicketContext extends Context {

    constructor() {
        super();
        // All tickets are held in a list of papers
        this.ticketList = new TicketList(this);
    }

}

/**
 * Define ticket smart contract by extending Fabric Contract class
 *
 */
class InteractionSC extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.ticketnet.combinedticket');
    }

    /**
     * Define a custom context for CombinedTicket
    */
    createContext() {
        return new CombinedTicketContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Issue CombinedTicket
     *
     * @param {Context} ctx the transaction context
     * @param {String} chateau ticket chateau
     * @param {String} ticketNumber ticket number for this chateau
     * @param {String} promocode ticket issue 
     * @param {Integer} price of paper
    */
    async sellCombinedTicket(ctx, chateau, ticketNumber,promoCode,price) {

        // create an instance of the ticket
        let ticket = CombinedTicket.createInstance(chateau, ticketNumber, promoCode, price);

        // Smart contract, rather than ticket, moves ticket into FORSALE state
        ticket.setForSale();

        // Newly issued paper is owned by the chateau
        ticket.setOwner(chateau);

        // Add the paper to the list of all similar CombinedTicket in the ledger world state
        await ctx.ticketList.addTicket(ticket);

        // Must return a serialized paper to caller of smart contract
        return ticket;
    }

    /**
     * Buy CombinedTicket
     *
     * @param {Context} ctx the transaction context
     * @param {String} chateau ticket chateau
     * @param {string} ticketNumber ticket number for this chateau
     * @param {String} currentOwner current owner of ticket
     * @param {String} newOwner new owner of ticket
    */
    async buyCombinedTicket(ctx, chateau, ticketNumber, currentOwner, newOwner) {

        // Retrieve the current paper using key fields provided
        let ticketKey = CombinedTicket.makeKey([chateau, ticketNumber]);
        let ticket = await ctx.ticketList.getTicket(ticketKey);

        // Validate current owner
        if (ticket.getOwner() !== currentOwner) {
            throw new Error('Ticket ' + chateau + ticketNumber + ' is not owned by ' + currentOwner);
        }

        if (ticket.isForSale()) {
            ticket.setOwner(newOwner);
            ticket.setSold();


        } else {
            throw new Error('Ticket ' + chateau + ticketNumber + ' is not ForSale. Current state = ' +ticket.getCurrentState());
        }

        // Update the paper
        await ctx.ticketList.updateTicket(ticket);
        return ticket;
    }

}

module.exports = InteractionSC;
