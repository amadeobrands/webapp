export const TEST_PUB_KEY = new Uint8Array([0,255, 100, 34, 58]); // dummy data
export const TEST_COSMOS_ADDRESS = 'some kava address';

/**
 * Represents a mocked ledger device. Intended for development
 * and testing only.
 *
 * All methods mimic async IO by returning on next tick and throw
 * when accessed in parallel to simulate real ledger device.
 */
export class MockLedger {
  /**
   * Create a MockLedger instance to mimic a ledger device
   */
  constructor() {
    this.connected = false;
    this.busy = false;
    this.cosmosApp = null;
  }

  /** Mimic an async operation to connect */
  async connect() {
    return this._execute_async(async () => {
      this.connected = true;
    });
  }

  /**
    * Retrieve 'tendermint/PubKeySecp256k1' public key for development and testing.
    * @return {Uint8Array} A byte array representing the tendermint/PubKeySecp245k1 pubkey.
    */
  async getPubKey() {
    return this._execute_async(async () => {
      return TEST_PUB_KEY;
    });
  }

  /**
    * Retreive kava bech32 address for development and testing.
    * @return {string} A Bech32 formmated kava address.
    */
  async getCosmosAddress() {
    return this._execute_async(async () => {
      return TEST_COSMOS_ADDRESS;
    });
  }

  /**
   * Sign tendermint transaction for broadcast for development and testing.
   * @param {string} message - A canonical JSON serialized transaction to sign.
   * @return {Uint8Array} A byte array representing the transaction signature.
   */
  async sign(message) {
    return this._execute_async(async () => {
      return new Uint8Array([4,5,1,140,300]) // dummy data
    });
  }


  /**
   * Checks if we are currenlty performing another async
   * operation and throws if so.
   * @private
   */
  _check_or_set_busy() {
    if (this.busy) {
      throw new Error('non-sequential access!');
    }

    this.busy = true;
  }

  /**
   * Reset busy status
   * @private
   */
  _set_not_busy(fn) {
    return (...args) => {
      fn(...args);
      this.busy = false;
    }
  }

  /**
   * Mimics an async call to a ledger device
   * using setTimeout to perform function
   * in next event loop
   * @private
   */
  _execute_async(fn) {
    this._check_or_set_busy();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fn()
          .then(this._set_not_busy(resolve))
          .catch(this._set_not_busy(reject));
      }, 1);
    });
  }

}
