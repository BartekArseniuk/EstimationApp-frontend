<template>
  <v-app>
    <v-btn icon @click.stop="drawerOpen = !drawerOpen" :style="{ left: toggleButtonLeft }" class="toggle-button">
      <v-icon size="30">{{ drawerOpen ? 'mdi-chevron-left' : 'mdi-menu' }}</v-icon>
    </v-btn>

    <v-navigation-drawer app color="grey darken-3" dark v-model="drawerOpen">
      <v-list>
        <v-list-item>
          <v-img src="/logo.png" class="logo" alt="EstimationApp Logo"></v-img>
          <v-list-item-title>EstimationApp</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-for="item in filteredMenuItems"
          :key="item.value"
          @click="showTable(item.value)"
          :class="{ 'selected-item': selectedComponent === item.value }"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
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
        <transition name="slide-fade" mode="out-in">
          <ClientsTable v-if="selectedComponent === 'clients'" :isAdmin="isAdmin" />
          <ProjectsTable v-if="selectedComponent === 'projects'" :isAdmin="isAdmin" />
          <EstimationsTable v-if="selectedComponent === 'estimations'" :isAdmin="isAdmin" />
          <HomePage v-if="selectedComponent === 'home'" />
          <AdminPanel v-if="selectedComponent === 'adminPanel' && isAdmin" />
        </transition>
        <v-row v-if="showNavigationArrows" class="navigation-arrows">
          <v-btn icon @click="showPreviousComponent" :disabled="currentComponentIndex === 0" class="arrow-btn">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon @click="showNextComponent" :disabled="currentComponentIndex === componentsList.length - 1" class="arrow-btn">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="loginModalOpen">
      <LoginForm @close="loginModalOpen = false" @login-success="handleLoginSuccess" />
    </v-dialog>
  </v-app>
</template>

<script>
import ClientsTable from './Tables/ClientsTable.vue';
import ProjectsTable from './Tables/ProjectsTable.vue';
import EstimationsTable from './Tables/EstimationsTable.vue';
import HomePage from './HomePage.vue';
import AdminPanel from './Tables/AdminPanel.vue';
import LoginForm from './Modals/LoginForm.vue';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      selectedComponent: 'home',
      drawerOpen: true,
      loginModalOpen: false,
      isLoggedIn: false,
      userName: '',
      isAdmin: false,
      componentsList: ['clients', 'projects', 'estimations'],
      currentComponentIndex: 0,
      menuItems: [
        { value: 'home', title: 'Ekran główny', icon: 'mdi-home' },
        { value: 'clients', title: 'Klienci', icon: 'mdi-account-multiple', requiresAuth: true },
        { value: 'projects', title: 'Projekty', icon: 'mdi-folder', requiresAuth: true },
        { value: 'estimations', title: 'Wyceny', icon: 'mdi-chart-bar', requiresAuth: true },
        { value: 'adminPanel', title: 'Panel administratora', icon: 'mdi-key', requiresAdmin: true },
      ],
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
  computed: {
    toggleButtonLeft() {
      return this.drawerOpen ? '270px' : '20px';
    },
    showNavigationArrows() {
      return this.selectedComponent !== 'home' && this.selectedComponent !== 'adminPanel';
    },
    filteredMenuItems() {
      return this.menuItems.filter(item => {
        if (item.requiresAuth && !this.isLoggedIn) return false;
        if (item.requiresAdmin && !this.isAdmin) return false;
        return true;
      });
    },
  },
  methods: {
    showTable(value) {
      this.selectedComponent = value;
      this.currentComponentIndex = this.componentsList.indexOf(value);
    },
    handleLogin() {
      this.loginModalOpen = true;
    },
    handleLoginSuccess(user) {
      this.isLoggedIn = true;
      this.userName = user.name;
      this.isAdmin = user.role === 'admin';
      const UserData = btoa(JSON.stringify(user));
      localStorage.setItem('UserData', UserData);
      this.loginModalOpen = false;
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.userName = '';
      this.isAdmin = false;
      localStorage.removeItem('AuthToken');
      localStorage.removeItem('UserData');
      this.showTable('home');
      Swal.fire('Sukces!', 'Wylogowano pomyślnie.', 'success');
    },
    checkLoginStatus() {
      const UserData = localStorage.getItem('UserData');
      if (UserData) {
        try {
          const user = JSON.parse(atob(UserData));
          this.isLoggedIn = true;
          this.userName = user.name;
          this.isAdmin = user.role === 'admin';
        } catch (e) {
          this.handleLogout();
        }
      }
    },
    showPreviousComponent() {
      if (this.currentComponentIndex > 0) {
        this.currentComponentIndex--;
        this.showTable(this.componentsList[this.currentComponentIndex]);
      }
    },
    showNextComponent() {
      if (this.currentComponentIndex < this.componentsList.length - 1) {
        this.currentComponentIndex++;
        this.showTable(this.componentsList[this.currentComponentIndex]);
      }
    },
  },
};
</script>

<style>
.toggle-button {
  top: 20px;
  left: 270px;
  z-index: 100;
  transition: left 0.2s ease;
}

.logo {
  height: 50px;
  width: 50px;
  margin-right: 10px;
  margin-bottom: 5px;
}

.selected-item {
  background-color: #787878;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

.navigation-arrows {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.arrow-btn {
  border-radius: 50%;
  margin: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.arrow-btn:disabled {
  background-color: #E0E0E0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-active {
  transform: translateX(-100%);
  opacity: 0;
}
</style>