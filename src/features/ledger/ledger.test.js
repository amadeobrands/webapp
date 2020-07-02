import { MockLedger, TEST_PUB_KEY, TEST_COSMOS_ADDRESS } from './mockLedger';
import { CosmosLedger } from './ledger';

describe('CosmosLedger', () => {
  const ledger = new MockLedger();
  const cosmosLedger = new CosmosLedger(ledger);

  test('connects ledger device with sequential protection', async () => {
    ledger.connected = false;

    await Promise.all([cosmosLedger.connect(), cosmosLedger.connect()])

    expect(ledger.connected).toBe(true);
  });

  test('returns pubkey from ledger with sequential protection', async () => {
    const keys = await Promise.all([cosmosLedger.getPubKey(), cosmosLedger.getPubKey()]);

    expect(keys).toStrictEqual([TEST_PUB_KEY, TEST_PUB_KEY]);
  });

  test('returns cosmos address from ledger with sequential protection', async () => {
    const addresses = await Promise.all([cosmosLedger.getAddress(), cosmosLedger.getAddress()]);

    expect(addresses).toStrictEqual([TEST_COSMOS_ADDRESS, TEST_COSMOS_ADDRESS]);
  });

  test('allows the ledger cosmosApp to be reset', () => {
    ledger.cosmosApp = {};
    cosmosLedger.reset();

    expect(ledger.cosmosApp).toBe(null);
  });

  test('allows signing of messages with sequential protection', async () => {
    const message1 = 'message1';
    const message2 = 'message2';

    const signedMessages = await Promise.all([cosmosLedger.sign(message1), cosmosLedger.sign(message2)]);

    expect(signedMessages[0]).toStrictEqual(await cosmosLedger.sign(message1));
    expect(signedMessages[1]).toStrictEqual(await cosmosLedger.sign(message2));
  });

  test('all methods enforce sequential calls with each other', async () => {
    const message = 'some message';

    await Promise.all([
      cosmosLedger.connect(),
      cosmosLedger.getPubKey(),
      cosmosLedger.getAddress(),
      cosmosLedger.sign(message),
    ]);
  });

  test('errors are returned to the correct callers during sequential calls', async () => {
    const errors = [ 'could not connect', 'error getting pub key', 'invalid hd path', 'user rejected message'];

    const connectSpy = jest.spyOn(ledger, 'connect').mockRejectedValue(new Error(errors[0]));
    const getPubKeySpy = jest.spyOn(ledger, 'getPubKey').mockRejectedValue(new Error(errors[1]));
    const getCosmosAddressSpy = jest.spyOn(ledger, 'getCosmosAddress').mockRejectedValue(new Error(errors[2]));
    const signSpy = jest.spyOn(ledger, 'sign').mockRejectedValue(new Error(errors[3]));


    const cosmosLedgerErrors = await Promise.allSettled([
      cosmosLedger.connect(),
      cosmosLedger.getPubKey(),
      cosmosLedger.getAddress(),
      cosmosLedger.sign('message'),
    ]);

    expect(cosmosLedgerErrors.map(e => e.reason.toString())).toStrictEqual(errors.map(e => 'Error: ' + e));

    connectSpy.mockRestore();
    getPubKeySpy.mockRestore();
    getCosmosAddressSpy.mockRestore();
    signSpy.mockRestore();
  });
});


