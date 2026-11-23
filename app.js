const views = {
  dashboard: { title: 'Genel Bakış', subtitle: 'İçerik akışınız bugün gayet iyi görünüyor.' },
  studio: { title: 'İçerik Stüdyosu', subtitle: 'Yapay zekâ ile platforma özel içerikler oluşturun.' },
  calendar: { title: 'Paylaşım Takvimi', subtitle: 'Tüm hesaplarınızın yayın planını tek ekranda yönetin.' },
  library: { title: 'Medya Arşivi', subtitle: 'İçerik havuzunuzu düzenleyin ve otomasyon sırasını belirleyin.' },
  accounts: { title: 'Sosyal Hesaplar', subtitle: 'Bağlantıları, modları ve paylaşım sıklıklarını yönetin.' },
  reports: { title: 'Performans Raporları', subtitle: 'Platformlarınızın büyümesini ve içerik sonuçlarını inceleyin.' },
  settings: { title: 'Ayarlar', subtitle: 'Otomasyon panelinizi çalışma şeklinize göre özelleştirin.' }
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function switchView(name) {
  if (!views[name]) return;
  $$('.view').forEach(view => view.classList.remove('active'));
  $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === name));
  $(`#${name}View`)?.classList.add('active');
  $('#pageTitle').textContent = views[name].title;
  $('#pageSubtitle').textContent = views[name].subtitle;
  closeMobileNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('[data-view]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
$$('[data-view-link]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.viewLink)));

const sidebar = $('#sidebar');
const navOverlay = $('#navOverlay');
function closeMobileNav() { sidebar.classList.remove('open'); navOverlay.classList.remove('show'); }
$('#menuBtn').addEventListener('click', () => { sidebar.classList.add('open'); navOverlay.classList.add('show'); });
navOverlay.addEventListener('click', closeMobileNav);

let toastTimer;
function showToast(title, message) {
  $('#toastTitle').textContent = title;
  $('#toastText').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3200);
}

let automationRunning = true;
$('#automationToggle').addEventListener('click', () => {
  automationRunning = !automationRunning;
  const card = $('.automation-card');
  card.classList.toggle('paused', !automationRunning);
  $('#automationTitle').textContent = automationRunning ? 'Tüm sistemler çalışıyor' : 'Otomasyon geçici olarak durduruldu';
  $('#automationText').textContent = automationRunning ? "Sıradaki paylaşım 42 dakika sonra LinkedIn'de." : 'Planlanan içerikler korunuyor; yeni paylaşım yapılmayacak.';
  const button = $('#automationToggle');
  button.querySelector('use').setAttribute('href', automationRunning ? '#i-pause' : '#i-play');
  button.querySelector('span').textContent = automationRunning ? 'Otomasyonu durdur' : 'Otomasyonu başlat';
  showToast(automationRunning ? 'Otomasyon yeniden başladı' : 'Otomasyon durduruldu', automationRunning ? 'Planlanan paylaşımlar sıraya alındı.' : 'İstediğiniz zaman yeniden başlatabilirsiniz.');
});

const composer = $('#composerModal');
function openComposer() { composer.classList.add('open'); composer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; setTimeout(() => $('#captionText').focus(), 120); }
function closeComposer() { composer.classList.remove('open'); composer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
$$('[data-open-composer]').forEach(button => button.addEventListener('click', openComposer));
$$('[data-close-modal]').forEach(button => button.addEventListener('click', closeComposer));
composer.addEventListener('click', event => { if (event.target === composer) closeComposer(); });

$$('.platform-choice').forEach(button => button.addEventListener('click', () => button.classList.toggle('selected')));
$$('.schedule-options label').forEach(label => label.addEventListener('click', () => {
  $$('.schedule-options label').forEach(item => item.classList.remove('selected'));
  label.classList.add('selected');
}));

const caption = $('#captionText');
caption.addEventListener('input', () => $('#charCount').textContent = `${caption.value.length} karakter`);
$('#aiCaption').addEventListener('click', () => {
  const button = $('#aiCaption');
  button.disabled = true;
  button.innerHTML = '<svg><use href="#i-spark"/></svg>Hazırlanıyor...';
  setTimeout(() => {
    caption.value = 'Geleceği birlikte daha sürdürülebilir hâle getiriyoruz. 🌱 Yeni çevre dostu ambalajlarımızla doğaya bıraktığımız izi azaltırken, ürün kalitemizi aynı özenle koruyoruz.\n\n#Sürdürülebilirlik #YeşilGelecek #NovaMarka';
    caption.dispatchEvent(new Event('input'));
    button.disabled = false;
    button.innerHTML = '<svg><use href="#i-spark"/></svg>AI ile yeniden yaz';
    showToast('Metin hazırlandı', 'Her platform için yayın sırasında otomatik uyarlanacak.');
  }, 950);
});

$('#chooseMedia').addEventListener('click', () => {
  const drop = $('.media-drop');
  drop.classList.add('selected-media');
  drop.innerHTML = '<svg><use href="#i-check"/></svg><b>yeni-sezon.jpg seçildi</b><p>1080 × 1350 · Yayına hazır</p><button class="secondary-btn" type="button">Medyayı değiştir</button>';
});

$('#schedulePost').addEventListener('click', () => {
  const text = caption.value.trim();
  if (!text) {
    caption.focus();
    showToast('Paylaşım metni eksik', 'Metni yazın veya AI ile oluşturun.');
    return;
  }
  const selectedCount = $$('.platform-choice.selected').length;
  closeComposer();
  showToast('Paylaşım planlandı', `${selectedCount} platform için 25 Kasım 14:30 sırasına eklendi.`);
});

$('#quickGenerate').addEventListener('click', () => {
  const button = $('#quickGenerate');
  button.classList.add('loading');
  button.querySelector('span').textContent = 'Metinler oluşturuluyor...';
  setTimeout(() => {
    button.classList.remove('loading');
    button.querySelector('span').textContent = 'Platform metinlerini yeniden oluştur';
    $$('.variation-card').forEach((card, index) => { card.animate([{ opacity: .25, transform: 'translateY(5px)' }, { opacity: index === 2 ? .75 : 1, transform: 'none' }], { duration: 420, delay: index * 90, fill: 'both' }); });
    showToast('4 platform metni hazır', 'Ton ve karakter uzunlukları kanallara göre uyarlandı.');
  }, 1050);
});

$$('.tone-row .chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.tone-row .chip').forEach(item => item.classList.remove('active'));
  chip.classList.add('active');
}));

