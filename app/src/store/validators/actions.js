import { services } from '@services/index';
import { SET_VALIDATORS_LIST, SET_VALIDATORS_DICT} from './mutations';

export const FETCH_VALIDATORS_LIST = 'FETCH_VALIDATORS_LIST';
export const FETCH_VALIDATORS_DICT = 'FETCH_VALIDATORS_DICT';


export const actions = {
  [FETCH_VALIDATORS_LIST]: async ({ commit, state, getters, dispatch }) => {
    const responseValidators = await services.validator.fetchValidatorsList();
    commit(SET_VALIDATORS_LIST, responseValidators.data.result);
  },

  [FETCH_VALIDATORS_DICT]: async ({ commit, state, getters, dispatch }) =>{
    let statuses = ['UNBONDED','UNBONDING','BONDED']
    let validators_dict = {}

    for(status of statuses){
      var responseValidators = await services.validator.fetchValidatorsList({status : "BOND_STATUS_" + status});
      // Build a validator dict with  index= address and value= moniker
      if (responseValidators.data.result){
        for (var val in responseValidators.data.result){
          validators_dict[responseValidators.data.result[val].operator_address] =  {
                                                                                    moniker: responseValidators.data.result[val].description.moniker,
                                                                                    status:  status
                                                                                    }
        }
      }
    }
    commit(SET_VALIDATORS_DICT, validators_dict);
  },
};
