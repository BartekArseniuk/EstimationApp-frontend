<template>
  <v-app>
    <v-app-bar app color="blue darken-1" dark>
      <v-toolbar-title>EstimationApp</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="showClientsTable">Klienci</v-btn>
      <v-btn text @click="showProjectsTable">Projekty</v-btn>
      <v-btn text @click="showEstimationsTable">Wyceny</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <ClientsTable v-if="selectedComponent === 'clients'" />
        <ProjectsTable v-if="selectedComponent === 'projects'" />
        <EstimationsTable v-if="selectedComponent === 'estimations'" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ClientsTable from './ClientsTable.vue';
import ProjectsTable from './ProjectsTable.vue';
import EstimationsTable from './EstimationsTable.vue';

export default {
  data() {
    return {
      selectedComponent: 'clients'
    };
  },
  components: {
    ClientsTable,
    ProjectsTable,
    EstimationsTable
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
    }
  }
};
</script>