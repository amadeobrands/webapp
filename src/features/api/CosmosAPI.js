import Cosmos, {createSignMessage} from '@lunie/cosmos-api'

export class CosmosAPI {
  constructor(url, chainID, ledger) {
    this._url = url;
    this._chainID = chainID;
    this._ledger = ledger;
    this._cosmosAPI = null;
    return this
  }

  async init() {
    this._cosmosAPI = new Cosmos(this._url, this._chainID);
    return this._cosmosAPI;
  }

  async getAccountAddress() {
    return await this._ledger.getAddress();
  }

  async getBlock(height) {
    return await this._cosmosAPI.get.block(height)
  }

  async getAccount(addr) {
    return await this._cosmosAPI.get.account(addr)
  }

  async prepareSignInfo() {
    // Fetch and parse account meta data 
    const acc = await this.getAccount(await this.getAccountAddress());

    let accNum;
    let seqNum;
    if(acc) {
      accNum = acc.account_number;
      seqNum = acc.sequence;
    }
    if (!(accNum || seqNum)) {
      console.log('Error: account number or sequence number from rest server are undefined');
    }

    // Package signing info
    const signInfo = {
      chain_id: this._chainID,
      account_number: accNum,
      sequence: seqNum,
    };

    return signInfo;
  }

  async signTx(tx, meta) {
    // TODO: create sign msg to replace createSignMessage
    // const signMsg = createSignMsg(tx, meta);

    const seq = meta.sequence;
    const acc = meta.account_number;
    const id = meta.chain_id;
    const signMessage = createSignMessage(tx, { seq, acc, id });

    // TODO: create signature using ledger
    // const signature = createSignature(signMsg, keyPair);
    // return signature
    return signMessage
  }

  async broadcast(msg) {
    const signer = this._ledger.getSigner();
    return await this.send({ gas: '250000', memo: 'kava test tx' }, msg, signer);
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
