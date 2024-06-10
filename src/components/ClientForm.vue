<template>
    <v-app>
        <v-container>
            <v-card class="card">
                <v-card-title>Klient</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveClient">
                        <v-text-field v-model="client.name" label="Nazwa Klienta*"></v-text-field>
                        <v-text-field v-model="client.description" label="Opis*"></v-text-field>
                        <v-row>
                            <v-col cols="10">
                                <v-file-input v-model="logoFile" label="Logo"
                                    @change="updateLogoPreview"></v-file-input>
                            </v-col>
                            <v-col cols="2">
                                <v-img v-if="client.logoPreview"
                                    :src="client.logoPreview" height="50px"
                                    width="50px"></v-img>
                            </v-col>
                        </v-row>
                        <v-select v-model="client.country" label="Kraj*" :items="country"></v-select>
                        <v-text-field v-model="client.email" label="Email*" type="email"></v-text-field>
                        <v-card-actions>
                            <v-btn color="blue darken-1" dark type="submit">Zapisz</v-btn>
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
    created() {
        if (this.$route.params.clientData) {
            this.client = this.$route.params.clientData;
            if (this.client.logo) {
                this.client.logoPreview = 'data:image/png;base64,' + this.client.logo;
            }
        }
    },

    methods: {
        saveClient() {
            if (this.client.name && this.client.description && this.client.country && this.client.email) {
                const formData = {
                    name: this.client.name,
                    description: this.client.description,
                    logo: this.client.logoBase64,
                    country: this.client.country,
                    email: this.client.email
                };

                if (this.client.id) {
                    axios.put(`http://localhost:8000/api/clients/${this.client.id}`, formData)
                        .then(response => {
                            window.alert('Klient został zaktualizowany pomyślnie', response);
                            this.$router.push({ name: 'MainView' });
                        })
                        .catch(error => {
                            window.alert('Błąd podczas aktualizacji klienta', error);
                        });
                } else {
                    axios.post('http://localhost:8000/api/clients', formData)
                        .then(response => {
                            window.alert('Klient został dodany pomyślnie', response);
                            this.$router.push({ name: 'MainView' });
                        })
                        .catch(error => {
                            window.alert('Błąd podczas dodawania klienta', error);
                        });
                }
            } else {
                window.alert('Wypełnij wymagane pola');
            }
        },
        cancel() {
            this.$router.push({ name: 'MainView' });
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
                    this.$forceUpdate();
                };
                img.src = reader.result;
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }
};
</script>

<style lang="scss">
@import '../styles/forms.scss'
</style>
