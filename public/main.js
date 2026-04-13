const result = document.getElementById("result");
const btnGetir = document.getElementById("btnGetir");
const overlay = document.getElementById("overlay");
const val = document.getElementById("val");
const btnEkle = document.getElementById("btnEkle");

// --- 1. YARDIMCI FONKSİYON: EKRANA KULLANICI EKLEME ---
// Bu fonksiyonu hem GET hem POST içinde kullanacağız.
function renderUser(user) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  const btn2 = document.createElement("button");
  btn.textContent = "Sil";
  btn2.textContent = "Düzenle";
  btn.className = "btn-sil";
  btn2.className = "btn-duzenle";
  li.textContent = user.name;

  btn.onclick = async () => {
    // 1. Önce onayı al, SONRA overlay'i aç (Daha güvenli)
    if (!confirm(`${user.name} silinsin mi?`)) return;

    try {
      overlay.style.visibility = "visible";

      const res = await fetch("http://localhost:1453/users/" + user._id, {
        method: "DELETE",
      });

      if (res.ok) {
        li.remove();
      } else {
        alert("Sunucu silme işlemini reddetti.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    } finally {
      // 2. Ne olursa olsun burası çalışır ve gizler
      overlay.style.visibility = "hidden";
    }
  };

  li.appendChild(btn);
  li.appendChild(btn2);
  result.prepend(li);
}

// --- 2. TÜM LİSTEYİ GETİRME ---
async function loadUsers() {
  try {
    overlay.style.visibility = "visible";
    const res = await fetch("http://localhost:1453/users");
    const users = await res.json();

    result.innerHTML = ""; // Listeyi temizle
    users.forEach((user) => renderUser(user)); // Her biri için renderUser'ı çağır
  } catch (error) {
    console.error("Yükleme hatası:", error);
  } finally {
    overlay.style.visibility = "hidden";
  }
}

// --- 3. YENİ VERİ EKLEME ---
btnEkle.addEventListener("click", async () => {
  let userName = val.value.trim();
  if (!userName) return alert("Lütfen bir isim girin!");

  // Türkçe Formatlama
  userName = userName.toLocaleLowerCase("tr-TR");
  userName = userName.charAt(0).toLocaleUpperCase("tr-TR") + userName.slice(1);

  try {
    overlay.style.visibility = "visible";
    const res = await fetch("http://localhost:1453/users", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ name: userName }),
    });

    if (res.ok) {
      const newUser = await res.json();
      renderUser(newUser); // Yeni geleni listeye ekle (Silme butonu otomatik hazır gelir)
      val.value = ""; // Inputu temizle
    }
  } catch (error) {
    alert("Ekleme hatası!");
  } finally {
    overlay.style.visibility = "hidden";
  }
});

btnGetir.addEventListener("click", loadUsers);
