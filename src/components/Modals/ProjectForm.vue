<template>
    <v-card>
        <v-card-title v-if="!editingMode">Dodaj nowy projekt</v-card-title>
        <v-card-title v-else>Edytuj projekt</v-card-title>
        <v-card-text>
            <v-form ref="form" @submit.prevent="saveProject">
                <v-text-field v-model="project.name" label="Nazwa Projektu *"></v-text-field>
                <v-text-field v-model="project.description" label="Opis"></v-text-field>
                <v-row>
                    <v-col cols="6" md="8">
                        <v-select v-model="project.client" :items="clients" item-text="displayText" item-value="id" label="Klient *"></v-select>
                    </v-col>
                    <v-col cols="2" md="4">
                        <v-btn color="grey darken-3" dark @click="openClientForm">DODAJ NOWY</v-btn>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn color="grey darken-3" dark type="submit" v-if="editingMode">Zapisz zmiany</v-btn>
                    <v-btn color="grey darken-3" dark type="submit" v-else>Dodaj projekt</v-btn>
                    <v-btn color="grey darken-3" dark @click="cancel">Anuluj</v-btn>
                </v-card-actions>
                <v-subheader x-small>* Pole obowiązkowe</v-subheader>
            </v-form>
        </v-card-text>

        <v-dialog v-model="clientFormOpen">
            <ClientForm :editingMode="false" @client-added="handleClientAdded" @cancel="closeClientForm" />
        </v-dialog>
    </v-card>
</template>

<script>
import ClientForm from './ClientForm.vue';
import Swal from 'sweetalert2';
import apiService from '@/config';

export default {
    props: {
        editingMode: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            project: this.getInitialProject(),
            clients: [],
            clientFormOpen: false,
        };
    },
    created() {
        this.fetchClients();
    },
    methods: {
        getInitialProject() {
            return {
                id: null,
                name: '',
                description: '',
                client: null,
            };
        },
        fetchClients() {
            apiService.get('/clients')
                .then(response => {
                    this.clients = response.data.map(client => ({
                        id: client.id,
                        displayText: `${client.id} - ${client.name}`,
                    }));
                })
                .catch(error => {
                    console.error('Błąd pobierania klientów:', error);
                });
        },
        saveProject() {
            if (this.project.name && this.project.client) {
                const formData = {
                    name: this.project.name,
                    description: this.project.description,
                    client_id: this.project.client,
                };

                const apiCall = this.editingMode
                    ? apiService.put(`/projects/${this.project.id}`, formData)
                    : apiService.post('/projects', formData);

                apiCall
                    .then(response => {
                        const message = this.editingMode ? 'Zaktualizowano!' : 'Dodano!';
                        Swal.fire(message, `Projekt został ${this.editingMode ? 'zaktualizowany' : 'dodany'} pomyślnie`, 'success');
                        this.$emit(this.editingMode ? 'project-updated' : 'project-added', response.data);
                        this.resetForm();
                    })
                    .catch(error => {
                        Swal.fire('Błąd!', `Wystąpił problem podczas ${this.editingMode ? 'aktualizacji' : 'dodawania'} projektu`, 'error');
                        console.error('Błąd podczas zapisywania projektu:', error);
                    });
            } else {
                Swal.fire('Uwaga!', 'Proszę wypełnić wymagane pola', 'warning');
            }
        },
        cancel() {
            this.resetForm();
            this.$emit('cancel');
        },
        openClientForm() {
            this.clientFormOpen = true;
        },
        closeClientForm() {
            this.clientFormOpen = false;
            this.fetchClients();
        },
        handleClientAdded(newClient) {
            this.clients.push({
                id: newClient.id,
                displayText: `${newClient.id} - ${newClient.name}`,
            });
            this.project.client = newClient.id;
            this.clientFormOpen = false;
        },
        editProject(project) {
            this.project = {
                id: project.id,
                name: project.name,
                description: project.description,
                client: project.client.id,
            };
        },
        resetForm() {
            this.project = this.getInitialProject();
        },
    },
    components: {
        ClientForm,
    },
};
</script>

<style>
@import '../../styles/forms.scss'
</style>