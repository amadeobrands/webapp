import { toCanonicalJSONString, bytesToBase64 } from '@tendermint/belt';

export class CosmosAPI {
  constructor(url, chainID, ledger) {
    this._url = url;
    this._chainID = chainID;
    this._ledger = ledger;
    return this
  }

  getUrl() {
    return this._url;
  }

  async getWalletAddress() {
    return await this._ledger.getAddress();
  }

  async getAccountInfo() {
    const address = await this._ledger.getAddress();

    const accountResponse = await fetch(this._url + '/auth/accounts/' + address);
    const accountData = await accountResponse.json();

    const accountNumber = accountData.result.value.account_number.toString();
    const sequence = accountData.result.value.sequence.toString();

    return [address, accountNumber, sequence];
  }

  async signTxForMsg(msg, accountNumber, sequence) {
    const signTx = {
      account_number: accountNumber,
      chain_id: this._chainID,
      fee: { amount: [], gas: '250000' },
      memo: '',
      msgs: [msg],
      sequence: sequence,
    }

    const signMsg = toCanonicalJSONString(signTx);

    const pubKey = await this._ledger.getPubKey();
    const signature = await this._ledger.sign(signMsg);

    return {
      msg: signTx.msgs,
      fee: signTx.fee,
      memo: signTx.memo,
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
  }

  async broadcastTx(signedTx) {
    const response = await fetch(this._url + '/txs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tx: signedTx,
        mode: 'async'
      })
    });

    if (!response.ok) {
      throw new Error('could not broadcast transaction');
    }

    return response.json();
  }

  async waitForBlock(txHash, timeout = 60000) {
    const beginTime = (new Date()).getTime();
    let backoff = 500;

    return new Promise((resolve, reject) => {
     const checkTx = async() => {
       // check elapsed time against timeout
       if ((new Date()).getTime() - beginTime > timeout) {
         resolve(false);
         return;
       }

       // wait before attempting to fetch tx
       await this.sleep(backoff);

       fetch(this._url + '/txs/' + txHash).then(response => {
        // not included yet
         if (!response.ok) {
           backoff = backoff * 2;
           checkTx();
         }
         
         if(response.ok) {
          response.json().then(data => {
            // internal chain error
            if (data.code) {
              reject(data.raw_log)
              return;
            }

           // http error
           if (data.error) {
            reject(data.raw_log)
            return;
           }

           resolve(true);
           return;
          });
        }
      });
     }
    checkTx();
   })
  }

  // Sleep is a wait function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
