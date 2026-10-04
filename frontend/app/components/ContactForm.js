'use client'
import { useState } from 'react'

const ContactForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit (e) {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
      if (!response.ok) throw new Error(`Error ${response.status}`)
      setName('')
      setEmail('')
      setMessage('')
      setStatus('success')
    } catch (error) {
      console.log(error)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='name' className='label'>Nombre</label>
        <input
          id='name'
          required
          type='text'
          autoComplete='name'
          className='field mt-2'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='email' className='label'>Email</label>
        <input
          id='email'
          required
          type='email'
          autoComplete='email'
          className='field mt-2'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='message' className='label'>Mensaje</label>
        <textarea
          id='message'
          required
          className='field mt-2 min-h-[10rem]'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button type='submit' disabled={status === 'loading'} className='btn-primary disabled:opacity-60'>
        {status === 'loading' ? 'Enviando…' : 'Enviar mensaje'}
      </button>
      <p aria-live='polite' className='text-sm'>
        {status === 'success' && (
          <span className='text-emerald-400'>Mensaje enviado. Te responderé lo antes posible.</span>
        )}
        {status === 'error' && (
          <span className='text-red-400'>No se ha podido enviar el mensaje. Escríbeme por email.</span>
        )}
      </p>
    </form>
  )
}

export default ContactForm
