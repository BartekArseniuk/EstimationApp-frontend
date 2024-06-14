<template>
    <v-app>
        <v-container>
            <v-card class="card">
                <v-card-title>Projekt</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveProject">
                        <v-text-field v-model="project.name" label="Nazwa Projektu *"></v-text-field>
                        <v-text-field v-model="project.description" label="Opis"></v-text-field>
                        <v-row>
                            <v-col cols="6" md="8">
                                <v-select v-model="project.client" :items="clients" item-text="displayText"
                                    item-value="id" label="Klient *"></v-select>
                            </v-col>
                            <v-col cols="2" md="4">
                                <v-btn color="grey darken-4" dark @click="addNewClient">DODAJ NOWY</v-btn>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-btn color="grey darken-4" dark type="submit">Dodaj</v-btn>
                            <v-btn color="grey darken-4" dark @click="cancel">Anuluj</v-btn>
                        </v-card-actions>
                        <v-subheader x-small>* Pole obowiązkowe</v-subheader>
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
            project: {
                id: null,
                name: '',
                description: '',
                client: null
            },
            clients: []
        };
    },
    created() {
        this.fetchClients();

        if (this.$route.params.projectData) {
            this.project = this.$route.params.projectData;
            if (this.project.client) {
                this.project.client = this.project.client.id;
            }
        }
    },
    methods: {
        fetchClients() {
            axios.get('http://localhost:8000/api/clients').then(response => {
                this.clients = response.data.map(client => ({
                    id: client.id,
                    displayText: `${client.id} - ${client.name}`
                }));
            }).catch(error => {
                console.error('Błąd pobierania klientów:', error);
            });
        },
        saveProject() {
            if (this.project.name && this.project.client) {
                const formData = {
                    name: this.project.name,
                    description: this.project.description,
                    client_id: this.project.client
                }
                if (this.project.id) {
                    axios.put(`http://localhost:8000/api/projects/${this.project.id}`, formData)
                    .then(response => {
                        window.alert('Projekt został zaktualizowany pomyślnie', response);
                        this.$router.push({ name: 'MainView' });
                    })
                    .catch(error => {
                        window.alert('Błąd podczas aktualizacji projektu', error)
                    });
                } else {
                    axios.post('http://localhost:8000/api/projects', formData).then(response => {
                    window.alert('Projekt został dodany pomyślnie', response);
                    this.$router.push({ name: 'MainView' });
                })
                    .catch(error => {
                        window.alert('Błąd podczas dodawania projektu', error);
                    });
                }
            } else {
                window.alert('Wypełnij wymagane pola');
            }
        },
        cancel() {
            this.$router.push({ name: 'MainView' });
        },
        addNewClient() {
            this.$router.push({ name: 'Client' });
        }
    }
};
</script>

<style lang="scss">
@import '../styles/forms.scss'
</style>