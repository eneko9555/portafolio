import { experience } from '../data/profile'

const ExperienceList = () => {
  return (
    <ol className='divide-y divide-line border-y border-line'>
      {experience.map((job) => (
        <li key={job.company} data-reveal className='grid gap-4 py-10 lg:grid-cols-12 lg:gap-8'>
          <div className='lg:col-span-4'>
            <p className='label'>{job.period}</p>
            <h3 className='mt-3 text-2xl font-semibold tracking-tight'>
              {job.href
                ? (
                  <a href={job.href} target='_blank' rel='noreferrer' className='link'>
                    {job.company}
                  </a>
                  )
                : job.company}
            </h3>
            <p className='mt-1 text-muted'>{job.role}</p>
          </div>
          <div className='lg:col-span-8'>
            <p className='text-lg leading-relaxed'>{job.summary}</p>
            <ul className='mt-5 space-y-3 text-muted'>
              {job.points.map((point) => (
                <li key={point} className='flex gap-3 leading-relaxed'>
                  <span aria-hidden='true' className='mt-[0.7rem] h-px w-4 shrink-0 bg-muted' />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default ExperienceList
