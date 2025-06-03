# Turtle sources example

This is a slightly more complex example showing querying over several Turtle files [hosted on GitHub](https://github.com/max-ionov/aspect-db/tree/main/rdf).
We are going to create a page searching for aspect pairs in 3 languages: Bosnian, Croatian and Serbian.

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
      "placeholder": "pisati"
    }
  ]
}
```

```sparql
PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>
PREFIX lime: <http://www.w3.org/ns/lemon/lime#>
PREFIX vartrans: <http://www.w3.org/ns/lemon/vartrans#>
PREFIX decomp: <http://www.w3.org/ns/lemon/decomp#>
        
        
SELECT ?lemma ?language
WHERE {
    ?lexicon lime:entry ?s ;
             lime:language ?language .
    ?s a ontolex:LexicalEntry .
    ?s ontolex:canonicalForm ?form  .
    ?form ontolex:writtenRep "${verb}" .
    {
        ?rel vartrans:source ?s .
        ?rel vartrans:target ?s2 .
        ?s2 ontolex:canonicalForm/ontolex:writtenRep ?lemma .
    }
    UNION
    {
        ?rel vartrans:source ?s2 .
        ?rel vartrans:target ?s .
        ?s2 ontolex:canonicalForm/ontolex:writtenRep ?lemma .
    }
}
```
:::form