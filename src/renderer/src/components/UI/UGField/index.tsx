import React from 'react'
import { type WithFormProps } from '@/components/UI/UGForm'
import { UGHOCWithForm } from '@/components/UI'
import style from './index.module.scss'

export interface Props extends React.InputHTMLAttributes<HTMLInputElement>, WithFormProps {
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  inputSize?: 'normal' | 'small'
  className?: string
}
function Index({
  addonBefore,
  addonAfter,
  register,
  error = false,
  className = '',
  ...props
}: Props) {
  return (
    <div className={`${style.context} ${error ? style['context-error'] : ''} ${className}`}>
      {addonBefore}
      <input {...register} {...props} className={style['ug-input']} />
      {addonAfter}
    </div>
  )
}

export default React.memo(UGHOCWithForm(Index))
