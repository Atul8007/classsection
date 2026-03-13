const { extractSchema, hasCustomClassSetting, addCustomClassSetting, rebuildSchemaTag } = require('../core/schema-parser');
const { injectCustomClass, hasCustomClassInMarkup } = require('../core/wrapper-injector');

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

// Schema parser tests
test('extract schema from valid content', () => {
  const content = '<div class="w">Hi</div>\n{% schema %}\n{"name":"Test","settings":[]}\n{% endschema %}';
  const s = extractSchema(content);
  assert(s !== null, 'should extract');
  assert(s.json.name === 'Test', 'should parse name');
});

test('extract schema with whitespace variations', () => {
  const content = '{%- schema -%}\n{"name":"X"}\n{%- endschema -%}';
  const s = extractSchema(content);
  assert(s !== null, 'should handle dash syntax');
  assert(s.json.name === 'X');
});

test('return null for no schema block', () => {
  assert(extractSchema('<div>Hi</div>') === null);
});

test('return null for malformed JSON', () => {
  assert(extractSchema('{% schema %}{bad json}{% endschema %}') === null);
});

test('hasCustomClassSetting returns false when absent', () => {
  assert(!hasCustomClassSetting({ settings: [{ id: 'title', type: 'text' }] }));
});

test('hasCustomClassSetting returns false when no settings array', () => {
  assert(!hasCustomClassSetting({}));
});

test('hasCustomClassSetting returns true when present', () => {
  assert(hasCustomClassSetting({ settings: [{ id: 'custom_class', type: 'text' }] }));
});

test('addCustomClassSetting adds to existing settings', () => {
  const schema = { settings: [{ id: 'title', type: 'text' }] };
  const updated = addCustomClassSetting(schema);
  assert(hasCustomClassSetting(updated));
  assert(updated.settings.length === 2);
});

test('addCustomClassSetting creates settings array if missing', () => {
  const schema = { name: 'Test' };
  const updated = addCustomClassSetting(schema);
  assert(hasCustomClassSetting(updated));
  assert(updated.settings.length === 1);
});

test('rebuildSchemaTag produces valid schema block', () => {
  const tag = rebuildSchemaTag({ name: 'Test', settings: [] });
  assert(tag.includes('{% schema %}'));
  assert(tag.includes('{% endschema %}'));
  assert(tag.includes('"name": "Test"'));
});

// Wrapper injector tests
test('inject custom class into wrapper', () => {
  const result = injectCustomClass('<div class="section-wrapper">Hi</div>');
  assert(result.injected === true);
  assert(result.content.includes('{{ section.settings.custom_class }}'));
  assert(result.content.includes('section-wrapper {{ section.settings.custom_class }}'));
});

test('skip injection if already present', () => {
  const content = '<div class="w {{ section.settings.custom_class }}">Hi</div>';
  assert(hasCustomClassInMarkup(content) === true);
  const result = injectCustomClass(content);
  assert(result.injected === false);
});

test('skip injection if no class attribute', () => {
  const result = injectCustomClass('<div id="test">Hi</div>');
  assert(result.injected === false);
});

test('inject into empty class attribute', () => {
  const result = injectCustomClass('<div class="">Hi</div>');
  assert(result.injected === true);
  assert(result.content.includes('class="{{ section.settings.custom_class }}"'));
});

// Summary
console.log(`\n${passed}/${passed + failed} tests passed`);
if (failed > 0) process.exit(1);
