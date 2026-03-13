/**
 * Example: React component using classsection for class management.
 *
 * Before (without classsection):
 *   <section className="hero-section">
 *
 * After (with classsection):
 *   <section className={sectionClass('hero-section', { custom: customClass, modifiers: { dark } })}>
 */

import { sectionClass } from 'classsection';

export function HeroSection({ title, subtitle, customClass, dark = false }) {
  return (
    <section className={sectionClass('hero-section', { custom: customClass, modifiers: { dark } })}>
      <div className="hero-section__container">
        <h1 className="hero-section__title">{title}</h1>
        <p className="hero-section__subtitle">{subtitle}</p>
      </div>
    </section>
  );
}

// Usage:
// <HeroSection title="Welcome" customClass="my-promo" dark />
// Renders: <section class="hero-section hero-section--dark my-promo">
