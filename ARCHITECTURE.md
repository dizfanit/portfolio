# Архитектура DIZFANIT DESIGN

Фактическое состояние на 2026-09-27, включая текущую рабочую копию.
Это карта реализации. Правила дизайна находятся в docs/design, предложения — в
[backlog](docs/plans/backlog.md), исходный обзор — в [архиве](docs/reviews/2026-09-27-initial-audit.md).

## Стек и границы
Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, framer-motion.
Точные версии и команды — package.json; npm с package-lock.json.
Добавлена простая /admin и API /api/admin для входа, загрузки и сохранения новых кейсов.
Исходные 14 кейсов хранятся в TypeScript/public; новые кейсы и правки исходных — в локальном постоянном каталоге .portfolio-content.
Внешней CMS и облачной базы пока нет. Подробнее — docs/admin.md. Папки src/ сейчас нет.

## Маршруты
- app/layout.tsx: metadata, глобальный CSS, CustomCursor и GridOverlay.
  Глобальная CRT-рамка сохранена, но ENABLE_TV_EFFECT = false.
- app/page.tsx: Preloader, Header, SmoothSectionScroll; внутри main.page-snap:
  Hero → About → SelectedCases → Services → Process → Contact.
- app/work/[slug]/page.tsx: async params, поиск по slug, notFound для неизвестного
  кейса. Маршрут динамический: поиск в объединённом опубликованном каталоге lib/content-store.ts. Черновики и одиночные работы возвращают notFound; исходная запись не подставляется вместо скрытой. Подключён Header с casePage; Preloader здесь не подключён.
  Все кейсы используют CaseStudyBoard и getCaseStudy из data/caseStudies.ts.

## Компоненты
| Область | Владельцы |
| --- | --- |
| Первый экран и навигация | components/Hero.tsx, components/Header.tsx |
| Профиль | components/About.tsx |
| Работы | components/SelectedCases.tsx, components/WorkBoard.tsx |
| Среда кейсов и общая механика досок | components/CaseStudyBoard.tsx, hooks/useBoardPan.ts |
| Услуги, процесс, связь | components/Services.tsx, Process.tsx, Contact.tsx |
| Вступление и скролл | components/Preloader.tsx, SmoothSectionScroll.tsx |
| Эффекты | components/CustomCursor.tsx, LiquidReveal.tsx, ScrambleTitle.tsx |
| Вспомогательная сетка по T | components/GridOverlay.tsx и GridOverlay.module.css |

AboutBackup.tsx существует, но в обзоре не найдено его импортов. Это не разрешение удалять файл.

## Server / client
Маршруты и статические секции — серверные компоненты. Клиентские границы:
About, WorkBoard, Preloader, SmoothSectionScroll, CustomCursor, LiquidReveal,
ScrambleTitle, GridOverlay, CaseStudyBoard. Интерактивное состояние локально.
Не требуется переносить всю страницу в use client ради отдельного эффекта.

## Данные
data/cases.ts хранит исходные основные поля; data/workItems.ts объединяет их с исходными категориями, номерами и параметрами визуала. lib/content-store.ts создаёт редактируемые исходные записи из этих данных и getCaseStudy, затем накладывает сохранённые правки по стабильному id builtin:<slug>. readAdminCases возвращает общий каталог без записей с внутренним deleted, publishedCases фильтрует его по статусу. PATCH /api/admin/cases меняет только сохранённый статус; DELETE сохраняет отметку удаления и убирает запись из каталога, чтобы исходные данные не восстановили её после перезапуска. POST, PATCH и DELETE используют общую очередь атомарной записи и проверку revision; удалённые id отвергаются. Номера удалённых работ и файлы медиа сохраняются. Обложка исходного placeholder может оставаться пустой. Исходные public-медиа допустимы только из списка файлов того же кейса; загруженные медиа проверяются по сохранённым размерам.
Все опубликованные записи загружаются сервером в app/page.tsx и передаются в SelectedCases/WorkBoard без подробного текста и списка внутренних медиа. WorkBoard сохраняет исходный визуал и пропорции неизменённой обложки; новые обложки используют свои размеры. singleWork отключает ссылку на отдельный кейс. adminCategories задаёт общий список фильтров, включая «Рекламные баннеры».
Название и тип продублированы в workItems и cases.ts, сейчас совпадают; описания превью и страниц исходных кейсов отличаются. Дублирование остаётся техническим долгом.
Контент услуг, процесса и контактов находится в компонентах.
data/caseStudies.ts хранит подробные данные Abby и getCaseStudy(slug), который
возвращает данные общей среды для известных slug, undefined для неизвестных.
В незаполненных кейсах нет фиктивных медиа; описание берётся из cases.ts.

## Стили и медиа
app/globals.css — активный источник токенов, сетки, секций, CRT и адаптивности.
CSS Modules используются у GridOverlay, ScrambleTitle и CaseStudyBoard.
Общий .board-dismiss в globals.css задаёт стиль закрытия и возврата обеих досок.
Work содержит исторические слои каскада: перенос файлов без сведения итоговых
правил не решает проблему.
public/fonts — PaluiSP и Manrope; public/videos — Hero MP4 и постер;
about1.png/about2.png — LiquidReveal; about-icons и cursors — вспомогательные ассеты.
Ссылки на public-ассеты в приложении начинаются с /.

## Связи, важные при изменениях
- Hero и Preloader используют один видеоассет, путь записан в обоих компонентах.
- SmoothSectionScroll зависит от main.page-snap > section и глобальных snap-правил.
- WorkBoard связан с CSS состояний has-selection/is-open, курсором закрытия и скроллом.
- WorkBoard и CaseStudyBoard используют useBoardPan: реальные границы холста,
  Work добавляет конечный panPadding по четырём направлениям, кейс сохраняет default 0;
  pointer capture, порог drag и preventScroll при фокусе карточки.
- CaseStudyBoard возвращается через useCaseTransition с красной пиксельной волной
  и /?section=work (scroll: false); перед снимком нового экрана проверяются
  pathname и DOM назначения (номер кейса либо восстановленная позиция #work).
  WorkBoard восстанавливает секцию и нормализует URL до /#work. При has-selection scroll-snap отключён,
  SmoothSectionScroll пропускает ввод и останавливает активную анимацию секций.
- Токены с префиксом hero используются также другими секциями.
- GridOverlay — скрытая по умолчанию вспомогательная сетка; это не CRT-рамка.

Изменения этих связей отражать здесь; поведенческие требования — в соответствующей
спецификации секции или [motion](docs/design/motion.md).

## Администрирование

components/AdminPanel.tsx — клиентская форма /admin с общей редактируемой витриной, списком работ владельца и карточкой статуса выбранного кейса. AdminPanel.module.css использует компактные токены и 12 колонок локально для /admin. Галерея миниатюр позволяет заменить, удалить из кейса и переставить изображения без редактируемых подписей; одиночная работа отключает внутренние медиа и подробный текст, сохраняя их данные. lib/content-store.ts и lib/admin-auth.ts — server-only модули. API проверяет подписанную сессию и Origin для изменений. Пароль создаётся только локально, хранится scrypt-хеш. /media/[file] отдаёт обработанные WebP из приватного каталога по случайным URL. Публичные кейсы и главная рендерятся динамически, чтобы сохранённый контент появился без пересборки. Черновики не выдаются на публичных страницах. Первая версия предполагает один Node.js-процесс с постоянным диском; облачный адаптер ещё не подключён.
