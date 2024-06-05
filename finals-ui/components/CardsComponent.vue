<template>
    <div>
        <v-card elevation="0">
          <v-list-item>
            <v-list-item-content align="left">
              <v-list-item-subtitle class="subtitle mb-1">
                {{ title }}
              </v-list-item-subtitle>
              <div>
                <v-divider></v-divider>
                <v-list-item-subtitle class="display-1">
                  <div>{{ value }}</div>
                </v-list-item-subtitle>
              </div>
            </v-list-item-content>
            <v-icon class="display-3" :color="color">{{ icon }}</v-icon>
          </v-list-item>
        </v-card>
    </div>
</template>
<script>
export default {
  props: {
    title: String,
    value: Number,
    icon: String,
    color: String,
  }
}
</script>