# Local Qwen worker

Модель: qwen3.5:9b. Runtime: локальный Ollama на 127.0.0.1:11434.
Владелец разрешил использовать одного read-only помощника для сбора контекста.
Это отдельный Codex CLI process, не переключение модели основного чата.

## Запуск
Из PowerShell 7 в репозитории:

```powershell
pwsh -NoProfile -File scripts/qwen-worker.ps1 -Task 'Find usages of --hero-title-size. Return paths, line numbers and a short explanation. Do not edit.'
```

Wrapper определяет корень относительно своего файла, проверяет Ollama и наличие
модели; запускает Codex через --oss --local-provider ollama с --sandbox read-only,
--ephemeral и --ignore-user-config. Профиль ollama-launch не нужен.
Глобальные настройки Codex не меняются. Нужны PowerShell 7, Codex CLI и Ollama.

Задача передаётся через stdin, без интерпретации shell. Плагины, apps, multi-agent
и web search отключены; итоговый ответ читается из временного файла и файл удаляется.
Ограничение времени — 240 секунд; -TimeoutSeconds позволяет выбрать 15–900 секунд.
При таймауте останавливается только дерево запущенного процесса, не Ollama-сервер.
Ephemeral не означает, что Ollama выгрузит модель из памяти или все runtime-логи исчезнут.

## Когда использовать
Поиск файлов/символов, трассировка импортов и вызовов, usages CSS/компонентов,
короткий разбор переданных логов, первичная локализация ошибки, механические
несоответствия и предварительное ревью ограниченного diff.

Не использовать для архитектуры, трактовки неоднозначных требований, визуального
или продуктового выбора, сложной анимации, большого рефакторинга и финальной оценки.
Sol отвечает за решения и реализацию; Astra — по существующим правилам эскалации.
Не делегировать ради бесплатности: один rg обычно дешевле и быстрее запуска модели.

## Контракт
Задай вопрос, разрешённые пути, ожидаемые факты и предел ответа.
Результат: максимум 10 пунктов / 500 слов, пути, символы/строки, конкретные факты,
короткие доказательства, неопределённость и следующий файл для основной модели.
Гипотезы отделять от наблюдений; проценты уверенности не заменяют доказательств.
Не читать секреты, бинарные ассеты, зависимости, сборки или весь репозиторий.
Не передавать исходный лог целиком, если можно отобрать относящийся к проблеме фрагмент.
Qwen не правит файлы и не делегирует; основная модель не запускает бесконечные повторы.

Перед изменением важного поведения проверить вывод по исходникам. Для простой
инвентаризации достаточно непосредственно проверяемых ссылок; не считать ответ
гарантированно полным. При ошибке/таймауте сообщить и продолжить самостоятельно.

## Шаблоны

Scout: «Read-only. Find the Hero animation paths in components/Hero.tsx and
components/Preloader.tsx. Return files, symbols, evidence and execution flow.
Maximum 10 bullets. Do not redesign or edit.»

Bug triage: «Read-only. Investigate horizontal overflow below 430px in <named files>.
Return up to 3 hypotheses with line evidence and a way to verify each.
Do not claim browser reproduction unless performed. Do not edit.»

Diff review: «Read-only. Review git diff only for <named paths>. Look for functional
bugs, responsive regressions, missing cleanup and obvious performance issues.
Ignore style preferences. Return evidence and uncertainty. Do not edit.»

Context builder: «Parent task: <task>. Search only <scope>. Return FILES_TO_READ,
WHY per file, IMPORTANT_CONTEXT up to 500 words. Do not solve, edit or delegate.»

## Ограничения
Проверка 2026-09-27: CLI запущен из Portfolio напрямую и через wrapper.
Задача SelectedCases/WorkBoard завершилась с exit code 0; цепочка открытия и
плейсхолдеры подтверждены по исходникам. Qwen ошибался в номерах строк, а в первом
ответе приписал WorkVisual загрузку картинок. Поэтому точные locations и важные
утверждения основной агент перепроверяет через rg/чтение исходника.

Read-only sandbox ограничивает файловые изменения, но сам по себе не является
универсальной изоляцией всех внешних сервисов. Не расширять worker MCP-инструментами
или правами записи. Если понадобится пишущий агент — отдельная задача и настройка.
