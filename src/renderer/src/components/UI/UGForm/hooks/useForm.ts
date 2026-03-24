import { useForm as useRHFForm, FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form'

export function useForm<T extends FieldValues>(props?: UseFormProps<T>): UseFormReturn<T> {
  return useRHFForm<T>(props)
}
