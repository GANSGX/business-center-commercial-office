'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import styles from './TiptapEditor.module.css'

interface Props {
  value: string
  onChange: (html: string) => void
}

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: styles.editorContent },
    },
  })

  // Sync external value changes (e.g. on load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === '' || !editor ? value : null])

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.btn} ${editor?.isActive('bold') ? styles.active : ''}`}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Жирный"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={`${styles.btn} ${editor?.isActive('italic') ? styles.active : ''}`}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Курсив"
        >
          <em>I</em>
        </button>
        <div className={styles.sep} />
        <button
          type="button"
          className={`${styles.btn} ${editor?.isActive('bulletList') ? styles.active : ''}`}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Маркированный список"
        >
          ≡
        </button>
        <button
          type="button"
          className={`${styles.btn} ${editor?.isActive('orderedList') ? styles.active : ''}`}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title="Нумерованный список"
        >
          1.
        </button>
        <div className={styles.sep} />
        <button
          type="button"
          className={styles.btn}
          onClick={() => editor?.chain().focus().undo().run()}
          title="Отменить"
        >
          ↩
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => editor?.chain().focus().redo().run()}
          title="Повторить"
        >
          ↪
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
