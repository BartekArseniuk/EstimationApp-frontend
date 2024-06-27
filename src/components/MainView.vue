<template>
<v-app>

    <v-btn icon @click.stop="drawerOpen = !drawerOpen" :style="{ left: toggleButtonLeft }" class="toggle-button">
        <v-icon size="30">{{ drawerOpen ? 'mdi-chevron-left' : 'mdi-menu' }}</v-icon>
    </v-btn>

    <v-navigation-drawer app color="grey darken-3" dark v-model="drawerOpen">
        <v-list>
            <v-list-item>
                <v-img src="/logo.png" class="logo"></v-img>
                <v-list-item-title>EstimationApp</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showHome" :value="'home'" :class="{ 'selected-item': selectedComponent === 'home' }">
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Ekran główny</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isLoggedIn" @click="showClientsTable" :value="'clients'" :class="{ 'selected-item': selectedComponent === 'clients' }">
                <v-list-item-icon>
                    <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Klienci</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isLoggedIn" @click="showProjectsTable" :value="'projects'" :class="{ 'selected-item': selectedComponent === 'projects' }">
                <v-list-item-icon>
                    <v-icon>mdi-folder</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Projekty</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isLoggedIn" @click="showEstimationsTable" :value="'estimations'" :class="{ 'selected-item': selectedComponent === 'estimations' }">
                <v-list-item-icon>
                    <v-icon>mdi-chart-bar</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Wyceny</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isLoggedIn && isAdmin" @click="showAdminPanel" :value="'adminPanel'" :class="{ 'selected-item': selectedComponent === 'adminPanel' }">
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
    },
    methods: {
        showClientsTable() {
            this.selectedComponent = 'clients';
            this.currentComponentIndex = this.componentsList.indexOf('clients');
        },
        showProjectsTable() {
            this.selectedComponent = 'projects';
            this.currentComponentIndex = this.componentsList.indexOf('projects');
        },
        showEstimationsTable() {
            this.selectedComponent = 'estimations';
            this.currentComponentIndex = this.componentsList.indexOf('estimations');
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
            const token = btoa(JSON.stringify(user));
            localStorage.setItem('token', token);
            this.loginModalOpen = false;
        },
        handleLogout() {
            this.isLoggedIn = false;
            this.userName = '';
            this.isAdmin = false;
            localStorage.removeItem('token');
            this.selectedComponent = 'home';
            Swal.fire('Sukces!', 'Wylogowano pomyślnie.', 'success');
        },
        checkLoginStatus() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const user = JSON.parse(atob(token));
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
                this.selectedComponent = this.componentsList[this.currentComponentIndex];
            }
        },
        showNextComponent() {
            if (this.currentComponentIndex < this.componentsList.length - 1) {
                this.currentComponentIndex++;
                this.selectedComponent = this.componentsList[this.currentComponentIndex];
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