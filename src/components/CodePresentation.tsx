'use client'

import { useState, useEffect } from 'react'
import { HighlighterCore } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import { CodeSlide } from '@/data/code-slides'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Copy, Check, SplitSquareHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodePresentationProps {
    slides: CodeSlide[]
    highlighter: HighlighterCore
}

interface CodeBlockProps {
    title?: string
    code: string
    highlighter: HighlighterCore
}

function CodeBlock({ title, code, highlighter }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <div className="h-full w-full overflow-auto relative shiki-code-container bg-[#121212] rounded-lg p-4">
            {title && (
                <div className="absolute top-2 left-6 z-10">
                    <span className="text-sm font-medium text-gray-400">{title}</span>
                </div>
            )}
            <div className="absolute top-2 right-2 z-10">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="bg-[#121212] border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                    {isCopied ? (
                        <>
                            <Check className="h-4 w-4 mr-1" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                        </>
                    )}
                </Button>
            </div>
            <div className="pt-8">
                <ShikiMagicMove
                    lang="tsx"
                    theme="vitesse-dark"
                    highlighter={highlighter}
                    code={code}
                    options={{
                        duration: 800,
                        stagger: 0.3,
                        lineNumbers: true
                    }}
                />
            </div>
        </div>
    )
}

export function CodePresentation({ slides, highlighter }: CodePresentationProps) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [isSplitView, setIsSplitView] = useState(true)
    const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary')
    const currentSlide = slides[currentSlideIndex]

    // Reset slide index when slides change
    useEffect(() => {
        setCurrentSlideIndex(0)
    }, [slides])

    const goToNextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1)
        }
    }

    const goToPreviousSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1)
        }
    }

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                goToPreviousSlide()
            } else if (event.key === 'ArrowRight') {
                goToNextSlide()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        // Clean up event listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentSlideIndex]) // Re-add listeners when currentSlideIndex changes

    const isFirstSlide = currentSlideIndex === 0
    const isLastSlide = currentSlideIndex === slides.length - 1

    const toggleView = () => {
        setIsSplitView(!isSplitView)
    }

    return (
        <Card className="flex h-full flex-col bg-transparent">
            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{currentSlide.title}</h2>
                    {currentSlide.secondaryCode && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-700 text-gray-400 hover:text-white"
                            onClick={toggleView}
                        >
                            {isSplitView ? <X className="h-4 w-4" /> : <SplitSquareHorizontal className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
                <p className="text-sm text-gray-400">{currentSlide.description}</p>
                {currentSlide.secondaryCode && !isSplitView && (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "text-sm",
                                activeTab === 'primary' && "bg-gray-800"
                            )}
                            onClick={() => setActiveTab('primary')}
                        >
                            Primary
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "text-sm",
                                activeTab === 'secondary' && "bg-gray-800"
                            )}
                            onClick={() => setActiveTab('secondary')}
                        >
                            Secondary
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1">
                {currentSlide.secondaryCode ? (
                    isSplitView ? (
                        <div className="grid h-full grid-cols-2 gap-4">
                            <CodeBlock
                                code={currentSlide.code}
                                highlighter={highlighter}
                                title={currentSlide.secondaryCode ? "Source Code" : undefined}
                            />
                            <CodeBlock
                                code={currentSlide.secondaryCode.code}
                                highlighter={highlighter}
                                title={currentSlide.secondaryCode.title}
                            />
                        </div>
                    ) : (
                        <div className="h-full">
                            {activeTab === 'primary' ? (
                                <CodeBlock
                                    code={currentSlide.code}
                                    highlighter={highlighter}
                                />
                            ) : (
                                <CodeBlock
                                    code={currentSlide.secondaryCode.code}
                                    highlighter={highlighter}
                                />
                            )}
                        </div>
                    )
                ) : (
                    <CodeBlock
                        code={currentSlide.code}
                        highlighter={highlighter}
                    />
                )}
            </CardContent>
            <CardFooter className="justify-between bg-transparent">
                <Button
                    variant="outline"
                    onClick={goToPreviousSlide}
                    disabled={isFirstSlide}
                    className="border-gray-700 text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    onClick={goToNextSlide}
                    disabled={isLastSlide}
                    className="border-gray-700 text-gray-400 hover:text-white"
                >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
} 