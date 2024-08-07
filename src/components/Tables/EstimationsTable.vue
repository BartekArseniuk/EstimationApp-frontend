<template>
<v-container class="tab-page">
    <v-card-title>Wyceny</v-card-title>
    <v-card class="table-card">
        <v-card-title>
            <v-btn v-if="isAdmin" class="add-button" @click="openModal" small color="grey darken-3" dark>
                <v-icon>mdi-plus</v-icon>Dodaj wycenę
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="filteredEstimations" :items-per-page="5" :search="search" class="table">
            <template v-slot:body="{ items }">
                <tbody v-if="items.length > 0">
                    <tr v-for="estimation in items" :key="estimation.id">
                        <td>{{ estimation.id }}</td>
                        <td>{{ estimation.name }}</td>
                        <td>{{ estimation.project ? estimation.project.name : 'Brak projektu' }}</td>
                        <td>{{ estimation.client ? estimation.client.name : 'Brak klienta' }}</td>
                        <td>{{ estimation.amount }}</td>
                        <td>{{ estimation.created_at }}</td>
                        <td v-if="isAdmin">
                            <v-icon @click="editEstimation(estimation)">mdi-pencil</v-icon>
                            <v-icon @click="confirmDeleteEstimation(estimation.id)">mdi-delete</v-icon>
                        </td>
                        <td v-else>Brak uprawnień</td>
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
        <EstimationForm :editingMode="editingMode" :editedEstimationId="editedEstimationId" @estimation-added="handleEstimationAdded" @estimation-updated="handleEstimationUpdated" @cancel="closeModal" ref="estimationForm" />
    </v-dialog>
</v-container>
</template>

<script>
import EstimationForm from '../Modals/EstimationForm.vue';
import Swal from 'sweetalert2';
import apiService from '@/config';

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
                    text: 'Projekt',
                    value: 'project.name'
                },
                {
                    text: 'Klient',
                    value: 'client.name'
                },
                {
                    text: 'Wycena',
                    value: 'amount'
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
            apiService.get('/estimations')
                .then(response => {
                    this.estimations = response.data;
                })
                .catch(error => {
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
        confirmDeleteEstimation(estimationId) {
            Swal.fire({
                title: 'Czy na pewno chcesz usunąć tę wycenę?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tak, usuń wycenę',
                cancelButtonText: 'Anuluj',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteEstimation(estimationId);
                }
            });
        },
        deleteEstimation(estimationId) {
            apiService.delete(`/estimations/${estimationId}`)
                .then(() => {
                    this.estimations = this.estimations.filter(estimation => estimation.id !== estimationId);
                    Swal.fire('Usunięto!', 'Wycena została pomyślnie usunięta.', 'success');
                })
                .catch(error => {
                    console.error('Błąd usuwania wyceny:', error);
                    Swal.fire('Błąd!', 'Wystąpił problem podczas usuwania wyceny.', 'error');
                });
        }
    },
};
</script>

<style>
@import '../../styles/tables.scss'
</style>