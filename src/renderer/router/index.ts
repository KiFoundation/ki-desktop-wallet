import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

import publicRoutes from './public';
import privateRoutes from './private';

import PublicLayout from '@cmp/public-layout/index.vue';
import PrivateLayout from '@cmp/private-layout/index.vue';

export const routes = [...publicRoutes, ...privateRoutes];

const router = createRouter({
  history: import.meta.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        ...publicRoutes,
        {
          path: '/',
          component: PrivateLayout,
          children: [...privateRoutes],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: {
        name: 'login',
      },
    },
  ],
});

router.beforeResolve(async (to, from, next) => {
  const identity = await localStorage.getItem('identity_kichain');
  var proceed = identity;

  if (!to.meta.public && !proceed) {
    next({
      name: 'login',
    });
  } else {
    next();
  }
});

export default router;
