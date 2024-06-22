<template>
  <v-app>

    <v-btn icon @click.stop="drawerOpen = !drawerOpen" class="toggle-button">
      <v-icon size="30">{{ drawerOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
    </v-btn>

    <v-navigation-drawer app color="grey darken-3" dark v-model="drawerOpen">
      <v-list>
        <v-list-item>
          <v-img src="/logo.png" class="logo"></v-img>
          <v-list-item-title>EstimationApp</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showHome" :value="'home'">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Ekran główny</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isLoggedIn" @click="showClientsTable" :value="'clients'">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Klienci</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isLoggedIn" @click="showProjectsTable" :value="'projects'">
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Projekty</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isLoggedIn" @click="showEstimationsTable" :value="'estimations'">
          <v-list-item-icon>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Wyceny</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isLoggedIn && isAdmin" @click="showAdminPanel" :value="'adminPanel'">
          <v-list-item-icon>
            <v-icon>mdi-key</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Panel administratora</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list>
          <v-list-item>
            <v-icon size="30">mdi-account</v-icon>
            <v-list-item>
              <v-list-item-title v-if="isLoggedIn">{{ userName }}</v-list-item-title>
              <v-list-item-title v-else @click="handleLogin" style="cursor: pointer;">Zaloguj się</v-list-item-title>
            </v-list-item>
            <v-icon v-if="isLoggedIn" @click="handleLogout" size="30">mdi-logout</v-icon>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <ClientsTable v-if="selectedComponent === 'clients'" />
        <ProjectsTable v-if="selectedComponent === 'projects'" />
        <EstimationsTable v-if="selectedComponent === 'estimations'" />
        <HomePage v-if="selectedComponent === 'home'" />
        <AdminPanel v-if="selectedComponent === 'adminPanel' && isAdmin" />
      </v-container>
    </v-main>
    
    <v-dialog v-model="loginModalOpen">
      <LoginForm @close="loginModalOpen = false" @login-success="handleLoginSuccess" />
    </v-dialog>
  </v-app>
</template>

<script>
import ClientsTable from './ClientsTable.vue';
import ProjectsTable from './ProjectsTable.vue';
import EstimationsTable from './EstimationsTable.vue';
import HomePage from './HomePage.vue';
import AdminPanel from './AdminPanel.vue';
import LoginForm from './Modals/LoginForm.vue';

export default {
  data() {
    return {
      selectedComponent: 'home',
      drawerOpen: true,
      loginModalOpen: false,
      isLoggedIn: false,
      userName: '',
      isAdmin: false,
    };
  },
  components: {
    ClientsTable,
    ProjectsTable,
    EstimationsTable,
    HomePage,
    AdminPanel,
    LoginForm,
  },
  created() {
    this.checkLoginStatus();
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
    showHome() {
      this.selectedComponent = 'home';
    },
    showAdminPanel() {
      this.selectedComponent = 'adminPanel';
    },
    handleLogin() {
      this.loginModalOpen = true;
    },
    handleLoginSuccess(user) {
      this.isLoggedIn = true;
      this.userName = user.name;
      this.isAdmin = user.role === 'admin';
      localStorage.setItem('user', JSON.stringify(user));
      this.loginModalOpen = false;
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.userName = '';
      this.isAdmin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.selectedComponent = 'home';
      window.alert('Wylogowano pomyślnie.');
    },
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.isLoggedIn = true;
        const parsedUser = JSON.parse(user);
        this.userName = parsedUser.name;
        this.isAdmin = parsedUser.role === 'admin';
      }
    },
  },
};
</script>

<style>
.toggle-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.logo {
  height: 50px;
  width: 50px;
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>