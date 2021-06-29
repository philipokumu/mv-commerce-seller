/* eslint-disable no-console */

export const state = () => ({
  readNotifications: null,
  unreadNotifications: null,
  busy: false,
  errors: null
});

export const getters = {
  readNotifications: state => state.readNotifications,
  unreadNotifications: state => state.unreadNotifications,
  busy: state => state.busy,
  errors: state => state.errors
};

export const mutations = {
  SET_READ_NOTIFICATIONS(state, payload) {
    state.readNotifications = payload;
  },

  SET_UNREAD_NOTIFICATIONS(state, payload) {
    state.unreadNotifications = payload;
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

  async getUnread({ getters, commit }, refresh) {
    commit('SET_ERRORS', null);
    commit('IS_BUSY', true);

    let unreadNotifications = getters.unreadNotifications;

    if (!unreadNotifications || unreadNotifications.length === 0 || refresh) {
      const res = await this.$axios.get('/unread/notifications');
      unreadNotifications = res.data.data;
    }

    commit('SET_UNREAD_NOTIFICATIONS', unreadNotifications);
    commit('IS_BUSY', false);
  },

  async getRead({ getters, commit }, refresh) {
    commit('SET_ERRORS', null);
    commit('IS_BUSY', true);

    let readNotifications = getters.readNotifications;

    if (!readNotifications || readNotifications.length === 0 || refresh) {
      const res = await this.$axios.get('/read/notifications');
      readNotifications = res.data.data;
    }

    commit('SET_READ_NOTIFICATIONS', readNotifications);
    commit('IS_BUSY', false);
  },

  async markAsRead({ getters, commit, dispatch }) {
    commit('SET_ERRORS', null);
    commit('IS_BUSY', true);

    const unreadNotifications = getters.unreadNotifications;

    if (!unreadNotifications || unreadNotifications.length < 1) return;
    await this.$axios
      .post('/unread/notifications?_method=PATCH')
      .then(() => {
        dispatch('getUnread', true);
        dispatch('getRead', true);
        commit('IS_BUSY', false);
      })
      .catch(err => {
        console.log(err);
        commit('IS_BUSY', false);
      });

    commit('SET_READ_NOTIFICATIONS', unreadNotifications);
    commit('IS_BUSY', false);
  }
};
