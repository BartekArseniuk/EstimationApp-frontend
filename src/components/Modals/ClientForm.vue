<template>
<v-card>
    <v-card-title v-if="!editingMode">Dodaj nowego klienta</v-card-title>
    <v-card-title v-else>Edytuj klienta</v-card-title>
    <v-card-text>
        <v-form @submit.prevent="saveClient">
            <v-text-field v-model="client.name" label="Nazwa Klienta *"></v-text-field>
            <v-text-field v-model="client.description" label="Opis"></v-text-field>
            <v-row>
                <v-col cols="10">
                    <v-file-input v-model="logoFile" label="Logo" @change="updateLogoPreview"></v-file-input>
                </v-col>
                <v-col cols="2">
                    <v-img v-if="client.logoPreview" :src="client.logoPreview" height="50px" width="50px"></v-img>
                </v-col>
            </v-row>
            <v-select v-model="client.country" label="Kraj *" :items="country"></v-select>
            <v-text-field v-model="client.email" label="Email *" type="email"></v-text-field>
            <v-card-actions>
                <v-btn color="grey darken-3" dark type="submit">{{ editingMode ? 'Zapisz zmiany' : 'Dodaj klienta' }}</v-btn>
                <v-btn color="grey darken-3" dark @click="cancel">Anuluj</v-btn>
            </v-card-actions>
            <v-subheader x-small>* Pole obowiązkowe</v-subheader>
        </v-form>
    </v-card-text>
</v-card>
</template>

<script>
import axios from 'axios';
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
            client: {
                id: null,
                name: '',
                description: '',
                logo: null,
                country: null,
                email: '',
                logoPreview: null
            },
            country: ['Poland', 'USA', 'Canada', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'Australia'],
            logoFile: null
        };
    },
    methods: {
        saveClient() {
            if (this.client.name && this.client.country && this.client.email) {
                const formData = {
                    name: this.client.name,
                    description: this.client.description,
                    logo: this.client.logoBase64,
                    country: this.client.country,
                    email: this.client.email,
                };

                if (this.editingMode) {
                    axios.put(`http://localhost:8000/api/clients/${this.client.id}`, formData)
                        .then(response => {
                            Swal.fire('Zaktualizowano!', 'Klient został zaktualizowany pomyślnie.', 'success');
                            this.$emit('client-updated', response.data);
                        })
                        .catch(error => {
                            console.error('Błąd podczas aktualizacji klienta:', error);
                            Swal.fire('Błąd!', 'Błąd podczas aktualizacji klienta.', 'error');
                        });
                } else {
                    axios.post('http://localhost:8000/api/clients', formData)
                        .then(response => {
                            Swal.fire('Dodano!', 'Klient został dodany pomyślnie.', 'success');
                            this.$emit('client-added', response.data);
                            this.resetForm();
                        })
                        .catch(error => {
                            console.error('Błąd podczas dodawania klienta:', error);
                            Swal.fire('Błąd!', 'Błąd podczas dodawania klienta.', 'error');
                        });
                }
            } else {
                Swal.fire('Uwaga!', 'Wypełnij wszystkie wymagane pola.', 'warning');
            }
        },
        cancel() {
            this.resetForm();
            this.$emit('cancel');
        },
        updateLogoPreview() {
            const file = this.logoFile;
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = 50;
                    canvas.height = 50;

                    ctx.drawImage(img, 0, 0, 50, 50);

                    this.client.logoBase64 = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, '');
                    this.client.logoPreview = canvas.toDataURL();
                };
                img.src = reader.result;
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        },
        resetForm() {
            this.client = {
                id: null,
                name: '',
                description: '',
                logo: null,
                country: null,
                email: '',
                logoPreview: null,
            };
            this.logoFile = null;
        },
        editClient(client) {
            this.client.id = client.id;
            this.client.name = client.name;
            this.client.description = client.description;
            this.client.country = client.country;
            this.client.email = client.email;
            this.client.logoPreview = client.logo ? this.getLogoUrl(client.logo) : null;
        },
        getLogoUrl(base64String) {
            return 'data:image/png;base64,' + base64String;
        },
    },
};
</script>

<style>
@import '../../styles/forms.scss'
</style>