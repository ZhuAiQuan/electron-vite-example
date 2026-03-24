import { PropsWithChildren, useCallback } from 'react'
import {
  UseFormRegisterReturn,
  FieldValues,
  UseFormReturn,
  SubmitHandler,
  FieldErrors
} from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'
export { default as FormItem } from './item'
export { useForm } from './hooks/useForm'
import FormContext from './context'

export interface WithFormProps {
  register?: UseFormRegisterReturn
  error?: boolean
}

interface FormProps<T extends FieldValues> extends PropsWithChildren {
  onSubmit: SubmitHandler<T>
  className?: string
  form: UseFormReturn<T>
  /**
   * 校验失败是否自动滚动到第一个错误表单的位置
   */
  scrollToErrors?: boolean
}
export default function Index<T extends FieldValues>({
  children,
  onSubmit,
  className = '',
  form,
  scrollToErrors = false
}: FormProps<T>) {
  // 校验失败自动滚动到指定位置
  const onInvalid = useCallback(
    (errors: FieldErrors<T>) => {
      if (!scrollToErrors) return
      const firstKey = Object.keys(errors)[0]
      if (!firstKey) return

      const el = document.querySelector(`[name="${firstKey}"]`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        ;(el as HTMLElement).focus()
      }
    },
    [scrollToErrors]
  )
  return (
    <FormContext.Provider value={form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className={className}>
        <AnimatePresence>{children}</AnimatePresence>
      </form>
    </FormContext.Provider>
  )
}
