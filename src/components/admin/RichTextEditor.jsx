'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { articleWordCount, sanitizeArticleHtml } from '../../lib/article-html'

function ToolButton({ active = false, disabled = false, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition ${
        active ? 'bg-midnight-navy text-white' : 'text-slate-500 hover:bg-white hover:text-midnight-navy'
      } disabled:pointer-events-none disabled:opacity-35`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-slate-200" aria-hidden="true" />
}

export default function RichTextEditor({ value, bodyFormat = 'html', onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right', 'justify'] }),
      Superscript,
      Subscript,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: sanitizeArticleHtml(value, { plain: bodyFormat === 'plain' }),
    editorProps: {
      attributes: {
        id: 'publication-body',
        class: 'tgn-rich-editor min-h-[460px] px-5 py-5 text-[16px] leading-7 text-slate-800 outline-none',
        'aria-label': 'Publication body',
      },
      transformPastedHTML: (html) => sanitizeArticleHtml(html),
    },
    onUpdate: ({ editor: currentEditor }) => onChange(sanitizeArticleHtml(currentEditor.getHTML())),
  })

  useEffect(() => {
    if (!editor) return
    const cleanedValue = sanitizeArticleHtml(value, { plain: bodyFormat === 'plain' })
    if (cleanedValue !== sanitizeArticleHtml(editor.getHTML())) {
      editor.commands.setContent(cleanedValue, { emitUpdate: false })
    }
  }, [bodyFormat, editor, value])

  if (!editor) return <div className="min-h-[520px] animate-pulse bg-slate-50" aria-label="Loading writing editor" />

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href || ''
    const url = window.prompt('Enter the link address', previousUrl)
    if (url === null) return
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const tools = [
    { icon: 'format_bold', label: 'Bold', active: editor.isActive('bold'), run: () => editor.chain().focus().toggleBold().run() },
    { icon: 'format_italic', label: 'Italic', active: editor.isActive('italic'), run: () => editor.chain().focus().toggleItalic().run() },
    { icon: 'format_underlined', label: 'Underline', active: editor.isActive('underline'), run: () => editor.chain().focus().toggleUnderline().run() },
    { icon: 'superscript', label: 'Superscript', active: editor.isActive('superscript'), run: () => editor.chain().focus().toggleSuperscript().run() },
    { icon: 'subscript', label: 'Subscript', active: editor.isActive('subscript'), run: () => editor.chain().focus().toggleSubscript().run() },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 focus-within:border-midnight-navy/40 focus-within:ring-2 focus-within:ring-midnight-navy/10">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-100 bg-slate-50/80 px-3 py-2" aria-label="Writing tools">
        <ToolButton icon="undo" label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} />
        <ToolButton icon="redo" label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} />
        <Divider />
        <ToolButton icon="notes" label="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()} />
        <ToolButton icon="format_h2" label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolButton icon="format_h3" label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <Divider />
        {tools.map((tool) => <ToolButton key={tool.label} {...tool} onClick={tool.run} />)}
        <Divider />
        <ToolButton icon="format_list_bulleted" label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolButton icon="format_list_numbered" label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolButton icon="format_quote" label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolButton icon="link" label="Add or edit link" active={editor.isActive('link')} onClick={setLink} />
        <ToolButton icon="horizontal_rule" label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <Divider />
        {[
          ['format_align_left', 'Align left', 'left'],
          ['format_align_center', 'Align center', 'center'],
          ['format_align_right', 'Align right', 'right'],
          ['format_align_justify', 'Justify', 'justify'],
        ].map(([icon, label, alignment]) => (
          <ToolButton key={alignment} icon={icon} label={label} active={editor.isActive({ textAlign: alignment })} onClick={() => editor.chain().focus().setTextAlign(alignment).run()} />
        ))}
        <Divider />
        <ToolButton icon="table" label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
        <ToolButton icon="format_clear" label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} />
      </div>
      <EditorContent editor={editor} />
      <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-right text-xs text-slate-400">
        {articleWordCount(editor.getHTML()).toLocaleString()} words
      </div>
    </div>
  )
}
