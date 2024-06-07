<template>
    <v-app>
        <v-container>
            <v-card class="card">
                <v-card-title>Dodaj Estymację</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveEstimation">
                        <v-text-field v-model="estimation.name" label="Nazwa" dense></v-text-field>
                        <v-text-field v-model="estimation.description" label="Opis" dense></v-text-field>
                        <v-row>
                            <v-col cols="6" md="8">
                                <v-select v-model="estimation.project" label="Projekt" :items="projects"
                                    item-text="displayText" item-value="id" dense></v-select>
                            </v-col>
                            <v-col cols="2" md="4">
                                <v-btn color="blue darken-1" dark @click="addNewProject" small>DODAJ NOWY</v-btn>
                            </v-col>
                        </v-row>
                        <v-text-field v-model="estimation.date" label="Data" type="date" dense></v-text-field>
                        <v-radio-group v-model="estimation.type" label="Rodzaj wyceny" dense>
                            <v-radio label="Godzinowa" value="hourly"></v-radio>
                            <v-radio label="Ustalona kwota" value="fixed_price"></v-radio>
                        </v-radio-group>
                        <v-text-field v-model="estimation.amount" label="Wycena" dense></v-text-field>
                        <v-card-actions>
                            <v-btn color="blue darken-1" dark type="submit" large>Dodaj</v-btn>
                            <v-btn color="red darken-1" dark @click="cancel" large>Anuluj</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            estimation: {
                name: '',
                description: '',
                project: null,
                date: new Date().toISOString().substr(0, 10),
                type: 'hourly',
                amount: ''
            },
            projects: []
        };
    },
    created() {
        this.fetchProjects();
    },
    methods: {
        fetchProjects() {
            axios.get('http://localhost:8000/api/projects').then(response => {
                this.projects = response.data.map(project => ({
                    id: project.id,
                    client_id: project.client_id,
                    displayText: `${project.id} - ${project.name} (Klient ID: ${project.client_id})`
                }));
            }).catch(error => {
                console.error('Błąd pobierania projektów:', error);
            });
        },
        saveEstimation() {
            if (this.estimation.name && this.estimation.description && this.estimation.project && this.estimation.date && this.estimation.type && this.estimation.amount) {
                const selectedProject = this.projects.find(project => project.id === this.estimation.project);
                const formData = {
                    name: this.estimation.name,
                    description: this.estimation.description,
                    project_id: this.estimation.project,
                    client_id: selectedProject.client_id,
                    date: this.estimation.date,
                    type: this.estimation.type,
                    amount: this.estimation.amount
                };
                axios.post('http://localhost:8000/api/estimations', formData).then(response => {
                    window.alert('Estymacja została dodana pomyślnie', response);
                    this.$router.push({ name: 'MainView' });
                })
                    .catch(error => {
                        window.alert('Błąd podczas dodawania estymacji', error);
                    });
            } else {
                window.alert('Wypełnij wszystkie pola');
            }
        },
        cancel() {
            this.$router.push({ name: 'MainView' });
        },
        addNewProject() {
            this.$router.push({ name: 'AddProject' });
        }
    }
};
</script>

<style lang="scss">
@import '../styles/forms.scss'
</style>
