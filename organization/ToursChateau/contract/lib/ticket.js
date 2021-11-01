/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate CombinedTicket state values
const cpState = {
    ForSale: 1,
    Sold: 2
};

/**
 * CombinedTicket class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class CombinedTicket extends State {

    constructor(obj) {
        super(CombinedTicket.getClass(), [obj.chateau, obj.ticketNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getchateau() {
        return this.chateau;
    }

    setchateau(newchateau) {
        this.chateau = newchateau;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    /**
     * Useful methods to encapsulate CombinedTicket states
     */
    setForSale() {
        this.currentState = cpState.ForSale;
    }

    setSold() {
        this.currentState = cpState.Sold;
    }

    isForSale() {
        return this.currentState === cpState.ForSale;
    }

    isSold() {
        return this.currentState === cpState.Sold;
    }

    static fromBuffer(buffer) {
        return CombinedTicket.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to CombinedTicket
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, CombinedTicket);
    }

    /**
     * Factory method to create a CombinedTicket object
     */
    static createInstance(chateau, ticketNumber, promoCode,price) {
        return new CombinedTicket({ chateau, ticketNumber,promoCode,price});
    }

    static getClass() {
        return 'org.ticketnet.combinedticket';
    }
}

module.exports = CombinedTicket;
