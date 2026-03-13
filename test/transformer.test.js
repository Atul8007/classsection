const liquidTransformer = require('../transformers/liquid');
const htmlTransformer = require('../transformers/html');
const jsxTransformer = require('../transformers/jsx');
const vueTransformer = require('../transformers/vue');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('PASS:', name);
    passed++;
  } catch (e) {
    console.log('FAIL:', name, '-', e.message);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

// ── Liquid Transformer ──

test('liquid: injects schema setting and markup', () => {
  const content = '<div class="hero">Hi</div>\n{% schema %}\n{"name":"Hero","settings":[]}\n{% endschema %}';
  const r = liquidTransformer.transform(content);
  assert(r.modified === true);
  assert(r.content.includes('{{ section.settings.custom_class }}'));
  assert(r.content.includes('"id": "custom_class"'));
});

test('liquid: skips if already present', () => {
  const content = '<div class="hero {{ section.settings.custom_class }}">Hi</div>\n{% schema %}\n{"name":"Hero","settings":[{"id":"custom_class","type":"text"}]}\n{% endschema %}';
  const r = liquidTransformer.transform(content);
  assert(r.modified === false);
});

test('liquid: warns on no schema', () => {
  const r = liquidTransformer.transform('<div class="hero">Hi</div>');
  assert(r.modified === false);
  assert(r.warnings.length > 0);
});

// ── HTML Transformer ──

test('html: injects class expression', () => {
  const r = htmlTransformer.transform('<section class="hero">content</section>', { classExpr: 'custom-class' });
  assert(r.modified === true);
  assert(r.content.includes('hero custom-class'));
});

test('html: skips if already present', () => {
  const r = htmlTransformer.transform('<section class="hero custom-class">content</section>', { classExpr: 'custom-class' });
  assert(r.modified === false);
});

test('html: warns on no class attribute', () => {
  const r = htmlTransformer.transform('<section id="hero">content</section>');
  assert(r.modified === false);
  assert(r.warnings.length > 0);
});

// ── JSX Transformer ──

test('jsx: transforms static className', () => {
  const content = 'export function Hero() { return <section className="hero">Hi</section>; }';
  const r = jsxTransformer.transform(content);
  assert(r.modified === true);
  assert(r.content.includes('sectionClass'));
  assert(r.content.includes("import { sectionClass }"));
});

test('jsx: skips if sectionClass already used', () => {
  const content = "import { sectionClass } from 'classsection';\n<section className={sectionClass('hero')}>Hi</section>";
  const r = jsxTransformer.transform(content);
  assert(r.modified === false);
});

// ── Vue Transformer ──

test('vue: transforms static class', () => {
  const content = '<template>\n<section class="hero">\n  <h1>Hi</h1>\n</section>\n</template>';
  const r = vueTransformer.transform(content);
  assert(r.modified === true);
  assert(r.content.includes('sectionClass'));
});

test('vue: skips if sectionClass already used', () => {
  const content = '<template>\n<section :class="sectionClass(\'hero\')">\n  <h1>Hi</h1>\n</section>\n</template>';
  const r = vueTransformer.transform(content);
  assert(r.modified === false);
});

// Summary
console.log(`\n${passed}/${passed + failed} tests passed`);
if (failed > 0) process.exit(1);
