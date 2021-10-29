/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const CombinedTicket = require('./ticket.js');

class TicketList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.ticketnet.combinedticketlist');
        this.use(CombinedTicket);
    }

    async addTicket(ticket) {
        return this.addState(ticket);
    }

    async getTicket(ticketKey) {
        return this.getState(ticketKey);
    }

    async updateTicket(ticket) {
        return this.updateState(ticket);
    }
}


module.exports = TicketList;
