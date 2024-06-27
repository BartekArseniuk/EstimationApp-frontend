<template>
<v-card>
    <v-card-title>Logowanie</v-card-title>
    <v-card-text>
        <v-form @submit.prevent="login">
            <v-text-field v-model="email" label="Email" type="email"></v-text-field>
            <v-text-field v-model="password" label="Hasło" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"></v-text-field>
            <v-card-actions>
                <v-btn color="grey darken-3" dark type="submit">Zaloguj</v-btn>
            </v-card-actions>
        </v-form>
    </v-card-text>
</v-card>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            email: '',
            password: '',
            showPassword: false
        };
    },
    methods: {
        login() {
            const formData = {
                email: this.email,
                password: this.password
            };

            axios.post('http://localhost:8000/api/login', formData)
                .then(response => {
                    const token = response.data.token;
                    const user = response.data.user;

                    localStorage.setItem('token', token);
                    this.$emit('login-success', user);
                    this.clearForm();
                    this.$emit('close');
                    Swal.fire('Sukces!', 'Zalogowano pomyślnie.', 'success');
                })
                .catch(error => {
                    console.error('Błąd logowania:', error);
                    Swal.fire('Błąd!', 'Błąd logowania. Sprawdź swoje dane.', 'error');
                });
        },
        clearForm() {
            this.email = '';
            this.password = '';
        }
    }
};
</script>
  
<style>
@import '../../styles/forms.scss'
</style>