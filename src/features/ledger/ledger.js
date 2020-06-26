import Ledger from "@lunie/cosmos-ledger"

export class CosmosLedger {
  constructor() {
    this._ledger = new Ledger(false, [44, 118, 0, 0, 0], 'kava');
  }

  async connect() {
    return this._ledger.connect();
  }

  async getAddress() {
    return this._ledger.getCosmosAddress();
  }

  getSigner() {
    return async (signMessage) => {
      const publicKey = await this._ledger.getPubKey();
      const signature = new BuffWrapper(await this._ledger.sign(signMessage));

      return {
        signature,
        publicKey
      }
    }
  }
}

// NOTE: Gives Buffer compatible interface for Uint8Array
// Cosmos API expects a toString('base64') method for
// signature encoding
class BuffWrapper {
  constructor(sig) {
    this._sig = sig;
  }
  toString(encoding) {
    if (encoding !== 'base64') {
      throw new Error('unknown encoding: ' + encoding);
    }

    return btoa(String.fromCharCode(...this._sig));
  }
}
