import { emailPattern } from '@/utils/regex';
import s from './Input.module.scss';

import { ChangeEvent, SetStateAction } from 'react';

type Inputs = {
  [key: string]: string

}

interface TInputProps {
  type: string;
  placeholder: string;
  label: string;
  isOptional: boolean;
  name: string;
  errors: Inputs
  setErrors: React.Dispatch<React.SetStateAction<Inputs>>
  data: Inputs
  setData: React.Dispatch<React.SetStateAction<Inputs>>
}

export const Input = ({ type = 'text', placeholder, label, isOptional, name, errors, setErrors, data, setData }: TInputProps) => {
  const changeHandler = ((ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = ev.target.value;
    if (!isOptional) {
      if (value === '') setErrors(prev => ({ ...prev, [name]: "Can't be empty" }))
      else {
        if (type === 'email' && !emailPattern.test(value)) setErrors(prev => ({ ...prev, [name]: "Please enter correct Email" }))
        else {
          if (value !== '') setErrors(prev => ({ ...prev, [name]: "" }))
        }
      }
    }

    setData(prev => ({ ...prev, [name]: value }))
  })

  // console.log(name.split(' '))

  return (
    <div className={s.input__block} key={label}>
      <label htmlFor={placeholder} className={s.input__block_label}>{label}</label>
      {
        type !== 'textarea' ?
          <input
            id={placeholder}
            type='text'
            className={`${s.input__block_input}`}
            onChange={(e) => changeHandler(e)}
            placeholder={placeholder}
            // name={name.split(' ')[0]}
          />
          :
          <textarea
            id={placeholder}
            className={`${s.input__block_input} ${s.textarea} 
           `}
            placeholder={placeholder}
            onChange={(e) => changeHandler(e)}
            // name={name.split(' ')[0]}

          ></textarea>
      }
      {
        errors[name as keyof Inputs] !== '' && <div className={s.input__block_error}>{errors[name as keyof Inputs]}</div>
      }
    </div>
  )
}

