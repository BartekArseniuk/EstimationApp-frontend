<template>
    <v-app>
        <v-card class="table-card">
            <v-card-title>
                Lista projektów
                <v-btn class="add-button" @click="goToAddProject" small color="blue darken-1" dark>Dodaj</v-btn>
                <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="filteredProjects" :search="search" class="table">
                <template v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="item in items" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.client.name }}</td>
                            <td>{{ item.estimate }}</td>
                            <td>{{ item.created_at }}</td>
                            <td>
                                <v-icon @click="editProject(item)" class="action-button">mdi-pencil</v-icon>
                                <v-icon @click="deleteProject(item.id)" class="action-button">mdi-delete</v-icon>
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
                { text: 'Klient', value: 'client.name' },
                { text: 'Wycena', value: 'estimate' },
                { text: 'Data dodania', value: 'created_at' },
                { text: 'Akcje', value: 'actions', sortable: false },
            ],
            projects: []
        };
    },
    computed: {
        filteredProjects() {
            return this.projects.filter(project => {
                const clientName = project.client.name ? project.client.name.toLowerCase() : '';
                const createdAt = project.created_at ? project.created_at.toLowerCase() : '';
                return clientName.includes(this.search.toLowerCase()) ||
                    createdAt.includes(this.search.toLowerCase());
            });
        },
    },
    created() {
        this.fetchProjects();
    },
    methods: {
        fetchProjects() {
            axios.get('http://localhost:8000/api/projects').then(response => {
                this.projects = response.data;
            }).catch(error => {
                console.error('Błąd pobierania projektów:', error);
            });
        },
        goToAddProject() {
            this.$router.push({ name: 'AddProject' });
        },
        editProject() {
            //todo
        },
        deleteProject(projectId) {
            axios.delete(`http://localhost:8000/api/projects/${projectId}`)
                .then(response => {
                    this.projects = this.projects.filter(project => project.id !== projectId);
                    window.alert('Usunięto projekt', response);
                })
                .catch(error => {
                    console.error('Błąd usuwania projektu:', error);
                });
        }
    }
};
</script>

<style lang="scss">
@import '../styles/tables.scss'
</style>
