/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useRef, useEffect } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { editor } from 'monaco-editor'

export default function Home() {
  const [markdown, setMarkdown] = useState('# Hello\n\nStart typing your README here...')
  const [syncScroll, setSyncScroll] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  useEffect(() => {
    if (!syncScroll || !editorRef.current || !previewRef.current) return

    const editor = editorRef.current
    const disposable = editor.onDidScrollChange(() => {
      const preview = previewRef.current
      if (!editor || !preview) return

      const editorScrollTop = editor.getScrollTop()
      const editorScrollHeight = editor.getScrollHeight() - editor.getLayoutInfo().height
      const scrollPercentage = editorScrollTop / editorScrollHeight
      const previewScrollHeight = preview.scrollHeight - preview.clientHeight

      preview.scrollTop = scrollPercentage * previewScrollHeight
    })

    return () => {
      disposable.dispose()
    }
  }, [syncScroll])

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>README Preview</h1>
          <button
            onClick={() => setSyncScroll(!syncScroll)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              syncScroll
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}>
            {syncScroll ? 'Scroll Sync: ON' : 'Scroll Sync: OFF'}
          </button>
        </div>

        {/* Editor and Preview Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Monaco Editor */}
          <div className='h-[80vh] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm'>
            <Editor
              height='100%'
              defaultLanguage='markdown'
              defaultValue={markdown}
              onChange={(value) => setMarkdown(value || '')}
              onMount={handleEditorDidMount}
              theme='vs-dark'
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                lineNumbers: 'on',
                fontSize: 14,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                scrollBeyondLastColumn: 3,
              }}
            />
          </div>

          {/* Markdown Preview */}
          <div
            ref={previewRef}
            className='h-[80vh] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-y-auto'>
            <div className='p-8'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ ...props }) => (
                    <h1
                      {...props}
                      className='pb-3 mb-6 border-b border-gray-200 dark:border-gray-700 text-3xl font-semibold text-gray-900 dark:text-white'
                    />
                  ),
                  h2: ({ ...props }) => (
                    <h2
                      {...props}
                      className='mt-6 mb-4 text-2xl font-semibold text-gray-900 dark:text-white'
                    />
                  ),
                  h3: ({ ...props }) => (
                    <h3
                      {...props}
                      className='mt-5 mb-3 text-xl font-semibold text-gray-900 dark:text-white'
                    />
                  ),
                  p: ({ ...props }) => (
                    <p
                      {...props}
                      className='mb-4 text-gray-700 dark:text-gray-300 leading-relaxed'
                    />
                  ),
                  a: ({ ...props }) => (
                    <a
                      {...props}
                      className='text-blue-600 hover:underline dark:text-blue-400'
                    />
                  ),
                  ul: ({ ...props }) => (
                    <ul
                      {...props}
                      className='mb-4 ml-5 list-disc text-gray-700 dark:text-gray-300'
                    />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      {...props}
                      className='mb-4 ml-5 list-decimal text-gray-700 dark:text-gray-300'
                    />
                  ),
                  li: ({ ...props }) => (
                    <li
                      {...props}
                      className='mb-1'
                    />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote
                      {...props}
                      className='pl-4 mb-4 border-l-4 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    />
                  ),
                  code: ({ inline, ...props }: { inline?: boolean } & React.HTMLProps<HTMLElement>) =>
                    inline ? (
                      <code
                        {...props}
                        className='px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-mono'
                      />
                    ) : (
                      <code
                        {...props}
                        className='block p-4 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-mono overflow-x-auto'
                      />
                    ),
                  img: ({ ...props }) => (
                    <img
                      {...props}
                      className='max-w-full h-auto rounded-lg dark:border-gray-700'
                    />
                  ),
                  table: ({ ...props }) => (
                    <div className='overflow-x-auto mb-4'>
                      <table
                        {...props}
                        className='min-w-full border border-gray-200 dark:border-gray-700 rounded-lg'
                      />
                    </div>
                  ),
                  th: ({ ...props }) => (
                    <th
                      {...props}
                      className='px-4 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-white'
                    />
                  ),
                  td: ({ ...props }) => (
                    <td
                      {...props}
                      className='px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    />
                  ),
                }}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
          Edit your README and see the preview in real-time with GitHub-style formatting
        </div>
      </div>
    </div>
  )
}
