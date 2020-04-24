import { router as loginRouter } from "@views/login/router";

const routes = [loginRouter];

export default routes.map(route => {
  const meta = {
    public: true
  };
  return { ...route, meta };
});
