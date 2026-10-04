import CineLoader from './CineLoader'

export const metadata = {
  title: 'Cine',
  description: 'El portfolio de Eneko Fernández como un cine que se recorre en 3D.',
  robots: { index: false }
}

export default function CinePage () {
  return (
    <main>
      <h1 className='sr-only'>Cine: el portfolio en 3D</h1>
      <CineLoader />
    </main>
  )
}
