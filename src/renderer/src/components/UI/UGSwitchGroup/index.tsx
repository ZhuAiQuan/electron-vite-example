/**
 * 类switch group切换组件
 */

import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import style from './switch_group.module.scss'

interface Props<T> {
  options: Option<T>[]
  onChange?: (value: T) => void
  value?: T
  className?: string
}
interface Option<T> {
  label: string
  value: T
}
function Index<T extends string>({ options, value, onChange, className = '' }: Props<T>) {
  const onHandleChange = useCallback(
    (val: T) => {
      onChange?.(val)
    },
    [onChange]
  )
  return (
    <div className={`${style.container} ${className}`}>
      <div className={style['switch-group-context']}>
        <motion.div
          className={style.actived}
          style={{ width: `calc(100%/${options.length})` }}
          initial={false}
          animate={{
            x: options.findIndex((option) => option.value === value) * 100 + '%'
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        ></motion.div>
        {options.map((option) => (
          <div
            key={option.value}
            className={`${style.switch} ${value === option.value ? style['switch-active'] : ''}`}
            style={{
              width: `calc(100%/${options.length})`
            }}
            onClick={() => onHandleChange(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(Index)
