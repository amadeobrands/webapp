import Cosmos from "@lunie/cosmos-api"

export class CosmosAPI {
  constructor(url, ledger) {
    this._url = url;
    this._ledger = ledger;
    this._cosmosAPI = null;
    return this
  }

  async init() {
    const address = await this._ledger.getAddress();
    this._cosmosAPI = new Cosmos(this._url, address);
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
  //            HTTP post
  // -----------------------------------

  async broadcast(msg) {
    const signer = this._ledger.getSigner();
    const { included } = await msg.send({ gas: 200000 }, signer)
    return included()
  }

  // -----------------------------------
  //               Msgs
  // -----------------------------------

  MsgSend(sender, recipient, denom, amount) {
    return this._cosmosAPI.MsgSend(sender, {
      toAddress: recipient,
      amounts: [{ denom: denom, amount: amount }],
    })
  }
}
