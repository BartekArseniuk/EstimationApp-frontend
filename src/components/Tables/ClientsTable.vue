<template>
<v-container class="tab-page">
    <v-card-title>Klienci</v-card-title>
    <v-card class="table-card">
        <v-card-title>
            <v-btn v-if="isAdmin" class="add-button" @click="openModal" small color="grey darken-3" dark>
                <v-icon>mdi-plus</v-icon>Dodaj klienta
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="filteredClients" :items-per-page="5" :search="search" class="table">
            <template v-slot:body="{ items }">
                <tbody v-if="items.length > 0">
                    <tr v-for="client in items" :key="client.id">
                        <td>{{ client.id }}</td>
                        <td>{{ client.name }}</td>
                        <td><img v-if="client.logo" :src="getLogoUrl(client.logo)" height="50px" width="50px"></td>
                        <td>{{ client.country }}</td>
                        <td>{{ client.created_at }}</td>
                        <td v-if="isAdmin">
                            <v-icon @click="editClient(client)">mdi-pencil</v-icon>
                            <v-icon @click="confirmDeleteClient(client)">mdi-delete</v-icon>
                        </td>
                        <td v-else>Brak uprawnień</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="6" class="text-center">Aktualnie tabela nie posiada żadnych rekordów.</td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
    </v-card>

    <v-dialog v-model="modalOpen">
        <ClientForm :editingMode="editingMode" :editedClientId="editedClientId" @client-added="handleClientAdded" @client-updated="handleClientUpdated" @cancel="closeModal" ref="clientForm" />
    </v-dialog>
</v-container>
</template>

<script>
import axios from 'axios';
import ClientForm from '../Modals/ClientForm.vue';
import Swal from 'sweetalert2';

export default {
    props: {
        isAdmin: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            search: '',
            headers: [{
                    text: 'L.p.',
                    value: 'id'
                },
                {
                    text: 'Nazwa',
                    value: 'name'
                },
                {
                    text: 'Logotyp',
                    value: 'logo'
                },
                {
                    text: 'Kraj',
                    value: 'country'
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
            clients: [],
            modalOpen: false,
            editedClientId: null,
            editingMode: false,
        };
    },
    computed: {
        filteredClients() {
            return this.clients.filter(client => {
                return client.created_at.toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    created() {
        this.fetchClients();
    },
    components: {
        ClientForm,
    },
    methods: {
        fetchClients() {
            axios.get('http://localhost:8000/api/clients')
                .then(response => {
                    this.clients = response.data;
                })
                .catch(error => {
                    console.error('Błąd pobierania klientów:', error);
                });
        },
        openModal() {
            this.modalOpen = true;
            this.editingMode = false;
            this.$nextTick(() => {
                this.$refs.clientForm.resetForm();
            });
        },
        closeModal() {
            this.modalOpen = false;
            this.editedClientId = null;
            this.editingMode = false;
            this.$refs.clientForm.resetForm();
        },
        handleClientAdded(newClient) {
            this.clients.push(newClient);
            this.closeModal();
        },
        handleClientUpdated() {
            this.fetchClients();
            this.closeModal();
        },
        editClient(client) {
            this.editedClientId = client.id;
            this.editingMode = true;
            this.modalOpen = true;
            this.$nextTick(() => {
                this.$refs.clientForm.editClient(client);
            });
        },
        confirmDeleteClient(client) {
            axios.get('http://localhost:8000/api/projects')
                .then(response => {
                    const projects = response.data;
                    const clientProjects = projects.filter(project => project.client_id === client.id);

                    console.log('Client projects:', clientProjects);

                    if (clientProjects.length > 0) {
                        Swal.fire({
                            title: 'Klient ma przypisane projekty!',
                            text: 'Jeśli usuniesz klienta, jego projekty również zostaną usunięte. Czy na pewno chcesz kontynuować?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Tak, usuń klienta',
                            cancelButtonText: 'Anuluj',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.deleteClient(client.id);
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Czy na pewno chcesz usunąć tego klienta?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Tak, usuń klienta',
                            cancelButtonText: 'Anuluj',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.deleteClient(client.id);
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Błąd pobierania projektów:', error);
                });
        },
        deleteClient(clientId) {
            axios.delete(`http://localhost:8000/api/clients/${clientId}`)
                .then(() => {
                    this.clients = this.clients.filter(client => client.id !== clientId);
                    Swal.fire('Usunięto!', 'Klient został pomyślnie usunięty.', 'success');
                })
                .catch(error => {
                    console.error('Błąd usuwania klienta:', error);
                    Swal.fire('Błąd!', 'Wystąpił problem podczas usuwania klienta.', 'error');
                });
        },
        getLogoUrl(base64String) {
            return 'data:image/png;base64,' + base64String;
        },
    },
};
</script>

<style>
@import '../../styles/tables.scss'
</style>