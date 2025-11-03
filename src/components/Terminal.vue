<template>
  <section class="terminal" role="region" aria-label="fake terminal">
    <div class="terminal-output" aria-live="polite">
      <div v-for="(line, idx) in output" :key="idx" class="line">{{ line }}</div>
    </div>

    <div class="terminal-input">
      <span class="prompt">$</span>
      <input
        ref="inputRef"
        v-model="current"
        @keydown.enter.prevent="run"
        @keydown.tab.prevent="onTab"
        aria-label="terminal command input"
        class="input"
        spellcheck="false"
        autocomplete="off"
      />
      <button class="btn" @click="run" aria-label="Run command">Run</button>
    </div>
    <ul v-if="showSuggest" class="suggestions" role="listbox" aria-label="command suggestions">
      <li
        v-for="s in suggestions"
        :key="s"
        class="suggestion-item"
        role="option"
        @click="() => { current = s; inputRef && inputRef.focus && inputRef.focus() }"
      >{{ s }}</li>
    </ul>
  </section>
  <section>
    <div v-if="showContactsButtons" class="contacts" aria-label="contact buttons">
      <a class="link-btn" :href="props.linkedinUrl" target="_blank" rel="noopener noreferrer" aria-label="Open LinkedIn">LinkedIn</a>
      <a class="link-btn" :href="props.githubUrl" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub">GitHub</a>
      <a class="link-btn" href="/src/assets/CV.pdf" target="_blank" rel="noopener noreferrer" aria-label="Download CV">Download CV</a>
    </div>
  </section>

</template>

<script setup lang="ts">
import { ref, onMounted, type Ref, computed } from 'vue';

const props = defineProps<{
  linkedinUrl: string;
  githubUrl: string;
  contactEmail: string;
  contactPhone: string;
}>();

const inputRef: Ref<HTMLInputElement | null> = ref(null);
const current = ref<string>('');
const output = ref<string[]>([
  'Welcome! Type "help" and press Enter to see commands.',
]);

// Subtle autotype: type the placeholder text into the input on load, without auto-running
onMounted(() => {
  inputRef.value?.focus();
  const text = 'help';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      current.value += text[i];
      i += 1;
    } else {
      clearInterval(timer);
    }
  }, 120);
});

const print = (lines: string | string[]): void => {
  const arr = Array.isArray(lines) ? lines : [lines];
  output.value.push(...arr);
};

// Autocomplete support
const availableCommands = [
  'help',
  'start-time',
  'linkedin',
  'motivation',
  'more',
  'sudo join',
] as const;

const normalized = (s: string): string => s.toLowerCase();
const suggestions = computed<string[]>(() => {
  const value = normalized(current.value || '');
  if (!value) return [];
  return availableCommands.filter(cmd => normalized(cmd).startsWith(value));
});
const showSuggest = computed<boolean>(() => {
  const v = current.value;
  if (!v) return false;
  const s = suggestions.value;
  return s.length > 0 && !s.includes(v);
});

const onTab = (): void => {
  if (suggestions.value.length > 0) {
    current.value = suggestions.value[0];
    // keep focus for continued typing
    inputRef.value?.focus();
  }
};

const run = (): void => {
  const cmd = (current.value || '').trim();
  if (!cmd) return;
  print(`$ ${cmd}`);

  switch (cmd.toLowerCase()) {
    case 'help':
      print([
        'Available commands:',
        '- start-time     → show my availability',
        '- linkedIn       → open my LinkedIn',
        '- motivation     → short motivation message',
        '- more           → contact buttons & download CV',
        '- sudo join      → (same as start-time, special)',
      ]);
      break;
    case 'start-time':
    case 'sudo join':
      print([
        'Candidate: Lukas Houf',
        'Availability: IMMEDIATE (tomorrow)',
        'Timezone: Europe/Prague',
        'Preferred start: ASAP — happy to join this week',
      ]);
      break;
    case 'linkedin':
      window.open(props.linkedinUrl, '_blank', 'noopener,noreferrer');
      print('Opening LinkedIn...');
      break;
    case 'motivation':
      print([
        `I need a job :-) I was checking your website and I really like the concept of your company helping people to make their ideas come to life. Not sure how it works exactly, but I'd love to learn more about it.`,
        'Might have one idea of my own that I\'d like to discuss with you. So I could be your customer and employee at the same time :-)',
        'I also love the way you check for compatible people to work with.'
      ]);
      break;
    case 'more':
      print([
        `Email: ${props.contactEmail}`,
        `Phone: ${props.contactPhone}`,
        `LinkedIn: ${props.linkedinUrl}`,
        `GitHub: ${props.githubUrl}`,
      ]);
      // Show interactive buttons below the terminal
      showContactsButtons.value = true;
      break;
    default:
      print('Unknown command. Try: help.');
  }

  current.value = '';
};

const showContactsButtons = ref<boolean>(false);
</script>

<style scoped>
.terminal {
  background: #0b0f14;
  color: #a7f3d0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  padding: 16px;
}
.terminal-output {
  min-height: 140px;
  margin-bottom: 10px;
}
.line { white-space: pre-wrap; }
.terminal-input {
  display: flex;
  align-items: center;
  gap: 8px;
}
.prompt { color: #10b981; }
.input {
  flex: 1;
  background: transparent;
  color: #e2fbe8;
  border: none;
  outline: none;
  font: inherit;
}
.cursor {
  color: #34d399;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
.btn {
  background: #16a34a;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  cursor: pointer;
}
.btn:hover { background: #15803d; }
.example { color: #93c5fd; font-size: 14px; }

.suggestions {
  margin-top: 6px;
  list-style: none;
  padding: 0;
}
.suggestion-item {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(255,255,255,0.06);
  color: #c7f9e5;
  cursor: pointer;
}
.suggestion-item:hover { background: rgba(255,255,255,0.12); }

.contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}
.link-btn {
  background: #0ea5e9;
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}
.link-btn:hover { background: #0284c7; }
</style>


