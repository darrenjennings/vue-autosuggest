import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import filesize from "rollup-plugin-filesize";
import uglify from "rollup-plugin-uglify";
import json from "rollup-plugin-json";

export default {
  input: "src/vue-autosuggest.js",
  plugins: [
    vue({ compileTemplate: true, css: false }),
    json(),
    buble({
      objectAssign: "Object.assign",
      jsx: "h"
    }),
    filesize(),
    uglify()
  ],
  output: [
    {
      file: `dist/vue-autosuggest.esm.js`,
      format: "es"
    }
  ]
};
