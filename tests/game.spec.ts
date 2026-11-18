import { expect, type Page, test } from '@playwright/test'

const isExternalApiRequest = (url: URL) =>
  !url.host.includes('localhost:3000') && !url.host.includes('127.0.0.1')

test.describe('Страница игры и игровой движок', () => {
  test.beforeEach(async ({ page }) => {
    const mockUserData = {
      id: 42,
      first_name: 'Иван',
      second_name: 'Иванов',
      display_name: 'SuperPlayer',
      login: 'test_player',
      avatar: null,
      email: 'player@greatgame.com',
      phone: '+79991112233',
    }

    await page.route(
      url => isExternalApiRequest(url),
      async route => {
        const request = route.request()

        // Обрабатываем запросы браузера для работы CORS
        if (request.method() === 'OPTIONS') {
          await route.fulfill({
            status: 204,
            headers: {
              'Access-Control-Allow-Origin': 'http://localhost:3000',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Allow-Credentials': 'true',
            },
          })
          return
        }

        // Возвращаем мок-профиль пользователя на запрос проверки авторизации
        if (
          request.url().includes('/auth/user') &&
          request.method() === 'GET'
        ) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            headers: {
              'Access-Control-Allow-Origin': 'http://localhost:3000',
              'Access-Control-Allow-Credentials': 'true',
            },
            body: JSON.stringify(mockUserData),
          })
          return
        }

        // Заглушка для остальных запросов
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true',
          },
          body: JSON.stringify({ result: 'OK' }),
        })
      }
    )

    // Переходим на страницу игры
    await page.goto('/game')
  })

  test('должен отображать игровой холст', async ({ page }) => {
    await expect(page).toHaveURL(/\/game/)

    const canvas = page.getByLabel('Игровое поле игры')
    await expect(canvas).toBeVisible()
    await expect(canvas).toHaveAttribute('tabindex', '0')
  })

  test('должен скрывать стартовый оверлей и реагировать на клавиши управления', async ({
    page,
  }) => {
    const canvas = page.getByLabel('Игровое поле игры')
    await expect(canvas).toBeVisible()

    // Используем локатор кнопки старта и явно проверяем, что кнопка START отображается (если её нет — тест сразу упадёт)
    const startButton = page.getByRole('button', { name: 'START' })
    await expect(startButton).toBeVisible()
    await startButton.click()
    await expect(startButton).toBeHidden()

    // Ставим фокус на игровой холст
    await canvas.click()
    await expect(canvas).toBeFocused()

    // Фиксируем снимок пикселей холста до начала движения
    const initialCanvasSnapshot = await canvas.evaluate(
      (el: HTMLCanvasElement) => el.toDataURL()
    )

    // Удерживаем клавишу движения вправо, чтобы игровой цикл успел сдвинуть героя
    await page.keyboard.down('ArrowRight')
    await page.waitForTimeout(200)
    await page.keyboard.up('ArrowRight')

    // Проверяем, что изображение на холсте изменилось
    await expect(async () => {
      const updatedCanvasSnapshot = await canvas.evaluate(
        (el: HTMLCanvasElement) => el.toDataURL()
      )
      expect(updatedCanvasSnapshot).not.toBe(initialCanvasSnapshot)
    }).toPass({ timeout: 2000 })
  })
})
