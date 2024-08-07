<template>
<v-container class="tab-page">
    <v-card-title class="title">Panel Administratora</v-card-title>
    <v-card-title>
        <v-btn color="grey darken-3" dark small @click="openRegisterModal">
            <v-icon>mdi-plus</v-icon>Dodaj użytkownika
        </v-btn>
    </v-card-title>
    <v-card class="table-card">
        <v-data-table :headers="headers" :items="users" :items-per-page="5" class="table">
            <template v-slot:body="{ items }">
                <tbody v-if="items.length > 0">
                    <tr v-for="(user, index) in items" :key="user.id" :class="{ 'inactive-row': index === 0 && !user.isActive }">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.created_at }}</td>
                        <td v-if="index !== 0 || user.isActive">
                            <v-icon @click="editUser(user)">mdi-pencil</v-icon>
                            <v-icon @click="confirmDeleteUser(user.id)">mdi-delete</v-icon>
                        </td>
                        <td v-else colspan="5">Brak akcji</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="5" class="text-center">Aktualnie tabela nie posiada żadnych rekordów.</td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
    </v-card>

    <v-dialog v-model="registerModalOpen">
        <RegisterForm :editingMode="editingMode" :editedUserId="editedUserId" @close="registerModalOpen = false" @register-success="handleRegisterSuccess" @user-updated="handleUserUpdated" ref="userForm" />
    </v-dialog>
</v-container>
</template>

<script>
import Swal from 'sweetalert2';
import RegisterForm from '../Modals/RegisterForm.vue';
import apiService from '@/config';

export default {
    data() {
        return {
            headers: [{
                    text: 'L.p.',
                    value: 'id'
                },
                {
                    text: 'Nazwa',
                    value: 'name'
                },
                {
                    text: 'Email',
                    value: 'email'
                },
                {
                    text: 'Data dodania',
                    value: 'created_at'
                },
                {
                    text: 'Akcje',
                    value: 'actions',
                    sortable: false
                },
            ],
            users: [],
            registerModalOpen: false,
            editedUserId: null,
            editingMode: false
        };
    },
    components: {
        RegisterForm
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        fetchUsers() {
            apiService.get('/users')
                .then(response => {
                    this.users = response.data;
                })
                .catch(error => {
                    console.error('Błąd pobierania użytkowników:', error);
                });
        },
        editUser(user) {
            this.editedUserId = user.id;
            this.editingMode = true;
            this.registerModalOpen = true;
            this.$nextTick(() => {
                if (this.$refs.userForm) {
                    this.$refs.userForm.editUser(user);
                }
            });
        },
        confirmDeleteUser(userId) {
            Swal.fire({
                title: 'Czy na pewno chcesz usunąć użytkownika?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tak, usuń',
                cancelButtonText: 'Anuluj',
            }).then(result => {
                if (result.isConfirmed) {
                    this.deleteUser(userId);
                }
            });
        },
        deleteUser(userId) {
            apiService.delete(`/users/${userId}`)
                .then(() => {
                    this.users = this.users.filter(user => user.id !== userId);
                    Swal.fire('Usunięto!', 'Użytkownik został pomyślnie usunięty.', 'success');
                })
                .catch(error => {
                    console.error('Błąd usuwania użytkownika:', error);
                    Swal.fire('Błąd!', 'Wystąpił problem podczas usuwania użytkownika.', 'error');
                });
        },
        openRegisterModal() {
            this.registerModalOpen = true;
            this.editingMode = false;
            this.$nextTick(() => {
                if (this.$refs.userForm) {
                    this.$refs.userForm.resetForm();
                }
            });
        },
        handleRegisterSuccess(user) {
            this.users.push(user);
            this.registerModalOpen = false;
        },
        handleUserUpdated() {
            this.fetchUsers();
            this.registerModalOpen = false;
        }
    }
};
</script>

<style>
@import '../../styles/tables.scss';

.inactive-row {
    background-color: #f2f2f2;
    opacity: 0.7;
}
</style>