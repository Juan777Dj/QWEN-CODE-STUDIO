import { useState } from 'react'
import Editor from '@monaco-editor/react'
import './App.css'

function App() {
  const [code, setCode] = useState<string>(`// Bienvenido a QwenCode Studio 🚀
// Tu IDE potenciado con Qwen 3.7

function saludar(nombre: string): string {
  return \`Hola, \${nombre}! Bienvenido al futuro del desarrollo.\`;
}

console.log(saludar('Developer'));
`)

  const [activeFile, setActiveFile] = useState('app.ts')
  const [showChat, setShowChat] = useState(true)

  const files = [
    { name: 'app.ts', language: 'typescript' },
    { name: 'utils.ts', language: 'typescript' },
    { name: 'styles.css', language: 'css' },
    { name: 'index.html', language: 'html' },
  ]

  return (
    <div className="app">
      {/* Sidebar - File Explorer */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>📁 EXPLORADOR</h2>
        </div>
        <div className="file-tree">
          {files.map(file => (
            <div
              key={file.name}
              className={`file-item ${activeFile === file.name ? 'active' : ''}`}
              onClick={() => setActiveFile(file.name)}
            >
              <span className="file-icon">📄</span>
              {file.name}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Editor Area */}
      <main className="editor-area">
        <div className="tabs">
          {files.map(file => (
            <div
              key={file.name}
              className={`tab ${activeFile === file.name ? 'active' : ''}`}
              onClick={() => setActiveFile(file.name)}
            >
              {file.name}
            </div>
          ))}
        </div>
        <Editor
          height="calc(100% - 40px)"
          language="typescript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            }
          }}
        />
      </main>

      {/* AI Chat Panel */}
      {showChat && (
        <aside className="ai-panel">
          <div className="ai-panel-header">
            <h3>🤖 Qwen 3.7 Assistant</h3>
            <button onClick={() => setShowChat(false)}>✕</button>
          </div>
          <div className="ai-chat-messages">
            <div className="message ai">
              <p>¡Hola! Soy tu asistente de IA integrado en QwenCode Studio. ¿En qué puedo ayudarte hoy?</p>
            </div>
          </div>
          <div className="ai-input-area">
            <textarea placeholder="Escribe tu pregunta o comando..." rows={3} />
            <button className="send-btn">Enviar 🚀</button>
          </div>
          <div className="token-info">
            <span>Tokens usados: 0</span>
            <span className="budget">Presupuesto: 10000/día</span>
          </div>
        </aside>
      )}

      {/* Status Bar */}
      <footer className="status-bar">
        <span>QwenCode Studio v0.1.0</span>
        <span>TypeScript React</span>
        <span>UTF-8</span>
        {!showChat && (
          <button onClick={() => setShowChat(true)} className="ai-toggle">
            🤖 Activar IA
          </button>
        )}
      </footer>
    </div>
  )
}

export default App
