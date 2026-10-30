'use client'

import { Fragment } from 'react'
import { TextRepel } from '@/components/ui/text-repel'

type RepelWordsProps = {
  /** The phrase to render -- split and animated one word at a time. */
  text: string
  /** Classes applied to every letter (e.g. "nm2-grad-text" for the gradient-fill words). Omit to inherit the ambient text color/weight from the heading. */
  letterClassName?: string
  radius?: number
  strength?: number
}

// Wraps text-repel's TextRepel one word at a time instead of once for the
// whole phrase. TextRepel lays its letters out with flex-wrap, which --
// given the whole headline as one string -- wraps mid-word wherever a line
// runs out of room, instead of pushing the whole word down the way normal
// text does. Giving each word its own TextRepel (each an inline-flex box
// that line-wraps as a single unit) keeps the headline's existing line
// breaks intact at every viewport width.
export function RepelWords({ text, letterClassName, radius = 90, strength = 26 }: RepelWordsProps) {
  const words = text.split(' ').filter(Boolean)
  return (
    <>
      {words.map((word, i) => (
        // The separating space is a sibling of the word's wrapper, not a
        // child of it. A space placed INSIDE a display:inline-block box
        // sits at the end of that box's own internal line, and CSS trims
        // trailing collapsible whitespace at the end of a line -- so it
        // was vanishing even though the markup had it, running every pair
        // of words together ("FINDYOUR"). Out here, in the normal flow
        // between two inline-block siblings, it's just an ordinary space.
        <Fragment key={i}>
          <span className="inline-block whitespace-nowrap">
            <TextRepel text={word} letterClassName={letterClassName} radius={radius} strength={strength} />
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </>
  )
}
