<!--
  Example: Vue component using classsection for class management.

  Before (without classsection):
    <section class="hero-section">

  After (with classsection):
    <section :class="sectionClass('hero-section', { custom: customClass, modifiers: { dark } })">
-->

<template>
  <section :class="sectionClass('hero-section', { custom: customClass, modifiers: { dark } })">
    <div class="hero-section__container">
      <h1 class="hero-section__title">{{ title }}</h1>
      <p class="hero-section__subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script>
import { sectionClass } from 'classsection';

export default {
  name: 'HeroSection',
  props: {
    title: { type: String, default: 'Welcome' },
    subtitle: { type: String, default: '' },
    customClass: { type: String, default: '' },
    dark: { type: Boolean, default: false },
  },
  methods: { sectionClass },
};
</script>