$('#uploadBtn').addEventListener('click', () => $('#fileInput').click());
$('#fileInput').addEventListener('change', event => {
  if (!event.target.files.length) return;
  const file = event.target.files[0];
  const card = document.createElement('article');
  card.className = 'media-card';
  card.innerHTML = `<div class="media-art art-3"><span>YENİ</span></div><div><b>${file.name}</b><small>Yeni yüklendi · Demo dosyası</small></div><em>Kullanılmadı</em>`;
  $('#mediaGrid').prepend(card);
  showToast('Medya arşive eklendi', `${event.target.files.length} dosya otomasyon için hazır.`);
});

$$('.filter-chips .chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.filter-chips .chip').forEach(item => item.classList.remove('active'));
  chip.classList.add('active');
}));

const accountModal = $('#accountModal');
function openAccountModal() { accountModal.classList.add('open'); accountModal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function closeAccountModal() { accountModal.classList.remove('open'); accountModal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
$('#addAccountBtn').addEventListener('click', openAccountModal);
$('#addAccountCard').addEventListener('click', openAccountModal);
$$('[data-close-account]').forEach(button => button.addEventListener('click', closeAccountModal));
accountModal.addEventListener('click', event => { if (event.target === accountModal) closeAccountModal(); });
$$('.platform-list button').forEach(button => button.addEventListener('click', () => {
  closeAccountModal();
  showToast(`${button.dataset.platform} bağlantısı başlatıldı`, 'Demo modunda yetkilendirme başarıyla simüle edildi.');
}));

$$('.account-btn').forEach(button => button.addEventListener('click', () => showToast('Hesap ayarları açıldı', 'Paylaşım modu ve sıklık bu ekrandan güncellenebilir.')));
$('.save-settings').addEventListener('click', () => showToast('Ayarlar kaydedildi', 'Yeni tercihler otomasyon akışına uygulandı.'));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeComposer(); closeAccountModal(); closeMobileNav(); }
});
