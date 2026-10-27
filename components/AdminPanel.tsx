"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { adminCategories, type AdminMedia, type CaseInput, type StoredCase } from "../data/adminTypes";
import { caseStudySections } from "../data/caseStudies";
import { uploadHint } from "../data/uploadLimits";
import styles from "./AdminPanel.module.css";

type Draft = CaseInput;
function emptyDraft(): Draft {
  return {title:"",type:"",year:String(new Date().getFullYear()),industry:"",description:"",category:"Сайты",favorite:false,status:"draft",singleWork:false,cover:null,media:[],sections:{about:[],task:[],problem:[],solution:[],visual:[],result:[]}};
}
async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url,{...init,cache:"no-store"});
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Не удалось выполнить действие.");
  return result;
}
export default function AdminPanel() {
  const [session,setSession] = useState<{configured:boolean;authenticated:boolean;canSetup:boolean} | null>(null);
  const [password,setPassword] = useState(""); const [confirm,setConfirm] = useState("");
  const [items,setItems] = useState<StoredCase[]>([]); const [draft,setDraft] = useState<Draft>(emptyDraft);
  const [busy,setBusy] = useState(false); const [uploading,setUploading] = useState(false);
  const [error,setError] = useState(""); const [notice,setNotice] = useState(""); const [dirty,setDirty] = useState(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current=true; api<typeof session>("/api/admin/session").then(s => { if(mounted.current) setSession(s); }).catch(e => setError(e.message)); return () => {mounted.current=false;}; },[]);
  useEffect(() => {
    if (!session?.authenticated) return;
    let active = true;
    api<StoredCase[]>("/api/admin/cases").then(records => {if(active) setItems(records);}).catch(e => {if(active) setError(e.message);});
    return () => {active=false;};
  },[session?.authenticated]);
  useEffect(() => { const warn = (e:BeforeUnloadEvent) => { if(dirty || uploading) e.preventDefault(); }; window.addEventListener("beforeunload",warn); return () => window.removeEventListener("beforeunload",warn); },[dirty,uploading]);
  const selected = items.find(item => item.id === draft.id);
  const ownerItems = items.filter(item => item.source !== "builtin");
  const siteItems = items.filter(item => item.status === "published");
  const hiddenItems = items.filter(item => item.status === "draft");
  const locked = busy || uploading;
  function update(patch: Partial<Draft>) { setDraft(d => ({...d,...patch})); setDirty(true); setNotice(""); }
  function select(item?:StoredCase) {
    if(dirty && !window.confirm("Есть несохранённые изменения. Переключиться без сохранения?")) return;
    setDraft(item ?? emptyDraft()); setDirty(false); setError(""); setNotice("");
  }
  async function login(e:FormEvent) {
    e.preventDefault(); setError("");
    if(!session?.configured && password !== confirm) {setError("Пароли не совпадают."); return;}
    setBusy(true);
    try { await api("/api/admin/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password,setup:!session?.configured})}); setSession({configured:true,authenticated:true,canSetup:false}); setPassword(""); setConfirm(""); }
    catch(e) {setError((e as Error).message);} finally {setBusy(false);}
  }
  async function logout() {
    if(dirty && !window.confirm("Выйти без сохранения изменений?")) return;
    setBusy(true);
    try { await api("/api/admin/session",{method:"DELETE"}); setSession(s => s ? {...s,authenticated:false}:s); setItems([]); setDraft(emptyDraft()); setDirty(false); }
    catch(e) {setError((e as Error).message);} finally {setBusy(false);}
  }
  async function upload(files:FileList | null, target:"cover" | "media" | number) {
    if(!files?.length) return;
    setUploading(true); setError(""); setNotice("");
    try {
      if(target === "media" && draft.media.length + files.length > 40) throw new Error("Можно добавить до 40 изображений.");
      // Sequential uploads avoid decoding several large images at once.
      for(const file of Array.from(files).slice(0, target === "media" ? files.length : 1)) {
        const data = new FormData(); data.set("file",file);
        const image = await api<AdminMedia>("/api/admin/upload",{method:"POST",body:data});
        setDraft(d => {
          const position = typeof target === "number" ? target + 1 : target === "cover" ? 1 : d.media.length + 1;
          const uploaded = {...image,title:"Изображение " + position,alt:(d.title || "Работа") + " — изображение " + position};
          if(target === "cover") return {...d,cover:uploaded,media:!d.singleWork && !d.media.length ? [uploaded] : d.media};
          if(typeof target === "number") return {...d,media:d.media.map((m,i) => i === target ? {...uploaded,kind:m.kind} : m)};
          return {...d,media:[...d.media,uploaded]};
        });
        setDirty(true);
      }
    } catch(e) {setError((e as Error).message);} finally {setUploading(false);}
  }
  async function save(e:FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      if(!draft.cover && !(selected?.source === "builtin" && !selected.cover)) throw new Error("Загрузите обложку работы.");
      const saved = await api<StoredCase>("/api/admin/cases",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(draft)});
      setItems(prev => prev.some(x => x.id === saved.id) ? prev.map(x => x.id === saved.id ? saved:x) : [...prev,saved]);
      setDraft(saved); setDirty(false);
      setNotice(saved.status === "published" ? "Работа опубликована во вкладке «" + saved.category + "»." : "Черновик сохранён. На сайте работа не отображается.");
    } catch(e) {setError((e as Error).message);} finally {setBusy(false);}
  }
  async function toggleVisibility() {
    if(!selected || locked) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const saved = await api<StoredCase>("/api/admin/cases",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:selected.id,revision:selected.revision,status:selected.status === "published" ? "draft":"published"})});
      setItems(prev => prev.map(item => item.id === saved.id ? saved:item));
      setDraft(current => ({...current,status:saved.status,revision:saved.revision}));
      setNotice(saved.status === "published" ? "Кейс возвращён на сайт." : "Кейс скрыт с сайта. Его можно вернуть в любое время.");
    } catch(e) {setError((e as Error).message);} finally {setBusy(false);}
  }
  async function removeCase() {
    if(!selected || locked || !window.confirm("Удалить кейс «" + selected.title + "»? Он исчезнет с сайта и из админки. Вернуть его через админку нельзя.")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const removed = await api<{id:string}>("/api/admin/cases",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:selected.id,revision:selected.revision})});
      setItems(prev => prev.filter(item => item.id !== removed.id));
      setDraft(emptyDraft()); setDirty(false); setNotice("Кейс «" + selected.title + "» удалён.");
    } catch(e) {setError((e as Error).message);} finally {setBusy(false);}
  }
  function move(index:number, direction:number) {
    const media = [...draft.media]; const target=index+direction;
    if(target < 0 || target >= media.length) return;
    [media[index],media[target]]=[media[target],media[index]]; update({media});
  }
  function caseButton(item:StoredCase) {
    return <button type="button" className={styles.caseButton} aria-current={draft.id === item.id ? "true":undefined} key={item.id} onClick={() => select(item)} disabled={locked}>
      <span className={styles.caseNumber}>{item.number}</span><span className={styles.caseInfo}><strong>{item.title}</strong><small>{item.category} · {item.singleWork ? "Одиночная работа":"Кейс"}</small></span>
      <span className={styles.listStatus} data-published={item.status === "published"}>{item.status === "published" ? "На сайте":"Скрыт"}</span>
    </button>;
  }

  return <main className={styles.page} data-admin-page>
    <header className={styles.header}><a href="/">DIZFANIT DESIGN</a><span>Управление работами</span>{session?.authenticated && <button type="button" onClick={logout} disabled={locked}>Выйти</button>}</header>
    {!session?.authenticated ? <section className={styles.login}>
      <p className={styles.kicker}>ЛИЧНЫЙ КАБИНЕТ</p><h1>{!session ? "Загрузка…" : session.configured ? "Вход в админку" : "Задайте пароль"}</h1>
      <p>{session?.configured ? "Введите пароль, чтобы управлять своими работами." : "Этот пароль понадобится для следующих входов. Сохраните его у себя."}</p>
      {session && (session.configured || session.canSetup) && <form onSubmit={login}>
        <label>Пароль<input type="password" autoComplete={session.configured ? "current-password":"new-password"} minLength={session.configured ? undefined:10} maxLength={200} value={password} onChange={e => setPassword(e.target.value)} required /></label>
        {!session.configured && <label>Повторите пароль<input type="password" autoComplete="new-password" minLength={10} maxLength={200} value={confirm} onChange={e => setConfirm(e.target.value)} required /><small>Не менее 10 символов.</small></label>}
        <button className={styles.primary} disabled={busy}>{busy ? "Подождите…":session.configured ? "Войти":"Сохранить пароль и войти"}</button>
      </form>}
      {session && !session.configured && !session.canSetup && <p role="alert">Первый пароль нужно задать на компьютере, где запущен сайт.</p>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
    </section> : <div className={styles.workspace}>
      <aside className={styles.sidebar}>
        <button className={styles.primary} type="button" onClick={() => select()} disabled={locked}>+ Новый кейс</button>
        <section><h2>Ваши кейсы <span>{ownerItems.length}</span></h2>
          {!ownerItems.length && <p className={styles.muted}>Здесь появятся добавленные вами работы.</p>}
          <div className={styles.caseList}>{ownerItems.map(caseButton)}</div>
        </section>
        <section><h2>Текущие кейсы сайта <span>{siteItems.length}</span></h2><p className={styles.muted}>Все опубликованные работы. Нажмите, чтобы изменить.</p>
          {!siteItems.length && <p className={styles.muted}>Нет опубликованных работ.</p>}
          <div className={styles.siteList}>{siteItems.map(caseButton)}</div>
        </section>
        {hiddenItems.length > 0 && <details><summary>Скрытые кейсы · {hiddenItems.length}</summary><div className={styles.caseList}>{hiddenItems.map(caseButton)}</div></details>}
      </aside>
      <form className={styles.editor} onSubmit={save}>
        <section className={styles.editorTitle} aria-label="Текущая работа">
          <div><p className={styles.kicker}>{selected ? "РЕДАКТИРОВАНИЕ · CASE " + selected.number:"НОВАЯ РАБОТА"}</p><h1>{selected ? selected.title:"Добавить кейс"}</h1>
            <p className={styles.muted}>{selected ? selected.source === "builtin" ? "Исходный кейс сайта":"Добавлен вами" : "Заполните форму и выберите статус публикации."}</p>
          </div>
          <div className={styles.editorState}>
            <span className={styles.statusBadge} data-published={selected?.status === "published"}>{selected ? selected.status === "published" ? "Опубликован на сайте":"Черновик · скрыт с сайта":"Ещё не сохранён"}</span>
            <span className={styles.muted}>{dirty ? "Есть несохранённые изменения":selected ? "Все изменения сохранены":"Номер назначится при сохранении"}</span>
            {selected && draft.status !== selected.status && <span>После сохранения: {draft.status === "published" ? "опубликуется":"скроется с сайта"}</span>}
            {selected?.status === "published" && <a href={selected.singleWork ? "/#work":"/work/" + selected.slug} target="_blank" rel="noreferrer">{selected.singleWork ? "Открыть блок работ":"Открыть кейс"} ↗</a>}
            {selected && <>
              {dirty && <small>Действия ниже относятся к сохранённой версии.</small>}
              <div className={styles.caseActions}>
                <button type="button" onClick={toggleVisibility} disabled={locked}>{selected.status === "published" ? "Скрыть с сайта":"Вернуть на сайт"}</button>
                <button type="button" className={styles.deleteCase} onClick={removeCase} disabled={locked}>Удалить кейс</button>
              </div>
            </>}
          </div>
        </section>
        <fieldset disabled={locked}>
          <div className={styles.fields}>
            <label>Название<input value={draft.title} onChange={e => update({title:e.target.value})} placeholder="Например, Malepartus" required maxLength={120}/></label>
            <label>Тип работы<input value={draft.type} onChange={e => update({type:e.target.value})} placeholder="Газета, сайт, презентация…" required maxLength={120}/></label>
            <label>Вкладка на сайте<select value={draft.category} onChange={e => update({category:e.target.value as Draft["category"]})}>{draft.category === "Избранное" && <option>Избранное</option>}{adminCategories.map(c => <option key={c}>{c}</option>)}</select></label>
            <label>Год<input value={draft.year} onChange={e => update({year:e.target.value})} required pattern="[0-9]{4}" maxLength={4}/></label>
            <label className={styles.full}>Сфера проекта<input value={draft.industry} onChange={e => update({industry:e.target.value})} placeholder="Например, гостиницы" maxLength={160}/></label>
            <label className={styles.full}>Краткое описание<textarea value={draft.description} onChange={e => update({description:e.target.value})} rows={2} required maxLength={3000}/></label>
          </div>
          <div className={styles.options}>
            <label className={styles.checkbox}><input type="checkbox" checked={draft.favorite} onChange={e => update({favorite:e.target.checked})} disabled={draft.category === "Избранное"}/>Показывать также в «Избранном»</label>
            <label className={styles.checkbox}><input type="checkbox" checked={draft.singleWork} onChange={e => update({singleWork:e.target.checked})}/>Одиночная работа — без страницы кейса</label>
          </div>
          {draft.singleWork && <p className={styles.modeNote}>На сайте будет обложка и краткое описание, без кнопки «Смотреть кейс». Внутренние изображения и подробный текст отключены.</p>}
          <section className={styles.mediaSection}><h2>Обложка</h2>
            <div className={styles.coverRow}>{draft.cover ? <Image unoptimized src={draft.cover.src} width={draft.cover.width} height={draft.cover.height} alt="Обложка работы"/> : <div className={styles.coverEmpty}>Нет обложки</div>}
              <div><label className={styles.upload}>{draft.cover ? "Заменить обложку":"Выбрать обложку"}<input type="file" accept="image/png,image/jpeg,image/webp" aria-label={draft.cover ? "Заменить обложку":"Выбрать обложку"} onChange={e => {void upload(e.target.files,"cover"); e.target.value="";}}/></label><p className={styles.muted}>{uploadHint}</p></div>
            </div>
          </section>
          <fieldset disabled={draft.singleWork} className={styles.caseDetails}>
            <section className={styles.mediaSection} aria-label="Изображения внутри кейса">
              <div className={styles.sectionTitle}><h2>Изображения внутри кейса <span>{draft.media.length}</span></h2><label className={styles.upload}>+ Добавить<input type="file" accept="image/png,image/jpeg,image/webp" aria-label="Добавить изображения" multiple onChange={e => {void upload(e.target.files,"media"); e.target.value="";}}/></label></div>
              <p className={styles.muted}>{draft.singleWork ? "Недоступно для одиночной работы. Добавленные изображения сохранятся." : "Изображения идут по порядку. Можно заменить, удалить или переставить."}</p>
              <p className={styles.muted}>{uploadHint}</p>
              {!draft.media.length && <p className={styles.emptyMedia}>Изображения пока не добавлены.</p>}
              <div className={styles.mediaList}>{draft.media.map((image,index) => <div className={styles.mediaCard} key={image.src + "-" + index}>
                <div className={styles.mediaPreview}><Image unoptimized src={image.src} width={image.width} height={image.height} alt={"Изображение " + (index+1)}/><span className={styles.mediaNumber}>{index+1}</span>
                  <button className={styles.removeMedia} type="button" aria-label={"Удалить изображение " + (index+1)} title="Удалить" onClick={() => update({media:draft.media.filter((_,i) => i!==index)})}>×</button>
                </div>
                <div className={styles.mediaTools}><label className={styles.replaceMedia}>Заменить<input type="file" accept="image/png,image/jpeg,image/webp" aria-label={"Заменить изображение " + (index+1)} onChange={e => {void upload(e.target.files,index); e.target.value="";}}/></label>
                  <button type="button" aria-label={"Поднять изображение " + (index+1)} title="Раньше" disabled={index===0} onClick={() => move(index,-1)}>←</button><button type="button" aria-label={"Опустить изображение " + (index+1)} title="Позже" disabled={index===draft.media.length-1} onClick={() => move(index,1)}>→</button>
                </div>
                <label className={styles.checkbox}><input type="checkbox" checked={image.kind === "website"} onChange={e => update({media:draft.media.map((m,i) => i===index ? {...m,kind:e.target.checked ? "website":"image"}:m)})}/>Длинная страница</label>
              </div>)}</div>
            </section>
            <details className={styles.narrative} open={draft.singleWork ? false:undefined}><summary aria-disabled={draft.singleWork} onClick={e => {if(draft.singleWork) e.preventDefault();}}>Подробное описание кейса</summary><p className={styles.muted}>Необязательно. Пустые разделы не показываются, для «О проекте» используется краткое описание.</p>{caseStudySections.map(section => <label key={section.id}>{section.title}<textarea rows={3} value={draft.sections[section.id].join("\n\n")} onChange={e => update({sections:{...draft.sections,[section.id]:e.target.value.split(/\n\n/)}})} maxLength={10000}/></label>)}</details>
          </fieldset>
          <div className={styles.saveBar}><label>Статус после сохранения<select value={draft.status} onChange={e => update({status:e.target.value as Draft["status"]})}><option value="draft">Черновик</option><option value="published">Опубликован</option></select></label><button type="submit" className={styles.primary}>{busy ? "Сохранение…":draft.status === "published" ? "Сохранить и опубликовать":"Сохранить черновик"}</button></div>
        </fieldset>
        <div aria-live="polite">{uploading && <p>Загрузка изображений…</p>}{notice && <p className={styles.success}>{notice}</p>}</div>{error && <p role="alert" className={styles.error}>{error}</p>}
      </form>
    </div>}
  </main>;
}
