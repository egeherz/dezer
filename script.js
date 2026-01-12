document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById("news-grid");
    
    // RSS Kaynağı: CNN Türk veya TRT Haber kullanabiliriz.
    // Şimdilik CNN Türk daha görsel ağırlıklı olduğu için onu seçtim.
    const rssUrl = "https://www.cnnturk.com/feed/66/index.rss";
    const apiKey = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssUrl);

    fetch(apiKey)
        .then(response => response.json())
        .then(data => {
            newsContainer.innerHTML = ""; // Yükleniyor yazısını sil

            if(data.status === 'ok') {
                data.items.slice(0, 12).forEach(item => { // İlk 12 haberi çek
                    
                    // Görseli yakalama mantığı
                    let imageUrl = item.thumbnail;
                    if (!imageUrl && item.enclosure && item.enclosure.link) {
                        imageUrl = item.enclosure.link;
                    }
                    if (!imageUrl) {
                        // Resim yoksa standart bir haber görseli kullan
                        imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=500&q=60";
                    }

                    // Tarih formatlama
                    const date = new Date(item.pubDate).toLocaleDateString('tr-TR', {
                        day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit'
                    });

                    // Başlık kısaltma (çok uzunsa)
                    let title = item.title.length > 70 ? item.title.substring(0, 70) + "..." : item.title;

                    const cardHTML = `
                        <div class="news-card">
                            <a href="${item.link}" target="_blank">
                                <img src="${imageUrl}" alt="${title}" class="news-img">
                                <div class="news-body">
                                    <span class="news-date"><i class="far fa-clock"></i> ${date}</span>
                                    <h3 class="news-title">${title}</h3>
                                </div>
                            </a>
                        </div>
                    `;
                    newsContainer.innerHTML += cardHTML;
                });
            } else {
                newsContainer.innerHTML = "<p style='text-align:center'>Haberler şu an alınamıyor.</p>";
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            newsContainer.innerHTML = "<p style='text-align:center'>Bağlantı hatası oluştu.</p>";
        });
});
