export const BrowserFrame = ({ url, children, className = '' }) => {
  return (
    <div className={`frame ${className}`}>
      <div className='frame-bar' aria-hidden='true'>
        <span className='frame-dot' />
        <span className='frame-dot' />
        <span className='frame-dot' />
        {url && <span className='frame-url'>{url}</span>}
      </div>
      {children}
    </div>
  )
}

export const PhoneFrame = ({ children, className = '' }) => {
  return <div className={`phone ${className}`}>{children}</div>
}
