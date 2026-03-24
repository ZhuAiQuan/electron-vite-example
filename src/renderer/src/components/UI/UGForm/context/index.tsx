import { createContext, useContext } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

export interface FormContextType<T extends FieldValues> extends UseFormReturn<T> {}

const FormContext = createContext<FormContextType<any> | null>(null)

export const useFormContextSafe = <T extends FieldValues>() => {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useFormContextSafe must be used within <Form>')
  return ctx as FormContextType<T>
}

export default FormContext
