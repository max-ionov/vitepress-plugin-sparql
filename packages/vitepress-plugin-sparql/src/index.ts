import {Plugin} from "vite";
import SparqlForm from './SparqlForm.vue';

type StringFunctionMap = Record<string, (input: string) => string>;

function objToSafeJSON(obj: any) {
    return JSON.stringify(obj)
        .replace(/"/g, '&quot;')    // Escape double quotes
        .replace(/'/g, '&#39;')     // Escape single quotes
        .replace(/`/g, '&#96;');    // Escape backticks

}

function parseSparqlBlock(block: string, md: any) {
    let params = block.match(/```json params(.*?)```/s)?.[1] ?? "{}";
    let sparql = block.match(/```sparql(.*?)```/s)?.[1] ?? "";
    let template = block.match(/```(html|markdown) result(.*?)```/s)?.slice(1,3) ?? [];

    const renderers: StringFunctionMap = {
        html: (input: string) => input,
        markdown: md.render ?? ((input: string) => input)
    };

    if(!template || !template[0]) {
        console.error('No template found: ', block);
        template = ['markdown', '**Error**: No template found.'];
    }

    return {
        config: objToSafeJSON(JSON.parse(params.trim())),
        sparql: objToSafeJSON(sparql),
        template: objToSafeJSON(renderers[template[0]](template[1]))
    }
}

export { SparqlForm }

export function SparqlPlugin(): Plugin {
    let markdown: any;

    return {
        name: 'vitepress-plugin-sparql',
        enforce: 'pre',
        async configResolved(config) {
            try {
                const { createMarkdownRenderer } = await import('vitepress');
                markdown = await createMarkdownRenderer(config.root || ".");
            } catch(error) {
                console.error('Vitepress cannot be found:', error, 'Markdown rendering will not work.');
            }
        },
        transform(md, id) {
            if(!id.endsWith('.md'))
                return null;
            // replace SPARQL blocks here
            return md.replace(/:::form(.*?):::form/s, (_, capturedGroup) => {
                const { config, sparql, template } = parseSparqlBlock(capturedGroup, markdown);
                return `<SparqlForm :config='${config}' :sparql='${sparql}' :template="${template}"/>`;
            });
        }
    }
}