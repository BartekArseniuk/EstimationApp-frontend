<template>
  <v-app>
    <v-navigation-drawer app color="grey darken-3" dark>
      <v-list>
        <v-list-item>
          <v-img src="/logo.png" class="logo"></v-img>
          <v-list-item-title>EstimationApp</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showClientsTable" :value="'clients'">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Klienci</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showProjectsTable" :value="'projects'">
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Projekty</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showEstimationsTable" :value="'estimations'">
          <v-list-item-icon>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Wyceny</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showAbout" :value="'about'">
          <v-list-item-icon>
            <v-icon>mdi-information</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Info</v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-divider></v-divider>
        <v-list>
          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-avatar size="40px">
                  <v-img src="/logo.png"></v-img>
                </v-avatar>
                <v-list-item-content class="ml-2">
                  <v-list-item-title>User</v-list-item-title>
                </v-list-item-content>
                <v-icon>mdi-menu-up</v-icon>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item @click="addNewUser">
                <v-list-item-action>
                  <v-icon>mdi-plus</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Dodaj nowego użytkownika</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list>
      </template>
    </v-navigation-drawer>
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
    },
    addNewUser() {
      //todo
    }
  }
};
</script>

<style>
.logo {
  height: 50px;
  width: 50px;
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
