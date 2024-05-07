import './About.css'

export const About = () => {
  return (
    <div className='about'>
      <p className='about__header'>
        <a
          className='about__turtle-link'
          href='https://github.com/HewsonSchulz/Turtle'
          target='_blank'
          rel='noopener noreferrer'>
          Turtle
        </a>{' '}
        is a full-stack application that was developed by{' '}
        <a
          className='about__link'
          href='https://www.linkedin.com/in/hewson-schulz/'
          target='_blank'
          rel='noopener noreferrer'>
          Hewson Schulz
        </a>{' '}
        during his time at{' '}
        <a
          className='about__link'
          href='https://nashvillesoftwareschool.com/'
          target='_blank'
          rel='noopener noreferrer'>
          Nashville Software School.
        </a>{' '}
        It was created for his final capstone project, and it uses{' '}
        <a className='about__link' href='https://react.dev/' target='_blank' rel='noopener noreferrer'>
          React
        </a>{' '}
        for its client-side, and{' '}
        <a
          className='about__link'
          href='https://www.django-rest-framework.org/'
          target='_blank'
          rel='noopener noreferrer'>
          Django REST Framework
        </a>{' '}
        for its server-side. To learn more about the developer, click the links below.
      </p>
      <ul className='about-container'>
        <a href='https://github.com/HewsonSchulz' target='_blank' rel='noopener noreferrer' className='about__item'>
          <img className='about__img about__github' src='/Turtle/assets/github-icon.svg' alt='Github icon' />
          <p className='about__desc about__github-desc'>GitHub</p>
        </a>
        <a
          href='https://www.linkedin.com/in/hewson-schulz/'
          target='_blank'
          rel='noopener noreferrer'
          className='about__item'>
          <img className='about__img about__linkedin' src='/Turtle/assets/linkedin-icon.svg' alt='LinkedIn icon' />
          <p className='about__desc about__linkedin-desc'>LinkedIn</p>
        </a>
        <a
          href='https://nss-day-cohort-68.github.io/'
          target='_blank'
          rel='noopener noreferrer'
          className='about__item'>
          <img
            className='about__img about__nss'
            src='/Turtle/assets/nss-icon.svg'
            alt='Nashville Software School icon'
          />
          <p className='about__desc about__nss-desc'>NSS Cohort 68</p>
        </a>
        <a
          href='https://drive.google.com/file/d/1Y6aAPjofwJsvoG7PVx5yeZq8xexLF_xB/view?usp=sharing'
          target='_blank'
          rel='noopener noreferrer'
          className='about__item'>
          <img className='about__img about__resume' src='/Turtle/assets/doc-icon.svg' alt='resume icon' />
          <p className='about__desc about__resume-desc'>Resume</p>
        </a>
      </ul>
    </div>
  )
}
