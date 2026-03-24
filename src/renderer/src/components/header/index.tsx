import React, { useCallback, useMemo } from 'react'
import style from './index.module.scss'
import Close from 'assets/image/svg/close.svg?react'
import Full from 'assets/image/svg/full.svg?react'
import Mini from 'assets/image/svg/mini.svg?react'

function Header() {
  const toggleFullscreen = useCallback(() => {
    try {
      window.api.window.maximize()
    } catch {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.error(err))
      } else {
        document.documentElement.requestFullscreen()
      }
    }
  }, [])
  const onCloseWindow = useCallback(() => {
    window.api.window.close()
  }, [])
  const onMiniWindow = useCallback(() => {
    window.api.window.minimize()
  }, [])

  const options = useMemo(
    () => [
      {
        key: 'mini',
        src: <Mini />,
        title: '最小化',
        onClick: onMiniWindow
      },
      {
        key: 'full',
        src: <Full />,
        title: '全屏/退出',
        onClick: toggleFullscreen
      },
      {
        key: 'close',
        src: <Close />,
        title: '关闭',
        onClick: onCloseWindow
      }
    ],
    [toggleFullscreen, onCloseWindow, onMiniWindow]
  )

  return (
    <header className={style.header}>
      <div className={style.optoins}>
        {options.map((item) => (
          <div className={style.icon} title={item.title} key={item.key} onClick={item.onClick}>
            {item.src}
          </div>
        ))}
      </div>
    </header>
  )
}

export default React.memo(Header)
