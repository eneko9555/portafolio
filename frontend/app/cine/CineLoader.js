'use client'
import dynamic from 'next/dynamic'

const Loading = () => (
  <div className='fixed inset-0 z-50 grid place-items-center bg-bg'>
    <p className='label animate-pulse'>Abriendo el cine…</p>
  </div>
)

// three y la escena solo se descargan al entrar en /cine
const Cine = dynamic(() => import('./Cine'), { ssr: false, loading: Loading })

export default function CineLoader () {
  return <Cine />
}
