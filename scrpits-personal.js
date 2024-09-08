const mapContainer = document.getElementById("map-container");
const worldMap = document.getElementById("world-map");

async function loadCountries() {
    try {
        const response = await fetch('countries.json'); // JSON dosyasının yolu
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const countries = await response.json();

        worldMap.addEventListener('load', function () {
            const svgDoc = worldMap.contentDocument; // SVG'nin içeriğini al
            countries.forEach((country) => {
                const countryPath = svgDoc.getElementById(country.id);
                if (countryPath) {
                    // Ziyaret edilip edilmediğine göre renk belirle
                    const fillColor = country.visited ? "rgba(135, 139, 250, 0.9955533596837944)" : "rgb(211,211,211)";
                    countryPath.setAttribute("fill", fillColor);

                    // Tooltip oluştur ve pozisyonunu ayarla
                    const tooltip = document.createElement("div");
                    tooltip.className = "country-tooltip";
                    tooltip.style.position = "absolute";
                    tooltip.style.display = "none"; // Başlangıçta gizli

                    mapContainer.appendChild(tooltip);

                    // Orijinal sınır renk ve genişliğini sakla
                    const originalStroke = countryPath.getAttribute("stroke") || "none";
                    const originalStrokeWidth = countryPath.getAttribute("stroke-width") || "1";

                    // Fare ülkenin üzerinde hareket ederken
                    countryPath.addEventListener("mousemove", (e) => {
                        // Flag-icon-css kütüphanesinden bayrak URL'sini oluştur
                        const flagClass = `fi fi-${country.id.toLowerCase()}`;

                        // Tooltip içeriği
                        const tooltipContent = `
                            <div class="tooltip-content">
                                <span class="${flagClass} flag" style="width: 32px; height: 24px; margin-right: 10px;"></span>
                                <span class="name">${country.name}</span>
                            </div>
                            <span class="visited-text">${country.visited ? "First time: " + country.visited : ""}</span>
                        `;
                        
                        tooltip.innerHTML = tooltipContent;
                        tooltip.style.display = "block"; // Tooltip'i göster
                        tooltip.style.top = `${e.clientY - 5}px`;
                        tooltip.style.left = `${e.clientX + 20}px`;

                        // Harita sınırlarını kontrol et
                        const tooltipRect = tooltip.getBoundingClientRect();
                        if (tooltipRect.right > window.innerWidth) {
                            tooltip.style.left = `${e.clientX - tooltipRect.width - 20}px`;
                        }
                        if (tooltipRect.bottom > window.innerHeight) {
                            tooltip.style.top = `${e.clientY - tooltipRect.height}px`;
                        }

                        // Sınır rengini kırmızı yap ve genişliği 0.4 piksel olarak ayarla
                        countryPath.setAttribute("stroke", "red");
                        countryPath.setAttribute("stroke-width", "0.4");
                    });

                    // Fare ülkenin üzerinden ayrıldığında tooltip'i gizle ve sınır rengini eski haline döndür
                    countryPath.addEventListener("mouseout", () => {
                        tooltip.style.display = "none";
                        countryPath.setAttribute("stroke", originalStroke);
                        countryPath.setAttribute("stroke-width", originalStrokeWidth);
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error loading countries:', error);
    }
}

// JSON dosyasını yükle
loadCountries();
