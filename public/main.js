//? --- DEĞİŞKENLER VE SEÇİCİLER ---
const result = document.getElementById("result");
const btnGetir = document.getElementById("btnGetir");
const overlay = document.getElementById("overlay");
const val = document.getElementById("val");
const btnEkle = document.getElementById("btnEkle");
const adminPanel = document.getElementById("admin-panel");
import { emreFetch } from "./api.js"; // En üste import ekledik

//? --- GÜVENLİK KONTROLÜ (FEDAİ) ---
const token = localStorage.getItem("adminToken");
//! Eğer token yoksa, aşağıdaki hiçbir kodun çalışmasına izin verme ve kov!
if (!token) window.location.href = "login.html";

//? --- 1. YARDIMCI FONKSİYON: EKRANA KULLANICI EKLEME ---
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
    //! 1. Onay al
    if (!confirm(`${user.name} silinsin mi?`)) return;

    try {
      overlay.style.visibility = "visible";

      //! emreFetch kullanımı: Token otomatik eklenir
      const res = await emreFetch(`${API_URL}/users/${user._id}`, {
        method: "DELETE",
      });

      if (res && res.ok) {
        li.remove();
      } else {
        alert("Silme işlemi başarısız. Yetkiniz olmayabilir.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    } finally {
      overlay.style.visibility = "hidden";
    }
  };

  li.appendChild(btn);
  li.appendChild(btn2);
  result.prepend(li);
}

//? --- 2. TÜM KULLANICI LİSTESİNİ GETİRME ---
async function loadUsers() {
  try {
    overlay.style.visibility = "visible";

    //! emreFetch ile temiz bir GET isteği
    const res = await emreFetch(`${API_URL}/users`);

    if (res && res.ok) {
      const users = await res.json();
      result.innerHTML = ""; // Listeyi temizle
      users.forEach((user) => renderUser(user));
    }
  } catch (error) {
    alert("Veri çekme hatası!");
    console.error("Yükleme hatası:", error);
  } finally {
    overlay.style.visibility = "hidden";
  }
}

//? --- 3. YENİ VERİ EKLEME ---
btnEkle.addEventListener("click", async () => {
  let userName = val.value.trim();
  if (!userName) return alert("Lütfen bir isim girin!");

  //! Türkçe Formatlama
  userName = userName.toLocaleLowerCase("tr-TR");
  userName = userName.charAt(0).toLocaleUpperCase("tr-TR") + userName.slice(1);

  try {
    overlay.style.visibility = "visible";

    //! emreFetch POST isteği: Headers otomatik halledilir
    const res = await emreFetch(`${API_URL}/users`, {
      method: "POST",
      body: JSON.stringify({ name: userName }),
    });

    if (res && res.ok) {
      const newUser = await res.json();
      renderUser(newUser);
      val.value = "";
    }
  } catch (error) {
    alert("Ekleme hatası!");
  } finally {
    overlay.style.visibility = "hidden";
  }
});

//! Admin listesini getir
async function fetchAdminList() {
  try {
    overlay.style.visibility = "visible";
    const res = await emreFetch(`${API_URL}/admins/`);

    if (res && res.ok) {
      const admins = await res.json();
      adminPanel.innerHTML = "";

      admins.forEach((admin) => {
        const div = document.createElement("div");
        const btn = document.createElement("button");
        btn.textContent = "Sil";
        btn.className = "btn-sil";
        div.className = "admin-box";
        div.textContent = `${admin.name} -- (${admin.role})`;
        div.appendChild(btn);
        adminPanel.appendChild(div);

        btn.onclick = async () => {
          //! 1. Onay al
          if (!confirm(`${admin.name} Silinsin mi?`)) return;

          try {
            overlay.style.visibility = "visible";

            //! emreFetch kullanımı: Token otomatik eklenir
            const res = await emreFetch(`${API_URL}/admins/${admin._id}`, {
              method: "DELETE",
            });

            if (res && res.ok) {
              div.remove();
            } else {
              alert("Silme işlemi başarısız. Yetkiniz olmayabilir.");
            }
          } catch (error) {
            console.error("Silme hatası:", error);
          } finally {
            overlay.style.visibility = "hidden";
          }
        };
      });
    }
  } catch (error) {
    console.error("Admin listesi yüklenemedi:", error);
  } finally {
    overlay.style.visibility = "hidden";
  }
}

//! Buton dinleyicisi
btnGetir.addEventListener("click", loadUsers);

//! Admin listesini yükle
fetchAdminList();
