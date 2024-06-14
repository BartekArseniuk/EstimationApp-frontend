<template>
    <v-app>
        <v-card-title>
            Klienci
        </v-card-title>
        <v-card class="table-card">
            <v-card-title>
                <v-btn class="add-button" @click="goToAddClient" small color="grey darken-4" dark>
                    <v-icon>mdi-plus</v-icon>
                    Dodaj klienta
                </v-btn>
                <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="filteredClients" :items-per-page="5" :search="search"
                class="table">
                <template v-slot:body="{ items }">
                    <tbody v-if="items.length > 0">
                        <tr v-for="item in items" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td><img v-if="item.logo" :src="getLogoUrl(item.logo)" height="50px" width="50px"></td>
                            <td>{{ item.country }}</td>
                            <td>{{ item.created_at }}</td>
                            <td>
                                <v-icon @click="editClient(item)">mdi-pencil</v-icon>
                                <v-icon @click="deleteClient(item.id)">mdi-delete</v-icon>
                            </td>
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
    </v-app>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            search: '',
            headers: [
                { text: 'L.p.', value: 'id' },
                { text: 'Nazwa', value: 'name' },
                { text: 'Logotyp', value: 'logo' },
                { text: 'Kraj', value: 'country' },
                { text: 'Data dodania', value: 'created_at' },
                { text: 'Akcje', value: 'actions', sortable: false },
            ],
            clients: []
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
        goToAddClient() {
            this.$router.push({ name: 'Client' });
        },
        editClient(client) {
            this.$router.push({ name: 'Client', params: { clientData: client } });
        },
        deleteClient(clientId) {
            axios.get('http://localhost:8000/api/projects')
                .then(response => {
                    const projects = response.data;
                    const clientProjects = projects.filter(project => project.client_id === clientId);

                    console.log('Client projects:', clientProjects);

                    if (clientProjects.length > 0) {
                        const confirmDelete = window.confirm('Klient ma przypisane projekty. Jeśli usuniesz klienta, jego projekty również zostaną usunięte. Czy na pewno chcesz kontynuować?');
                        if (!confirmDelete) {
                            return;
                        }
                    }

                    axios.delete(`http://localhost:8000/api/clients/${clientId}`)
                        .then(() => {
                            this.clients = this.clients.filter(client => client.id !== clientId);
                            window.alert('Usunięto klienta');
                        })
                        .catch(error => {
                            console.error('Błąd usuwania klienta:', error);
                        });
                })
                .catch(error => {
                    console.error('Błąd pobierania projektów:', error);
                });
        },
        getLogoUrl(base64String) {
            return 'data:image/png;base64,' + base64String;
        }
    },
};
</script>

<style>
@import '../styles/tables.scss'
</style>