# Контакты по красному портретному референсу

Этот ExecPlan ведётся по PLANS.md. Рабочая папка: C:\Users\Dizfa\Desktop\Portfolio. Пользователь просит заменить только последнюю секцию сайта, повторить предоставленную композицию и сгенерировать фон с его лицом из второго блока.

## Purpose / Big Picture

Посетитель видит приглашение «Давайте обсудим проект» и две ссылки на Telegram и ВК. По уточнению владельца 2026-10-09 фон заменён на присланный красный глобус, а типографика, высота кнопок и System Online унифицированы с Hero. В актуальной реализации оба правых мини-блока — статус с прицелом и список Ideas / Design / Websites — полностью удалены по последнему запросу пользователя. Фоновая сетка сохранена. Проверить результат можно на главной странице через пункт «Контакты» в фиксированном меню.

## Progress

- [x] (2026-10-08) Прочитаны инструкции и git status, установлена граница изменений и найден портрет public/about1.png.
- [x] (2026-10-08) Фон сгенерирован встроенным imagegen, пользователь подтвердил реальные TG/VK ссылки.
- [x] (2026-10-08) Собран новый Contact и локальные стили, сохранён оптимизированный фон в public, 79 354 байта.
- [x] (2026-10-08) npm.cmd run build прошёл, QHD-снимок сохранён; проверены якорь, ссылки, загрузка портрета, клавиатурный фокус и отсутствие перекрытий.
- [x] (2026-10-08) Проверено потенциальное переполнение на 390×844: содержимое доступно, горизонтального скролла нет.
- [x] (2026-10-09) Обновлена документация секции и контента, независимое read-only ревью не выявило дефектов; план завершён.
- [x] (2026-10-09) По уточнению пользователя установлен присланный глобус, убраны пиксельный декор и подпись рядом с логотипом; типографика, футер, кнопки и иконки унифицированы.
- [x] (2026-10-09) Повторный build успешен; QHD DOM-сравнение подтвердило совпадение с Hero, проверены фокус и риск переполнения кнопок на 390px. Сохранён актуальный снимок, справка обновлена.
- [x] (2026-10-09) По следующему уточнению карточки сужены до ширины Hero CTA, акцент переиспользован из ScrambleTitle как в Work, квадратный статус заменён открытым круговым маркером; build, QHD и проверки переполнения успешны.
- [x] (2026-10-09) Маркер увеличен втрое, Ideas / Design / Websites перенесены на точную позицию статуса Hero, поверх фона повторены два его слоя сетки; build, QHD и проверка риска переполнения успешны.
- [x] (2026-10-09) По последнему запросу оба мини-блока удалены целиком вместе с локальными стилями; сетка, фон, кнопки и футер сохранены. Build и QHD-проверка успешны, справка обновлена.

## Surprises & Discoveries

В исходном Contact три ссылки ведут на заглушки. Пользователь подтвердил https://t.me/dizfanit и https://vk.ru/dizfanit. Фиксированный Header уже содержит логотип и меню из референса, поэтому повторять их внутри секции не требуется. В рабочем дереве много прежних изменений; Contact до этой задачи не менялся.

Первый build в ограниченной среде остановился на compile без результата. После остановки только собственного exec-сеанса тот же npm.cmd run build вне ограничения успешно завершился за 6.2 секунды. Dev-сервер уже работал на 3000, поэтому использован существующий экземпляр. На прямом входе по #contact Next dev может предупреждать об LCP для ленивого фонового изображения; на главной это последняя секция, поэтому загрузка оставлена ленивой.

## Decision Log

Решение (2026-10-08, Codex): менять components/Contact.tsx, добавить components/Contact.module.css и public/contact-portrait.webp; сохранить якорь #contact, порядок секций и глобальные эффекты. Это изолирует запрошенный визуальный редизайн.

Решение (2026-10-08, Codex): сохранить существующий размер заголовка Contact 42/64/86px, использовать Hero-токены для остальных ролей, 12 колонок и --section-inner-inset. Пробное переиспользование build-title давало переполнение заголовка в QHD (928px содержимого на 880px контейнера); исходный размер 86px устранил его и точнее совпал с референсом. Глобальные переменные и правила остаются прежними.

