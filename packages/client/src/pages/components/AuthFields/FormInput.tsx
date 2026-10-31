import type { InputProps } from 'antd'
import { Form, Input } from 'antd'
import type React from 'react'

//Прокидываем пропсы
type FormInputProps = Omit<InputProps, 'name'> & {
  name: string | [string, string, string]
  label?: React.ReactNode
  rules?: React.ComponentProps<typeof Form.Item>['rules']
  help?: React.ReactNode
  isPassword?: boolean
  dependencies?: React.ComponentProps<typeof Form.Item>['dependencies']
  hasFeedback?: boolean
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  rules,
  help,
  isPassword,
  dependencies,
  hasFeedback,
  ...inputProps
}) => {
  const InputComponent = isPassword ? Input.Password : Input

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      help={help}
      dependencies={dependencies}
      hasFeedback={hasFeedback}>
      <InputComponent {...inputProps} />
    </Form.Item>
  )
}
