import { mount } from '@vue/test-utils'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import { nextTick } from 'vue'

describe('MarkdownEditor.vue', () => {
  it('renders textarea and preview', () => {
    const wrapper = mount(MarkdownEditor)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('.preview').exists()).toBe(true)
  })

  it('initial markdown is rendered in preview', () => {
    const wrapper = mount(MarkdownEditor)
    const preview = wrapper.find('.preview')
    expect(preview.html()).toContain('Welcome to your Obsidian-like editor')
  })

  it('addMarkdown adds markdown syntax correctly', async () => {
    const wrapper = mount(MarkdownEditor)
    const textarea = wrapper.find('textarea')

    // Set some text and select it
    await textarea.setValue('hello world')
    const el = wrapper.vm.$refs.textarea
    el.selectionStart = 0
    el.selectionEnd = 5 // select "hello"

    wrapper.vm.addMarkdown('**', '**')
    await nextTick()

    expect(wrapper.vm.markdown).toContain('**hello** world')
  })

  it('addChecklist inserts checklist syntax', async () => {
    const wrapper = mount(MarkdownEditor)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('task list')
    const el = wrapper.vm.$refs.textarea
    el.selectionStart = 0
    el.selectionEnd = 9

    wrapper.vm.addChecklist()
    await nextTick()

    expect(wrapper.vm.markdown).toContain('- [ ] task list')
  })
})
