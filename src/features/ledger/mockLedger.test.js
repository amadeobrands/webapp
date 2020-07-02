import { MockLedger } from './mockLedger';

test('throws sequential access error', () => {
  const ledger = new MockLedger();

  expect(
    Promise.all([ledger.connect(), ledger.getCosmosAddress()])
  ).rejects.toThrow('non-sequential access!');
});
