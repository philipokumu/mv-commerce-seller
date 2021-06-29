/* eslint-disable no-console */

export const state = () => ({
  purchasedProducts: null,
  purchasedProduct: null,
  busy: false,
  errors: null
});

export const getters = {
  purchasedProducts: state => state.purchasedProducts,
  purchasedProduct: state => state.purchasedProduct,
  busy: state => state.busy,
  errors: state => state.errors
};

export const mutations = {
  SET_PURCHASED_PRODUCTS(state, payload) {
    state.purchasedProducts = payload;
  },

  SET_PURCHASED_PRODUCT(state, payload) {
    state.purchasedProduct = payload;
  },

  IS_BUSY(state, payload) {
    state.busy = payload;
  },

  SET_ERRORS(state, payload) {
    state.errors = payload;
  }
};

export const actions = {
  clearErrors({ commit }) {
    return commit('SET_ERRORS', null);
  },

  async get({ getters, commit }) {
    commit('SET_ERRORS', null);
    commit('IS_BUSY', true);

    let purchasedProducts = getters.purchasedProducts;

    if (!purchasedProducts || purchasedProducts.length === 0) {
      const res = await this.$axios.get('/purchased/cartItems');
      purchasedProducts = res.data.data;
    }

    commit('SET_PURCHASED_PRODUCTS', purchasedProducts);
    commit('IS_BUSY', false);
  }
};
