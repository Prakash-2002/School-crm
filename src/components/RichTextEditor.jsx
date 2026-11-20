import React, { useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

export default function RichTextEditor({ value = '', onChange, placeholder = 'Write article content here...' }) {
  const editorRef = useRef(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  // Sync editor content with external value if changed externally
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setInternalValue(value || '');
  }, [value, isSourceMode]);

  const handleInput = () => {
    if (editorRef.current) {
      const rawHtml = editorRef.current.innerHTML;
      const sanitized = DOMPurify.sanitize(rawHtml);
      setInternalValue(sanitized);
      if (onChange) onChange(sanitized);
    }
  };

  const handleSourceChange = (e) => {
    const rawHtml = e.target.value;
    const sanitized = DOMPurify.sanitize(rawHtml);
    setInternalValue(sanitized);
    if (onChange) onChange(sanitized);
  };

  const executeCommand = (command, val = null) => {
    if (isSourceMode) return;
    document.execCommand(command, false, val);
    handleInput();
    if (editorRef.current) editorRef.current.focus();
  };

  const handleInsertLink = () => {
    if (isSourceMode) return;
    const url = window.prompt('Enter link URL (e.g., https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div style={{
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      overflow: 'hidden',
      backgroundColor: 'var(--surface-color)'
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.35rem',
        padding: '0.5rem',
        backgroundColor: 'var(--background-color)',
        borderBottom: '1px solid var(--border-color)',
        alignItems: 'center'
      }}>
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="btn btn-outline"
          title="Bold"
          style={{ padding: '0.25rem 0.55rem', fontWeight: 700 }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="btn btn-outline"
          title="Italic"
          style={{ padding: '0.25rem 0.55rem', fontStyle: 'italic' }}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="btn btn-outline"
          title="Underline"
          style={{ padding: '0.25rem 0.55rem', textDecoration: 'underline' }}
        >
          U
        </button>

        <span style={{ color: 'var(--border-color)', margin: '0 0.2rem' }}>|</span>

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="btn btn-outline"
          title="Heading 2"
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.85rem', fontWeight: 600 }}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="btn btn-outline"
          title="Heading 3"
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.85rem', fontWeight: 600 }}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<p>')}
          className="btn btn-outline"
          title="Paragraph"
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.85rem' }}
        >
          ¶
        </button>

        <span style={{ color: 'var(--border-color)', margin: '0 0.2rem' }}>|</span>

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="btn btn-outline"
          title="Bullet List"
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.85rem' }}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="btn btn-outline"
          title="Numbered List"
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.85rem' }}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          className="btn btn-outline"
          title="Quote"
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.85rem' }}
        >
          “ Quote
        </button>
        <button
          type="button"
          onClick={handleInsertLink}
          className="btn btn-outline"
          title="Insert Link"
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.85rem' }}
        >
          🔗 Link
        </button>

        <span style={{ color: 'var(--border-color)', margin: '0 0.2rem' }}>|</span>

        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="btn btn-outline"
          title="Clear Formatting"
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.85rem' }}
        >
          Clear
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => setIsSourceMode(!isSourceMode)}
            className="btn btn-outline"
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.8rem',
              backgroundColor: isSourceMode ? 'var(--primary-color)' : 'transparent',
              color: isSourceMode ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            {isSourceMode ? 'Visual Editor' : 'HTML Code'}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isSourceMode ? (
        <textarea
          rows={10}
          value={internalValue}
          onChange={handleSourceChange}
          placeholder="Paste or write raw sanitized HTML..."
          style={{
            width: '100%',
            minHeight: '220px',
            padding: '1rem',
            border: 'none',
            outline: 'none',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            resize: 'vertical',
            backgroundColor: 'var(--surface-color)',
            color: 'var(--text-primary)'
          }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          data-placeholder={placeholder}
          style={{
            minHeight: '220px',
            padding: '1rem',
            outline: 'none',
            lineHeight: 1.7,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--surface-color)'
          }}
        />
      )}

      {/* DOMPurify Sanitization Indicator */}
      <div style={{
        padding: '0.35rem 0.8rem',
        fontSize: '0.75rem',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-secondary)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>🛡️ Sanitized in real-time with <strong>DOMPurify</strong></span>
        <span>HTML Safe</span>
      </div>
    </div>
  );
}
