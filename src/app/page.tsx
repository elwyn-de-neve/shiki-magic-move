'use client'
import type { HighlighterCore } from 'shiki'
import { useEffect, useState } from 'react'
import { createHighlighter } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import { CodePresentation } from '@/components/CodePresentation'
import { codeSlideDecks } from '@/data/code-slides'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import 'shiki-magic-move/dist/style.css'

export default function Home() {
  const [selectedDeck, setSelectedDeck] = useState<keyof typeof codeSlideDecks>('functionalComponents')
  const [highlighter, setHighlighter] = useState<HighlighterCore>()

  useEffect(() => {
    async function initializeHighlighter() {
      const highlighter = await createHighlighter({
        themes: ['vitesse-dark'],
        langs: ['javascript', 'typescript', 'tsx', 'jsx'],
      })
      setHighlighter(highlighter)
    }
    initializeHighlighter()
  }, [])

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <header className="py-3 px-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Code Presentation</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">
              Select presentation:
            </span>
            <Select
              value={selectedDeck as string}
              onValueChange={(value) => setSelectedDeck(value as keyof typeof codeSlideDecks)}
            >
              <SelectTrigger className="w-[180px] border-gray-700 bg-gray-900 text-gray-300">
                <SelectValue placeholder="Select a presentation" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-300">
                {Object.keys(codeSlideDecks).map((deck) => (
                  <SelectItem key={deck} value={deck}>
                    {deck.charAt(0).toUpperCase() + deck.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {highlighter ? (
        <div className="flex-1 overflow-hidden">
          <CodePresentation
            slides={codeSlideDecks[selectedDeck]}
            highlighter={highlighter}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-300">
          <p>Loading syntax highlighter...</p>
        </div>
      )}
    </main>
  )
}