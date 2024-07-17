<template>
    <v-container class="homePage">
      <v-row>
        <v-col cols="12">
          <v-card class="mainCard" color="grey darken-3" dark>
            <v-card-title>
              EstimationApp - Narzędzie do zarządzania projektami
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="cardOne">
            <v-card-title>
              <v-icon size="64" left>mdi-account-multiple</v-icon>
              Klienci
            </v-card-title>
            <v-card-text>
              Zarządzaj danymi klientów, w tym ich nazwą, logo, krajem i danymi kontaktowymi. Informacje te
              można wygodnie wyświetlać w tabeli. Tabela może zawierać kolumny takie jak nazwa klienta, adres e-mail, krótki opis, logo, kraj itp. To ułatwi
              zarządzanie klientami, dodawanie nowych, usuwanie istniejących oraz modyfikowanie danych klientów.
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="6">
          <v-card class="cardTwo">
            <v-card-title>
              <v-icon size="64" left>mdi-folder</v-icon>
              Projekty
            </v-card-title>
            <v-card-text>
              Zarządzaj projektami, przypisując je do klientów i monitorując postępy. Każdy projekt może mieć
              unikalny tytuł, krótki opis i być przypisany do odpowiedniego klienta, co ułatwia śledzenie
              powiązań. Dodawaj nowe projekty, usuwaj istniejące i regularnie aktualizuj dane, aby lepiej
              zarządzać działaniami.
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12">
          <v-card class="cardThree">
            <v-card-title>
              <v-icon size="64" left>mdi-chart-bar</v-icon>
              Wyceny
            </v-card-title>
            <v-card-text>
              Zarządzaj wycenami powiązanymi z projektami i klientami. Każda wycena może mieć unikalny tytuł i
              opis. Przypisz wycenę do projektu, określ datę i wybierz rodzaj wyceny - stałą lub godzinową. Dzięki
              temu łatwiej śledzić koszty i zarządzać budżetem każdego projektu i klienta. Możesz dodawać nowe
              wyceny, aktualizować dane i analizować wyceny, co umożliwia lepszą kontrolę finansową.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12" class="text-center">
          <div v-for="(icon, index) in techIcons" :key="index" class="techIcon">
            <v-icon :class="icon.class" size="20"></v-icon>
            {{ icon.label }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        techIcons: [
          {
            class: "mdi mdi-language-html5",
            label: "HTML5"
          },
          {
            class: "mdi mdi-language-css3",
            label: "CSS3"
          },
          {
            class: "mdi mdi-language-javascript",
            label: "JavaScript"
          },
          {
            class: "mdi mdi-vuejs",
            label: "Vue.js"
          },
          {
            class: "mdi mdi-vuetify",
            label: "Vuetify"
          },
          {
            class: "mdi mdi-webpack",
            label: "Webpack"
          },
          {
            class: "mdi mdi-language-php",
            label: "PHP"
          },
          {
            class: "mdi mdi-database",
            label: "MySQL"
          },
          {
            class: "mdi mdi-laravel",
            label: "Laravel"
          }
        ]
      };
    }
  };
  </script>
  
  <style>
  .cardOne,
  .cardTwo,
  .cardThree,
  .mainCard {
    border-radius: 20px !important;
  }
  
  .homePage {
    width: 90%;
  }
  
  .techIcon {
    display: inline-block;
    margin: 0 10px;
  }
  </style>  