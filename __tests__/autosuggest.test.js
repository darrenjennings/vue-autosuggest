import Vue from "vue/dist/vue";
import Autosuggest from "../src/index";

describe("Autosuggest", () => {
  Vue.use(Autosuggest);

  it("can mount", async () => {
    document.body.innerHTML = `
            <div id="app">
                <vue-autosuggest 
                  :suggestions="[]"
                  :on-selected="function(){}"
                  :current-query="'cool things'"
                  :placeholder="'placeholder'"
                  :input-props="{
                    onInputChange: function(){}
                  }">
                </vue-autosuggest>
            </div>
        `;

    createVm().then(() => {
      expect(document.body.innerHTML).toMatchSnapshot();
    });
  });
});

async function createVm(options = {}) {
  const vm = new Vue({
    el: "#app",
    ...options
  });

  await Vue.nextTick(() => {});

  const component = vm.$children[0];

  return component;
}
