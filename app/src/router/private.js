import { router as homeRouter } from '@views/home/router';
import { router as walletRouter } from '@views/wallet/router';

const routes = [homeRouter, walletRouter];

export default routes.map(route => {
  const meta = {
    public: false,
  };
  return { ...route, meta };
});
