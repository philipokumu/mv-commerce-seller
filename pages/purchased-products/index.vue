<template>
  <div>
    <div
      class="px-4 md:px-8 flex items-center bg-white shadow-md overflow-x-auto"
    >
      <nuxt-link
        to="?tab=all"
        class="py-3 px-6 transition focus:outline-none"
        :class="{
          'hover:text-primary-500 focus:text-primary-500': tab !== 'all',
          ' text-primary-500 border-b-2 border-primary-500': tab === 'all'
        }"
      >
        All
      </nuxt-link>
      <nuxt-link
        to="?tab=invoiced"
        class="py-3 px-6 transition focus:outline-none"
        :class="{
          'hover:text-primary-500 focus:text-primary-500': tab !== 'invoiced',
          ' text-primary-500 border-b-2 border-primary-500': tab === 'invoiced'
        }"
      >
        Invoiced
      </nuxt-link>
      <nuxt-link
        to="?tab=uninvoiced"
        class="py-3 px-6 transition focus:outline-none"
        :class="{
          'hover:text-primary-500 focus:text-primary-500': tab !== 'uninvoiced',
          ' text-primary-500 border-b-2 border-primary-500':
            tab === 'uninvoiced'
        }"
      >
        Uninvoiced
      </nuxt-link>
    </div>
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
        <button
          v-show="tab === 'uninvoiced' && products.length > 0"
          class="ml-auto mb-4 py-2 px-4 block text-white bg-green-600 hover:bg-green-700 focus:bg-green-700 rounded-full shadow-md transition focus:outline-none"
          @click.stop="openModal = true"
        >
          Request Payment
        </button>
        <payment-request-modal
          :toggle="openModal"
          @closeModal="openModal = false"
        />
        <div v-if="products && products.length > 0">
          <div class="w-full shadow-md rounded overflow-x-auto">
            <table class="w-full divide-y">
              <thead class="bg-gray-100 text-gray-500">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider whitespace-nowrap"
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider whitespace-nowrap"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider whitespace-nowrap"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider whitespace-nowrap"
                  >
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y">
                <tr v-for="(product, index) in products" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="mr-2 h-10 w-10 rounded overflow-hidden">
                        <img
                          :src="
                            product.data.attributes.productDetails.data
                              .attributes.cover_image.data.attributes.path
                          "
                          :alt="
                            product.data.attributes.productDetails.data
                              .attributes.preserve_name
                          "
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <p>
                        {{
                          product.data.attributes.productDetails.data.attributes
                            .preserve_name
                        }}
                      </p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p>
                      {{
                        product.data.attributes.productDetails.data.attributes
                          .currency
                      }}
                      {{
                        product.data.attributes.productDetails.data.attributes
                          .product_price
                      }}
                    </p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p>
                      {{ product.data.attributes.quantity }}
                    </p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p>
                      {{ product.data.attributes.currency }}
                      {{ product.data.attributes.total_price }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center">
          <div class="mb-2 mx-auto h-24 w-24 text-gray-300"><done-icon /></div>
          <p class="text-center font-poppins text-2xl font-semibold">
            No products yet.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DoneIcon from '@/components/Icons/DoneIcon.vue';
import PaymentRequestModal from '@/components/Modals/PaymentRequestModal.vue';

export default {
  components: { DoneIcon, PaymentRequestModal },
  layout: 'dashboard',
  data() {
    return {
      products: [],
      openModal: false
    };
  },
  computed: {
    ...mapGetters({
      busy: 'purchasedProducts/busy',
      purchasedProducts: 'purchasedProducts/purchasedProducts'
    }),
    tab() {
      if (!this.$route.query.tab) return 'all';
      return this.$route.query.tab;
    }
  },
  watch: {
    tab: {
      immediate: true,
      handler() {
        this.filterProducts(this.tab);
      }
    }
  },
  mounted() {
    this.closeSidebar();
  },
  created() {
    this.getPurchasedProducts().then(() => this.filterProducts(this.tab));
  },
  methods: {
    ...mapActions({
      closeSidebar: 'closeSidebar',
      getPurchasedProducts: 'purchasedProducts/get'
    }),
    filterProducts(status) {
      let products;

      if (!this.purchasedProducts) return;

      switch (status) {
        case 'all':
          products = this.purchasedProducts;
          break;

        case 'invoiced':
          products = this.purchasedProducts.filter(
            product => product.data.attributes.invoice_id !== null
          );
          break;

        case 'uninvoiced':
          products = this.purchasedProducts.filter(
            product => product.data.attributes.invoice_id === null
          );
          break;

        default:
          products = this.purchasedProducts;
          break;
      }

      return (this.products = products);
    }
  }
};
</script>
