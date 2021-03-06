<template>
  <div>
    <title-bar page-title="View Category" back />
    <div v-if="busy" class="p-4">
      <spinner color="secondary" class="mx-auto" />
    </div>
    <div v-else>
      <div v-if="category && category.data">
        <header class="bg-white shadow-md">
          <div class="container mx-auto py-4 px-4 md:px-8 flex items-center">
            <p class="text-2xl font-semibold">
              {{ category.data.attributes.name }}
            </p>
          </div>
        </header>
        <div class="container mx-auto py-4 px-4 md:px-8">
          <div
            v-if="
              category.data.attributes.subCategories.data &&
              category.data.attributes.subCategories.data.length > 0
            "
          >
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
                      Products
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y">
                  <tr
                    v-for="(subCategory, index) in category.data.attributes
                      .subCategories.data"
                    :key="index"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="mr-2 h-10 w-10 rounded overflow-hidden">
                          <img
                            :src="
                              subCategory.data.attributes.subCategoryImage.data
                                .attributes.path
                            "
                            :alt="subCategory.data.attributes.name"
                            class="h-full w-full object-cover"
                          />
                        </div>
                        <p>{{ subCategory.data.attributes.name }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <p>
                        {{
                          subCategory.data.attributes.productDetails.data.length
                        }}
                      </p>
                    </td>
                    <td class="px-6 py-4 text-sm whitespace-nowrap text-right">
                      <nuxt-link
                        :to="`/categories/${categorySlug}/sub-category/${subCategory.data.attributes.slug}`"
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
              No sub categories yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TitleBar from '@/components/Navigation/TitleBar.vue';
import CategoryIcon from '@/components/Icons/CategoryIcon.vue';
import Spinner from '@/components/Widgets/Spinner.vue';

export default {
  components: { TitleBar, CategoryIcon, Spinner },
  data() {
    return {
      categorySlug: this.$route.params.slug
    };
  },
  computed: {
    ...mapGetters({
      category: 'categories/category',
      busy: 'categories/busy'
    })
  },
  created() {
    this.getCategory(this.$route.params.slug);
  },
  methods: {
    ...mapActions({
      getCategory: 'categories/view'
    })
  }
};
</script>
