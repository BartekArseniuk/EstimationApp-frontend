<template>
    <v-app>
        <v-container>
            <v-card>
                <v-card-title>Dodaj Klienta</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveClient">
                        <v-text-field v-model="client.name" label="Nazwa Klienta"></v-text-field>
                        <v-text-field v-model="client.description" label="Opis"></v-text-field>
                        <v-row>
                            <v-col cols="10">
                                <v-file-input v-model="client.logo" label="Logo" @change="updateLogoPreview"></v-file-input>
                            </v-col>
                            <v-col cols="2">
                                <v-img v-if="client.logo" :src="client.logoPreview" height="50px" width="50px"></v-img>
                            </v-col>
                        </v-row>
                        <v-select v-model="client.country" label="Kraj" :items="country"></v-select>
                        <v-text-field v-model="client.email" label="Email" type="email"></v-text-field>
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
export default {
    data() {
        return {
            client: {
                name: '',
                description: '',
                logo: null,
                country: null,
                email: '',
                logoPreview: null
            },
            country: ['Poland', 'USA', 'Canada', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'Australia']
        };
    },
    methods: {
        saveClient() {
            //todo
        },
        cancel() {
            //todo
        },
        updateLogoPreview() {
            const file = this.client.logo;
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = 50;
                    canvas.height = 50;

                    ctx.drawImage(img, 0, 0, 50, 50);

                    this.client.logoPreview = canvas.toDataURL();
                };
                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }
    }
};
</script>

<style lang="scss">
@import '../styles/forms.scss'
</style>