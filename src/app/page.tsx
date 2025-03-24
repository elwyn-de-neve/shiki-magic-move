'use client'
import type { HighlighterCore } from 'shiki'
import { useEffect, useState } from 'react'
import { createHighlighter } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import { CodePresentation } from '@/components/CodePresentation'
import { codeSlideDecks } from '@/data/code-slides'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTheme } from 'next-themes'

import 'shiki-magic-move/dist/style.css'

export default function Home() {
  const [selectedDeck, setSelectedDeck] = useState<keyof typeof codeSlideDecks>('functionalComponents')
  const [highlighter, setHighlighter] = useState<HighlighterCore>()
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    async function initializeHighlighter() {
      const highlighter = await createHighlighter({
        themes: ['vitesse-dark', 'vitesse-light'],
        langs: ['javascript', 'typescript', 'tsx', 'jsx'],
      })
      setHighlighter(highlighter)
    }
    initializeHighlighter()
  }, [theme, systemTheme])

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Code Presentation</h1>
            <Select
              value={selectedDeck as string}
              onValueChange={(value) => setSelectedDeck(value as keyof typeof codeSlideDecks)}
            >
              <SelectTrigger className="w-[180px] border-border bg-card text-muted-foreground">
                <SelectValue placeholder="Select a presentation" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-muted-foreground">
                {Object.keys(codeSlideDecks).map((deck) => (
                  <SelectItem key={deck} value={deck}>
                    {deck.charAt(0).toUpperCase() + deck.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ThemeToggle />
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
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          <p>Loading syntax highlighter...</p>
        </div>
      )}
    </main>
  )
}