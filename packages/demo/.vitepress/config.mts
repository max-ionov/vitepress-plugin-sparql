import { defineConfig } from 'vitepress'
import { SparqlPlugin } from 'vitepress-plugin-sparql'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vitepress SPARQL Plugin Demo",
  description: "A demo site showing how to use the SPARQL plugin for Vitepress to create Web interfaces for OntoLex dictionaries",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples/' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'A simple example', link: '/examples/simple-example' },
          { text: 'Turtle sources example', link: '/examples/ttl-example' },
          { text: 'Combining dictionaries', link: '/examples/federated-example' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/max-ionov/vitepress-plugin-sparql' },
    ]
  },
  vite: {
    plugins: [SparqlPlugin()]
  }
})
