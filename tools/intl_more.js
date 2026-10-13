// スペイン語・タイ語・インドネシア語のページのことば。intl.js が英語の上にかぶせて使う（ないものは英語のまま）。
// P はその言語のページの先頭（/es など）。
function KYOCHIKA_SX(L, P) {
  const IG = '<a href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">@kyochika.tokyo</a>';
  const X = {
    es: {
      site: 'Kyochika Tokio', loc: 'es_ES',
      G: { art: ['Exposiciones de arte', 'Arte'], live: ['Música en directo y conciertos', 'Música'], food: ['Eventos gastronómicos', 'Comida'], market: ['Mercados y mercadillos', 'Mercados'], festival: ['Festivales y fiestas locales', 'Festivales'], popup: ['Tiendas pop-up', 'Pop-ups'] },
      free: 'Gratis', weekend: 'Este fin de semana', ig: 'Desde Instagram',
      h1: '¿Qué hacer hoy en Tokio?',
      sub: 'Museos, música en directo, ferias gastronómicas, mercadillos y festivales de santuarios. Los eventos de Tokio están repartidos entre webs oficiales y cuentas de Instagram, casi siempre en japonés. Aquí los tienes juntos, en español.',
      lead: (n, nv) => `${n} eventos ahora, de ${nv} recintos y organizadores, ordenados por distancia desde tu estación.`,
      getapp: ['Añádela a tu pantalla de inicio y úsala como una app', 'Cómo'],
      igcta: ['Cada jueves, planes para el fin de semana en Tokio en Instagram', 'Seguir'],
      follow: `Cada jueves publicamos planes para el fin de semana en Tokio en Instagram: ${IG}. <a href="${P}/app/">Añade esta web a tu pantalla de inicio</a> para abrirla como una app.`,
      plate: ['Hoy', 'Día', 'Día anterior', 'Día siguiente', 'Mañana'],
      sub2: (n, nv) => `Exposiciones, música en directo, ferias gastronómicas, mercadillos y festivales: ${n} eventos de ${nv} fuentes oficiales, ordenados por distancia desde tu estación.`,
      lDay: '¿Qué día?', lOther: 'Otro día', lFrom: '¿Desde qué estación? (los más cercanos primero)', lGenre: 'Tipo', lFilt: 'Filtros',
      listed: 'Eventos', n: n => `${n} eventos`,
      time: 'Horario', price: 'Precio', date1: 'Fecha', dates: 'Fechas', venue: 'Lugar', station: 'Estación más cercana',
      details: 'Detalles', official: 'Página oficial (japonés)', igpost: 'Publicación de Instagram', chkOff: 'Ver la página oficial (japonés)', chkIg: 'Ver la publicación de Instagram', map: 'Abrir en Google Maps',
      start: o => `empieza a las ${o}`, endAbout: c => `termina hacia las ${c}`, until: d => `hasta el ${d}`, sta: s => `Est. ${s}`, staP: s => ` (Est. ${s})`,
      lateOn: (ds, t) => `hasta las ${t} los ${ds.join(' y ')}`, dows: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'], hol: ', festivo', sep: ' – ', joiner: '; ',
      capHours: 'Antes de ir, consulta en la página oficial los días de cierre y la última entrada.', capIg: 'Consulta el Instagram del organizador por si hay cambios o cancelaciones.',
      fromH: 'Distancia desde las estaciones principales', fromSt: s => `Desde ${s}`, capDist: 'Distancias en línea recta; los tiempos son aproximados.',
      affH: 'Tours y entradas cerca', affK: s => `Tours, pases y entradas cerca de ${s} en Klook`, affCap: 'Publicidad: enlace de afiliado de Klook.', affFoot: 'Esta web contiene enlaces de afiliado (publicidad).',
      nearH: 'Otros eventos cerca', fromHere: d => `${d} desde aquí`, capPhoto: 'La foto muestra el lugar o sus alrededores, no el evento.', alt: 'Foto de la zona del lugar',
      upd: (d, ig) => `Comprobado con ${ig ? 'la publicación de Instagram del organizador' : 'la página oficial'} el ${d}. Títulos y descripciones traducidos por nosotros.`,
      near: 'justo al lado', walk: n => `unos ${n} min a pie`, train: n => `unos ${n} min en tren`, km: (k, t) => `${k} km, ${t}`,
      home: 'Inicio', endSoon: 'Los que terminan antes primero', listUpd: d => `Actualizado el ${d}. Para buscar por día y estación, usa la <a href="${P}/">página de inicio</a>.`,
      gH1: g => `${g} en Tokio`, gTitle: g => `${g} en Tokio: ahora y esta semana | Kyochika Tokio`,
      gDesc: (g, n, f) => `${n} eventos de ${g.toLowerCase()} en Tokio, ahora o esta semana, con fechas, horarios, precios y estación más cercana en español. ${f} son gratis.`,
      freeH1: 'Planes gratis en Tokio', freeDesc: n => `${n} eventos gratis en Tokio: exposiciones, música en directo, comida y festivales con entrada libre. La comida, la bebida y las compras pueden costar aparte.`,
      igH1: 'Eventos de Tokio vistos en Instagram', igDesc: n => `${n} eventos de Tokio anunciados en el Instagram de sus organizadores: mercadillos, galerías y conciertos pequeños difíciles de encontrar en buscadores.`,
      wkH1: r => `Este fin de semana en Tokio: ${r}`, wkDesc: (n, r) => `${n} eventos en Tokio este fin de semana (${r}), día a día, con horarios, precios y estación más cercana.`,
      wkDay: (d, n) => `${d}: ${n} eventos`, wkOver: `Este fin de semana ya ha pasado. Mira los eventos actuales en la <a href="${P}/">página de inicio</a>.`,
      ways1: 'Buscar por tipo',
      foot: 'Solo publicamos eventos que hemos podido confirmar en la página oficial o el Instagram oficial del lugar u organizador. Los datos pueden cambiar, las entradas agotarse y los lugares cerrar: consulta la página oficial antes de ir. Las distancias son en línea recta y los tiempos, aproximados. Las fotos muestran el lugar o sus alrededores, no el evento. Títulos y descripciones traducidos del japonés por nosotros.',
      navFind: 'Buscar eventos', navApp: 'Usar como app', navAbout: 'Sobre esta web',
      idxTitle: 'Kyochika Tokio | Qué hacer hoy en Tokio cerca de ti: arte, música, comida, mercadillos y festivales',
      idxDesc: n => `Exposiciones, música en directo, comida, mercadillos y festivales de Tokio en una sola página, en español. Elige el día y tu estación para ver qué hay cerca. ${n} eventos ahora.`,
      intro: (cnt, d) => `Kyochika reúne los eventos de Tokio de las webs oficiales y cuentas de Instagram de recintos y organizadores, traduce lo esencial y los ordena por distancia desde tu estación. Ahora: ${cnt} (actualizado el ${d}).`,
      cntJoin: ', ', cnt: (g, n) => `${n} de ${g.toLowerCase()}`,
      evTitle: (t, v, s) => `${t} | ${v}, Est. ${s}: fechas, horario, precio | Kyochika Tokio`,
      evDesc: (kind, v, s, span, hrs, price, note) => `${kind} en ${v} (Est. ${s}), Tokio. ${span}, ${hrs}. ${price}. ${note}`,
      kind: { art: 'Exposición', live: 'Concierto', food: 'Evento gastronómico', market: 'Mercado', festival: 'Festival', popup: 'Pop-up' },
      orig: 'Título en japonés',
      halalBd: 'Info halal', halalH: 'Apto para musulmanes', halalRow: 'La página oficial menciona opciones halal o sin cerdo / sin alcohol. Consulta los detalles allí.',
      moH1: m => `Eventos en Tokio en ${m}`, moTitle: m => `Qué hacer en Tokio en ${m}: festivales, mercados, arte y música | Kyochika Tokio`, moDesc: (m, n, f) => `${n} eventos en Tokio en ${m}: festivales, mercadillos, exposiciones, música en directo y comida, con fechas, horarios, precios y estación más cercana. ${f} son gratis.`,
      aboutT: 'Sobre Kyochika', aboutD: 'Sobre Kyochika Tokio: qué es, cómo se comprueba la información, quién la lleva y cómo contactar.',
      about: `    <p>Kyochika (キョウチカ, «hoy, cerca») es una guía independiente de eventos en Tokio. Reunimos exposiciones, música en directo, eventos gastronómicos, mercados y festivales de las webs oficiales y cuentas de Instagram de recintos y organizadores, y los ordenamos por fecha y por distancia desde tu estación.</p>
    <h2>Cómo usarla</h2>
    <p>En la página de inicio, elige el día y la estación desde la que sales. Verás primero lo más cercano. Puedes filtrar por tipo, entrada gratis, horario nocturno y eventos vistos en Instagram.</p>
    <h2>Sobre la información</h2>
    <p>Solo publicamos lo que hemos podido confirmar en una página oficial o en una cuenta oficial de Instagram. Fechas, horarios y precios pueden cambiar, así que consulta la página oficial antes de ir. Los títulos y descripciones son traducciones nuestras; cada evento muestra también el título original en japonés. La mayoría de páginas oficiales están solo en japonés.</p>
    <h2>Quién la lleva</h2>
    <p>Kyochika la lleva Masanaka Sakao (坂尾正中) desde Tokio. Contacto: info@kyochika.jp</p>
    <h2>Fotos</h2>
    <p>Las fotos son de Wikimedia Commons y muestran los lugares o sus alrededores. Autores y licencias en la <a href="/about.html" hreflang="ja">página en japonés</a>.</p>`,
      appT: 'Usa Kyochika como una app', appD: 'Cómo añadir Kyochika a la pantalla de inicio del móvil y usarla como una app, en iPhone, Android y ordenador. Sin descargas ni registro.',
      app: `    <p>Añade Kyochika a tu pantalla de inicio y se abrirá desde un icono, a pantalla completa. No hay nada que descargar ni registrarse. Es gratis.</p>
    <p><button class="go pri" id="inst" type="button" hidden>Añadir a este dispositivo</button></p>
    <h2>iPhone y iPad</h2>
    <ol><li>Abre kyochika.jp/es/ en Safari</li><li>Toca el botón Compartir (un cuadrado con una flecha hacia arriba)</li><li>Elige «Añadir a pantalla de inicio»</li><li>Toca «Añadir»</li></ol>
    <h2>Android</h2>
    <ol><li>Abre kyochika.jp/es/ en Chrome</li><li>Toca el menú «⋮» arriba a la derecha</li><li>Elige «Añadir a pantalla de inicio» o «Instalar aplicación»</li></ol>
    <h2>Ordenador (Chrome, Edge)</h2>
    <ol><li>Abre kyochika.jp/es/</li><li>Haz clic en el botón de instalar a la derecha de la barra de direcciones</li></ol>
    <h2>Para quitarla</h2>
    <p>Mantén pulsado el icono y elige «Eliminar».</p>`,
      ui: { today: 'Hoy', nowOnly: 'Abierto ahora', free: 'Gratis', soon: 'Termina pronto', night: 'Abierto después de las 19:00', ig: 'Desde Instagram', board: '{d} · más cerca de {from} primero', n: '{n} eventos', start: 'empieza a las {o}', lastDay: 'Hoy es el último día', until: 'hasta el {d}', now: 'Abierto ahora', fromT: 'Desde las {o}', over: 'Terminado por hoy', endsToday: 'Termina hoy', left: 'Quedan {n} días', time: 'Horario', dist: 'Distancia', price: 'Precio', fromSt: 'Desde {s}: ', near: 'justo al lado', walk: 'unos {n} min a pie', train: 'unos {n} min en tren', km: '{k} km, {t}', details: 'Detalles', official: 'Página oficial (japonés)', igpost: 'Publicación de Instagram', igbd: 'Visto en Instagram', alt: 'Foto de la zona del lugar', sta: ' (Est. {s})', empty: 'No hay eventos para este día con estos filtros. Quita un filtro o elige otro día.' },
      kidH: 'Niños', kidBd: k => k[1] >= 99 ? `En familia, desde ${k[0]} años` : `Niños de ${k[0]} a ${k[1]}`, kidRow: k => k[1] >= 99 ? `Para toda la familia, desde ${k[0]} años` : `De ${k[0]} a ${k[1]} años`,
      KL: ['Con niños', '¿Qué edad tienen?', '0–2 años', '3–6 años', 'Primaria', 'Cualquier edad'], adult: x => `Adultos ¥${x}`,
    },
    th: {
      site: 'Kyochika โตเกียว', loc: 'th_TH',
      G: { market: ['ตลาดและตลาดนัดของมือสอง', 'ตลาด'], food: ['งานอาหาร', 'อาหาร'], festival: ['เทศกาลและงานท้องถิ่น', 'เทศกาล'], art: ['นิทรรศการศิลปะ', 'ศิลปะ'], live: ['ดนตรีสดและคอนเสิร์ต', 'ดนตรี'], popup: ['ป๊อปอัพสโตร์', 'ป๊อปอัพ'] },
      free: 'ฟรี', weekend: 'สุดสัปดาห์นี้', ig: 'จาก Instagram',
      h1: 'วันนี้เที่ยวไหนดีในโตเกียว?',
      sub: 'พิพิธภัณฑ์ ดนตรีสด เทศกาลอาหาร ตลาดนัด และเทศกาลศาลเจ้า ข้อมูลงานในโตเกียวกระจายอยู่ตามเว็บไซต์ทางการและ Instagram ส่วนใหญ่เป็นภาษาญี่ปุ่น เราจึงรวมไว้ในหน้าเดียวเป็นภาษาไทย',
      lead: (n, nv) => `ตอนนี้มี ${n} งาน จาก ${nv} สถานที่และผู้จัด เรียงตามระยะทางจากสถานีของคุณ`,
      getapp: ['เพิ่มไว้ที่หน้าจอโฮมแล้วใช้เหมือนแอป', 'วิธีทำ'],
      igcta: ['ทุกวันพฤหัสฯ เราแนะนำที่เที่ยวสุดสัปดาห์ในโตเกียวทาง Instagram', 'ติดตาม'],
      follow: `ทุกวันพฤหัสบดี เราโพสต์งานแนะนำสำหรับสุดสัปดาห์ในโตเกียวทาง Instagram ${IG} <a href="${P}/app/">เพิ่มเว็บนี้ไว้ที่หน้าจอโฮม</a>เพื่อเปิดใช้เหมือนแอป`,
      plate: ['วันนี้', 'วัน', 'วันก่อนหน้า', 'วันถัดไป', 'พรุ่งนี้'],
      sub2: (n, nv) => `นิทรรศการ ดนตรีสด เทศกาลอาหาร ตลาดนัด และเทศกาล: ${n} งานจาก ${nv} แหล่งข้อมูลทางการ เรียงตามระยะทางจากสถานีของคุณ`,
      lDay: 'วันไหน?', lOther: 'วันอื่น', lFrom: 'ออกจากสถานีไหน? (ใกล้สุดก่อน)', lGenre: 'ประเภท', lFilt: 'ตัวกรอง',
      listed: 'งานทั้งหมด', n: n => `${n} งาน`,
      time: 'เวลา', price: 'ราคา', date1: 'วันที่', dates: 'วันที่จัด', venue: 'สถานที่', station: 'สถานีใกล้ที่สุด',
      details: 'รายละเอียด', official: 'เว็บไซต์ทางการ (ภาษาญี่ปุ่น)', igpost: 'โพสต์ Instagram', chkOff: 'ดูเว็บไซต์ทางการ (ภาษาญี่ปุ่น)', chkIg: 'ดูโพสต์ Instagram', map: 'เปิดใน Google Maps',
      start: o => `เริ่ม ${o} น.`, endAbout: c => `คาดว่าจบราว ${c} น.`, until: d => `ถึง ${d}`, sta: s => `สถานี ${s}`, staP: s => ` (สถานี ${s})`,
      lateOn: (ds, t) => `วัน${ds.join(' และ ')} เปิดถึง ${t} น.`, dows: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'], hol: ' วันหยุด', sep: ' – ', joiner: ' / ',
      capHours: 'ก่อนไป โปรดตรวจสอบวันหยุดและเวลาเข้าชมรอบสุดท้ายในเว็บไซต์ทางการ', capIg: 'โปรดตรวจสอบ Instagram ของผู้จัดเผื่อมีการเปลี่ยนแปลงหรือยกเลิก',
      fromH: 'ระยะทางจากสถานีหลัก', fromSt: s => `จาก ${s}`, capDist: 'ระยะทางเป็นเส้นตรง เวลาเป็นค่าประมาณ',
      affH: 'ทัวร์และตั๋วใกล้เคียง', affK: s => `ทัวร์ บัตรผ่าน และตั๋วแถว ${s} บน Klook`, affCap: 'โฆษณา: ลิงก์พันธมิตรของ Klook', affFoot: 'เว็บไซต์นี้มีลิงก์พันธมิตร (โฆษณา)',
      nearH: 'งานอื่นใกล้ๆ', fromHere: d => `${d} จากที่นี่`, capPhoto: 'ภาพเป็นสถานที่หรือบริเวณรอบๆ ไม่ใช่ภาพของงาน', alt: 'ภาพบริเวณสถานที่จัดงาน',
      upd: (d, ig) => `ตรวจสอบกับ${ig ? 'โพสต์ Instagram ของผู้จัด' : 'เว็บไซต์ทางการ'}เมื่อ ${d} ชื่องานและคำอธิบายแปลโดยเรา`,
      near: 'อยู่ใกล้ๆ', walk: n => `เดินประมาณ ${n} นาที`, train: n => `นั่งรถไฟประมาณ ${n} นาที`, km: (k, t) => `${k} กม. ${t}`,
      home: 'หน้าแรก', endSoon: 'งานที่ใกล้จบขึ้นก่อน', listUpd: d => `ข้อมูล ณ ${d} หากต้องการค้นตามวันและสถานี ใช้<a href="${P}/">หน้าแรก</a>`,
      gH1: g => `${g}ในโตเกียว`, gTitle: g => `${g}ในโตเกียว จัดอยู่ตอนนี้และสัปดาห์นี้ | Kyochika โตเกียว`,
      gDesc: (g, n, f) => `${g}ในโตเกียว ${n} งาน ที่จัดอยู่ตอนนี้หรือสัปดาห์นี้ พร้อมวันที่ เวลา ราคา และสถานีใกล้ที่สุดเป็นภาษาไทย ฟรี ${f} งาน`,
      freeH1: 'เที่ยวฟรีในโตเกียว', freeDesc: n => `งานฟรีในโตเกียว ${n} งาน: นิทรรศการ ดนตรีสด งานอาหาร และเทศกาลที่เข้าชมฟรี ค่าอาหาร เครื่องดื่ม และของซื้อแยกต่างหาก`,
      igH1: 'งานในโตเกียวที่พบใน Instagram', igDesc: n => `งานในโตเกียว ${n} งานที่ผู้จัดประกาศทาง Instagram ทั้งตลาดเล็กๆ แกลเลอรี และไลฟ์ที่หาทางเว็บได้ยาก`,
      wkH1: r => `สุดสัปดาห์นี้ในโตเกียว: ${r}`, wkDesc: (n, r) => `งานในโตเกียวสุดสัปดาห์นี้ (${r}) ${n} งาน แยกตามวัน พร้อมเวลา ราคา และสถานีใกล้ที่สุด`,
      wkDay: (d, n) => `${d} — ${n} งาน`, wkOver: `สุดสัปดาห์นี้ผ่านไปแล้ว ดูงานที่จัดอยู่ได้ที่<a href="${P}/">หน้าแรก</a>`,
      ways1: 'ค้นตามประเภท',
      foot: 'เราลงเฉพาะงานที่ยืนยันได้จากเว็บไซต์ทางการหรือ Instagram ทางการของสถานที่หรือผู้จัด ข้อมูลอาจเปลี่ยน ตั๋วอาจหมด หรือสถานที่อาจปิด โปรดตรวจสอบเว็บไซต์ทางการก่อนไป ระยะทางเป็นเส้นตรงและเวลาเป็นค่าประมาณ ภาพเป็นสถานที่หรือบริเวณรอบๆ ไม่ใช่ภาพของงาน ชื่องานและคำอธิบายแปลจากภาษาญี่ปุ่นโดยเรา',
      navFind: 'ค้นหางาน', navApp: 'ใช้เหมือนแอป', navAbout: 'เกี่ยวกับเว็บนี้',
      idxTitle: 'Kyochika โตเกียว | วันนี้มีงานอะไรในโตเกียว ใกล้คุณ: ศิลปะ ดนตรีสด อาหาร ตลาดนัด เทศกาล',
      idxDesc: n => `นิทรรศการศิลปะ ดนตรีสด งานอาหาร ตลาดนัด และเทศกาลในโตเกียว รวมไว้ในหน้าเดียวเป็นภาษาไทย เลือกวันและสถานีเพื่อดูงานใกล้คุณ ตอนนี้มี ${n} งาน`,
      intro: (cnt, d) => `Kyochika รวบรวมงานในโตเกียวจากเว็บไซต์ทางการและ Instagram ของสถานที่และผู้จัด แปลข้อมูลสำคัญ และเรียงตามระยะทางจากสถานีของคุณ ตอนนี้มี ${cnt} (อัปเดต ${d})`,
      cntJoin: ' ', cnt: (g, n) => `${g} ${n} งาน`,
      evTitle: (t, v, s) => `${t} | ${v} สถานี ${s} วันที่ เวลา ราคา | Kyochika โตเกียว`,
      evDesc: (kind, v, s, span, hrs, price, note) => `${kind}ที่ ${v} (สถานี ${s}) โตเกียว ${span} ${hrs} ${price} ${note}`,
      kind: { art: 'นิทรรศการ', live: 'ไลฟ์', food: 'งานอาหาร', market: 'ตลาด', festival: 'เทศกาล', popup: 'ป๊อปอัพ' },
      orig: 'ชื่อภาษาญี่ปุ่น',
      halalBd: 'ข้อมูลฮาลาล', halalH: 'สำหรับชาวมุสลิม', halalRow: 'เว็บไซต์ทางการระบุว่ามีตัวเลือกฮาลาล หรือไม่มีหมู/แอลกอฮอล์ โปรดดูรายละเอียดที่นั่น',
      moH1: m => `งานในโตเกียว เดือน${m}`, moTitle: m => `เที่ยวโตเกียวเดือน${m}: งานเทศกาล ตลาดนัด นิทรรศการ ดนตรีสด | Kyochika โตเกียว`, moDesc: (m, n, f) => `งานในโตเกียวเดือน${m} ${n} งาน ทั้งตลาดนัด เทศกาล นิทรรศการ ดนตรีสด และงานอาหาร พร้อมวันที่ เวลา ราคา และสถานีใกล้ที่สุด ฟรี ${f} งาน`,
      aboutT: 'เกี่ยวกับ Kyochika', aboutD: 'เกี่ยวกับ Kyochika โตเกียว: เว็บนี้คืออะไร ตรวจสอบข้อมูลอย่างไร ใครเป็นผู้ดูแล และติดต่ออย่างไร',
      about: `    <p>Kyochika (キョウチカ แปลว่า “วันนี้ ใกล้ๆ”) เป็นคู่มืออิสระสำหรับงานต่างๆ ในโตเกียว เรารวบรวมนิทรรศการศิลปะ ดนตรีสด งานอาหาร ตลาด และเทศกาล จากเว็บไซต์ทางการและ Instagram ของสถานที่และผู้จัด แล้วเรียงตามวันและระยะทางจากสถานีของคุณ</p>
    <h2>วิธีใช้</h2>
    <p>ที่หน้าแรก เลือกวันที่จะออกไปเที่ยวและสถานีที่ออกเดินทาง งานที่ใกล้ที่สุดจะขึ้นก่อน กรองได้ตามประเภท เข้าฟรี เปิดช่วงค่ำ และงานจาก Instagram</p>
    <h2>เกี่ยวกับข้อมูล</h2>
    <p>เราลงเฉพาะข้อมูลที่ยืนยันได้จากเว็บไซต์ทางการหรือ Instagram ทางการ วันที่ เวลา และราคาอาจเปลี่ยน โปรดตรวจสอบเว็บไซต์ทางการก่อนไป ชื่องานและคำอธิบายแปลโดยเรา และทุกหน้าจะแสดงชื่อภาษาญี่ปุ่นเดิมด้วย</p>
    <h2>ผู้ดูแล</h2>
    <p>Kyochika ดูแลโดย Masanaka Sakao (坂尾正中) ในโตเกียว ติดต่อ: info@kyochika.jp</p>
    <h2>ภาพถ่าย</h2>
    <p>ภาพมาจาก Wikimedia Commons ผู้ถ่ายและสัญญาอนุญาตดูได้ที่<a href="/about.html" hreflang="ja">หน้าภาษาญี่ปุ่น</a></p>`,
      appT: 'ใช้ Kyochika เหมือนแอป', appD: 'วิธีเพิ่ม Kyochika ไว้ที่หน้าจอโฮมและใช้เหมือนแอป บน iPhone, Android และคอมพิวเตอร์ ไม่ต้องดาวน์โหลดหรือสมัคร',
      app: `    <p>เพิ่ม Kyochika ไว้ที่หน้าจอโฮม แล้วเปิดจากไอคอนได้แบบเต็มจอ ไม่ต้องดาวน์โหลดจากสโตร์และไม่ต้องสมัคร ใช้ฟรี</p>
    <p><button class="go pri" id="inst" type="button" hidden>เพิ่มลงในอุปกรณ์นี้</button></p>
    <h2>iPhone และ iPad</h2>
    <ol><li>เปิด kyochika.jp/th/ ใน Safari</li><li>แตะปุ่มแชร์ (สี่เหลี่ยมมีลูกศรชี้ขึ้น)</li><li>เลือก “เพิ่มไปยังหน้าจอโฮม”</li><li>แตะ “เพิ่ม”</li></ol>
    <h2>Android</h2>
    <ol><li>เปิด kyochika.jp/th/ ใน Chrome</li><li>แตะเมนู “⋮” มุมขวาบน</li><li>เลือก “เพิ่มลงในหน้าจอหลัก” หรือ “ติดตั้งแอป”</li></ol>
    <h2>คอมพิวเตอร์ (Chrome, Edge)</h2>
    <ol><li>เปิด kyochika.jp/th/</li><li>คลิกปุ่มติดตั้งทางขวาของแถบที่อยู่</li></ol>
    <h2>หากต้องการลบ</h2>
    <p>กดไอคอนค้างไว้แล้วเลือก “ลบ”</p>`,
      ui: { today: 'วันนี้', nowOnly: 'ยังเปิดอยู่ตอนนี้', free: 'ฟรี', soon: 'ใกล้จบ', night: 'เปิดหลัง 19:00', ig: 'จาก Instagram', board: '{d} · ใกล้ {from} ก่อน', n: '{n} งาน', start: 'เริ่ม {o} น.', lastDay: 'วันนี้วันสุดท้าย', until: 'ถึง {d}', now: 'เปิดอยู่', fromT: 'เริ่ม {o} น.', over: 'วันนี้ปิดแล้ว', endsToday: 'จบวันนี้', left: 'เหลืออีก {n} วัน', time: 'เวลา', dist: 'ระยะทาง', price: 'ราคา', fromSt: 'จาก {s}: ', near: 'อยู่ใกล้ๆ', walk: 'เดินประมาณ {n} นาที', train: 'นั่งรถไฟประมาณ {n} นาที', km: '{k} กม. {t}', details: 'รายละเอียด', official: 'เว็บไซต์ทางการ (ภาษาญี่ปุ่น)', igpost: 'โพสต์ Instagram', igbd: 'พบใน Instagram', alt: 'ภาพบริเวณสถานที่จัดงาน', sta: ' (สถานี {s})', empty: 'ไม่มีงานตรงกับวันและตัวกรองนี้ ลองเอาตัวกรองออกหรือเลือกวันอื่น' },
      kidH: 'เด็ก', kidBd: k => k[1] >= 99 ? `ครอบครัว ${k[0]} ขวบขึ้นไป` : `เด็ก ${k[0]}–${k[1]} ขวบ`, kidRow: k => k[1] >= 99 ? `เหมาะกับครอบครัว อายุ ${k[0]} ขวบขึ้นไป` : `อายุ ${k[0]}–${k[1]} ขวบ`,
      KL: ['ไปกับลูก', 'ลูกอายุเท่าไร?', '0–2 ขวบ', '3–6 ขวบ', 'ประถม', 'ทุกวัย'], adult: x => `ผู้ใหญ่ ¥${x}`,
    },
    id: {
      site: 'Kyochika Tokyo', loc: 'id_ID',
      G: { art: ['Pameran seni', 'Seni'], live: ['Musik live dan konser', 'Musik'], food: ['Acara kuliner', 'Kuliner'], market: ['Pasar dan pasar loak', 'Pasar'], festival: ['Festival dan acara lokal', 'Festival'], popup: ['Toko pop-up', 'Pop-up'] },
      free: 'Gratis', weekend: 'Akhir pekan ini', ig: 'Dari Instagram',
      h1: 'Hari ini ke mana di Tokyo?',
      sub: 'Museum, musik live, festival kuliner, pasar loak, dan festival kuil. Info acara di Tokyo tersebar di situs resmi dan akun Instagram, kebanyakan dalam bahasa Jepang. Di sini semuanya ada dalam satu halaman, berbahasa Indonesia.',
      lead: (n, nv) => `Saat ini ada ${n} acara dari ${nv} tempat dan penyelenggara, diurutkan dari yang terdekat dengan stasiunmu.`,
      getapp: ['Tambahkan ke layar utama dan pakai seperti aplikasi', 'Caranya'],
      igcta: ['Setiap Kamis, rekomendasi akhir pekan di Tokyo di Instagram', 'Ikuti'],
      follow: `Setiap Kamis kami membagikan rekomendasi akhir pekan di Tokyo di Instagram ${IG}. <a href="${P}/app/">Tambahkan situs ini ke layar utama</a> agar bisa dibuka seperti aplikasi.`,
      plate: ['Hari ini', 'Hari', 'Hari sebelumnya', 'Hari berikutnya', 'Besok'],
      sub2: (n, nv) => `Pameran, musik live, festival kuliner, pasar loak, dan festival: ${n} acara dari ${nv} sumber resmi, diurutkan dari yang terdekat dengan stasiunmu.`,
      lDay: 'Hari apa?', lOther: 'Hari lain', lFrom: 'Dari stasiun mana? (terdekat lebih dulu)', lGenre: 'Jenis', lFilt: 'Filter',
      listed: 'Daftar acara', n: n => `${n} acara`,
      time: 'Jam', price: 'Harga', date1: 'Tanggal', dates: 'Tanggal', venue: 'Tempat', station: 'Stasiun terdekat',
      details: 'Detail', official: 'Situs resmi (bahasa Jepang)', igpost: 'Postingan Instagram', chkOff: 'Cek situs resmi (bahasa Jepang)', chkIg: 'Cek postingan Instagram', map: 'Buka di Google Maps',
      start: o => `mulai ${o}`, endAbout: c => `perkiraan selesai sekitar ${c}`, until: d => `sampai ${d}`, sta: s => `Stasiun ${s}`, staP: s => ` (Stasiun ${s})`,
      lateOn: (ds, t) => `sampai ${t} setiap ${ds.join(' & ')}`, dows: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'], hol: ', libur', sep: ' – ', joiner: '; ',
      capHours: 'Sebelum berangkat, cek hari tutup dan jam masuk terakhir di situs resmi.', capIg: 'Cek Instagram penyelenggara untuk perubahan jadwal atau pembatalan.',
      fromH: 'Jarak dari stasiun utama', fromSt: s => `Dari ${s}`, capDist: 'Jarak dihitung garis lurus; waktu tempuh hanya perkiraan.',
      affH: 'Tur dan tiket di sekitar', affK: s => `Cari tur, pass, dan tiket di sekitar ${s} di Klook`, affCap: 'Iklan: tautan afiliasi Klook.', affFoot: 'Situs ini berisi tautan afiliasi (iklan).',
      nearH: 'Acara lain di dekat sini', fromHere: d => `${d} dari sini`, capPhoto: 'Foto menunjukkan tempat atau sekitarnya, bukan acaranya.', alt: 'Foto area tempat acara',
      upd: (d, ig) => `Dicek dengan ${ig ? 'postingan Instagram penyelenggara' : 'situs resmi'} pada ${d}. Judul dan deskripsi diterjemahkan oleh kami.`,
      near: 'dekat sekali', walk: n => `sekitar ${n} menit jalan kaki`, train: n => `sekitar ${n} menit naik kereta`, km: (k, t) => `${k} km, ${t}`,
      home: 'Beranda', endSoon: 'Yang segera berakhir lebih dulu', listUpd: d => `Per ${d}. Untuk mencari berdasarkan hari dan stasiun, buka <a href="${P}/">beranda</a>.`,
      gH1: g => `${g} di Tokyo`, gTitle: g => `${g} di Tokyo – sedang berlangsung dan minggu ini | Kyochika Tokyo`,
      gDesc: (g, n, f) => `${n} acara ${g.toLowerCase()} di Tokyo yang sedang berlangsung atau minggu ini, lengkap dengan tanggal, jam, harga, dan stasiun terdekat dalam bahasa Indonesia. ${f} di antaranya gratis.`,
      freeH1: 'Acara gratis di Tokyo', freeDesc: n => `${n} acara gratis di Tokyo: pameran, musik live, acara kuliner, dan festival dengan masuk gratis. Makanan, minuman, dan belanja bisa berbayar.`,
      igH1: 'Acara Tokyo dari Instagram', igDesc: n => `${n} acara di Tokyo yang diumumkan di Instagram penyelenggara: pasar kecil, pameran galeri, dan konser yang sulit dicari lewat mesin pencari.`,
      wkH1: r => `Akhir pekan ini di Tokyo: ${r}`, wkDesc: (n, r) => `${n} acara di Tokyo akhir pekan ini (${r}), per hari, dengan jam, harga, dan stasiun terdekat.`,
      wkDay: (d, n) => `${d} — ${n} acara`, wkOver: `Akhir pekan ini sudah lewat. Lihat acara terbaru di <a href="${P}/">beranda</a>.`,
      ways1: 'Cari berdasarkan jenis',
      foot: 'Kami hanya mencantumkan acara yang bisa kami pastikan di situs resmi atau Instagram resmi tempat atau penyelenggara. Info bisa berubah, tiket bisa habis, dan tempat bisa tutup, jadi cek situs resmi sebelum berangkat. Jarak dihitung garis lurus dan waktu tempuh hanya perkiraan. Foto menunjukkan tempat atau sekitarnya, bukan acaranya. Judul dan deskripsi diterjemahkan dari bahasa Jepang oleh kami.',
      navFind: 'Cari acara', navApp: 'Pakai seperti aplikasi', navAbout: 'Tentang situs ini',
      idxTitle: 'Kyochika Tokyo | Acara di Tokyo hari ini, dekat kamu: seni, musik live, kuliner, pasar, festival',
      idxDesc: n => `Pameran seni, musik live, acara kuliner, pasar loak, dan festival di Tokyo dalam satu halaman, berbahasa Indonesia. Pilih hari dan stasiunmu untuk melihat acara terdekat. Saat ini ada ${n} acara.`,
      intro: (cnt, d) => `Kyochika mengumpulkan acara di Tokyo dari situs resmi dan Instagram tempat serta penyelenggara, menerjemahkan info pentingnya, dan mengurutkannya berdasarkan jarak dari stasiunmu. Saat ini: ${cnt} (diperbarui ${d}).`,
      cntJoin: ', ', cnt: (g, n) => `${n} ${g.toLowerCase()}`,
      evTitle: (t, v, s) => `${t} | ${v}, Stasiun ${s} – tanggal, jam, harga | Kyochika Tokyo`,
      evDesc: (kind, v, s, span, hrs, price, note) => `${kind} di ${v} (Stasiun ${s}), Tokyo. ${span}, ${hrs}. ${price}. ${note}`,
      kind: { art: 'Pameran', live: 'Pertunjukan live', food: 'Acara kuliner', market: 'Pasar', festival: 'Festival', popup: 'Pop-up' },
      orig: 'Judul bahasa Jepang',
      halalBd: 'Info halal', halalH: 'Ramah Muslim', halalRow: 'Situs resmi menyebutkan pilihan halal atau tanpa babi / tanpa alkohol. Cek detailnya di sana.',
      moH1: m => `Event di Tokyo bulan ${m}`, moTitle: m => `Event di Tokyo bulan ${m}: festival, pasar, pameran, musik live | Kyochika Tokyo`, moDesc: (m, n, f) => `${n} event di Tokyo bulan ${m}: festival, pasar loak, pameran, musik live, dan kuliner, lengkap dengan tanggal, jam, harga, dan stasiun terdekat. ${f} di antaranya gratis.`,
      aboutT: 'Tentang Kyochika', aboutD: 'Tentang Kyochika Tokyo: apa situs ini, bagaimana info dicek, siapa pengelolanya, dan cara menghubungi.',
      about: `    <p>Kyochika (キョウチカ, “hari ini, di dekat sini”) adalah panduan independen untuk acara di Tokyo. Kami mengumpulkan pameran seni, musik live, acara kuliner, pasar, dan festival dari situs resmi dan akun Instagram tempat serta penyelenggara, lalu mengurutkannya berdasarkan tanggal dan jarak dari stasiunmu.</p>
    <h2>Cara pakai</h2>
    <p>Di beranda, pilih hari dan stasiun keberangkatanmu. Acara terdekat muncul lebih dulu. Kamu bisa memfilter berdasarkan jenis, masuk gratis, buka malam, dan acara dari Instagram.</p>
    <h2>Tentang info</h2>
    <p>Kami hanya mencantumkan info yang bisa dipastikan di situs resmi atau Instagram resmi. Tanggal, jam, dan harga bisa berubah, jadi cek situs resmi sebelum berangkat. Judul dan deskripsi adalah terjemahan kami; setiap halaman acara juga menampilkan judul asli dalam bahasa Jepang.</p>
    <h2>Pengelola</h2>
    <p>Kyochika dikelola oleh Masanaka Sakao (坂尾正中) di Tokyo. Kontak: info@kyochika.jp</p>
    <h2>Foto</h2>
    <p>Foto berasal dari Wikimedia Commons. Fotografer dan lisensi tercantum di <a href="/about.html" hreflang="ja">halaman bahasa Jepang</a>.</p>`,
      appT: 'Pakai Kyochika seperti aplikasi', appD: 'Cara menambahkan Kyochika ke layar utama ponsel dan memakainya seperti aplikasi, di iPhone, Android, dan komputer. Tanpa unduh dan tanpa daftar.',
      app: `    <p>Tambahkan Kyochika ke layar utama, lalu buka dari ikon dalam layar penuh. Tidak perlu unduh dari toko aplikasi dan tidak perlu daftar. Gratis.</p>
    <p><button class="go pri" id="inst" type="button" hidden>Tambahkan ke perangkat ini</button></p>
    <h2>iPhone dan iPad</h2>
    <ol><li>Buka kyochika.jp/id/ di Safari</li><li>Ketuk tombol Bagikan (kotak dengan panah ke atas)</li><li>Pilih “Tambah ke Layar Utama”</li><li>Ketuk “Tambah”</li></ol>
    <h2>Android</h2>
    <ol><li>Buka kyochika.jp/id/ di Chrome</li><li>Ketuk menu “⋮” di kanan atas</li><li>Pilih “Tambahkan ke layar utama” atau “Instal aplikasi”</li></ol>
    <h2>Komputer (Chrome, Edge)</h2>
    <ol><li>Buka kyochika.jp/id/</li><li>Klik tombol instal di ujung kanan bilah alamat</li></ol>
    <h2>Untuk menghapus</h2>
    <p>Tekan lama ikonnya lalu pilih “Hapus”.</p>`,
      ui: { today: 'Hari ini', nowOnly: 'Masih buka sekarang', free: 'Gratis', soon: 'Segera berakhir', night: 'Buka setelah 19.00', ig: 'Dari Instagram', board: '{d} · terdekat dari {from}', n: '{n} acara', start: 'mulai {o}', lastDay: 'Hari ini hari terakhir', until: 'sampai {d}', now: 'Sedang berlangsung', fromT: 'Mulai {o}', over: 'Sudah tutup hari ini', endsToday: 'Berakhir hari ini', left: '{n} hari lagi', time: 'Jam', dist: 'Jarak', price: 'Harga', fromSt: 'Dari {s}: ', near: 'dekat sekali', walk: 'sekitar {n} menit jalan kaki', train: 'sekitar {n} menit naik kereta', km: '{k} km, {t}', details: 'Detail', official: 'Situs resmi (bahasa Jepang)', igpost: 'Postingan Instagram', igbd: 'Dari Instagram', alt: 'Foto area tempat acara', sta: ' (Stasiun {s})', empty: 'Tidak ada acara untuk hari dan filter ini. Hapus filter atau pilih hari lain.' },
      kidH: 'Anak', kidBd: k => k[1] >= 99 ? `Keluarga, usia ${k[0]}+` : `Anak ${k[0]}–${k[1]} th`, kidRow: k => k[1] >= 99 ? `Cocok untuk keluarga, usia ${k[0]}+` : `Usia ${k[0]}–${k[1]} tahun`,
      KL: ['Bersama anak', 'Berapa usia anak?', '0–2 tahun', '3–6 tahun', 'Usia SD', 'Semua usia'], adult: x => `Dewasa ¥${x}`,
    },
  };
  return X[L] || {};
}
if (typeof module !== 'undefined') module.exports = { KYOCHIKA_SX };
