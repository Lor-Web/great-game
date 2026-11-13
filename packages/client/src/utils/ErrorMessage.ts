export const ErrorMessage = (
  error: unknown,
  defaultMessage = 'Произошла ошибка.'
): string => {
  const err = error as Record<string, unknown>

  if (err && typeof err.response === 'string') {
    try {
      const parsed = JSON.parse(err.response) as Record<string, unknown>
      if (parsed && typeof parsed.reason === 'string') {
        return parsed.reason // Возвращаем ответ с бэкенда
      }
    } catch {
      // Если ответ пришел не в формате JSON сработает дефолтный текст
    }
  }

  return defaultMessage
}
