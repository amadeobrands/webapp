import Kava from '@kava-labs/javascript-sdk';
import { toCanonicalJSONString, bytesToBase64 } from '@tendermint/belt';
//const sender = await cosmosAPI.getAccountAddress();
  //const coins = Kava.utils.formatCoins(amount, denom);
  //const msgSend = Kava.msg.newMsgSend(sender, recipient, coins);

  //// NOTE: msgSend's json is formatted as:
  //// {
  ////   type: 'cosmos-sdk/MsgSend',
  ////   value: {
  ////     from_address: sender,
  ////     to_address: recipient,
  ////     amount: [{amount: String(amount), denom: String(denom)}],
  ////   }
  //// }

  //const fee = { amount: [], gas: `200000` };
  //const stdTx = Kava.msg.newStdTx([msgSend], fee, '200000');

  //const signInfo = await cosmosAPI.prepareSignInfo();
  //const signedTx = await cosmosAPI.signTx(stdTx, signInfo)
  //console.log("signedTx:", signedTx);

  //// TODO: broadcast signed transaction:
  //// await cosmosAPI.broadcastTx(signedTx);

  //// Sign and broadcast the transaction
  //// await cosmosAPI.broadcast(msgSend);
  //// dispatch(posted());
export class CosmosAPI {
  constructor(url, chainID, ledger) {
    this._url = url;
    this._chainID = chainID;
    this._ledger = ledger;
    return this
  }

  async MsgSend(recipient, denom, amount) {
    // Get Ledger Kava Address
    const sender = await this._ledger.getAddress();
    // Format coins for MsgSend JSON
    const coins = Kava.utils.formatCoins(amount, denom);
    // Create Message to include in tx
    // {
    //   type: 'cosmos-sdk/MsgSend',
    //   value: {
    //     from_address: sender,
    //     to_address: recipient,
    //     amount: [{amount: String(amount), denom: String(denom)}],
    //   }
    // }
    const msgSend = Kava.msg.newMsgSend(sender, recipient, coins);
    // Create stdTx using Kava SDK fee and gas defaults
    const stdTx = Kava.msg.newStdTx([msgSend])

    const accountResponse = await fetch(this._url + '/auth/accounts/' + sender);
    const accountData = await accountResponse.json()

    const account_number = accountData.result.value.account_number;
    const sequence = accountData.result.value.sequence;

    // object to sign
    const signTx = {
      account_number: account_number,
      chain_id: this._chainID,
      fee: stdTx.value.fee,
      memo: stdTx.value.memo,
      msgs: stdTx.value.msg,
      sequence: sequence,
    }

    console.log(signTx);

    // sort and format to json string for ledger signing
    const signMsg = toCanonicalJSONString(signTx);

    // get pubkey and signature from ledger
    const pubKey = await this._ledger.getPubKey();
    const signature = await this._ledger.sign(signMsg);

    const signedTx = {
      msg: stdTx.value.msg,
      fee: stdTx.value.fee,
      memo: stdTx.value.memo,
      signatures: [
        {
          signature: bytesToBase64(signature),
          pub_key: {
            type: 'tendermint/PubKeySecp256k1',
            value: bytesToBase64(pubKey)
          }
        }
      ]
    };

    console.log(signedTx);

    // broadcast
    const response = await fetch(this._url + '/txs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tx: signedTx,
        mode: 'sync'
      })
    });

    const data = await response.json();

    console.log(data);
  }


  //async getAccount(addr) {
  //  return await this._cosmosAPI.get.account(addr)
  //}

  //async prepareSignInfo() {
  //  // Fetch and parse account meta data 
  //  const acc = await this.getAccount(await this.getAccountAddress());

  //  let accNum;
  //  let seqNum;
  //  if(acc) {
  //    accNum = acc.account_number;
  //    seqNum = acc.sequence;
  //  }
  //  if (!(accNum || seqNum)) {
  //    console.log('Error: account number or sequence number from rest server are undefined');
  //  }

  //  // Package signing info
  //  const signInfo = {
  //    chain_id: this._chainID,
  //    account_number: accNum,
  //    sequence: seqNum,
  //  };

  //  return signInfo;
  //}

  //async signTx(tx, meta) {
  //  // TODO: create sign msg to replace createSignMessage
  //  // const signMsg = createSignMsg(tx, meta);

  //  const seq = meta.sequence;
  //  const acc = meta.account_number;
  //  const id = meta.chain_id;
  //  const signMessage = createSignMessage(tx, { seq, acc, id });

  //  // TODO: create signature using ledger
  //  // const signature = createSignature(signMsg, keyPair);
  //  // return signature
  //  return signMessage
  //}

  //async broadcast(msg) {
  //  const signer = this._ledger.getSigner();
  //  return await this.send({ gas: '250000', memo: 'kava test tx' }, msg, signer);
  //}

  //async send({ gas, gasPrices, memo = undefined }, message, signer) {
  //  const senderAddress = await this.getAccountAddress();
  //  return await this._cosmosAPI.send(senderAddress, { gas, gasPrices, memo }, message, signer)
  //}

  //async simulate({ memo = undefined }, message) {
  //  const senderAddress = await this.getAccountAddress();
  //  return await this._cosmosAPI.simulate(senderAddress, { message, memo });
  //}

}
