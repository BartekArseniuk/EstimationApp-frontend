<template>
    <v-container>
        <v-card-title>Wyceny</v-card-title>
        <v-card class="table-card">
            <v-card-title>
                <v-btn class="add-button" @click="openModal" small color="grey darken-3" dark>
                    <v-icon>mdi-plus</v-icon>
                    Dodaj wycenę
                </v-btn>
                <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="filteredEstimations" :items-per-page="5" :search="search"
                class="table">
                <template v-slot:body="{ items }">
                    <tbody v-if="items.length > 0">
                        <tr v-for="estimation in items" :key="estimation.id">
                            <td>{{ estimation.id }}</td>
                            <td>{{ estimation.name }}</td>
                            <td>{{ estimation.project.name }}</td>
                            <td>{{ estimation.client?.name }}</td>
                            <td>{{ estimation.amount }}</td>
                            <td>{{ estimation.created_at }}</td>
                            <td>
                                <v-icon @click="editEstimation(estimation)">mdi-pencil</v-icon>
                                <v-icon @click="deleteEstimation(estimation.id)">mdi-delete</v-icon>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="7" class="text-center">Aktualnie tabela nie posiada żadnych rekordów.</td>
                        </tr>
                    </tbody>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="modalOpen">
            <EstimationForm :editingMode="editingMode" :editedtEstimationId="editedEstimationId"
                @estimation-added="handleEstimationAdded" @estimation-updated="handleEstimationUpdated"
                @cancel="closeModal" ref="estimationForm" />
        </v-dialog>
    </v-container>
</template>

<script>

import axios from 'axios';
import EstimationForm from './Modals/EstimationForm.vue';

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
            estimations: [],
            modalOpen: false,
            editedEstimationId: null,
            editingMode: false,
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
    components: {
        EstimationForm
    },
    methods: {
        fetchEstimations() {
            axios.get('http://localhost:8000/api/estimations').then(response => {
                this.estimations = response.data;
            }).catch(error => {
                console.error('Błąd pobierania estymacji:', error);
            });
        },
        openModal() {
            this.modalOpen = true;
            this.editingMode = false;
            this.$nextTick(() => {
                this.$refs.estimationForm.resetForm();
            });
        },
        closeModal() {
            this.modalOpen = false;
            this.editedEstimationId = null;
            this.editingMode = false;
            this.$refs.estimationForm.resetForm();
        },
        handleEstimationAdded(newEstimation) {
            this.estimations.push(newEstimation);
            this.fetchEstimations();
            this.closeModal();
        },
        handleEstimationUpdated(updatedEstimation) {
            const index = this.estimations.findIndex(estimation => estimation.id === updatedEstimation.id);
            if (index !== -1) {
                this.$set(this.estimations, index, updatedEstimation);
            }
            this.fetchEstimations();
            this.closeModal();
        },
        editEstimation(estimation) {
            this.editedEstimationId = estimation.id;
            this.editingMode = true;
            this.modalOpen = true;
            this.$nextTick(() => {
                this.$refs.estimationForm.editEstimation(estimation);
            });
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

<style>
@import '../styles/tables.scss'
</style>
