import { expect, test } from '@playwright/test'

// Проверяем, что запрос идет к внешнему серверу
const isExternalApiRequest = (url: URL) =>
  !url.host.includes('localhost:3000') && !url.host.includes('127.0.0.1')

test.describe('Страница авторизации (LoginPage E2E)', () => {
  test.beforeEach(async ({ page }) => {
    // По умолчанию на любой внешний GET-запрос возвращаем 401 Unauthorized,
    await page.route(
      url => isExternalApiRequest(url),
      async route => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Unauthorized' }),
          })
        } else {
          // POST и другие запросы по умолчанию пропускаем
          await route.continue()
        }
      }
    )

    await page.goto('/')
  })

  test('должен отображать все элементы формы и мета-тайтл страницы', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Вход', level: 3 })
    ).toBeVisible()
    await expect(page).toHaveTitle('Вход в систему')
    await expect(page.getByPlaceholder('Введите ваш логин')).toBeVisible()
    await expect(page.getByPlaceholder('Ваш пароль')).toBeVisible()

    const registerLink = page.getByRole('link', { name: 'Зарегистрироваться' })
    await expect(registerLink).toBeVisible()
    await expect(registerLink).toHaveAttribute('href', '/sign-up')
  })

  test('должен показывать клиентские ошибки Ant Design при отправке пустой формы', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Войти в аккаунт' }).click()

    const loginError = page
      .locator('.ant-form-item-explain-error')
      .filter({ hasText: /^Логин$/ })
    await expect(loginError).toBeVisible()
    await expect(
      page.getByText('Введите пароль', { exact: true })
    ).toBeVisible()
  })

  test('должен выводить ошибку бэкенда при неверных учетных данных (обработка catch-блока хука)', async ({
    page,
  }) => {
    // Перехватываем внешний запрос авторизации и возвращаем ошибку
    await page.route(
      url => isExternalApiRequest(url),
      async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Неверный логин или пароль.' }),
          })
        } else {
          await route.continue()
        }
      }
    )

    await page.getByPlaceholder('Введите ваш логин').fill('wrong_user')
    await page.getByPlaceholder('Ваш пароль').fill('wrong_password')
    await page.getByRole('button', { name: 'Войти в аккаунт' }).click()

    await expect(
      page.getByText('Неверный логин или пароль.', { exact: true })
    ).toBeVisible()
  })

  test('должен успешно авторизовать пользователя и перенаправить на главную страницу', async ({
    page,
  }) => {
    const mockUserData = {
      id: 42,
      login: 'best_player',
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'SuperPlayer',
      email: 'player@greatgame.com',
      phone: '+79991112233',
      avatar: null,
    }
    // POST вход и проверка профиля в ProtectedLayout
    await page.route(
      url => isExternalApiRequest(url),
      async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUserData),
        })
      }
    )

    await page.getByPlaceholder('Введите ваш логин').fill('best_player')
    await page.getByPlaceholder('Ваш пароль').fill('correct_password_123')

    // Настраиваем безопасное ожидание ответа
    const responsePromise = page.waitForResponse(response => {
      const url = new URL(response.url())
      return isExternalApiRequest(url) && response.request().method() === 'POST'
    })

    await page.getByRole('button', { name: 'Войти в аккаунт' }).click()
    await responsePromise

    // Проверяем успешный редирект на /main
    await expect(page).toHaveURL(/\/main/, { timeout: 10000 })
  })
})
