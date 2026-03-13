/**
 * Build a section class string from a base class, optional modifiers, and custom classes.
 *
 * @example
 * sectionClass('hero', { custom: 'my-class', modifiers: { dark: true } })
 * // => 'hero hero--dark my-class'
 */
export function sectionClass(
  base: string,
  options?: {
    /** Custom class(es) to append */
    custom?: string;
    /** BEM-style modifiers — keys with truthy values are appended as base--key */
    modifiers?: Record<string, boolean>;
    /** Custom modifier prefix (default: '--') */
    prefix?: string;
  }
): string;

/**
 * Inject a class expression into the first HTML element's class attribute.
 *
 * @example
 * addCustomClass('<div class="hero">content</div>', '{{ section.settings.custom_class }}')
 * // => { content: '<div class="hero {{ section.settings.custom_class }}">content</div>', modified: true }
 */
export function addCustomClass(
  content: string,
  classExpression: string
): { content: string; modified: boolean };

/**
 * Merge multiple class sources into a single class string.
 * Accepts strings, arrays, and objects (keys with truthy values).
 *
 * @example
 * mergeSectionClasses('hero', { 'hero--dark': true, 'hero--light': false }, 'custom')
 * // => 'hero hero--dark custom'
 */
export function mergeSectionClasses(
  ...args: Array<string | string[] | Record<string, boolean> | null | undefined | false>
): string;
