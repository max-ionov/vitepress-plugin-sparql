# Simple example

This is a simple example of using the plugin.
We are going to create a special block that contain our form definition and a code block with the SPARQL query.
Here we are going to query DBnary to extract English definitions of a word in any language represented there. 

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
    },
    {
      "variable": "lang",
      "type": "string",
      "label": "Language (ISO code)",
      "placeholder": "en"
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
       rdfs:label "${word}"@${lang} ;
       ontolex:sense/skos:definition/rdf:value ?definition ;
       lime:language ?lang .
       
       FILTER(LANG(?definition) = "en")
} LIMIT 100
```
:::form