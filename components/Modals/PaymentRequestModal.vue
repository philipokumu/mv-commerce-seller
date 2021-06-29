<template>
  <div>
    <overlay :active="toggle" />
    <div
      class="bg-white h-full md:h-auto w-full md:max-w-md fixed top-0 left-0 md:top-1/2 md:left-1/2 transform md:-translate-y-1/2 md:-translate-x-1/2 transition-all shadow-md md:rounded overflow-x-hidden overflow-y-auto z-20 lg:z-40"
      :class="{
        'scale-50 invisible opacity-0': !toggle,
        'scale-100 visible opacity-100': toggle
      }"
      @click.stop=""
    >
      <div class="p-4 sticky top-0 bg-white flex items-center justify-between">
        <p class="text-lg font-semibold">Payment Details</p>
        <button
          class="h-8 w-8 grid place-items-center ring-secondary-500 hover:bg-gray-50 focus:bg-gray-50 focus:ring-2 transition rounded-full focus:outline-none"
          @click.stop="$emit('closeModal')"
        >
          <div class="h-2/3 w-2/3">
            <close-icon />
          </div>
        </button>
      </div>
      <div class="p-4 grid grid-cols-2">
        <button
          class="py-2 px-4 block hover:text-primary-500 focus:text-primary-500 focus:outline-none"
          :class="{
            'text-primary-500 border-b-2 border-primary-500': tab === 'list'
          }"
          @click="tab = 'list'"
        >
          Payment Details
        </button>
        <button
          class="py-2 px-4 block hover:text-primary-500 focus:text-primary-500 focus:outline-none"
          :class="{
            'text-primary-500 border-b-2 border-primary-500': tab === 'new'
          }"
          @click="tab = 'new'"
        >
          Add New
        </button>
      </div>
      <div v-if="tab === 'list'" class="p-4">
        <div v-if="paymentDetails && paymentDetails.length > 0">
          <form
            autocomplete="off"
            class="w-full"
            @submit.prevent="completeRequest"
          >
            <label
              v-for="(detail, index) in paymentDetails"
              :key="index"
              :for="`paymentDetail-${index + 1}`"
              class="mb-4 p-4 border flex items-center justify-between rounded"
              :class="{
                'bg-green-200 ring-2 ring-green-500':
                  invoice.paymentDetail_id === detail.data.payment_details_id
              }"
            >
              <div>
                <input
                  :id="`paymentDetail-${index + 1}`"
                  v-model="invoice.paymentDetail_id"
                  name="payment-detail"
                  type="radio"
                  :value="detail.data.payment_details_id"
                  class="hidden"
                />
                <p class="text-lg font-semibold uppercase">
                  {{ detail.data.attributes.payment_mode }}
                </p>
                <p class="text-gray-500">
                  {{ detail.data.attributes.account }}
                </p>
              </div>
              <button
                type="button"
                class="h-8 w-8 grid place-items-center ring-red-500 hover:bg-gray-50 focus:bg-gray-50 focus:ring-2 rounded-full focus:outline-none"
                :class="{ 'pointer-events-none': busy }"
                :disabled="busy"
                @click="deletePaymentDetails(detail.data.payment_details_id)"
              >
                <div v-if="!busy" class="h-2/3 w-2/3">
                  <delete-icon />
                </div>
                <spinner v-if="busy" color="red" />
              </button>
            </label>
            <button
              class="mt-6 py-3 px-6 block w-full text-white shadow-md transition rounded focus:outline-none"
              :disabled="busy"
              :class="{
                'bg-green-500 shadow-md hover:bg-green-600 focus:bg-green-600':
                  invoice.paymentDetail_id,
                'pointer-events-none bg-gray-500 ': !invoice.paymentDetail_id,
                'pointer-events-none': invoiceBusy
              }"
            >
              <span v-if="!invoiceBusy"> Complete Request </span>
              <spinner v-if="invoiceBusy" class="mx-auto" />
            </button>
          </form>
        </div>
        <div v-else>
          <p class="mb-2 text-center">You have no payment details yet.</p>
          <button
            class="mx-auto py-2 px-4 flex items-center text-white bg-green-500 hover:bg-green-600 focus:bg-green-600 rounded shadow-md transition focus:outline-none"
            @click="tab = 'new'"
          >
            <div class="h-5 w-5">
              <add-icon />
            </div>
            <p class="mx-auto">Add New</p>
          </button>
        </div>
      </div>
      <div v-if="tab === 'new'" class="p-4">
        <div v-if="paymentDetails && paymentDetails.length === 3">
          <p class="text-center">You have maximum amount of payment details.</p>
        </div>
        <form
          v-else
          autocomplete="off"
          class="w-full"
          @submit.prevent="submitForm"
        >
          <div class="mb-4">
            <label for="paymentMode" class="block leading-8">
              Payment Method
            </label>
            <select
              id="paymentMode"
              v-model="data.payment_mode"
              class="py-3 px-6 border block w-full bg-white ring-secondary-500 focus:ring-2 transition rounded focus:outline-none"
              required
            >
              <option :value="null">Select Payment Method</option>
              <option value="mpesa">M-Pesa</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="accountNumber" class="block leading-8">
              Account Number
            </label>
            <textarea
              id="accountNumber"
              v-model="data.account"
              rows="3"
              class="py-3 px-6 border block w-full ring-secondary-500 focus:ring-2 transition rounded focus:outline-none"
              required
            ></textarea>
          </div>
          <button
            class="mt-6 py-3 px-6 block w-full bg-secondary-600 text-white shadow-md hover:bg-secondary-700 focus:bg-secondary-700 transition rounded focus:outline-none"
            :disabled="busy"
            :class="{ 'pointer-events-none': busy }"
          >
            <span v-if="!busy"> Save Payment Information </span>
            <spinner v-else class="mx-auto" />
          </button>
        </form>
      </div>
      <footer class="p-4">
        <div class="flex items-center">
          <button
            class="py-2 px-4 block hover:bg-gray-50 focus:bg-gray-100 transition rounded focus:outline-none"
            @click.stop="$emit('closeModal')"
          >
            Cancel
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AddIcon from '../Icons/AddIcon.vue';
import CloseIcon from '../Icons/CloseIcon.vue';
import DeleteIcon from '../Icons/DeleteIcon.vue';
import Overlay from '../Widgets/Overlay.vue';
import Spinner from '../Widgets/Spinner.vue';

