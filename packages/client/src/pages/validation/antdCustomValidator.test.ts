import { beforeEach, describe, expect, test, vi } from 'vitest'
import { antdCustomValidator } from './antdCustomValidator'
import { validateField } from './Validation'

vi.mock('./Validation', () => ({
  validateField: vi.fn(),
}))

describe('Кастомный валидатор antdCustomValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('должен успешно разрешать промис, если значение пустое или не передано', async () => {
    const validatorInstance = antdCustomValidator('login')()
    const { validator } = validatorInstance

    // Ant Design сам обрабатывает пустые поля поэтому наш валидатор должен их пропускать
    await expect(validator({}, undefined)).resolves.toBeUndefined()
    await expect(validator({}, null)).resolves.toBeUndefined()
    await expect(validator({}, '   ')).resolves.toBeUndefined()

    // Проверяем, что внутренняя функция валидации не вызывалась
    expect(validateField).not.toHaveBeenCalled()
  })

  test('должен успешно разрешать промис, если ошибок валидации нет', async () => {
    // Симулируем, что validateField не нашел ошибок и вернул пустую строку или undefined
    vi.mocked(validateField).mockReturnValueOnce('')

    const validatorInstance = antdCustomValidator('login')()
    const { validator } = validatorInstance

    await expect(validator({}, 'correct_login')).resolves.toBeUndefined()
    expect(validateField).toHaveBeenCalledWith('login', 'correct_login')
  })

  test('должен отклонять промис с ошибкой, если validateField возвращает текст ошибки', async () => {
    const errorText = 'Логин должен содержать только латинские буквы'
    vi.mocked(validateField).mockReturnValueOnce(errorText)

    const validatorInstance = antdCustomValidator('login')()
    const { validator } = validatorInstance

    // Проверяем, что промис возвращается с текстом ошибки
    await expect(validator({}, 'невалидный логин')).rejects.toThrow(errorText)
    expect(validateField).toHaveBeenCalledWith('login', 'невалидный логин')
  })
})
