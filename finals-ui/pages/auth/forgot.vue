<template>
  <div class="d-flex align-center justify-center" style="height: 100%; padding: 50px">
    <v-card width="450" class="mx-auto card-border" outlined>
      <br>
      <v-img src="https://onepampanga.com/uploads/businesses/st-nicholas-college-of-business-and-technology/Logo/b9e7a14328350ab93acb98ce0a590eb0.jpg" max-height="150" contain></v-img>
      <br>

      <div class="mx-15">
        <v-text-field
          v-model="email"
          v-if="!code"
          :rules="emailRules"
          label="E-mail"
          prepend-inner-icon="mdi-email"
          outlined
          required
        ></v-text-field>
        <v-text-field
          v-if="code"
          v-model="password"
          :rules="passwordRules"
          label="New Password"
          type="password"
          prepend-inner-icon="mdi-lock"
          outlined
          required  
        ></v-text-field>
        <v-text-field
          v-if="code"
          v-model="passwordConfirmation"
          :rules="passwordRules"
          label="Confirm New Password"
          type="password"
          prepend-inner-icon="mdi-lock"
          outlined
          required
        ></v-text-field>
        <v-btn v-if="code" @click="reset()" :disabled="password && passwordConfirmation && !(password === passwordConfirmation)"  color="primary" block>
          Reset
        </v-btn>
        <v-btn v-if="!code" @click="login()" :disabled="!email" color="primary" block>
          Send email verification
        </v-btn>
      </div>

      <div class="hr-sect mx-15 my-5">or sign in with</div>

      <v-card-actions class="mb-10 text-center">
        <v-spacer></v-spacer>
          <NuxtLink to="/auth/login" class="nuxt-link">Go back to login</NuxtLink>
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
      code: null,
      valid: true,
      email: "",
      password: "",
      passwordConfirmation: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },
  mounted () {
    const code = this.$route.query.code;
    this.code = code
    console.log('dada', code)
  },
  methods: {
    async login() {
       try {
        const response = await fetch('http://localhost:1337/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert('Password reset email sent.');
        this.email = ''
      } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred while sending the reset email.');
      }
    },
    async reset() {
       try {
        const response = await fetch('http://localhost:1337/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: this.password, passwordConfirmation: this.passwordConfirmation, code: this.code}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert('Password has been reset successfully.');
      } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred while resetting the password.');
      }
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