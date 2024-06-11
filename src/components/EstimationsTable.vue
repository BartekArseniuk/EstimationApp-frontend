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
                            <td>{{ item.project.name }}</td>
                            <td>{{ item.client.name }}</td>
                            <td>{{ item.amount }}</td>
                            <td>{{ item.created_at }}</td>
                            <td>
                                <v-icon @click="editEstimation(item)">mdi-pencil</v-icon>
                                <v-icon @click="deleteEstimation(item.id)">mdi-delete</v-icon>
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
                { text: 'Projekt', value: 'project.name' },
                { text: 'Klient', value: 'client.name' },
                { text: 'Wycena', value: 'amount' },
                { text: 'Data dodania', value: 'created_at' },
                { text: 'Akcje', value: 'actions', sortable: false },
            ],
            estimations: []
        };
    },
    computed: {
        filteredEstimations() {
            return this.estimations.filter(estimation => {
                const projectName = estimation.project ? estimation.project.name.toLowerCase() : '';
                const clientName = estimation.client ? estimation.client.name.toLowerCase() : '';
                const createdAt = estimation.created_at ? estimation.created_at.toLowerCase() : '';
                return projectName.includes(this.search.toLowerCase()) || clientName.includes(this.search.toLowerCase()) || createdAt.includes(this.search.toLowerCase());
            });
        },
    },
    created() {
        this.fetchEstimations();
    },
    methods: {
        fetchEstimations() {
            axios.get('http://localhost:8000/api/estimations').then(response => {
                this.estimations = response.data;
            }).catch(error => {
                console.error('Błąd pobierania estymacji:', error);
            });
        },
        goToAddEstimation() {
            this.$router.push({ name: 'Estimation' });
        },
        editEstimation(estimation) {
            this.$router.push({ name: 'Estimation', params: {estimationData: estimation} });
        },
        deleteEstimation(estimationId) {
            axios.delete(`http://localhost:8000/api/estimations/${estimationId}`)
                .then(response => {
                    this.estimations = this.estimations.filter(estimation => estimation.id !== estimationId);
                    window.alert('Usunięto wycenę', response);
                })
                .catch(error => {
                    console.error('Błąd usuwania wyceny:', error);
                });
        }
    },
};
</script>

<style lang="scss">
@import '../styles/tables.scss';
</style>
