import Ledger from "@lunie/cosmos-ledger"

const testModeAllowed = false;
const hdPath = [44, 118, 0, 0, 0];
const bech32Prefix = 'kava';

function newDefaultLedgerInstance() {
  return new Ledger(testModeAllowed, hdPath, bech32Prefix);
}

/**
  * Class representing a ledger device running a cosmos app
  * and enforces sequential access to the underlying ledger instance.
  */
export class CosmosLedger {
  /**
   * Create a CosmosLedger instance for a ledger device.
   *
   * Note: Once instance should be used across the entire application
   *
   * @param {Ledger} ledger - An instance from '@lunie/cosmos-ledger'.
   */
  constructor(ledger = newDefaultLedgerInstance()) {
    this._ledger = ledger;
    this._op_lock = false;
    this._operations = [];
  }

  /** Connect to ledger device. */
  async connect() {
    return this._queue_op(this._ledger.connect);
  }

  /** Reset and clear ledger app connection. */
  reset() {
    this._ledger.cosmosApp = null;
  }

  /**
    * Retreive kava bech32 address from device.
    * @return {string} A Bech32 formmated kava address.
    */
  async getAddress() {
    return this._queue_op(this._ledger.getCosmosAddress);
  }

  /**
    * Retrieve 'tendermint/PubKeySecp256k1' public key from device.
    * @return {Uint8Array} A byte array representing the tendermint/PubKeySecp245k1 pubkey.
    */
  async getPubKey() {
    return this._queue_op(this._ledger.getPubKey);
  }

  /**
   * Sign tendermint transaction for broadcast on device.
   * @param {string} signMessage - A canonical JSON serialized transaction to sign.
   * @return {Uint8Array} A byte array representing the transaction signature.
   */
  async sign(signMessage) {
    return this._queue_op(this._ledger.sign, signMessage);
  }

  /**
   * Queues the ledger operation returning a Promise that resolves
   * with the result
   *
   * @param {Promise} ledgerFn A async ledger function
   * @param {...*} ...args Arguments for the ledger function
   * @returns {Promise} A Promise that resolves with the result of the ledger operation
   * @private
   */
  _queue_op(ledgerFn, ...args) {
    const op = new Promise((resolve, reject) => {
      this._operations.push([ledgerFn, args, resolve, reject]);
    });

    if (this._op_lock) {
      return op;
    }

    this._op_lock = true;
    this._perform_ops();

    return op;
  }

  /**
   * Recursively calls ledger operations in a FIFO manner
   * @private
   */
  _perform_ops() {
    if (this._operations.length === 0) {
      this._op_lock = false;
      return;
    }

    const [fn, args, resolve, reject] = this._operations.shift();

    fn.call(this._ledger, ...args)
      .then(this._next_op(resolve))
      .catch(this._next_op(reject));
  }

  /**
   * Calls the provided function and continues calling ledger operations
   * @private
   */
  _next_op = (fn) => {
    return (...args) => {
      fn(...args);
      this._perform_ops();
    }
  }
}
