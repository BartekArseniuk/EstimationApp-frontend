import Vue from 'vue';
import Router from 'vue-router';
import MainView from '@/components/MainView.vue';
import AddClient from '@/components/ClientForm.vue';
import AddProject from '@/components/ProjectForm.vue';
import AddEstimation from '@/components/EstimationForm.vue';

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
      path: '/client',
      name: 'Client',
      component: AddClient
    },
    {
      path: '/project',
      name: 'Project',
      component: AddProject
    },
    {
      path: '/estimation',
      name: 'Estimation',
      component: AddEstimation
    }
  ]
});
