<template>
  <div class="py-4 px-4 md:px-8">
    <div v-if="busy">
      <div
        class="clone mb-4 relative h-12 rounded-lg bg-gray-100 overflow-hidden"
      ></div>
      <div class="clone mb-4 relative bg-gray-100 rounded-lg overflow-hidden">
        <div class="h-12 border-b border-white"></div>
        <div class="h-12"></div>
        <div class="h-12"></div>
      </div>
      <div
        class="clone mb-4 relative h-12 rounded-lg bg-gray-100 overflow-hidden"
      ></div>
    </div>
    <div v-else>
      <div v-if="categories && categories.length > 0">
        <div class="w-full shadow-md rounded overflow-x-auto">
          <table class="w-full divide-y">
            <thead class="bg-gray-100 text-gray-500">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider whitespace-nowrap"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider whitespace-nowrap"
                >
                  Sub Categories
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y">
              <tr v-for="(category, index) in categories" :key="index">
                <td class="px-6 py-4 whitespace-nowrap">
                  <p>{{ category.data.attributes.name }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p>
                    {{ category.data.attributes.subCategories.data.length }}
                  </p>
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap text-right">
                  <nuxt-link
                    :to="`/categories/${category.data.attributes.slug}`"
                    class="ml-2 inline-block text-green-500 hover:text-green-600 focus:text-green-600 focus:outline-none"
                  >
                    View
                  </nuxt-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center">
        <div class="mb-2 mx-auto h-24 w-24 text-gray-300">
          <category-icon />
        </div>
        <p class="text-center font-poppins text-2xl font-semibold">
          No categories yet.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CategoryIcon from '@/components/Icons/CategoryIcon.vue';

export default {
  components: { CategoryIcon },
  layout: 'dashboard',
  computed: {
    ...mapGetters({
      busy: 'categories/busy',
      categories: 'categories/categories'
    })
  },
  mounted() {
    this.closeSidebar();
  },
  created() {
    this.getCategories();
  },
  methods: {
    ...mapActions({
      closeSidebar: 'closeSidebar',
      getCategories: 'categories/get'
    })
  }
};
</script>
