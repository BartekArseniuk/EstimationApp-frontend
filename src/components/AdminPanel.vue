<template>
    <v-container>
      <v-card-title class="title">Panel Administratora</v-card-title>
      <v-card-title>
        <v-btn color="grey darken-3" dark small><v-icon>mdi-plus</v-icon>Dodaj użytkownika</v-btn>
      </v-card-title>
      <v-card class="table-card">
        <v-data-table :headers="headers" :items="users" :items-per-page="5" class="table">
          <template v-slot:body="{ items }">
            <tbody v-if="items.length > 0">
              <tr v-for="user in items" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.created_at }}</td>
                <td>
                  <v-icon @click="editUser(user)">mdi-pencil</v-icon>
                  <v-icon @click="deleteUser(user.id)">mdi-delete</v-icon>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="text-center">Aktualnie tabela nie posiada żadnych rekordów.</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        headers: [
          { text: 'L.p.', value: 'id' },
          { text: 'Nazwa', value: 'name' },
          { text: 'Email', value: 'email' },
          { text: 'Data dodania', value: 'created_at' },
          { text: 'Akcje', value: 'actions', sortable: false },
        ],
        users: [],
      };
    },
    created() {
      this.fetchUsers();
    },
    methods: {
      fetchUsers() {
        axios.get('http://localhost:8000/api/users')
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            console.error('Błąd pobierania użytkowników:', error);
          });
      },
      editUser(user) {
        console.log('Edytuj użytkownika:', user);
      },
      deleteUser(userId) {
        axios.delete(`http://localhost:8000/api/users/${userId}`)
          .then(() => {
            this.users = this.users.filter(user => user.id !== userId);
            window.alert('Usunięto użytkownika');
          })
          .catch(error => {
            console.error('Błąd usuwania użytkownika:', error);
          });
      },
    },
  };
  </script>
  
  <style>
  @import '../styles/tables.scss'
  </style>
  