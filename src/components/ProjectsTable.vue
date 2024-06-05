<template>
    <v-app>
        <v-card>
            <v-card-title>
                Lista projektów
                <v-btn @click="goToAddProject" small color="blue darken-1" dark>Dodaj</v-btn>
                <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="filteredProjects" :search="search">
                <template v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="item in items" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.client }}</td>
                            <td>{{ calculateTotalEstimate(item.estimates) }}</td>
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
                { text: 'Klient', value: 'client' },
                { text: 'Wycena', value: 'estimates' },
                { text: 'Data dodania', value: 'created_at' },
                { text: 'Akcje', value: 'actions', sortable: false },
            ],
            projects: []
        };
    },
    computed: {
        filteredProjects() {
            return this.projects.filter(project => {
                return project.client.toLowerCase().includes(this.search.toLowerCase()) || project.created_at.toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    methods: {
        goToAddProject() {
            //todo
        },
        editProject() {
            //todo
        },
        deleteProject() {
            //todo
        },
        calculateTotalEstimate(estimates) {
            if (!estimates) {
                return 'Brak';
            }
            return estimates.reduce((total, estimate) => total + estimate, 0);
        }
    },
};
</script>

<style lang="scss">
@import '../styles/tables.scss'
</style>
