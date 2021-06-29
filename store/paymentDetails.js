/* eslint-disable no-console */

export const state = () => ({
  paymentDetails: null,
  busy: false,
  errors: null
});

export const getters = {
  paymentDetails: state => state.paymentDetails,
  busy: state => state.busy,
  errors: state => state.errors
};

export const mutations = {
  SET_PAYMENT_DETAILS(state, payload) {
    state.paymentDetails = payload;
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

  async get({ getters, commit }, refresh) {
    commit('SET_ERRORS', null);
    commit('IS_BUSY', true);

    let paymentDetails = getters.paymentDetails;

    if (!paymentDetails || paymentDetails.length === 0 || refresh) {
      const res = await this.$axios.get('/paymentDetails');
      paymentDetails = res.data.data;
    }

    commit('SET_PAYMENT_DETAILS', paymentDetails);
    commit('IS_BUSY', false);
  },

  async create({ commit, dispatch }, data) {
    commit('SET_ERRORS', null);
    commit('IS_BUSY', true);

    await this.$axios
      .post('/paymentDetails', data)
      .then(() => {
        dispatch('get', true);
      })
      .catch(err => {
        console.log(err);
        commit('IS_BUSY', false);
      });
  },

  async delete({ commit, dispatch }, id) {
    if (!confirm('Are you sure? ')) return;

    commit('SET_ERRORS', null);
    commit('IS_BUSY', true);

    await this.$axios
      .delete(`/paymentDetails/${id}`)
      .then(() => {
        dispatch('get', true);
      })
      .catch(err => {
        console.log(err);
        commit('IS_BUSY', false);
      });
  }
};
