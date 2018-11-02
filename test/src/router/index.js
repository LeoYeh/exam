/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
  ],
});


Vue.filter('tmrFmt', (num) => {
  const dt = new Date(num)
  const hh = dt.getHours()
  const mm = dt.getMinutes()
  const ss = dt.getSeconds()
  return `${hh}:${mm}:${ss}`
});
