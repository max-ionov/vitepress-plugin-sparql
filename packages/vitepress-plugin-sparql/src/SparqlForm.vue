<script setup lang="ts">

import {reactive, computed, ref} from 'vue';
import {QueryEngine} from "@comunica/query-sparql";

type SparqlFormProps = {
  config: Record<string, any>;
  sparql: string;
  template: string;
}

const props = defineProps<SparqlFormProps>();

for (let param of props.config.parameters ?? []) {
  param.value = param.value ?? "";
}

const btnSubmitDisabled = ref(false);
const queryEngine = new QueryEngine();

const results = ref<Array<Record<string, any>>>([]);
const resultsLoading = ref(false);

const getQueryResults = async (sparql: QueryEngine,
                               query: string,
                               endpoints: string[]) => {
  const bindingsStream = await sparql.queryBindings(query, { sources: [endpoints[0], ...endpoints.slice(1)]})
  const bindings = await bindingsStream?.toArray()


  let result: Array<Record<string, any>> = [];

  for (let row of bindings) {
    const entryObject: Record<string, any> = {};
    for (const [key, value] of row) {
      entryObject[key.value] = value.value;
    }
    result.push(entryObject);
  }

  return result
}

const btnSubmitStyle = reactive({
  cursor: computed(() => btnSubmitDisabled.value ? 'wait' : 'pointer')
});

const btnClick = async () => {
  btnSubmitDisabled.value = true;
  let query = props.sparql;
  for (let param of props.config.parameters) {
    query = query.replace(new RegExp(`\\$\\{${param.variable}\\}`, 'g'), param.value);
  }

  resultsLoading.value = true;
  results.value = await getQueryResults(queryEngine,
      query, props.config.endpoints);
  resultsLoading.value = false;
  btnSubmitDisabled.value = false;
}

</script>

<template>
  <form onsubmit="return false">
    <div v-for="item in props.config.parameters" :key="item.variable">
      <label>{{ item.label }}</label>
      <input type="text" v-model="item.value" :placeholder="item.placeholder ?? 'Enter value'">
    </div>
    <button id="btnSubmit"
            @click="btnClick"
            :style="btnSubmitStyle"
            :disabled="btnSubmitDisabled">{{ props.config.submit ?? "Execute" }}</button>
  </form>

  <div v-if="results?.length || resultsLoading">
    <table v-if="!resultsLoading">
      <thead>
      <tr><td v-for="(_, value) in results[0]">{{ value }}</td></tr>
      </thead>
      <tbody>
      <tr v-for="item in results">
        <td v-for="value in item">{{ value }}</td>
      </tr>
      </tbody>
    </table>
    <div v-else>Loading...</div>
  </div>
</template>

<style scoped>
thead td {
  font-weight: bold;
}
form {
  padding: 22px 24px;
  border-radius: 8px;
  box-shadow: var(--vp-shadow-4);
  margin-bottom: 1.2em;
  transition: background-color .5s ease;
}

form * {
  margin: .4em .2em;
}

form button {
  background-color: var(--vp-button-alt-bg);
  transition: background-color .5s;
  padding: .2em .6em;
  margin-left: .4em;
  border: 1px solid var(--vp-button-alt-border);
  color: var(--vp-button-alt-active-text);
  border-radius: 8px;
  font-size: .9em;
  font-weight: 600;
}

form input {
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 0.2em 0.6em;
  margin-top: .6em;
  background: transparent;
  transition: background-color .5s;
}
</style>