export default {
  name: 'PaymentRequestModal',
  components: {
    CloseIcon,
    Overlay,
    Spinner,
    AddIcon,
    DeleteIcon
  },
  props: {
    toggle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tab: 'list',
      data: {
        payment_mode: null,
        account: null
      },
      invoice: {
        paymentDetail_id: null
      }
    };
  },
  computed: {
    ...mapGetters({
      busy: 'paymentDetails/busy',
      invoiceBusy: 'invoices/busy',
      paymentDetails: 'paymentDetails/paymentDetails'
    })
  },
  watch: {
    toggle: {
      immediate: true,
      handler() {
        if (this.toggle === true) {
          this.getPaymentDetails();
        }
      }
    }
  },
  mounted() {
    this.closeModal();
  },
  methods: {
    ...mapActions({
      getPaymentDetails: 'paymentDetails/get',
      addPaymentDetails: 'paymentDetails/create',
      deletePaymentDetails: 'paymentDetails/delete',
      requestInvoice: 'invoices/request'
    }),
    closeModal() {
      if (this.toggle) {
        window.onclick = () => {
          this.$emit('closeModal');
        };
      }
    },
    submitForm() {
      this.addPaymentDetails(this.data).then(() => {
        for (const key in this.data) {
          this.data[key] = null;
        }
        this.tab = 'list';
      });
    },
    completeRequest() {
      this.requestInvoice(this.invoice).then(() => {
        this.invoice.paymentDetail_id = null;
        this.closeModal();
      });
    }
  }
};
</script>
