<template>
  <div class="py-4 px-4 md:px-8 min-h-screen">
    <div class="mb-4 py-2 px-4 bg-white shadow-md rounded">
      <div class="py-2 flex items-center justify-between">
        <p class="text-lg font-semibold">Daily insights</p>
      </div>
      <line-chart v-if="loaded" :data="lineChartData" :options="options" />
    </div>
    <div class="md:grid grid-cols-2 gap-4">
      <div class="mb-4 md:mb-0 w-full bg-white shadow-md rounded">
        <div class="py-2 px-4">
          <p class="font-semibold">Popular products by amount paid</p>
        </div>
        <div class="w-full overflow-x-auto">
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
                  Amount paid
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y">
              <tr v-for="(product, index) in popularByAmount" :key="index">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="mr-2 h-10 w-10 rounded overflow-hidden">
                      <img
                        :src="
                          product.data.attributes.cover_image.data.attributes
                            .path
                        "
                        :alt="product.data.attributes.preserve_name"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <nuxt-link
                      :to="`/products/${product.data.attributes.slug}`"
                      class="hover:underline"
                    >
                      {{ product.data.attributes.preserve_name }}
                    </nuxt-link>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <p>
                    {{ product.data.attributes.currency }}
                    {{ product.meta.paid_amount_sum }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mb-4 md:mb-0 w-full bg-white shadow-md rounded">
        <div class="py-2 px-4">
          <p class="font-semibold">Popular products by number of orders</p>
        </div>
        <div class="w-full overflow-x-auto">
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
                  Orders
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y">
              <tr v-for="(product, index) in popularByOrder" :key="index">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="mr-2 h-10 w-10 rounded overflow-hidden">
                      <img
                        :src="
                          product.data.attributes.cover_image.data.attributes
                            .path
                        "
                        :alt="product.data.attributes.preserve_name"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <nuxt-link
                      :to="`/products/${product.data.attributes.slug}`"
                      class="hover:underline"
                    >
                      {{ product.data.attributes.preserve_name }}
                    </nuxt-link>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <p>
                    {{ product.meta.paid_order_count }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mb-4 md:mb-0 md:col-span-2 w-full bg-white shadow-md rounded">
        <div class="py-2 px-4">
          <p class="font-semibold">Popular products by quantity ordered</p>
        </div>
        <div class="w-full overflow-x-auto">
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
                  Quantity
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider whitespace-nowrap"
                >
                  Unit
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y">
              <tr v-for="(product, index) in popularByQuantity" :key="index">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="mr-2 h-10 w-10 rounded overflow-hidden">
                      <img
                        :src="
                          product.data.attributes.cover_image.data.attributes
                            .path
                        "
                        :alt="product.data.attributes.preserve_name"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <nuxt-link
                      :to="`/products/${product.data.attributes.slug}`"
                      class="hover:underline"
                    >
                      {{ product.data.attributes.preserve_name }}
                    </nuxt-link>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <p>
                    {{ product.meta.paid_quantity_sum }}
                  </p>
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <p>{{ product.data.attributes.product_unit }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LineChart from '@/components/Charts/LineChart.vue';

export default {
  components: {
    LineChart
  },
  layout: 'dashboard',
  data() {
    return {
      loaded: false,
      lineChartData: {
        labels: [],
        datasets: [
          {
            data: [],
            label: 'Revenue in Ksh',
            borderColor: '#A855F7',
            backgroundColor: 'rgba(54,73,93,.5)',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM D'
                }
              },
              gridLines: {
                borderDash: [8, 4],
                color: '#F3F4F6'
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                borderDash: [8, 4],
                color: '#F3F4F6',
                ticks: {}
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      orders: 'insights/orders/orders',
      popularByAmount: 'insights/popularProducts/popularByAmount',
      popularByQuantity: 'insights/popularProducts/popularByQuantity',
      popularByOrder: 'insights/popularProducts/popularByOrder'
    })
  },
  mounted() {
    this.closeSidebar();
    this.getChartData();
  },
  created() {
    this.getPopularProducts('amount');
    this.getPopularProducts('quantity');
    this.getPopularProducts('order');
  },
  methods: {
    ...mapActions({
      closeSidebar: 'closeSidebar',
      getOrdersInsights: 'insights/orders/get',
      getPopularProducts: 'insights/popularProducts/get'
    }),
    async getChartData() {
      await this.getOrdersInsights();

      for (let i = 0; i < this.orders.length; i++) {
        const orderDateLabel = this.orders[i].paid_at;
        const orderAmount = this.orders[i].seller_amount;
        this.lineChartData.labels.push(orderDateLabel);
        this.lineChartData.datasets[0].data.push(orderAmount);
      }
      this.loaded = true;
    }
  }
};
</script>
