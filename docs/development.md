# Локальная разработка на Windows

Рабочая папка: C:\Users\Dizfa\Desktop\Portfolio.
Используй npm.cmd в PowerShell: npm.ps1 может блокироваться execution policy.

- Установка при необходимости: npm.cmd install.
- Разработка: npm.cmd run dev.
- Проверка сборки: npm.cmd run build.
- Production после сборки: npm.cmd run start.

Если Next сообщает об уже работающем dev server, используй его.
Адрес: http://127.0.0.1:3000 (localhost может зависать).

Если после изменения списка зависимостей React-эффекта появляется ошибка
«The final argument passed to useEffect changed size between renders»,
полностью обнови страницу: Fast Refresh мог сохранить состояние старой версии.
В CaseStudyBoard.tsx используется `// @refresh reset`, чтобы при правках
компонент пересоздавался без сохранения прежнего состояния хуков.

## Восстановление зависшего сервера
Только если запросы зависают, проверь:
```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen
Get-CimInstance Win32_Process -Filter "name = 'node.exe'"
```
Останавливать можно только подтверждённые PID зависшего Next-процесса этого
репозитория. Не завершать все node.exe или чужой процесс, занявший порт.

Запуск скрытого detached-процесса из рабочей папки (после проверки, что сервер нужен):
```powershell
New-Item -ItemType Directory -Force .next | Out-Null
Start-Process powershell.exe -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command','cd "C:\Users\Dizfa\Desktop\Portfolio"; npm.cmd run dev -- --port 3000 *> .next\dev-server.log' -WindowStyle Hidden
(Invoke-WebRequest -UseBasicParsing -Uri http://127.0.0.1:3000 -TimeoutSec 30).StatusCode
```
Ожидается 200. Лог относится к состоянию проекта; не удалять при обычной уборке.
Не менять системную execution policy ради npm.

