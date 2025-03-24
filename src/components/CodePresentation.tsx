'use client'

import { useState, useEffect } from 'react'
import { HighlighterCore } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import { CodeSlide } from '@/data/code-slides'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Copy, Check, SplitSquareHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'

interface CodePresentationProps {
    slides: CodeSlide[]
    highlighter: HighlighterCore
}

interface CodeBlockProps {
    title: string
    fileName?: string
    code: string
    highlighter: HighlighterCore
    className?: string
}

function CodeBlock({ title, fileName, code, highlighter, className }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);
    const { resolvedTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState(resolvedTheme);

    useEffect(() => {
        setCurrentTheme(resolvedTheme);
    }, [resolvedTheme]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className={cn("relative rounded-lg bg-card h-full overflow-hidden border border-border", className)}>
            <div className="p-4 border-b border-border">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        {fileName || title}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="bg-background border-border text-muted-foreground hover:bg-muted hover:text-foreground"
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
            </div>
            <div className="p-4 h-[calc(100%-3.5rem)] overflow-auto">
                <ShikiMagicMove
                    key={currentTheme}
                    lang="tsx"
                    theme={currentTheme === 'dark' ? 'vitesse-dark' : 'vitesse-light'}
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
    );
}

export function CodePresentation({ slides, highlighter }: CodePresentationProps) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isSplitView, setIsSplitView] = useState(true);
    const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary');

    useEffect(() => {
        setCurrentSlideIndex(0);
    }, [slides]);

    const currentSlide = slides[currentSlideIndex];
    const hasSecondaryCode = Boolean(currentSlide.secondaryCode);

    const goToNextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const goToPreviousSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                goToPreviousSlide();
            } else if (event.key === 'ArrowRight') {
                goToNextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentSlideIndex]);

    const toggleView = () => {
        setIsSplitView(!isSplitView);
    };

    const isFirstSlide = currentSlideIndex === 0;
    const isLastSlide = currentSlideIndex === slides.length - 1;

    return (
        <div className="flex flex-col h-[calc(100vh-65px)] max-w-none mx-auto px-6 pb-5 bg-background">
            <div className="space-y-2 py-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">{currentSlide.title}</h2>
                    {hasSecondaryCode && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-border text-muted-foreground hover:text-foreground"
                            onClick={toggleView}
                        >
                            {isSplitView ? <X className="h-4 w-4" /> : <SplitSquareHorizontal className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">{currentSlide.description}</p>
                <div className="text-xs text-muted-foreground">
                    Slide {currentSlideIndex + 1} of {slides.length}
                </div>
                {hasSecondaryCode && !isSplitView && (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "text-sm text-muted-foreground",
                                activeTab === 'primary' && "bg-muted text-foreground"
                            )}
                            onClick={() => setActiveTab('primary')}
                        >
                            Primary
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "text-sm text-muted-foreground",
                                activeTab === 'secondary' && "bg-muted text-foreground"
                            )}
                            onClick={() => setActiveTab('secondary')}
                        >
                            Secondary
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-0 pt-4">
                {hasSecondaryCode ? (
                    isSplitView ? (
                        <div className="grid h-full grid-cols-2 gap-4">
                            <CodeBlock
                                title={currentSlide.title}
                                fileName={currentSlide.fileName}
                                code={currentSlide.code}
                                highlighter={highlighter}
                            />
                            {currentSlide.secondaryCode && (
                                <CodeBlock
                                    title={currentSlide.secondaryCode.title}
                                    fileName={currentSlide.secondaryCode.fileName}
                                    code={currentSlide.secondaryCode.code}
                                    highlighter={highlighter}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="h-full">
                            {activeTab === 'primary' ? (
                                <CodeBlock
                                    title={currentSlide.title}
                                    fileName={currentSlide.fileName}
                                    code={currentSlide.code}
                                    highlighter={highlighter}
                                    className="h-full"
                                />
                            ) : currentSlide.secondaryCode && (
                                <CodeBlock
                                    title={currentSlide.secondaryCode.title}
                                    fileName={currentSlide.secondaryCode.fileName}
                                    code={currentSlide.secondaryCode.code}
                                    highlighter={highlighter}
                                    className="h-full"
                                />
                            )}
                        </div>
                    )
                ) : (
                    <CodeBlock
                        title={currentSlide.title}
                        fileName={currentSlide.fileName}
                        code={currentSlide.code}
                        highlighter={highlighter}
                        className="h-full"
                    />
                )}
            </div>

            <div className="flex justify-between pt-4">
                <Button
                    variant="outline"
                    onClick={goToPreviousSlide}
                    disabled={isFirstSlide}
                    className="border-border text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    onClick={goToNextSlide}
                    disabled={isLastSlide}
                    className="border-border text-muted-foreground hover:text-foreground"
                >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
} 