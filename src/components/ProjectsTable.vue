<template>
  <v-container>
    <v-card-title>Projekty</v-card-title>
    <v-card class="table-card">
      <v-card-title>
        <v-btn class="add-button" @click="openModal" small color="grey darken-3" dark>
          <v-icon>mdi-plus</v-icon>
          Dodaj projekt
        </v-btn>
        <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Szukaj"></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="filteredProjects" :items-per-page="5" :search="search" class="table">
        <template v-slot:body="{ items }">
          <tbody v-if="items.length > 0">
            <tr v-for="project in items" :key="project.id">
              <td>{{ project.id }}</td>
              <td>{{ project.name }}</td>
              <td>{{ project.client?.name }}</td>
              <td>{{ project.estimate }}</td>
              <td>{{ project.created_at }}</td>
              <td>
                <v-icon @click="editProject(project)">mdi-pencil</v-icon>
                <v-icon @click="deleteProject(project.id)">mdi-delete</v-icon>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center">Aktualnie tabela nie posiada żadnych rekordów.</td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="modalOpen">
      <ProjectForm
        :editingMode="editingMode"
        :editedProjectId="editedProjectId"
        @project-added="handleProjectAdded"
        @project-updated="handleProjectUpdated"
        @cancel="closeModal"
        ref="projectForm"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import ProjectForm from './Modals/ProjectForm.vue';

export default {
  data() {
    return {
      search: '',
      headers: [
        { text: 'L.p.', value: 'id' },
        { text: 'Nazwa', value: 'name' },
        { text: 'Klient', value: 'client.name' },
        { text: 'Wycena', value: 'estimate' },
        { text: 'Data dodania', value: 'created_at' },
        { text: 'Akcje', value: 'actions', sortable: false },
      ],
      projects: [],
      modalOpen: false,
      editedProjectId: null,
      editingMode: false,
    };
  },
  computed: {
    filteredProjects() {
      return this.projects.filter(project => {
        const clientName = project.client?.name ? project.client.name.toLowerCase() : '';
        const createdAt = project.created_at ? project.created_at.toLowerCase() : '';
        const searchLower = this.search.toLowerCase();
        return project.name.toLowerCase().includes(searchLower) || clientName.includes(searchLower) || createdAt.includes(searchLower);
      });
    },
  },
  created() {
    this.fetchProjects();
  },
  components: {
    ProjectForm,
  },
  methods: {
    fetchProjects() {
      axios.get('http://localhost:8000/api/projects')
        .then(response => {
          this.projects = response.data;
        })
        .catch(error => {
          console.error('Błąd pobierania projektów:', error);
        });
    },
    openModal() {
      this.modalOpen = true;
      this.editingMode = false;
      this.$nextTick(() => {
        this.$refs.projectForm.resetForm();
      });
    },
    closeModal() {
      this.modalOpen = false;
      this.editedProjectId = null;
      this.editingMode = false;
      this.$refs.projectForm.resetForm();
    },
    handleProjectAdded(newProject) {
      this.projects.push(newProject);
      this.fetchProjects();
      this.closeModal();
    },
    handleProjectUpdated(updatedProject) {
      const index = this.projects.findIndex(project => project.id === updatedProject.id);
      if (index !== -1) {
        this.$set(this.projects, index, updatedProject);
      }
      this.fetchProjects();
      this.closeModal();
    },
    editProject(project) {
      this.editedProjectId = project.id;
      this.editingMode = true;
      this.modalOpen = true;
      this.$nextTick(() => {
        this.$refs.projectForm.editProject(project);
      });
    },
    deleteProject(projectId) {
      axios.delete(`http://localhost:8000/api/projects/${projectId}`)
        .then(() => {
          this.projects = this.projects.filter(project => project.id !== projectId);
          window.alert('Usunięto projekt');
        })
        .catch(error => {
          console.error('Błąd usuwania projektu:', error);
        });
    }
  }
};
</script>

<style>
@import '../styles/tables.scss'
</style>