const { sectionClass, addCustomClass, mergeSectionClasses } = require('../src/index');

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

function eq(a, b) {
  assert(a === b, `expected "${b}", got "${a}"`);
}

// ── sectionClass ──

test('sectionClass: base only', () => {
  eq(sectionClass('hero'), 'hero');
});

test('sectionClass: base with custom class', () => {
  eq(sectionClass('hero', { custom: 'my-class' }), 'hero my-class');
});

test('sectionClass: base with modifiers', () => {
  eq(sectionClass('hero', { modifiers: { dark: true, mobile: false } }), 'hero hero--dark');
});

test('sectionClass: base with modifiers and custom', () => {
  eq(
    sectionClass('hero', { custom: 'my-custom-class', modifiers: { dark: true, mobile: false } }),
    'hero hero--dark my-custom-class'
  );
});

test('sectionClass: custom prefix', () => {
  eq(sectionClass('hero', { modifiers: { dark: true }, prefix: '-' }), 'hero hero-dark');
});

test('sectionClass: empty base', () => {
  eq(sectionClass(''), '');
});

test('sectionClass: no args', () => {
  eq(sectionClass(), '');
});

test('sectionClass: empty custom is ignored', () => {
  eq(sectionClass('hero', { custom: '' }), 'hero');
});

test('sectionClass: whitespace custom is ignored', () => {
  eq(sectionClass('hero', { custom: '  ' }), 'hero');
});

test('sectionClass: multiple modifiers', () => {
  eq(
    sectionClass('card', { modifiers: { active: true, highlighted: true, disabled: false } }),
    'card card--active card--highlighted'
  );
});

// ── addCustomClass ──

test('addCustomClass: inject into class attribute', () => {
  const r = addCustomClass('<div class="hero">content</div>', 'extra');
  assert(r.modified === true);
  eq(r.content, '<div class="hero extra">content</div>');
});

test('addCustomClass: skip if already present', () => {
  const r = addCustomClass('<div class="hero extra">content</div>', 'extra');
  assert(r.modified === false);
});

test('addCustomClass: inject into empty class', () => {
  const r = addCustomClass('<div class="">content</div>', 'extra');
  assert(r.modified === true);
  eq(r.content, '<div class="extra">content</div>');
});

test('addCustomClass: no class attribute returns unmodified', () => {
  const r = addCustomClass('<div id="test">content</div>', 'extra');
  assert(r.modified === false);
});

test('addCustomClass: null content', () => {
  const r = addCustomClass(null, 'extra');
  assert(r.modified === false);
  eq(r.content, '');
});

test('addCustomClass: null expression', () => {
  const r = addCustomClass('<div class="hero">x</div>', null);
  assert(r.modified === false);
});

test('addCustomClass: Liquid expression', () => {
  const r = addCustomClass(
    '<section class="hero-section">content</section>',
    '{{ section.settings.custom_class }}'
  );
  assert(r.modified === true);
  assert(r.content.includes('hero-section {{ section.settings.custom_class }}'));
});

// ── mergeSectionClasses ──

test('mergeSectionClasses: strings', () => {
  eq(mergeSectionClasses('hero', 'dark', 'custom'), 'hero dark custom');
});

test('mergeSectionClasses: with object', () => {
  eq(
    mergeSectionClasses('hero', { 'hero--dark': true, 'hero--light': false }),
    'hero hero--dark'
  );
});

test('mergeSectionClasses: with array', () => {
  eq(mergeSectionClasses('hero', ['extra', 'more']), 'hero extra more');
});

test('mergeSectionClasses: with nulls and falsy values', () => {
  eq(mergeSectionClasses('hero', null, undefined, false, '', 'custom'), 'hero custom');
});

test('mergeSectionClasses: empty', () => {
  eq(mergeSectionClasses(), '');
});

test('mergeSectionClasses: nested arrays', () => {
  eq(mergeSectionClasses(['a', ['b', 'c']]), 'a b c');
});

test('mergeSectionClasses: mixed', () => {
  eq(
    mergeSectionClasses('base', ['arr'], { obj: true, skip: false }, 'end'),
    'base arr obj end'
  );
});

// Summary
console.log(`\n${passed}/${passed + failed} tests passed`);
if (failed > 0) process.exit(1);
