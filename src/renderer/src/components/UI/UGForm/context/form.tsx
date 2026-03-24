import { createContext, useContext } from 'react'
import { Path, FieldValues, RegisterOptions } from 'react-hook-form'

interface FormFieldContextValue<T extends FieldValues> {
  name?: Path<T>
  rules?: RegisterOptions<T, Path<T>>
}
const FormFieldContext = createContext<FormFieldContextValue<any> | null>(null)

export function useFormFieldContext<T extends FieldValues>() {
  const ctx = useContext(FormFieldContext)
  if (!ctx) throw new Error('useFormFieldContext must be used within <FormItem>')
  return ctx as FormFieldContextValue<T>
}

export default FormFieldContext
