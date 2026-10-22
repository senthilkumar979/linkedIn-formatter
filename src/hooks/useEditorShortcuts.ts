import { useEffect, type RefObject } from 'react'
import { matchShortcut, type ShortcutAction } from '../lib/editorActions'

interface UseEditorShortcutsArgs {
  textareaRef: RefObject<HTMLTextAreaElement | null>
  onActionRef: RefObject<(action: ShortcutAction) => void>
}

export function useEditorShortcuts({ textareaRef, onActionRef }: UseEditorShortcutsArgs) {
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return

    function handleKeyDown(event: KeyboardEvent) {
      const action = matchShortcut(event)
      if (!action) return
      event.preventDefault()
      onActionRef.current?.(action)
    }

    el.addEventListener('keydown', handleKeyDown)
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [textareaRef, onActionRef])
}
