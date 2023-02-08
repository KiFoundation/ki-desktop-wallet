import { createRouter, createWebHashHistory } from 'vue-router';

import publicRoutes from './public';
import privateRoutes from './private';

import PublicLayout from '@cmp/public-layout/index.vue';
import PrivateLayout from '@cmp/private-layout/index.vue';

export const routes = [...publicRoutes, ...privateRoutes];

const router = createRouter({
  history: createWebHashHistory(),
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: PublicLayout,
      name: 'publicHome',
      meta: {
        public: true,
      },
      children: [
        ...publicRoutes,
        {
          path: '/',
          name: 'privateHome',
          component: PrivateLayout,
          meta: {
            public: false,
          },
          children: [...privateRoutes],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const identity = await localStorage.getItem('identity_kichain');
  if (to.matched.some((record) => record.meta.public === false)) {
    if (identity) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
