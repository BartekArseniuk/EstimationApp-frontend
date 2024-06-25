<template>
<v-card>
    <v-card-title v-if="!editingMode">Rejestracja</v-card-title>
    <v-card-title v-else>Edytuj użytkownika</v-card-title>
    <v-card-text>
        <v-form @submit.prevent="register">
            <v-text-field v-model="user.name" label="Nazwa"></v-text-field>
            <v-text-field v-model="user.email" label="Email" type="email"></v-text-field>
            <v-text-field v-model="user.password" label="Hasło (min. 6 znaków)" :append-icon="user.showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="user.showPassword ? 'text' : 'password'" @click:append="user.showPassword = !user.showPassword"></v-text-field>
            <v-text-field v-model="user.confirmPassword" label="Potwierdź hasło" :append-icon="user.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="user.showConfirmPassword ? 'text' : 'password'" @click:append="user.showConfirmPassword = !user.showConfirmPassword"></v-text-field>
            <v-card-actions>
                <v-btn color="grey darken-3" dark type="submit">{{ editingMode ? 'Zapisz zmiany' : 'Zarejestruj użytkownika'
            }}</v-btn>
            </v-card-actions>
        </v-form>
    </v-card-text>
</v-card>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        editingMode: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            user: {
                id: null,
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                showPassword: false,
                showConfirmPassword: false,
            },
        };
    },
    methods: {
        register() {
            if (this.user.password.length < 6) {
                window.alert('Hasło musi zawierać co najmniej 6 znaków.');
                return;
            }

            if (this.user.password !== this.user.confirmPassword) {
                window.alert('Hasła się nie zgadzają.');
                return;
            }

            const formData = {
                name: this.user.name,
                email: this.user.email,
                password: this.user.password,
            };

            if (this.editingMode) {
                axios.put(`http://localhost:8000/api/users/${this.user.id}`, formData)
                    .then(response => {
                        window.alert('Użytkownik został zaktualizowany pomyślnie');
                        this.$emit('user-updated', response.data);
                        this.resetForm();
                    })
                    .catch(error => {
                        console.error('Błąd podczas aktualizacji użytkownika:', error);
                        window.alert('Błąd podczas aktualizacji użytkownika');
                    });
            } else {
                axios.post('http://localhost:8000/api/register', formData)
                    .then(response => {
                        const user = response.data.user;
                        this.$emit('register-success', user);
                        this.resetForm();
                        window.alert('Rejestracja przebiegła pomyślnie.');
                    })
                    .catch(error => {
                        console.error('Błąd rejestracji:', error);
                        window.alert('Błąd rejestracji. Sprawdź swoje dane.');
                    });
            }
        },
        resetForm() {
            this.user.id = null;
            this.user.name = '';
            this.user.email = '';
            this.user.password = '';
            this.user.confirmPassword = '';
            this.user.showPassword = false;
            this.user.showConfirmPassword = false;
        },
        editUser(user) {
            this.user.id = user.id;
            this.user.name = user.name;
            this.user.email = user.email;
        }
    }
};
</script>

<style>
@import '../../styles/forms.scss'
</style>