Решение (2026-10-08, Codex): неизвестные координаты из московского референса не выдавать за координаты владельца; нижний технический блок показывает формат удалённой работы и UTC +02:00 из часового пояса текущей сессии. Email, Behance, Dribbble, отдельная кнопка «Написать мне» и дата начала проектов отсутствуют.

Решение (2026-10-09, пользователь / Codex): пользователь явно заменил запрос портрета присланным изображением глобуса и попросил унификацию с сайтом. Использовать public/contact-world.webp; сохранить прежний портрет без использования. Заголовок теперь hero-title вместо старых 42/64/86px; пояснение и kicker переиспользуют Hero-классы. Высота обеих карточек равна --hero-button-height, подписи используют ту же роль Manrope, что «Связаться». Обе брендовые иконки заполненные. Футер, Format/Timezone и полосы System Online повторяют роли/разметку Hero. Общие переменные, Hero и Header не меняются.

## Outcomes & Retrospective

Запрошенная секция реализована и уточнена 2026-10-09. Только TG/VK, реальные адреса подтверждены пользователем, дата новых проектов отсутствует. Фон — присланный красный глобус. Декор у логотипа убран. Типографика и высота кнопок согласованы с Hero, System Online повторяет его полосы. Сборка успешна, QHD-вид и основной сценарий навигации проверены; нижнее содержимое и фокус доступны. Отдельный узкий DOM-проход устранил опасение переполнения на 390px. Другие секции и прежние изменения не редактировались.

Последующее уточнение той же даты: кнопки компактные, примерно 316×80px в QHD; красная линия после «проект» — CSS cursor из ScrambleTitle, как в Work. Статус открыт для проектов представлен круговым маркером с направляющей, индикатором доступности и отдельной строкой удалённого формата. Квадратная рамка и её штрихкод удалены, типографика и общий футер сохранены.

Последнее уточнение 2026-10-09: SVG-маркер 240×240px, блок статуса расширен до четырёх правых колонок. На узких экранах диаметр автоматически ограничивается шириной, оставляя 14ch для текста. Ideas / Design / Websites / Brands / People повторяют Hero primary grid, HUD cell и status-panel, включая его угловые линии и типографику. Поверх изображения добавлены те же горизонтальные линии и точки, что Hero, под контентом и с pointer-events: none.

## Context and Orientation

Актуальный результат после последнего уточнения 2026-10-09: справа нет прицела, статуса доступности, удалённого формата / России / ЕС и списка Ideas / Design / Websites / Brands / People с углом. Их разметка и локальные стили удалены; на mobile удалена лишняя строка сетки для бывшего статуса. Более ранние решения и измерения в этом плане отражают историю реализации.

app/page.tsx рендерит Contact последним после Process. components/Header.tsx и Hero ссылаются на #contact. Contact — серверный React-компонент без собственного backend; ссылки открывают внешние профили. app/globals.css содержит PaluiSP, Manrope, общие направляющие, внутренний отступ и Hero-токены. Изменять globals для этой задачи не нужно. public/about1.png — исходный портрет, public/about2.png — его кибернетическая версия для эффекта второго блока. Для нового фона использован первый, обычный портрет.

## Plan of Work

Сохранить сгенерированную фотографию в public/contact-portrait.webp с помощью уже установленного sharp, только конвертируя формат без изменения композиции. Создать локальный CSS-модуль: полный экран, изображение на фоне, затемнение слева, 12 колонок, крупный текст и две карточки слева, статус справа, технические подписи и нижний футер. Разметка использует существующие угловые направляющие и вертикальные рейки. Заголовок сохраняет старую responsive-роль Contact 42/64/86px, на mobile переходит к --hero-title-size с переносом длинных слов. Фон декоративный, у него пустой alt; ссылки имеют понятные названия и видимый focus-visible. На узком экране контент и статус располагаются последовательно, нижний текст остаётся достижимым. Не добавлять клиентский JavaScript и постоянную анимацию. Обновить docs/sections/contact.md по фактической реализации.

## Concrete Steps

В рабочей папке C:\Users\Dizfa\Desktop\Portfolio выполнить конвертацию sharp и изменить только перечисленные файлы. Запустить npm.cmd run build, затем использовать существующий локальный сервер на http://127.0.0.1:3000 либо npm.cmd run dev при отсутствии сервера. В браузере установить viewport 2560×1440, открыть главную и перейти в «Контакты». Сохранить снимок секции как свидетельство проверки. Зафиксировать итог команды и визуальные наблюдения ниже.

