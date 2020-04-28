import { ApiService } from './api.service';

export class WalletService extends ApiService {
  async fetchBalancesList(walletId) {
    return this.get(`/bank/balances/${walletId}`);
  }
  async fetchDelegatorsValidatorsList(walletId) {
    return this.get(`/staking/delegators/${walletId}/validators`);
  }
  async fetchDelegatorsDelegationsList(walletId) {
    return this.get(`/staking/delegators/${walletId}/delegations`);
  }
  async fetchDelegatorsUnbondingDelegationsList(walletId) {
    return this.get(`/staking/delegators/${walletId}/unbonding_delegations`);
  }
}
