import { router as homeRouter } from '@views/home/router';
import { router as cosmosRouter } from '@views/cosmos/router';
import { router as walletRouter } from '@views/wallet/router';

const routes = [homeRouter, cosmosRouter, walletRouter];

export default routes.map(route => {
  const meta = {
    public: false,
  };
  return { ...route, meta };
});
