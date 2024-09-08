const tableContainer = document.getElementById('table-container');
let tooltip = null;

async function loadTableData() {
    try {
        const response = await fetch('tasks.json'); // JSON dosyasının yolu
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const tasks = await response.json();
        console.log(tasks); // Veriyi kontrol edin

        // Tabloyu oluştur
        let tableHtml = `
            <table style="width: 100%; border-collapse: collapse; background-color: white;">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Completion Photo</th>
                    </tr>
                </thead>
                <tbody>
        `;

        tasks.forEach(task => {
            tableHtml += `
                <tr>
                    <td>${task.name}</td>
                    <td>${task.status}</td>
                    <td>${task.startTime}</td>
                    <td>${task.endTime}</td>
                    <td><a href="#" class="show-photo" data-photo-path="${task.photoFilePath}">Show</a></td>
                </tr>
            `;
        });

        tableHtml += `
            </tbody>
        </table>
        `;

        tableContainer.innerHTML = tableHtml;

        // "Show" linklerine tıklama olayı ekleyin
        document.querySelectorAll('.show-photo').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showTooltip(this.dataset.photoPath);
            });
        });

    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Tooltip göstermek için fonksiyon
function showTooltip(photoPath) {
    // Tooltip zaten varsa, önceki tooltip'i kaldırın
    if (tooltip) {
        tooltip.remove();
    }

    // Yeni tooltip oluşturun
    tooltip = document.createElement('div');
    tooltip.className = 'photo-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <span class="close-btn">&times;</span>
            <img src="${photoPath}" alt="Completion Photo" style="width: 100%; height: auto;">
        </div>
    `;

    document.body.appendChild(tooltip);

    // Kapatma butonuna tıklama olayı ekleyin
    tooltip.querySelector('.close-btn').addEventListener('click', () => {
        tooltip.remove();
    });

    // Tooltip'in dışında bir yere tıklanırsa kapatılacak
    document.addEventListener('click', (e) => {
        if (!tooltip.contains(e.target) && !e.target.classList.contains('show-photo')) {
            tooltip.remove();
        }
    });
}

// JSON dosyasını yükle
loadTableData();
