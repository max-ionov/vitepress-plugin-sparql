# VitePress SPARQL Plugin

A plugin for VitePress that extends the MarkDown syntax to allow 
SPARQL blocks for querying over RDF sources.

## Installation

To add the plugin to your VitePress project, run:

```bash
npm add vitepress-plugin-sparql
```

In your `vitepress/config.js` file, add the plugin:

```js
import { SparqlPlugin } from 'vitepress-plugin-sparql'

export default defineConfig({
    // ...
    vite: {
        plugins: [SparqlPlugin()]
    }
})
```

## Usage

SPARQL blocks can be created by adding a custom container `:::form:` that contains 
the following code blocks:
* `json params`: a JSON object with the endpoints and the parameters to use for the query
* `sparql`: the SPARQL query

The first code block must contain an array of endpoints to query,
the output format of the query (currently only `table` is supported),
and an array of parameters to use for the query:

~~~markdown
:::form

```json params
{
  "endpoints": [
    "https://kaiko.getalp.org/sparql"
  ],
  "output": "table",
  "parameters": [
    {
      "variable": "word",
      "type": "string",
      "label": "Word",
      "placeholder": "cat"
    }
  ]
}
```

```sparql
PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>
PREFIX lime: <http://www.w3.org/ns/lemon/lime#>
PREFIX vartrans: <http://www.w3.org/ns/lemon/vartrans#>
PREFIX decomp: <http://www.w3.org/ns/lemon/decomp#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT DISTINCT ?lang ?definition
WHERE {
    ?s a ontolex:LexicalEntry ;
       rdfs:label "${word}"@en ;
       ontolex:sense/skos:definition/rdf:value ?definition ;
       lime:language ?lang .
       
       FILTER(LANG(?definition) = "en")
} LIMIT 100
```
:::form
~~~

This generates a form asking a user to enter an English word, and on submit it sends a 
SPARQL request to DBnary requesting for a definition of that word in English,
outputting the results in a table.