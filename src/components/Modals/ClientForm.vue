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
                      <v-img v-if="client.logoPreview" :src="client.logoPreview" alt="Logo Klienta" height="50px" width="50px"></v-img>
                  </v-col>
              </v-row>
              <v-select v-model="client.country" label="Kraj *" :items="countries"></v-select>
              <v-text-field v-model="client.email" label="Email *" type="email"></v-text-field>
              <v-card-actions>
                  <v-btn color="grey darken-3" dark type="submit" v-if="editingMode">Zapisz zmiany</v-btn>
                  <v-btn color="grey darken-3" dark type="submit" v-else>Dodaj klienta</v-btn>
                  <v-btn color="grey darken-3" dark @click="cancel">Anuluj</v-btn>
              </v-card-actions>
              <v-subheader x-small>* Pole obowiązkowe</v-subheader>
          </v-form>
      </v-card-text>
  </v-card>
</template>

<script>
import apiService from '@/config';
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
          client: this.getInitialClient(),
          countries: ['Polska', 'USA', 'Kanada', 'UK', 'Niemcy', 'Francja', 'Włochy', 'Hiszpania', 'Australia'],
          logoFile: null,
      };
  },
  methods: {
      getInitialClient() {
          return {
              id: null,
              name: '',
              description: '',
              logo: null,
              country: null,
              email: '',
              logoPreview: null,
          };
      },
      saveClient() {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (this.client.name && this.client.country && this.client.email && emailPattern.test(this.client.email)) {
              const formData = {
                  name: this.client.name,
                  description: this.client.description,
                  logo: this.client.logoBase64,
                  country: this.client.country,
                  email: this.client.email,
              };

              const apiCall = this.editingMode
                  ? apiService.put(`/clients/${this.client.id}`, formData)
                  : apiService.post('/clients', formData);

              apiCall
                  .then(response => {
                      const message = this.editingMode ? 'Zaktualizowano!' : 'Dodano!';
                      Swal.fire(message, `Klient został ${this.editingMode ? 'zaktualizowany' : 'dodany'} pomyślnie.`, 'success');
                      this.$emit(this.editingMode ? 'client-updated' : 'client-added', response.data);
                      if (!this.editingMode) this.resetForm();
                  })
                  .catch(error => {
                      console.error('Błąd podczas zapisywania klienta:', error);
                      Swal.fire('Błąd!', `Błąd podczas ${this.editingMode ? 'aktualizacji' : 'dodawania'} klienta.`, 'error');
                  });
          } else {
              Swal.fire('Uwaga!', 'Wypełnij wszystkie wymagane pola i upewnij się, że adres email jest poprawny.', 'warning');
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
          this.client = this.getInitialClient();
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