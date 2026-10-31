import { validateField } from './Validation'

export const antdCustomValidator = (fieldName: string) => () => ({
  validator(_: unknown, value: unknown) {
    // Если поле пустое, Antd сам проверит его
    if (value === undefined || value === null || String(value).trim() === '') {
      return Promise.resolve()
    }

    // Вызываем функцию валидации
    const errorMessage = validateField(fieldName, String(value))

    // Если функция вернула строку с ошибкой — красим поле в красный и выводим этот текст
    if (errorMessage) {
      return Promise.reject(new Error(errorMessage))
    }

    // Ошибок нет
    return Promise.resolve()
  },
})
