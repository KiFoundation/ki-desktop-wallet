import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import util from '@static/js/util';

import publicRoutes from './public';
import privateRoutes from './private';

import PublicLayout from '@cmp/public-layout';
import PrivateLayout from '@cmp/private-layout';

export const routes = [...publicRoutes, ...privateRoutes];

const router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: PublicLayout,
      children: [
        ...publicRoutes,
        {
          path: '/',
          name: 'home',
          component: PrivateLayout,
          children: [...privateRoutes],
        },
      ],
    },
    {
      path: '*',
      redirect: {
        name: 'login'
      },
    },
  ],
});

router.beforeResolve(async (to, from, next) => {

  const identity = await localStorage.getItem('identity_kichain');
  var account_name = false;
  var account_ = false;

  if (identity) {
    try {
      account_name = JSON.parse(identity).accountName
      account_ = localStorage.getItem(account_name);
    } catch (e) {
      console.log(e)
    }
  }

  var proceed = account_name && account_ && identity
  console.log(proceed)

  if (!to.meta.public && !proceed) {
    next({
      name: 'login'
    });
  } else {
    next();
  }
});

export default router;