<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed, provide, ref, useSlots, watch, onMounted, onUnmounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import VPBackdrop from 'vitepress/dist/client/theme-default/components/VPBackdrop.vue'
import VPContent from 'vitepress/dist/client/theme-default/components/VPContent.vue'
import VPFooter from 'vitepress/dist/client/theme-default/components/VPFooter.vue'
import VPLocalNav from 'vitepress/dist/client/theme-default/components/VPLocalNav.vue'
import VPNav from 'vitepress/dist/client/theme-default/components/VPNav.vue'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import VPSkipLink from 'vitepress/dist/client/theme-default/components/VPSkipLink.vue'
import { useData } from 'vitepress'
import { useCloseSidebarOnEscape, useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar'
import { withBase } from 'vitepress'

const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar()
const route = useRoute()
watch(() => route.path, closeSidebar)
useCloseSidebarOnEscape(isSidebarOpen, closeSidebar)

const { frontmatter, isDark } = useData()
const slots = useSlots()
const heroImageSlotExists = computed(() => !!slots['home-hero-image'])
provide('hero-image-slot-exists', heroImageSlotExists)

const isHome = computed(() => frontmatter.value?.layout === 'home')
const showSpotlight = computed(() => isHome.value && isDark.value)

const mouseX = ref('50%')
const mouseY = ref('50%')
const overlayStyle = computed(() => ({
  '--spotlight-x': mouseX.value,
  '--spotlight-y': mouseY.value,
}))

function onMouseMove(e: MouseEvent) {
  if (!showSpotlight.value) return
  const x = (e.clientX / window.innerWidth) * 100
  const y = (e.clientY / window.innerHeight) * 100
  mouseX.value = `${x}%`
  mouseY.value = `${y}%`
}

onMounted(() => {
  if (typeof document === 'undefined') return
  document.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('mousemove', onMouseMove)
})

const factoryImageUrl = withBase('/dark-factory-hero.png')
</script>

<template>
  <div v-if="frontmatter.layout !== false" class="Layout" :class="[frontmatter.pageClass, { 'has-spotlight': showSpotlight, 'has-home-bg': isHome }]">
    <!-- Homepage background: dark factory image (full page) -->
    <template v-if="isHome">
      <div class="home-bg" aria-hidden="true" :style="{ backgroundImage: `url(${factoryImageUrl})` }" />
      <!-- Dark mode: cursor spotlight overlay (visibility from :root.dark so first paint is correct) -->
      <div class="spotlight-overlay" aria-hidden="true" :style="overlayStyle" />
      <!-- Light mode: light overlay so content stays readable -->
      <div class="home-bg-overlay" aria-hidden="true" />
    </template>

    <div class="layout-content" :class="{ 'has-spotlight': showSpotlight, 'has-home-bg': isHome }">
    <slot name="layout-top" />
    <VPSkipLink />
    <VPBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar" />
    <VPNav>
      <template #nav-bar-title-before><slot name="nav-bar-title-before" /></template>
      <template #nav-bar-title-after><slot name="nav-bar-title-after" /></template>
      <template #nav-bar-content-before><slot name="nav-bar-content-before" /></template>
      <template #nav-bar-content-after><slot name="nav-bar-content-after" /></template>
      <template #nav-screen-content-before><slot name="nav-screen-content-before" /></template>
      <template #nav-screen-content-after><slot name="nav-screen-content-after" /></template>
    </VPNav>
    <VPLocalNav :open="isSidebarOpen" @open-menu="openSidebar" />
    <VPSidebar :open="isSidebarOpen">
      <template #sidebar-nav-before><slot name="sidebar-nav-before" /></template>
      <template #sidebar-nav-after><slot name="sidebar-nav-after" /></template>
    </VPSidebar>
    <VPContent>
      <template #page-top><slot name="page-top" /></template>
      <template #page-bottom><slot name="page-bottom" /></template>
      <template #not-found><slot name="not-found" /></template>
      <template #home-hero-before><slot name="home-hero-before" /></template>
      <template #home-hero-info-before><slot name="home-hero-info-before" /></template>
      <template #home-hero-info><slot name="home-hero-info" /></template>
      <template #home-hero-info-after><slot name="home-hero-info-after" /></template>
      <template #home-hero-actions-after><slot name="home-hero-actions-after" /></template>
      <template #home-hero-image><slot name="home-hero-image" /></template>
      <template #home-hero-after><slot name="home-hero-after" /></template>
      <template #home-features-before><slot name="home-features-before" /></template>
      <template #home-features-after><slot name="home-features-after" /></template>
      <template #doc-footer-before><slot name="doc-footer-before" /></template>
      <template #doc-before><slot name="doc-before" /></template>
      <template #doc-after><slot name="doc-after" /></template>
      <template #doc-top><slot name="doc-top" /></template>
      <template #doc-bottom><slot name="doc-bottom" /></template>
      <template #aside-top><slot name="aside-top" /></template>
      <template #aside-bottom><slot name="aside-bottom" /></template>
      <template #aside-outline-before><slot name="aside-outline-before" /></template>
      <template #aside-outline-after><slot name="aside-outline-after" /></template>
      <template #aside-ads-before><slot name="aside-ads-before" /></template>
      <template #aside-ads-after><slot name="aside-ads-after" /></template>
    </VPContent>
    <VPFooter />
    <slot name="layout-bottom" />
    </div>
  </div>
  <Content v-else />
</template>

<style scoped>
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.Layout.has-spotlight,
.Layout.has-home-bg {
  isolation: isolate;
}

.layout-content.has-spotlight,
.layout-content.has-home-bg {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home-bg,
.spotlight-overlay,
.home-bg-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.home-bg {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Visibility from :root.dark so correct overlay shows on first load (before Vue hydration) */
.spotlight-overlay {
  display: none;
}
:root.dark .spotlight-overlay {
  display: block;
}
.home-bg-overlay {
  display: block;
}
:root.dark .home-bg-overlay {
  display: none;
}

.home-bg-overlay {
  background: rgba(250, 250, 250, 0.88);
}

.spotlight-overlay {
  background: rgba(6, 6, 8, 0.92);
  -webkit-mask-image: radial-gradient(
    circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
    transparent 0,
    transparent 280px,
    black 280px
  );
  mask-image: radial-gradient(
    circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
    transparent 0,
    transparent 280px,
    black 280px
  );
}
</style>

<style>
/* When home background or spotlight is active, content and footer show through */
.Layout.has-spotlight .VPContent,
.Layout.has-home-bg .VPContent {
  background: transparent;
}

.Layout.has-spotlight .VPHome,
.Layout.has-home-bg .VPHome {
  background: transparent;
}

/* Footer: use :root.dark so dark/light footer is correct on first load (before Vue hydration) */
:root.dark .Layout.has-home-bg .VPFooter {
  background: rgba(6, 6, 8, 0.75);
  backdrop-filter: blur(8px);
}
:root:not(.dark) .Layout.has-home-bg .VPFooter {
  background: rgba(250, 250, 250, 0.85);
  backdrop-filter: blur(8px);
}
</style>
