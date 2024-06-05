<template>
    <v-app>
        <v-container>
            <v-card>
                <v-card-title>Dodaj Projekt</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveProject">
                        <v-text-field v-model="project.name" label="Nazwa Projektu"></v-text-field>
                        <v-text-field v-model="project.description" label="Opis"></v-text-field>
                        <v-row>
                            <v-col cols="6" md="8">
                                <v-select v-model="project.client" :items="clients" label="Klient"></v-select>
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
    methods: {
        saveProject() {
            //todo
        },
        cancel() {
            //todo
        },
        addNewClient() {
            //todo
        }
    }
};
</script>

<style lang="scss">
@import '../styles/forms.scss'
</style>