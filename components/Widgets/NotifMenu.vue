<template>
  <div class="relative">
    <button
      class="h-10 w-10 grid place-items-center ring-primary-500 hover:bg-gray-50 focus:bg-gray-50 focus:ring-2 transition rounded-full focus:outline-none"
      @click.stop="toggleMenu"
    >
      <div class="h-2/3 w-2/3">
        <div v-if="busy"></div>
        <div v-else>
          <div
            v-if="unreadNotifications && unreadNotifications.length > 0"
            class="h-4 w-4 absolute -top-1 -left-1 text-white bg-red-500 rounded-full"
          >
            <p class="text-sm leading-4 text-center">
              {{ unreadNotifications.length }}
            </p>
          </div>
        </div>
        <bell-icon />
      </div>
    </button>
    <div
      class="absolute top-full right-0 z-10 transform translate-y-2 origin-top-right transition-all bg-white shadow-md rounded overflow-hidden"
      :class="{
        'scale-50 opacity-0 invisible': !open,
        'scale-100 opacity-100 visible': open
      }"
    >
      <div v-if="busy" class="p-4">
        <spinner color="primary" class="mx-auto" />
      </div>
      <div v-else>
        <div>
          <ul
            v-if="unreadNotifications && unreadNotifications.length > 0"
            class="divide-y"
          >
            <li
              v-for="(notification, index) in unreadNotifications"
              :key="index"
              class="m-1"
            >
              <nuxt-link
                to="#"
                class="py-2 px-4 block rounded hover:bg-gray-50 focus:bg-gray-50 transition focus:outline-none"
              >
                <p class="text-sm">
                  {{ notification.data.attributes.data.message }}
                </p>
              </nuxt-link>
            </li>
          </ul>
          <div v-else class="p-4">
            <p class="whitespace-nowrap">You have no notifications.</p>
          </div>
        </div>
        <div>
          <ul
            v-if="readNotifications && readNotifications.length > 0"
            class="divide-y"
          >
            <li
              v-for="(notification, index) in readNotifications"
              :key="index"
              class="m-1"
            >
              <nuxt-link
                to="#"
                class="py-2 px-4 block rounded hover:bg-gray-50 focus:bg-gray-50 transition focus:outline-none"
              >
                <p class="text-sm">
                  {{ notification.data.attributes.data.message }}
                </p>
              </nuxt-link>
            </li>
          </ul>
          <div v-else class="p-4">
            <p class="whitespace-nowrap">You have no notifications.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BellIcon from '../Icons/BellIcon.vue';
import Spinner from './Spinner.vue';

export default {
  name: 'AccountMenu',
  components: {
    BellIcon,
    Spinner
  },
  data() {
    return {
      open: false
    };
  },
  computed: {
    ...mapGetters({
      busy: 'notifications/busy',
      readNotifications: 'notifications/readNotifications',
      unreadNotifications: 'notifications/unreadNotifications'
    })
  },
  created() {
    this.getReadNotifications();
    this.getUnreadNotifications();
  },
  methods: {
    toggleMenu() {
      this.open = !this.open;

      window.onclick = () => {
        this.open = false;
      };

      this.markAsRead();
    },
    ...mapActions({
      getReadNotifications: 'notifications/getRead',
      getUnreadNotifications: 'notifications/getUnread',
      markAsRead: 'notifications/markAsRead'
    })
  }
};
</script>
