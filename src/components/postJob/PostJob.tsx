'use client'

import { FormEvent, useState } from 'react';

import { Input } from '../input/Input';
import s from './PostJob.module.scss';
import { emailPattern } from '@/utils/regex';
import Link from 'next/link';

const inputs = [
  {
    title: 'Company/Project',
    placeholder: 'Your Company/Project\'s name',
    type: 'text',
    isOptional: false,
    name: 'Company'
  },
  {
    title: 'Company website (optional)',
    placeholder: 'Your website',
    isOptional: true,
    type: 'text',
    name: 'Company Website'
  },
  {
    title: 'Email',
    placeholder: 'Your email',
    type: 'email',
    isOptional: false,
    name: 'Email'
  },
  {
    title: 'Job details (in any form or format, we\'ll make it look nice)',
    placeholder: `Usually people have:
    Project/ company description
    Duties and responsibilities;
    Required qualifications;
    Benefits`,
    type: 'textarea',
    isOptional: false,
    name: 'Details'
  },
  {
    title: 'Location (in any form or format, we\'ll make it look nice)',
    placeholder: 'e.g. Global Remote, EMEA Remote, US, San Francisco, etc.',
    type: 'text',
    isOptional: false,
    name: 'Location'
  },
  {
    title: 'Salary (in any form or format, we\'ll make it look nice)',
    placeholder: 'e.g. 100K-200K/year',
    type: 'text',
    isOptional: false,
    name: 'Salary'
  },
  {
    title: 'Apply Link (job page on Lever, Greenhouse or any service you’re using as a place where you keep your openings). Can be an email or Google Form too.',
    placeholder: 'Link or email',
    type: 'text',
    isOptional: false,
    name: 'Apply Link'
  },
]

export const PostJob = () => {

  const encode = (data: { [key: string]: string }) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  }

  const [isSubmitted, setIsSubmitted] = useState(false);


  type Inputs = {
    [key: string]: string;
  }

  const [errors, setErrors] = useState<Inputs>({
    'Company': '',
    'Website': '',
    'Email': '',
    'Details': '',
    'Location': '',
    'Salary': '',
    'Link': '',
  })
  const [data, setData] = useState<Inputs>({
    'Company': '',
    'Website': '',
    'Email': '',
    'Details': '',
    'Location': '',
    'Salary': '',
    'Link': '',
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    inputs.forEach(input => {
      const inputValue = input.name.split(' ')[input.name.split(' ').length - 1]
      const value = data[inputValue]

      if (!input.isOptional) {
        if (value === '') setErrors(prev => ({ ...prev, [inputValue]: "Can't be empty" }))
        else {
          if (input.type === 'email' && !emailPattern.test(value)) setErrors(prev => ({ ...prev, [inputValue]: "Please enter correct Email" }))
          else {
            if (value !== '') setErrors(prev => ({ ...prev, [inputValue]: "" }))
          }
        }
      }
    })

    if (Object.values(errors).every(error => error === '')) {

      fetch("/create", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "postJob", ...data })
      })
        .then(() => {
          setTimeout(() => {
            setIsSubmitted(true);
          }, 2000)
        })
        .catch(error => console.log(error))
    }
  }

  return (
    <section className={`${s.postJob} container`}>
      {!isSubmitted ?
        <>
          <div className={s.postJob__block}>
            <h2 className={s.postJob__title}>Post a Job</h2>
            <p className={s.postJob__desc}>
              We’re the only job board in Cosmos and tailored specifically for companies that search talents in the ecosystem. We charge 20 ATOMs per job post. We’ll be contacting you once you’ve submitted your job info.
            </p>
            <form
              // method="POST"
              data-netlify="true"
              name='postJob'
              netlify-honeypot="bot-field"
              noValidate
              autoComplete="off"
              onSubmit={onSubmit}
              className={s.postJob__form}>
              <input type="hidden" name="postJob" value="postJob" />
              {inputs.map(({ placeholder, title, name, type, isOptional }) => (
                <Input
                  key={title}
                  placeholder={placeholder}
                  label={title}
                  isOptional={isOptional}
                  type={type}
                  name={name}
                  errors={errors}
                  setErrors={setErrors}
                  data={data}
                  setData={setData}
                />
              ))}
              <button
                onClick={onSubmit}
                className={s.postJob__form_btn}>Submit</button>
            </form>

          </div>
        </>
        :
        <>
          <h2 className={`${s.postJob__title} ${s.postJob__success}`}>You’ve successfully submitted your job info!</h2>
          <Link className={s.postJob__done} href='/'>Done</Link>
        </>
      }
    </section>
  )
}