import Cosmos from "@lunie/cosmos-api"

// TODO: put in config
const chainID = "testing"

export class CosmosAPI {
  constructor(url, ledger) {
    this._url = url;
    this._ledger = ledger;
    this._cosmosAPI = null;
    return this
  }

  async init() {
    this._cosmosAPI = new Cosmos(this._url, chainID);
    return this._cosmosAPI;
  }

  // -----------------------------------
  //            HTTP get
  // -----------------------------------

  async getAccountAddress() {
    return await this._ledger.getAddress();
  }

  async getBlock(height) {
    return await this._cosmosAPI.get.block(height)
  }

  async getAccount(addr) {
    return await this._cosmosAPI.get.account(addr)
  }

  // -----------------------------------
  //            HTTP options
  // -----------------------------------

  async broadcast(msg) {
    // TODO: Replace gas amount with 'gasEstimate'
    // const gasEstimate = await this.simulate({}, msg)
    // console.log("gasEstimate:", gasEstimate)

    const signer = this._ledger.getSigner();
    return await this.send({ gas: '250000' }, msg, signer);
  }

  async send({ gas, gasPrices, memo = undefined }, message, signer) {
    const senderAddress = await this.getAccountAddress();
    return await this._cosmosAPI.send(senderAddress, { gas, gasPrices, memo }, message, signer)
  }

  async simulate({ memo = undefined }, message) {
    const senderAddress = await this.getAccountAddress();
    return await this._cosmosAPI.simulate(senderAddress, { message, memo });
  }
}
