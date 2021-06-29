<template>
  <div class="min-h-screen lg:grid grid-cols-2">
    <div
      class="py-4 px-4 md:px-8 min-h-screen flex flex-col items-center justify-between"
    >
      <div></div>
      <div class="max-w-sm w-full">
        <div class="mb-6">
          <logo />
        </div>
        <div class="mb-6">
          <h1 class="mb-2 text-4xl font-poppins font-semibold">
            Seller Center
          </h1>
          <p class="text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing.
          </p>
        </div>
        <form autocomplete="off" class="w-full" @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="name" class="block leading-8">Name</label>
            <input
              id="name"
              v-model="data.name"
              type="text"
              class="px-6 py-3 block w-full border focus:outline-none ring-primary-600 focus:ring-2 transition rounded"
              required
            />
          </div>
          <div class="md:grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label for="email" class="block leading-8">Email</label>
              <input
                id="email"
                v-model="data.email"
                type="email"
                class="px-6 py-3 block w-full border focus:outline-none ring-primary-600 focus:ring-2 transition rounded"
                :class="{
                  'border-red-500':
                    errors.email || (serverErrors && serverErrors.email)
                }"
                required
              />
              <div class="text-sm text-red-500">
                <span v-if="errors.email">{{ errors.email }}</span>
                <span v-if="serverErrors && serverErrors.email">
                  {{ serverErrors.email[0] }}
                </span>
              </div>
            </div>
            <div class="mb-4">
              <label for="phoneNumber" class="block leading-8"
                >Phone Number</label
              >
              <input
                id="phoneNumber"
                v-model="data.phone"
                type="number"
                class="px-6 py-3 block w-full border focus:outline-none ring-primary-600 focus:ring-2 transition rounded"
                :class="{
                  'border-red-500':
                    errors.phone || (serverErrors && serverErrors.phone)
                }"
                required
              />
              <div class="text-sm text-red-500">
                <span v-if="errors.phone">{{ errors.phone }}</span>
                <span v-if="serverErrors && serverErrors.phone">
                  {{ serverErrors.phone[0] }}
                </span>
              </div>
            </div>
          </div>
          <div class="md:grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label for="password" class="block leading-8">Password</label>
              <input
                id="password"
                v-model="data.password"
                type="password"
                class="px-6 py-3 block w-full border focus:outline-none ring-primary-600 focus:ring-2 transition rounded"
                :class="{
                  'border-red-500': serverErrors && serverErrors.password
                }"
                required
              />
              <div class="text-sm text-red-500">
                <span v-if="serverErrors && serverErrors.password">
                  {{ serverErrors.password[0] }}
                </span>
              </div>
            </div>
            <div class="mb-4">
              <label for="passwordConfirmation" class="block leading-8"
                >Confirm Password</label
              >
              <input
                id="passwordConfirmation"
                v-model="data.password_confirmation"
                type="password"
                class="px-6 py-3 block w-full border focus:outline-none ring-primary-600 focus:ring-2 transition rounded"
                required
              />
            </div>
          </div>
          <button
            class="my-6 py-3 px-6 block w-full bg-primary-600 text-white shadow-md hover:bg-primary-700 focus:bg-primary-700 transition rounded focus:outline-none"
            :disabled="busy"
            :class="{ 'pointer-events-none': busy }"
          >
            <span v-if="!busy"> Register </span>
            <spinner v-else class="mx-auto" />
          </button>
          <p class="text-sm text-center">
            Already have an account?
            <nuxt-link
              to="/auth/login"
              class="text-blue-700 hover:text-blue-900 focus:text-blue-900 transition focus:outline-none"
            >
              Login
            </nuxt-link>
          </p>
        </form>
      </div>
      <p class="text-sm text-gray-500">
        &copy; 2021 Multiccommerce Seller Center
      </p>
    </div>
    <div class="hightlight hidden lg:block"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Spinner from '@/components/Widgets/Spinner.vue';
import Logo from '@/components/Icons/Logo.vue';

export default {
  auth: 'guest',
  components: { Spinner, Logo },
  layout: 'auth',
  data() {
    return {
      data: {
        name: null,
        email: null,
        phone: null,
        password: null,
        password_confirmation: null
      },
      errors: {
        email: null,
        phone: null,
        password: null
      }
    };
  },
  computed: {
    ...mapGetters({
      busy: 'authentication/busy',
      serverErrors: 'authentication/errors'
    })
  },
  mounted() {
    this.closeMenu();
  },
  created() {
    this.clearServerErrors();
  },
  methods: {
    ...mapActions({
      closeMenu: 'closeMenu',
      register: 'authentication/register',
      clearServerErrors: 'authentication/clearErrors'
    }),
    clearErrors() {
      for (const error in this.errors) {
        this.errors[error] = null;
      }
      this.clearServerErrors();
    },
    validate() {
      let valid = true;
      const re = /\S+@\S+\.\S+/;
      this.clearErrors();

      if (!re.test(this.data.email)) {
        this.errors.email = 'Invalid email address';
        valid = false;
      }

      return valid;
    },
    submitForm() {
      const valid = this.validate();

      if (!valid) return;

      this.register(this.data);
    }
  }
};
</script>

<style lang="scss" scoped>
.hightlight {
  background-image: url('@/assets/images/login-bg.svg');
}
</style>
