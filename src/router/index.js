import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routerList = [
  {
    path: '/',
    redirect: '/box',
  },
  {
    path: '/map',
    component: () => import('@/components/HelloWorld'),
    hidden: true,
  },
  {
    path: '/box',
    component: () => import('@/components/Box'),
    hidden: true,
  },
  {
    path: '/cans',
    component: () => import('@/components/Cans'),
    hidden: true,
  },
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: routerList,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
