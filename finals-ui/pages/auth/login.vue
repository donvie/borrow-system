<template>
  <div class="d-flex align-center justify-center" style="height: 100%; padding: 50px">
    <v-card width="450" class="mx-auto card-border" outlined>
      <br>
      <v-img src="https://onepampanga.com/uploads/businesses/st-nicholas-college-of-business-and-technology/Logo/b9e7a14328350ab93acb98ce0a590eb0.jpg" max-height="150" contain></v-img>
      <br>

      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit()" class="mx-15">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          prepend-inner-icon="mdi-email"
          outlined
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock"
          outlined
          required
        ></v-text-field>
        <v-btn :disabled="!valid" color="primary" block type="submit">
          Sign In
        </v-btn>
      </v-form>

      <div class="hr-sect mx-15 my-5">or sign in with</div>

      <v-card-actions class="text-center">
        <v-spacer></v-spacer>
          <NuxtLink to="/auth/register" class="nuxt-link">Create an account</NuxtLink>
        <v-spacer></v-spacer>
      </v-card-actions>
      <v-card-actions class="mb-10 text-center">
        <v-spacer></v-spacer>
          <NuxtLink to="/auth/forgot" class="nuxt-link">Forgot password</NuxtLink>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  layout: "auth",
  middleware: 'auth',
  auth: 'guest',
  data() {
    return {
      valid: true,
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.login(this.email, this.password)
      }
    },
    login(email, password) {
      this.$auth.loginWith('local', {
        data: {
          identifier: email,
          password: password,
        },
      }).then((res) => {
        console.log('ress', res)
        this.$router.push("/");
      }).catch((error) => {
        console.log(error)
        if (error.response.data) {
          console.log(error.response.data.error.message)
          alert(error.response.data.error.message)
          this.isLoading = false
          this.isSignInDisabled = false
        }
      })
  },
  },
};
</script>
<style scoped>
.nuxt-link {
  text-decoration: none;
  padding-top: 5px;
}
.card-border {
  border-radius: 20px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.hr-sect {
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: rgba(0, 0, 0, 0.9);
  margin: 8px 0;
}
.hr-sect::before,
.hr-sect::after {
  content: "";
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.15);
  height: 1px;
  font-size: 0;
  line-height: 0;
  margin: 0 8px;
}
</style>