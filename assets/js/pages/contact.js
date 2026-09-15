import { bootstrap } from '../main.js';
import { CONTACT_ROWS, FORM_FIELDS } from '../../data/site.js';

function renderRows() {
  document.getElementById('contact-rows').innerHTML = CONTACT_ROWS.map(c => `
    <div class="contact-row"><div class="contact-row__k">${c.k}</div><div class="contact-row__v">${c.v}</div></div>
  `).join('');
}

function renderFields() {
  document.getElementById('contact-fields').innerHTML = FORM_FIELDS.map(f => `
    <div class="field">
      <label class="field__label" for="f-${f.name}">${f.label}</label>
      <input class="field__input" id="f-${f.name}" name="${f.name}" type="${f.type ?? 'text'}" placeholder="${f.ph}" ${f.required ? 'required' : ''} aria-describedby="err-${f.name}">
      <p class="field__error" id="err-${f.name}">${f.type === 'email' ? 'Please enter a valid email address.' : `Please enter your ${f.label.replace(/^your\s+/i, '').toLowerCase()}.`}</p>
    </div>
  `).join('');
}

function initValidation() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');

  function validateField(el) {
    const errorEl = document.getElementById(el.getAttribute('aria-describedby'));
    const valid = el.checkValidity();
    el.setAttribute('aria-invalid', String(!valid));
    if (errorEl) errorEl.classList.toggle('is-visible', !valid);
    return valid;
  }

  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validateField(el); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    success.hidden = true;
    const fields = Array.from(form.querySelectorAll('input, textarea'));
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      fields.find(el => el.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }
    success.hidden = false;
    form.reset();
  });
}

async function main() {
  renderRows();
  renderFields();
  await bootstrap();
  initValidation();
}

main();
