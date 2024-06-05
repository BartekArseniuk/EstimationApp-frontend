import Vue from 'vue';
import Router from 'vue-router';
import MainView from '../components/MainView.vue';
import AddClient from '@/components/AddClient.vue';
import AddProject from '../components/AddProject.vue';
import AddEstimation from '../components/AddEstimation.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'MainView',
      component: MainView
    },
    {
      path: '/add-client',
      name: 'AddClient',
      component: AddClient
    },
    {
      path: '/add-project',
      name: 'AddProject',
      component: AddProject
    },
    {
      path: '/add-estimation',
      name: 'AddEstimation',
      component: AddEstimation
    }
  ]
});
