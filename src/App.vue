<template>
  <main class="container">
    <header class="hero">
      <h1 class="title">I found your easter eggs. Actually, the most important one :-)</h1>
      <p class="subtitle">Here’s my quick reply to your console: type commands or press Enter.</p>
    </header>

    <section class="screenshot">
      <a :href="screenshotUrl" target="_blank" rel="noopener noreferrer" aria-label="Open screenshot in a new tab">
        <img :src="screenshotUrl" alt="screenshot of your console" class="screenshot-img" />
      </a>
      <figcaption class="caption">screenshot of your console</figcaption>
    </section>

    <Terminal
      :linkedin-url="LINKEDIN_URL"
      :github-url="GITHUB_URL"
      :contact-email="CONTACT_EMAIL"
      :contact-phone="CONTACT_PHONE"
    />

    <section class="extras">
      <details>
        <summary>Show me as plain text</summary>
        <p class="plain-text" aria-label="plain text version">
         {{ plainText }}
        </p>
        <button class="copy-btn" type="button" @click="copyPlainText" aria-label="Copy plain text to clipboard">
          {{ copied ? 'Copied!' : 'Copy text' }}
        </button>
      </details>
    </section>
  </main>
</template>

<script setup lang="ts">
import Terminal from './components/Terminal.vue';
import { ref, onMounted } from 'vue';
import { trackVisit } from './composition/track';
import screenshotUrl from './assets/cookielab.console.png';

const LINKEDIN_URL = 'https://linkedin.com/in/lukas-houf';
const GITHUB_URL = 'https://github.com/hoposon';
const CONTACT_EMAIL = 'lukas.houf@gmail.com';
const CONTACT_PHONE = '+420 777 054 608';

const plainText = `
Candidate: Lukas Houf
Availability: IMMEDIATE (tomorrow)
Timezone: Europe/Prague
Preferred start: ASAP — happy to join this week

LinkedIn: ${LINKEDIN_URL}
GitHub: ${GITHUB_URL}
Email: ${CONTACT_EMAIL}
Phone: ${CONTACT_PHONE}
`

const copied = ref(false);
const copyPlainText = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(plainText);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1500);
  } catch (_) {
    copied.value = false;
  }
}

onMounted(() => {
  trackVisit('page_view', {
    path: window.location.pathname,
    referrer: document.referrer || null,
    userAgent: navigator.userAgent,
  });
});

</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
}
.hero {
  text-align: center;
  margin-bottom: 24px;
}
.title {
  font-size: 28px;
  line-height: 1.25;
  margin: 0 0 8px 0;
}
.subtitle {
  color: #5f6b7a;
  margin: 0;
}
.screenshot {
  text-align: center;
  margin: 24px 0 32px 0;
}
.screenshot-img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}
.caption {
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
}
.extras {
  margin-top: 24px;
}
.preview-img {
  max-width: 100%;
  height: auto;
  margin-top: 12px;
  border-radius: 8px;
}
.plain-text {
  color: #0f172a;
  background: #f7fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  white-space: pre-wrap;
}
.copy-btn {
  margin-top: 8px;
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  cursor: pointer;
}
.copy-btn:hover { background: #0284c7; }
@media (max-width: 600px) {
  .title { font-size: 22px; }
}
</style>


