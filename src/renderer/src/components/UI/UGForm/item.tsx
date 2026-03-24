import React, { PropsWithChildren } from 'react'
import { FieldValues, Path, RegisterOptions, useFormState } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useFormContextSafe } from './context'
import FormFieldContext from './context/form'
import style from './item.module.scss'

interface Props<T extends FieldValues> extends PropsWithChildren {
  label?: string | React.ReactNode
  name?: Path<T>
  rules?: RegisterOptions<T, Path<T>>
  className?: string
}
function Item<T extends FieldValues>({ label, name, children, rules, className = '' }: Props<T>) {
  const { control } = useFormContextSafe<T>()
  const { errors } = useFormState({ control })

  return (
    <FormFieldContext.Provider value={{ name, rules }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0, y: 10 }}
        className={`${style.context} ${name ? style['context-hide-mb'] : ''} ${className}`}
      >
        {label && <label>{label}</label>}
        {children}
        {name && errors?.[name] && (
          <p className={style['fail-text']}>{(errors[name]?.message as string) || '错误'}</p>
        )}
      </motion.div>
    </FormFieldContext.Provider>
  )
}

export default React.memo(Item)
