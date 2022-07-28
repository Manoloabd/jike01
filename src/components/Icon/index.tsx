import React from 'react'
import classnames from 'classnames'
type props = {
  type: string
  onClick?: () => void
  className?: string
}
export default function Icon(props: props) {
  return (
    <div>
      <svg
        className={classnames('icon', props.className)}
        aria-hidden='true'
        onClick={props.onClick}
      >
        <use xlinkHref={`#${props.type}`} />
      </svg>
    </div>
  )
}