## Validation and Acceptance

Сборка должна завершиться успешно. В контактах видны ровно две контактные карточки со ссылками https://t.me/dizfanit и https://vk.ru/dizfanit. В меню якорь ведёт к полной секции; заголовок, карточки, статус и футер не обрезаются и не пересекаются. Фотография и шрифты загружаются. Табуляция показывает заметный фокус ссылок. Не должно быть горизонтального скролла. Мобильный отдельный проход согласно docs/design/responsive.md нужен только при признаках серьёзной регрессии.

## Idempotence and Recovery

Прежние пользовательские изменения сохраняются. Генерация не заменяет about1/about2. Повторный build безопасен. Исправления ограничиваются новым модулем и Contact. Удалять допустимо только временные файлы этой задачи; существующие логи, ассеты и состояние проекта не очищать.

## Artifacts and Notes

Фон: public/contact-portrait.webp. Генерация: встроенный image_gen; исходные референсы — public/about1.png и пользовательский codex-clipboard-339f8c61-fd55-4c69-b16a-59e8ff04e037.png. Исходник генерации: C:\Users\Dizfa\.codex\generated_images\01a11d77-36e5-7f21-9332-7d08edc700e4\exec-f919a054-3e20-42b4-9aca-f7cd9858cbdb.png, 1672×941.

Снимок: docs/plans/assets/contact-2560x1440.jpg. Свидетельство сборки:

    Compiled successfully in 1557ms
    Finished TypeScript in 2.3s
    Generating static pages using 10 workers (4/4)

QHD: секция top=0, height=1440; заголовок font-size=86px, clientWidth=scrollWidth=880px; статус width=398px; две реальные ссылки; портрет complete=true. Фокус ВК через Tab: focus-visible=true, красная рамка. Mobile 390×844: заголовок 215/215px, футер 279/279px по clientWidth/scrollWidth, horizontalOverflow=false.

Финальный промпт:

    Use case: identity-preserve. Asset type: full-bleed photographic background for a website contact section, wide 16:9 composition. Input image 1 is the identity reference: preserve this man's actual recognizable face, facial proportions, short wavy brown hairstyle and short beard. Input image 2 is ONLY the composition, lighting and atmosphere reference; do NOT copy its different person's facial identity and do NOT include any UI, text, logos, frames, icons or buttons. Create a cinematic photorealistic scene closely matching image 2's background: the man from image 1 sits at a dark desk on the RIGHT half, in a thoughtful three-quarter side profile looking down toward the left, leaning forward with one hand loosely resting at his chin, wearing dark clothes. Keep his face recognizable with a subtle red rim light and a little illuminated cheek detail rather than entirely losing his identity in a black silhouette. Strong saturated crimson backlight through a tall industrial studio window, black and deep red shadows, subtle smoke/haze and dust particles, rich organic texture, blurred tabletop objects in the foreground. Head occupies the upper right-center; seated body occupies right bottom. LEFT 44% must stay nearly black and visually calm, usable negative space for a large white heading. Copy the broad chiaroscuro red and black visual balance of image 2, with realistic skin and subtle film grain. High-resolution polished editorial photograph. Constraints: one man only; preserve identity from image 1; no cybernetic facial cracks; no other people; no graphic UI overlays; no lettering or watermarks.

## Interfaces and Dependencies

Contact остаётся export default function Contact() без аргументов. Используются React, next/image, локальный CSS-модуль и уже установленный sharp для разовой оптимизации изображения. Новые зависимости и API не нужны.

Contact также импортирует CSS-модуль ScrambleTitle для класса cursor, без импорта клиентского компонента и без нового JavaScript. Статус — декоративный статичный SVG и доступный текст.

Изменение плана 2026-10-08: зарегистрирован первоначальный объём, реальная пара ссылок и метод генерации, чтобы задача была воспроизводима без истории чата.

Изменение плана 2026-10-08: завершены реализация и проверки; возвращён исходный размер заголовка Contact после измерения переполнения, добавлены результаты build и визуальные свидетельства.

Изменение плана 2026-10-09: синхронизирована справка о подтверждённых контактах и зарегистрировано завершение после независимого ревью.

