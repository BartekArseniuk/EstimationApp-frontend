  <template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="main-card" color="blue dark" dark>
            <v-card-title>
              EstimationApp - Narzędzie do zarządzania projektami
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="card1">
            <v-card-title>
              <v-icon size="64" left>mdi-account-multiple</v-icon>
              Klienci
            </v-card-title>
            <v-card-text>
              Zarządzaj danymi klientów, w tym ich nazwą, logo, krajem i danymi kontaktowymi. Informacje te można
              wygodnie wyświetlać w tabeli, gdzie każdy wiersz reprezentuje jednego klienta. Tabela może zawierać
              kolumny takie jak nazwa klienta, adres e-mail, krótki opis, logo, kraj itp. To ułatwi zarządzanie
              klientami, dodawanie nowych, usuwanie istniejących oraz modyfikowanie danych klientów.
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="card2">
            <v-card-title>
              <v-icon size="64" left>mdi-briefcase</v-icon>
              Projekty
            </v-card-title>
            <v-card-text>
              Zarządzaj projektami, przypisując je do klientów i monitorując postępy. Każdy projekt może mieć unikalny
              tytuł, krótki opis i być przypisany do klienta, co ułatwia śledzenie powiązań. Możesz dodawać nowe
              projekty, usuwać istniejące i aktualizować dane, co umożliwia lepsze zarządzanie działaniami. Takie
              podejście poprawia kontrolę nad projektami i ich realizacją.
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="card3">
            <v-card-title>
              <v-icon size="64" left>mdi-cash</v-icon>
              Wyceny
            </v-card-title>
            <v-card-text>
              Zarządzaj wycenami powiązanymi z projektami i klientami. Każda wycena może mieć unikalny tytuł i opis.
              Przypisz wycenę do projektu, określ datę i wybierz rodzaj wyceny - stałą lub godzinową. Dzięki temu
              łatwiej śledzić koszty i zarządzać budżetem każdego projektu i klienta. Możesz dodawać nowe wyceny,
              aktualizować dane i analizować wyceny, co umożliwia lepszą kontrolę finansową.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>

<style>
.card1,
.card2,
.card3 {
  border-radius: 20px !important;
}

.main-card {
  border-radius: 20px !important;
}
</style>
