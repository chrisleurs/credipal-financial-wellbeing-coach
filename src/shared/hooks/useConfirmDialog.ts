
/**
 * useConfirmDialog Hook - Confirmaciones unificadas
 */
import { useState, useCallback } from 'react'

interface ConfirmOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

interface UseConfirmDialogReturn {
  isOpen: boolean
  options: ConfirmOptions
  confirm: (options?: ConfirmOptions) => Promise<boolean>
  close: () => void
  handleConfirm: () => void
  handleCancel: () => void
}

export function useConfirmDialog(): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((confirmOptions: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'default',
        ...confirmOptions
      })
      setResolvePromise(() => resolve)
      setIsOpen(true)
    })
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setOptions({})
    if (resolvePromise) {
      resolvePromise(false)
      setResolvePromise(null)
    }
  }, [resolvePromise])

  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true)
      setResolvePromise(null)
    }
    setIsOpen(false)
  }, [resolvePromise])

  const handleCancel = useCallback(() => {
    close()
  }, [close])

  return {
    isOpen,
    options,
    confirm,
    close,
    handleConfirm,
    handleCancel
  }
}
