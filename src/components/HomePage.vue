<template>
<v-container class="homePage">
    <v-row>
        <v-col cols="12">
            <v-card class="main-card" color="grey darken-3" dark>
                <v-card-title>
                    EstimationApp - Narzędzie do zarządzania projektami
                </v-card-title>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" md="6">
            <v-card class="card1">
                <v-card-title>
                    <v-icon size="64" left>mdi-account-multiple</v-icon>
                    Klienci
                </v-card-title>
                <v-card-text>
                    Zarządzaj danymi klientów, w tym ich nazwą, logo, krajem i danymi kontaktowymi. Informacje te
                    można
                    wygodnie wyświetlać w tabeli. Tabela może
                    zawierać
                    kolumny takie jak nazwa klienta, adres e-mail, krótki opis, logo, kraj itp. To ułatwi
                    zarządzanie
                    klientami, dodawanie nowych, usuwanie istniejących oraz modyfikowanie danych klientów.
                </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="12" md="6">
            <v-card class="card2">
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
            <v-card class="card3">
                <v-card-title>
                    <v-icon size="64" left>mdi-chart-bar</v-icon>
                    Wyceny
                </v-card-title>
                <v-card-text>
                    Zarządzaj wycenami powiązanymi z projektami i klientami. Każda wycena może mieć unikalny tytuł i
                    opis.
                    Przypisz wycenę do projektu, określ datę i wybierz rodzaj wyceny - stałą lub godzinową. Dzięki
                    temu
                    łatwiej śledzić koszty i zarządzać budżetem każdego projektu i klienta. Możesz dodawać nowe
                    wyceny,
                    aktualizować dane i analizować wyceny, co umożliwia lepszą kontrolę finansową.
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <v-row>
    <v-col cols="12" class="text-center">
        <v-icon size="12" class="mdi mdi-language-html5"></v-icon> HTML5
        <v-icon size="12" class="mdi mdi-language-css3"></v-icon> CSS3
        <v-icon size="12" class="mdi mdi-language-javascript"></v-icon> JavaScript
        <v-icon size="12" class="mdi mdi-vuejs"></v-icon> Vue.js
        <v-icon size="12" class="mdi mdi-vuetify"></v-icon> Vuetify
        <v-icon size="12" class="mdi mdi-webpack"></v-icon> Webpack
        <v-icon size="12" class="mdi mdi-language-php"></v-icon> PHP
        <v-icon size="12" class="mdi mdi-database"></v-icon> MySQL
        <v-icon size="12" class="mdi mdi-laravel"></v-icon> Laravel
    </v-col>
</v-row>
</v-container>
</template>

<style>
.card1,
.card2,
.card3,
.main-card {
    border-radius: 20px !important;
}

.homePage {
    width: 90%;
}
</style>