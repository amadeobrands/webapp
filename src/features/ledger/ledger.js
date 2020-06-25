import Ledger from "@lunie/cosmos-ledger"

export class CosmosLedger {
  constructor() {
    this._ledger = new Ledger(false, [44, 118, 0, 0, 0], 'kava');
  }

  async connect() {
    return this._ledger.connect();
  }

  async getKavaAddress() {
    return this._ledger.getCosmosAddress();
  }
}
