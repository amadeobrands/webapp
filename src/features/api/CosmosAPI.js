import Cosmos from "@lunie/cosmos-api"

export class CosmosAPI {
  constructor(url, ledger) {
    this._url = url;
    this._ledger = ledger;
    this._cosmosAPI = null;
    return this
  }

  async init() {
    const address = await this._ledger.getKavaAddress();
    this._cosmosAPI = new Cosmos(this._url, address);
    return this._cosmosAPI;
  }

  // -----------------------------------
  //            HTTP get
  // -----------------------------------

  async getAccountAddress() {
    return await this._ledger.getKavaAddress();
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

  async signMsg(msg) {
    return await this._ledger.signer([msg]);
  }

  async broadcast(msg) {
    const signedMsg = await this.signMsg(msg)
    const { included } = await msg.send({ gas: 200000 }, signedMsg)
    // Wait for tx to be included in the blockchain
    return await included()
  }

  // -----------------------------------
  //               Msgs
  // -----------------------------------

  // Build the Send tx
  MsgSend1(sender, recipient, denom, amount) {
    const tx = {
      msg: [
        {
          type: `cosmos-sdk/Send`,
          value: {
            inputs: [
              {
                address: sender,
                coins: [{ denom: denom, amount: amount }]
              }
            ],
            outputs: [
              {
                address: recipient,
                coins: [{ denom: denom, amount: amount }]
              }
            ]
          }
        }
      ],
      fee: { amount: [{ denom: ``, amount: `0` }], gas: `20000` },
      signatures: null,
      memo: ``
    }
    return tx;
  }

  // Build the Send msg
  MsgSend2(sender, recipient, denom, amount) {
    return this._cosmosAPI.MsgSend(sender, {
      toAddress: recipient,
      amounts: [{ denom: denom, amount: amount }],
    })
  }
}
