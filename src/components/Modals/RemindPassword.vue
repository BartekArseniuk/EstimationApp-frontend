<template>
<v-card>
    <v-card-title>Przypomnij Hasło</v-card-title>
    <v-card-text>
        <v-form @submit.prevent="remindPassword">
            <v-text-field v-model="email" label="Email" type="email"></v-text-field>
            <v-card-actions>
                <v-btn color="grey darken-3" dark type="submit">Wyślij</v-btn>
                <v-btn color="grey darken-3" dark @click="closeDialog">Anuluj</v-btn>
            </v-card-actions>
        </v-form>
    </v-card-text>
</v-card>
</template>

  
<script>
import apiService from '@/config';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            email: ''
        };
    },
    methods: {
        remindPassword() {
            apiService.post('/password/email', {
                    email: this.email
                })
                .then(response => {
                    Swal.fire('Sukces!', 'Wiadomość została wysłana na adres email', 'success', response);
                    this.closeDialog();
                })
                .catch(error => {
                    Swal.fire('Błąd!', 'Wystąpił problem podczas wysyłania emaila.', 'error', error);
                    this.closeDialog();
                });
        },
        closeDialog() {
            this.$emit('close');
            this.clearForm();
        },
        clearForm() {
            this.email = '';
        }
    }
};
</script>

  
<style>
@import '../../styles/forms.scss'
</style>