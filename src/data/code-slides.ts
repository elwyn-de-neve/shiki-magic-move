export interface CodeSlide {
  id: number;
  title: string;
  fileName?: string;
  code: string;
  secondaryCode?: {
    title: string;
    fileName?: string;
    code: string;
  };
  description?: string;
}

// Functional Components lesson
export const functionalComponentsSlides: CodeSlide[] = [
  {
    id: 1,
    title: "Functie Declaratie Basis",
    fileName: "src/components/Greeting.jsx",
    code: `// Named function declaration
function Greeting() {
  return <h1>Hello, World!</h1>
}

// Arrow function declaration
const GreetingArrow = () => {
  return <h1>Hello, World!</h1>
}`,
    description: "Twee manieren om een functioneel component te maken in React"
  },
  {
    id: 2,
    title: "Verkorte Return Syntax",
    fileName: "src/components/Greeting.jsx",
    code: `// Named function with explicit return
function Greeting() {
  return <h1>Hello, World!</h1>
}

// Arrow function with implicit return
const GreetingArrow = () => <h1>Hello, World!</h1>

// Both achieve the same result!`,
    description: "Bij eenvoudige componenten kun je de verkorte return syntax gebruiken"
  },
  {
    id: 3,
    title: "Logica Toevoegen",
    fileName: "src/components/Greeting.jsx",
    code: `function Greeting() {
  // You can add logic before the return
  const name = "Developer"
  const timeOfDay = new Date().getHours() < 12 ? "morning" : "day"
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Have a great {timeOfDay}!</p>
    </div>
  )
}`,
    description: "Hoe je logica kunt toevoegen voordat je JSX teruggeeft"
  },
  {
    id: 4,
    title: "Named Exports",
    fileName: "src/components/Greeting.jsx",
    code: `// greetings.jsx
export function Greeting() {
  return <h1>Hello, World!</h1>
}

export function Farewell() {
  return <h1>Goodbye!</h1>
}`,
    secondaryCode: {
      title: "src/components/Greeting.jsx (Source Code)",
      fileName: "src/app/page.jsx",
      code: `// app.jsx
import { Greeting, Farewell } from '@/components/Greeting'

export default function App() {
  return (
    <div>
      <Greeting />
      <Farewell />
    </div>
  )
}`
    },
    description: "Meerdere componenten exporteren vanuit één bestand"
  },
  {
    id: 5,
    title: "Default Export",
    fileName: "src/components/Greeting.jsx",
    code: `// greeting.jsx
function Greeting() {
  return <h1>Hello, World!</h1>
}

// Only one default export per file
export default Greeting`,
    secondaryCode: {
      title: "src/components/Greeting.jsx (Source Code)",
      fileName: "src/app/page.jsx",
      code: `// app.jsx
import Greeting from '@/components/Greeting'
// or
import CustomName from '@/components/Greeting'

export default function App() {
  return <Greeting />
}`
    },
    description: "Één hoofdcomponent exporteren uit een bestand"
  }
];

// Basic Button Components lesson
export const basicButtonsSlides: CodeSlide[] = [
  {
    id: 1,
    title: "Eenvoudige Button Component",
    fileName: "src/components/Button.jsx",
    code: `function Button() {
  return (
    <button>
      Click me!
    </button>
  )
}`,
    description: "Een basis button component maken"
  },
  {
    id: 2,
    title: "Button met Text Property",
    fileName: "src/components/Button.jsx",
    code: `function Button({ text }) {
  return (
    <button>
      {text}
    </button>
  )
}`,
    secondaryCode: {
      title: "src/components/Button.jsx (Source Code)",
      fileName: "src/app/page.jsx",
      code: `function App() {
  return (
    <div>
      <Button text="Click me!" />
      <Button text="Submit" />
    </div>
  )
}`
    },
    description: "Een property toevoegen om de button tekst aan te passen"
  },
  {
    id: 3,
    title: "Button met Click Handler",
    fileName: "src/components/Button.jsx",
    code: `function Button({ text, onClick }) {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}`,
    secondaryCode: {
      title: "src/app/page.jsx (Using the Component)",
      fileName: "src/app/page.jsx",
      code: `function App() {
  const handleClick = () => {
    alert('Button clicked!')
  }

  return (
    <Button 
      text="Click me!" 
      onClick={handleClick}
    />
  )
}`
    },
    description: "Een click handler toevoegen om de button interactief te maken"
  },
  {
    id: 4,
    title: "Button met Properties",
    fileName: "src/components/Button.jsx",
    code: `function Button({ text, onClick, disabled }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}`,
    secondaryCode: {
      title: "src/app/page.jsx (Implementation Example)",
      fileName: "src/app/page.jsx",
      code: `function App() {
  const handleClick = () => {
    console.log('Clicked!')
  }

  return (
    <div>
      <Button 
        text="Click me!" 
        onClick={handleClick}
      />
      <Button 
        text="Disabled Button" 
        disabled={true}
      />
    </div>
  )
}`
    },
    description: "Extra properties toevoegen aan de button component"
  }
];

// Export all slide decks
export const codeSlideDecks: Record<string, CodeSlide[]> = {
  functionalComponents: functionalComponentsSlides,
  basicButtons: basicButtonsSlides
};
