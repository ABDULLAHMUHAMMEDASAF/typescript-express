const adminName = document.getElementById("txtName");
const adminPassword = document.getElementById("txtPassword");
const adminRole = document.getElementById("cmbRole");
const btnKaydet = document.getElementById("btnKaydet");

btnKaydet.addEventListener("click", async () => {
  const name = adminName.value.trim();
  const pass = adminPassword.value;
  const role = adminRole.value.trim();

  if (!name || !pass || !role) {
    return alert("Lütfen tüm alanları doldurun!");
  }

  try {
    // Hatırlatma: Rota backend'de yazdığımız /register rotası olmalı
    const res = await fetch(`${API_URL}/admins/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, password: pass, role: role }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Admin başarıyla kaydedildi!");
      // Kayıttan sonra istersen ana sayfaya yönlendir:
      window.location.href = "index.html";
    } else {
      alert("Hata: " + data.message);
    }
  } catch (error) {
    console.error("Bağlantı hatası:", error);
    alert("Sunucuya bağlanılamadı!");
  }
});

document.querySelectorAll('.select-wrapper select').forEach(select => {
  select.addEventListener('focus', () => {
    select.closest('.select-wrapper').classList.add('open');
  });

  select.addEventListener('blur', () => {
    select.closest('.select-wrapper').classList.remove('open');
  });

  select.addEventListener('change', () => {
    setTimeout(() => select.blur(), 0); // ✅
  });
});

