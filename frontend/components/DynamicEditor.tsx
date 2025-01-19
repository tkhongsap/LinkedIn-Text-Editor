'use client'

import { Editor } from 'react-draft-wysiwyg'
import { EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

interface DynamicEditorProps {
  editorState: EditorState
  onEditorStateChange: (editorState: EditorState) => void
}

const DynamicEditor: React.FC<DynamicEditorProps> = ({ editorState, onEditorStateChange }) => {
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        options: ['inline', 'list'],
        inline: {
          options: ['bold', 'italic', 'underline'],
        },
      }}
    />
  )
}

export default DynamicEditor

