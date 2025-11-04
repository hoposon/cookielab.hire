import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Terminal from './Terminal.vue';

const props = {
  linkedinUrl: 'https://example.com/linkedin',
  githubUrl: 'https://example.com/github',
  contactEmail: 'hello@example.com',
  contactPhone: '+1234567890',
};

const getInput = (wrapper: ReturnType<typeof mount>) => wrapper.find('input.input');

describe('Terminal.vue', () => {
  it('prints help when pressing Enter on "help"', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('help');
    await input.trigger('keydown.enter');
    expect(wrapper.text()).toContain('Available commands:');
  });

  it('tab autocompletes a partial command', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('l');
    await input.trigger('keydown.tab');
    expect((input.element as HTMLInputElement).value).toBe('linkedin');
  });

  it('renders contact buttons after "more" command', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('more');
    await input.trigger('keydown.enter');
    const links = wrapper.findAll('.contacts .link-btn');
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it('shows unknown command message for invalid input', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('foobar');
    await input.trigger('keydown.enter');
    expect(wrapper.text()).toContain('Unknown command. Try: help.');
  });

  it('prints availability for start-time', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('start-time');
    await input.trigger('keydown.enter');
    expect(wrapper.text()).toContain('Candidate:');
    expect(wrapper.text()).toContain('Availability:');
  });

  it('prints availability for sudo join (alias)', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('sudo join');
    await input.trigger('keydown.enter');
    expect(wrapper.text()).toContain('Candidate:');
  });

  it('prints motivation message', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('motivation');
    await input.trigger('keydown.enter');
    expect(wrapper.text()).toContain('I need a job');
  });

  it('clears input after running a command', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('help');
    await input.trigger('keydown.enter');
    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('Run button triggers execution', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('help');
    await wrapper.find('button.btn').trigger('click');
    expect(wrapper.text()).toContain('Available commands:');
  });

  it('shows suggestions for partial but hides when exact', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('l');
    await input.trigger('input');
    expect(wrapper.findAll('.suggestion-item').length).toBeGreaterThan(0);
    await input.setValue('linkedin');
    await input.trigger('input');
    expect(wrapper.findAll('.suggestion-item').length).toBe(0);
  });

  it('clicking suggestion fills input', async () => {
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('l');
    await input.trigger('input');
    const first = wrapper.find('.suggestion-item');
    await first.trigger('click');
    expect((input.element as HTMLInputElement).value).toBe('linkedin');
  });

  it('linkedin command calls window.open', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null as any);
    const wrapper = mount(Terminal, { props });
    const input = getInput(wrapper);
    await input.setValue('linkedin');
    await input.trigger('keydown.enter');
    expect(openSpy).toHaveBeenCalled();
    openSpy.mockRestore();
  });
});