Изменение плана 2026-10-09 по уточнению пользователя: присланный исходник C:\Users\Dizfa\Downloads\magnific__recreate-the-provided-reference-image-with-the-hig__72719.png (5504×3072) конвертирован установленным sharp в public/contact-world.webp (3840×2143, 390 562 байта, quality 90). Композиция сохранена. Старые шаги и промпт выше описывают первоначальную реализацию; актуальное состояние — глобус и типографика Hero.

Повторная проверка: npm.cmd run build exit 0, compile 1845ms, TypeScript 2.3s, static pages 4/4. QHD 2560×1440: Contact top=0 height=1440; Hero/Contact имеют одинаковые font-family, font-size, line-height и letter-spacing для title (64px), lead (22px), kicker (16px), footer (12px); обе карточки высотой 80px с Manrope 22px, weight 500. Полосы System Online в обоих блоках 112×24px, identical repeating-linear-gradient с линиями 2px через 10px. Глобус complete=true naturalWidth=3840. Фокус ВК через Tab заметен, border rgb(209,10,10); ошибок консоли нет. 390×844: карточки 62px, подписи 78/78px и 91/91px по client/scrollWidth, заголовок 215/215px, horizontalOverflow=false. Актуальный снимок: docs/plans/assets/contact-unified-2560x1440.jpg.

Уточнение 2026-10-09, компактные действия и открытый статус: область влияния — только Contact.tsx, Contact.module.css и справка. Формула общей ширины карточек — min(100%, 2 × (Hero primary width − arrow gap) + grid gap), mobile сохраняет ширину контейнера. Акцент получает общий CSS-класс cursor из ScrambleTitle, локальная строка использует inline-flex, baseline и gap 0.08em. Статус имеет открытую сетку с SVG-орбитой, направляющей, доступностью и удалённым форматом; сплошной квадрат и штрихкод удалены. Изменений глобальных переменных, Work и Hero нет.

Проверка уточнения: npm.cmd run build exit 0, compile 1570ms, TypeScript 2.1s, static pages 4/4. QHD: карточки 316.02×80px; подписи 95/95px и 112/112px client/scrollWidth. Cursor Contact и Work 32×7.671875px. Статус 398×126.59px с SVG 80×80px, border 0px и прозрачным фоном. Фокус ВК через Tab заметен. Проверка риска inline-flex/сеточного переполнения на 390×844: заголовок и статус 215/215px, горизонтального скролла нет. Снимок: docs/plans/assets/contact-compact-2560x1440.jpg.

Проверка последнего уточнения 2026-10-09: npm.cmd run build exit 0, compile 1519ms, TypeScript 2.1s, static pages 4/4. QHD: SVG 240×240px (прежний 80×80px), статус 558×286.59px, кнопки 316.02×80px. Hero status-panel и список Contact имеют одинаковые координаты x=1314px, y=343.90625px относительно секций, monospace 13px и line-height 28px. DOM-сравнение подтвердило точное совпадение двух фоновых слоёв: repeating-linear-gradient 1px через 4px, opacity 0.07; radial-gradient точек с background-size 6×6px, opacity 0.1. Слои Contact: изображение −2, текстура −1, контент 2; текстура pointer-events none. Горизонтального скролла нет. Проверка риска большого SVG на 390×844: статус client/scrollWidth 215/215px, SVG 100.92px, horizontalOverflow false. Снимок: docs/plans/assets/contact-orbit-grid-2560x1440.jpg. Hero, общие переменные и пользовательский фон не менялись.

Последний запрос 2026-10-09: полностью удалить оба мини-блока. Из Contact.tsx убраны aside с прицелом/доступностью/удалённым форматом и декоративный Hero HUD со списком и угловыми линиями. Из Contact.module.css удалены относящиеся к ним правила; mobile grid-template-rows теперь auto auto для текста и футера. Фон, два слоя сетки, контакты, заголовок, рамка секции и футер сохранены.

Проверка удаления: npm.cmd run build exit 0, compile 1580ms, TypeScript 2.2s, static pages 4/4. QHD 2560×1440: Contact top=0, height=1440; aside count 0, hero-status-panel count 0, удалённые подписи отсутствуют. Две карточки 316.02×80px, подтверждённые TG/VK href; футер y=1224 height=104. Фон contact-world.webp и два слоя сетки сохранены; horizontalOverflow false. Снимок: docs/plans/assets/contact-clean-2560x1440.jpg. Другие секции не менялись.
