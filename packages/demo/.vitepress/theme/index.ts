import type { Theme } from 'vitepress'
import DefaultTheme from "vitepress/theme";

// TODO: remove the comment after publishing the package on npm
// @ts-ignore
import SparqlForm from 'vitepress-plugin-sparql/SparqlForm.vue';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('SparqlForm', SparqlForm)
    }
} satisfies Theme