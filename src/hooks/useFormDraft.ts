
import { useState, useEffect } from 'react'

interface UseFormDraftOptions<T> {
  key: string
  defaultValues: T
}

export function useFormDraft<T>({ key, defaultValues }: UseFormDraftOptions<T>) {
  const [formData, setFormData] = useState<T>(defaultValues)

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft_${key}`)
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        setFormData({ ...defaultValues, ...parsed })
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [key])

  // Save draft on data change
  const saveDraft = (data: T) => {
    setFormData(data)
    localStorage.setItem(`draft_${key}`, JSON.stringify(data))
  }

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem(`draft_${key}`)
    setFormData(defaultValues)
  }

  return {
    formData,
    saveDraft,
    clearDraft
  }
}
