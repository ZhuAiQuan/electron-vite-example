import React from 'react'
import { useFormContextSafe } from '../context'
import { FieldValues } from 'react-hook-form'
import { useFormFieldContext } from '../context/form'
import { useController } from 'react-hook-form'

export default function WithFormHOC<P extends object, T extends FieldValues>(
  Component: React.ComponentType<P>
) {
  return function Wrapped(rest: P) {
    const { control, setValue, trigger, clearErrors } = useFormContextSafe<T>()
    const { name, rules } = useFormFieldContext<T>()
    if (!name) return <Component {...rest} />
    const { field, fieldState } = useController({
      name,
      control,
      rules
    })
    const extra = {
      setValue,
      trigger,
      clearErrors
    }

    // field 包含 value, onChange, onBlur, name, ref（可选）
    return (
      <Component
        {...(rest as P)}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        name={field.name}
        error={fieldState.error?.message}
        {...extra}
      />
    )
  }
}
