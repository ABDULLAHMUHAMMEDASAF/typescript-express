// Merkezi Fetch Fonksiyonu
export async function emreFetch(url, options = {}) {
    const token = localStorage.getItem("adminToken");

    // Varsayılan ayarları oluştur
    const defaultOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token || "" // Varsa token'ı ekle
        }
    };

    // Kullanıcının gönderdiği ayarları varsayılanlarla birleştir
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };

    const response = await fetch(url, finalOptions);

    // Eğer sunucu "Yetkin yok" (401) derse, direkt login'e şutla
    if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "login.html";
        return;
    }

    return response;
}
