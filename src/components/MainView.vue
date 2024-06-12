<template>
  <v-app>
    <v-app-bar app color="blue darken-1" dark>
      <v-toolbar-title>
        <v-img src="/logo.png" height="50px" width="50px"></v-img>
      </v-toolbar-title>
      <v-btn text @click="showAbout" small>Info</v-btn>
      <v-spacer></v-spacer>
      <v-btn text @click="showClientsTable" small>Klienci</v-btn>
      <v-btn text @click="showProjectsTable" small>Projekty</v-btn>
      <v-btn text @click="showEstimationsTable" small>Wyceny</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <ClientsTable v-if="selectedComponent === 'clients'" />
        <ProjectsTable v-if="selectedComponent === 'projects'" />
        <EstimationsTable v-if="selectedComponent === 'estimations'" />
        <AboutPage v-if="selectedComponent === 'about'" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ClientsTable from './ClientsTable.vue';
import ProjectsTable from './ProjectsTable.vue';
import EstimationsTable from './EstimationsTable.vue';
import AboutPage from './AboutPage.vue';

export default {
  data() {
    return {
      selectedComponent: 'clients'
    };
  },
  components: {
    ClientsTable,
    ProjectsTable,
    EstimationsTable,
    AboutPage
  },
  methods: {
    showClientsTable() {
      this.selectedComponent = 'clients';
    },
    showProjectsTable() {
      this.selectedComponent = 'projects';
    },
    showEstimationsTable() {
      this.selectedComponent = 'estimations';
    },
    showAbout() {
      this.selectedComponent = 'about';
    }
  }
};
</script>