import { visit } from 'unist-util-visit';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function remarkMermaid() {
  return (tree, file) => {
    let diagramCount = 0;

    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.lang?.toLowerCase() !== 'mermaid') return;

      diagramCount += 1;
      const source = node.value.trim();
      const encoded = Buffer.from(source, 'utf-8').toString('base64');

      parent.children[index] = {
        type: 'html',
        value: `<figure class="mermaid-figure not-prose" data-mermaid-b64="${encoded}">
  <div class="mermaid-toolbar">
    <span class="mermaid-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M8.5 7.5 11 15.5"/><path d="M15.5 7.5 13 15.5"/></svg>
      Diagram ${diagramCount}
    </span>
    <button type="button" class="mermaid-expand-btn" aria-label="Expand diagram ${diagramCount}" title="Expand diagram">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
      <span>Expand</span>
    </button>
  </div>
  <div class="mermaid-canvas">
    <pre class="mermaid-fallback">${escapeHtml(source)}</pre>
  </div>
</figure>`,
      };
    });

    if (file.data?.astro?.frontmatter) {
      file.data.astro.frontmatter.diagramCount = diagramCount;
    }
  };
}
