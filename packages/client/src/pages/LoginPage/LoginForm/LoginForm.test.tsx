import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfigProvider } from 'antd'
import type React from 'react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import LoginForm from './LoginForm'
import '../../../test-setup'

const createTestStore = () =>
  configureStore({
    reducer: {
      user: (state = { data: null }) => state,
    },
  })

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

const mockSignin = vi.fn()
vi.mock('../../../api/Controllers/UserController', () => ({
  default: {
    signin: (...args: unknown[]) => mockSignin(...args),
  },
}))

describe('Интеграционные тесты формы LoginForm (валидация и ввод)', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    vi.clearAllMocks()
    store = createTestStore()
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <ConfigProvider prefixCls="test-ant">{ui}</ConfigProvider>
      </Provider>
    )
  }

  test('должен соответствовать сохраненному HTML-снапшоту', () => {
    const { asFragment } = renderWithProviders(<LoginForm />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('должен показывать встроенные ошибки Ant Design при попытке отправить пустую форму', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const submitButton = screen.getByRole('button', {
      name: /войти в аккаунт/i,
    })
    await user.click(submitButton)

    await waitFor(() => {
      const errorElements = document.querySelectorAll(
        '.test-ant-form-item-explain-error'
      )
      expect(errorElements.length).toBe(2)

      const errorTexts = Array.from(errorElements).map(el =>
        el.textContent?.trim()
      )
      expect(errorTexts).toContain('Логин')
      expect(errorTexts).toContain('Введите пароль')
    })

    expect(mockSignin).not.toHaveBeenCalled()
  })

  test('должен выводить ошибку кастомного валидатора, если введены некорректные данные', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const loginInput = screen.getByLabelText('Логин')
    const passwordInput = screen.getByLabelText('Пароль')
    const submitButton = screen.getByRole('button', {
      name: /войти в аккаунт/i,
    })

    // Передаём заведомо некорректный логин (только цифры)
    await user.type(loginInput, '123')
    await user.type(passwordInput, 'valid_password_123')
    await user.click(submitButton)

    await waitFor(() => {
      const errorElement = document.querySelector(
        '.test-ant-form-item-explain-error'
      )
      expect(errorElement).toBeInTheDocument()
      expect(errorElement?.textContent).toBeTruthy()
    })

    expect(mockSignin).not.toHaveBeenCalled()
  })

  test('должен отправлять форму на сервер при успешном прохождении всех валидаций', async () => {
    mockSignin.mockResolvedValueOnce({
      id: 42,
      login: 'player',
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'SuperPlayer',
      email: 'player@greatgame.com',
      phone: '+79991112233',
      avatar: null,
    })

    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const loginInput = screen.getByLabelText('Логин')
    const passwordInput = screen.getByLabelText('Пароль')
    const submitButton = screen.getByRole('button', {
      name: /войти в аккаунт/i,
    })

    await user.type(loginInput, 'valid_player')
    await user.type(passwordInput, 'secure_pass_123')
    await user.click(submitButton)

    await waitFor(
      () => {
        expect(mockSignin).toHaveBeenCalledTimes(1)
      },
      { timeout: 1500 }
    )

    expect(mockSignin).toHaveBeenCalledWith(
      { login: 'valid_player', password: 'secure_pass_123' },
      expect.any(Function),
      expect.anything()
    )
  })
})
