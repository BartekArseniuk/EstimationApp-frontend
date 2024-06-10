<template>
    <v-app>
        <v-card class="table-card">
            <v-card-title>
                Lista klientów
                <v-btn class="add-button" @click="goToAddClient" small color="blue darken-1" dark>Dodaj</v-btn>
                <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="filteredClients" :search="search" class="table">
                <template v-slot:body="{ items }">
                    <tbody>
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
            axios.get('http://localhost:8000/api/clients').then(response => {
                this.clients = response.data;
            }).catch(error => {
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
            axios.delete(`http://localhost:8000/api/clients/${clientId}`)
                .then(response => {
                    this.clients = this.clients.filter(client => client.id !== clientId);
                    window.alert('Usunięto klienta', response);
                })
                .catch(error => {
                    console.error('Błąd usuwania klienta:', error);
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
