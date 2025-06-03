# Federated example

This is a more complex example showing SPARQL capabilities for federated queries,
i.e. querying over several sources. We are going to repeat the same query as we have seen in 
the [Turtle source example](./ttl-example.md), but this time we will also fetch definitions from DBnary.
:::form
```json params
{
  "endpoints": [
    "https://raw.githubusercontent.com/max-ionov/aspect-db/refs/heads/main/rdf/aspect_bs.ttl",
    "https://raw.githubusercontent.com/max-ionov/aspect-db/refs/heads/main/rdf/aspect_hr.ttl",
    "https://raw.githubusercontent.com/max-ionov/aspect-db/refs/heads/main/rdf/aspect_sr.ttl"
  ],
  "output": "table",
  "parameters": [
    {
      "variable": "verb",
      "type": "string",
      "label": "Verb",
      "placeholder": "biti"
    }
  ]
}
```

```sparql
PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>
PREFIX lime: <http://www.w3.org/ns/lemon/lime#>
PREFIX vartrans: <http://www.w3.org/ns/lemon/vartrans#>
PREFIX decomp: <http://www.w3.org/ns/lemon/decomp#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT DISTINCT ?lemma ?language ?definition
WHERE {
    SERVICE <https://kaiko.getalp.org/sparql> {
        ?dbpedia_entry a ontolex:LexicalEntry ;
           ontolex:canonicalForm/ontolex:writtenRep "${verb}"@sh ;
           ontolex:sense/skos:definition/rdf:value ?definition .
           #FILTER(LANG(?definition) = "en")
        }
       
    ?lexicon lime:entry ?s ;
             lime:language ?language .
    ?s a ontolex:LexicalEntry .
    ?s ontolex:canonicalForm ?form  .
    ?form ontolex:writtenRep "${verb}" .
    
    ?rel vartrans:source ?s .
    ?rel vartrans:target ?s2 .
    ?s2 ontolex:canonicalForm/ontolex:writtenRep ?lemma .
}
```
:::form