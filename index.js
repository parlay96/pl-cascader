import plCascader from './lib/classifyChoice'
export default {
  install (Vue, opts = {}) {
    Vue.component('plCascader', plCascader);
  }
}
