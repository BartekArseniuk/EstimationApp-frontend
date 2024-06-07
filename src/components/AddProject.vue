<template>
    <v-app>
        <v-container>
            <v-card class="card">
                <v-card-title>Dodaj Projekt</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveProject">
                        <v-text-field v-model="project.name" label="Nazwa Projektu"></v-text-field>
                        <v-text-field v-model="project.description" label="Opis"></v-text-field>
                        <v-row>
                            <v-col cols="6" md="8">
                                <v-select v-model="project.client" :items="clients" item-text="displayText"
                                    item-value="id" label="Klient"></v-select>
                            </v-col>
                            <v-col cols="2" md="4">
                                <v-btn color="blue darken-1" dark @click="addNewClient">DODAJ NOWY</v-btn>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-btn color="blue darken-1" dark type="submit">Dodaj</v-btn>
                            <v-btn color="red darken-1" dark @click="cancel">Anuluj</v-btn>
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
            project: {
                name: '',
                description: '',
                client: null
            },
            clients: []
        };
    },
    created() {
        this.fetchClients();
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
            if (this.project.name && this.project.description && this.project.client) {
                const formData = {
                    name: this.project.name,
                    description: this.project.description,
                    client_id: this.project.client
                }
                axios.post('http://localhost:8000/api/projects', formData).then(response => {
                    window.alert('Projekt został dodany pomyślnie', response);
                    this.$router.push({ name: 'MainView' });
                })
                    .catch(error => {
                        window.alert('Błąd podczas dodawania projektu', error);
                    });
            } else {
                window.alert('Wypełnij wszystkie pola');
            }
        },
        cancel() {
            this.$router.push({ name: 'MainView' });
        },
        addNewClient() {
            this.$router.push({ name: 'AddClient' });
        }
    }
};
</script>

<style lang="scss">
@import '../styles/forms.scss'
</style>