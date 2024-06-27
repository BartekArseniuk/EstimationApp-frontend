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
export default {
    data() {
        return {
            email: ''
        };
    },
    methods: {
        remindPassword() {
            this.closeDialog();
        },
        closeDialog() {
            this.$emit('close');
        }
    }
};
</script>

  
<style>
@import '../../styles/forms.scss'
</style>