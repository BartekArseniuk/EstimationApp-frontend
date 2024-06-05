<template>
    <v-app>
        <v-card class="table-card">
            <v-card-title>
                Lista estymacji
                <v-btn class="add-button" @click="goToAddEstimation" small color="blue darken-1" dark>Dodaj</v-btn>
                <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="filteredEstimations" :search="search" class="table">
                <template v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="item in items" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.project }}</td>
                            <td>{{ item.client }}</td>
                            <td>{{ item.estimate }}</td>
                            <td>{{ item.created_at }}</td>
                            <td>
                                <v-icon @click="editClient(item)" class="action-button">mdi-pencil</v-icon>
                                <v-icon @click="deleteClient(item.id)" class="action-button">mdi-delete</v-icon>
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
                { text: 'Projekt', value: 'project' },
                { text: 'Klient', value: 'client' },
                { text: 'Wycena', value: 'estimate' },
                { text: 'Data dodania', value: 'created_at' },
                { text: 'Akcje', value: 'actions', sortable: false },
            ],
            estimations: []
        };
    },
    computed: {
        filteredEstimations() {
            return this.estimations.filter(estimation => {
                return estimation.project.toLowerCase().includes(this.search.toLowerCase()) || estimation.client.toLowerCase().includes(this.search.toLowerCase()) || estimation.created_at.toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    methods: {
        goToAddEstimation() {
            this.$router.push({ name: 'AddEstimation' });
        },
        editEstimation() {
            //todo
        },
        deleteEstimation() {
            //todo
        },
    },
};
</script>

<style lang="scss">
@import '../styles/tables.scss';
</style>