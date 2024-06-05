<template>
    <v-app>
        <v-card>
            <v-card-title>
                Lista klientów
                <v-btn @click="goToAddClient" small color="blue darken-1" dark>Dodaj</v-btn>
                <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="filteredClients" :search="search">
                <template v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="item in items" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td><v-img :src="item.logo" height="50px"></v-img></td>
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
    methods: {
        goToAddClient() {
            //todo
        },
        editClient() {
            //todo
        },
        deleteClient() {
            //todo
        },
    },
};
</script>

<style>
@import '../styles/tables.scss'
</style>
