/* Los datos vienen de contenido.json (los carga motor.js en window.INVITACION) */
const DATOS = window.INVITACION;

/* Script para abrir el sobre */
const openBtn = document.getElementById("openEnvelope");
const envelope = document.querySelector(".envelope");
const screen = document.getElementById("envelopeScreen");
const invitation = document.getElementById("invitationContent");

openBtn.addEventListener("click", () => {
  envelope.classList.add("open");

  setTimeout(() => {
    screen.classList.add("fade-out");
    invitation.classList.remove("hidden");
  }, 1200);
});

/* Script para el contador: la fecha se cambia en evento.inicio de contenido.json */
const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;

const countDown = new Date(DATOS.evento.inicio).getTime();
const x =
  document.getElementById("dias") &&
  setInterval(function () {
    const distance = Math.max(0, countDown - Date.now());
    document.getElementById("dias").innerText = Math.floor(distance / day);
    document.getElementById("horas").innerText = Math.floor((distance % day) / hour);
    document.getElementById("minutos").innerText = Math.floor((distance % hour) / minute);
    document.getElementById("segundos").innerText = Math.floor((distance % minute) / second);
    if (distance === 0) clearInterval(x);
  }, second);

/* Calendario: se arma solo con el mes de evento.inicio (semana de lunes a domingo) */
const grid = document.getElementById("calendarGrid");
if (grid) {
  const fecha = new Date(DATOS.evento.inicio);
  const anio = fecha.getFullYear(),
    mes = fecha.getMonth();
  const vacios = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const diasMes = new Date(anio, mes + 1, 0).getDate();
  let celdas = DATOS.calendario.diasSemana.map((d) => `<div class="day-name">${d}</div>`).join("");
  celdas += '<div class="empty"></div>'.repeat(vacios);
  for (let d = 1; d <= diasMes; d++) {
    celdas += `<div${d === fecha.getDate() ? ' class="event-day"' : ""}>${d}</div>`;
  }
  celdas += '<div class="empty"></div>'.repeat((7 - ((vacios + diasMes) % 7)) % 7);
  grid.innerHTML = celdas;

  const pad = (n) => String(n).padStart(2, "0");
  const formato = (f) => `${f.getFullYear()}${pad(f.getMonth() + 1)}${pad(f.getDate())}T${pad(f.getHours())}${pad(f.getMinutes())}00`;
  const fin = new Date(fecha.getTime() + DATOS.evento.duracionHoras * hour);
  document.getElementById("btnCalendar").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(DATOS.evento.tituloCalendario)}` +
    `&dates=${formato(fecha)}/${formato(fin)}` +
    `&details=${encodeURIComponent(DATOS.evento.detallesCalendario)}` +
    `&location=${encodeURIComponent(DATOS.evento.lugarCalendario)}`;
}
