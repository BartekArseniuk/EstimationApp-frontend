<template>
<v-card>
    <v-card-title v-if="!editingMode">Dodaj nową wycenę</v-card-title>
    <v-card-title v-else>Edytuj wycenę</v-card-title>
    <v-card-text>
        <v-form @submit.prevent="saveEstimation">
            <v-text-field v-model="estimation.name" label="Nazwa *" dense></v-text-field>
            <v-text-field v-model="estimation.description" label="Opis" dense></v-text-field>
            <v-row>
                <v-col cols="6" md="8">
                    <v-select v-model="estimation.project" label="Projekt *" :items="projects" item-text="displayText" item-value="id" dense></v-select>
                </v-col>
                <v-col cols="2" md="4">
                    <v-btn color="grey darken-3" dark @click="openProjectForm">DODAJ NOWY</v-btn>
                </v-col>
            </v-row>
            <v-text-field v-model="estimation.date" label="Data *" type="date" dense></v-text-field>
            <v-radio-group v-model="estimation.type" label="Rodzaj wyceny *" dense>
                <v-radio label="Godzinowa" value="hourly" color="grey darken-3"></v-radio>
                <v-radio label="Ustalona kwota" value="fixed_price" color="grey darken-3"></v-radio>
            </v-radio-group>
            <v-text-field v-model="estimation.amount" label="Wycena *" dense></v-text-field>
            <v-card-actions>
                <v-btn color="grey darken-3" dark type="submit" v-if="editingMode">Zapisz zmiany</v-btn>
                <v-btn color="grey darken-3" dark type="submit" v-else>Dodaj wycenę</v-btn>
                <v-btn color="grey darken-3" dark @click="cancel">Anuluj</v-btn>
            </v-card-actions>
            <v-subheader x-small>* Pole obowiązkowe</v-subheader>
        </v-form>
    </v-card-text>

    <v-dialog v-model="projectFormOpen">
        <ProjectForm @project-added="handleProjectAdded" @cancel="closeProjectForm" />
    </v-dialog>
</v-card>
</template>

<script>
import apiService from '@/config';
import ProjectForm from './ProjectForm.vue';
import Swal from 'sweetalert2';

export default {
    props: {
        editingMode: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            projectFormOpen: false,
            estimation: this.getInitialEstimation(),
            projects: [],
        };
    },
    created() {
        this.fetchProjects();
    },
    methods: {
        getInitialEstimation() {
            return {
                id: null,
                name: '',
                description: '',
                project: null,
                date: new Date().toISOString().substr(0, 10),
                type: 'hourly',
                amount: '',
            };
        },
        fetchProjects() {
            apiService.get('/projects')
                .then(response => {
                    this.projects = response.data.map(project => ({
                        id: project.id,
                        client_id: project.client_id,
                        displayText: `${project.id} - ${project.name} (Klient ID: ${project.client_id})`,
                    }));
                })
                .catch(error => {
                    console.error('Błąd pobierania projektów:', error);
                });
        },
        saveEstimation() {
            if (this.estimation.name && this.estimation.project && this.estimation.date && this.estimation.type && this.estimation.amount) {
                const selectedProject = this.projects.find(project => project.id === this.estimation.project);
                const formData = {
                    name: this.estimation.name,
                    description: this.estimation.description,
                    project_id: this.estimation.project,
                    client_id: selectedProject.client_id,
                    date: this.estimation.date,
                    type: this.estimation.type,
                    amount: this.estimation.amount,
                };
                const apiCall = this.editingMode ?
                    apiService.put(`/estimations/${this.estimation.id}`, formData) :
                    apiService.post('/estimations', formData);

                apiCall
                    .then(response => {
                        const message = this.editingMode ? 'Zaktualizowano!' : 'Dodano!';
                        Swal.fire(message, 'Wycena została zapisana pomyślnie.', 'success');
                        this.$emit(this.editingMode ? 'estimation-updated' : 'estimation-added', response.data);
                        this.resetForm();
                    })
                    .catch(error => {
                        Swal.fire('Błąd!', 'Błąd podczas zapisywania wyceny.', 'error');
                        console.error('Błąd podczas zapisywania wyceny:', error);
                    });
            } else {
                Swal.fire('Uwaga!', 'Wypełnij wszystkie wymagane pola.', 'warning');
            }
        },
        cancel() {
            this.resetForm();
            this.$emit('cancel');
        },
        resetForm() {
            this.estimation = this.getInitialEstimation();
        },
        editEstimation(estimation) {
            this.estimation = {
                id: estimation.id,
                name: estimation.name,
                description: estimation.description,
                project: estimation.project.id,
                date: estimation.date,
                type: estimation.type,
                amount: estimation.amount,
            };
        },
        openProjectForm() {
            this.projectFormOpen = true;
        },
        closeProjectForm() {
            this.projectFormOpen = false;
        },
        handleProjectAdded(newProject) {
            this.projects.push({
                id: newProject.id,
                client_id: newProject.client_id,
                displayText: `${newProject.id} - ${newProject.name} (Klient ID: ${newProject.client_id})`,
            });
            this.estimation.project = newProject.id;
            this.projectFormOpen = false;
        },
    },
    components: {
        ProjectForm,
    },
};
</script>

<style>
@import '../../styles/forms.scss'
</style>