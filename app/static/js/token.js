import * as numeral from 'numeral';

export const tokenUtil = {
  format: tokens => numeral(tokens / Math.pow(10, 6)).format('0,0.00[0000]'),
};
