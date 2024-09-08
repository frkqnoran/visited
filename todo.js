document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.querySelector('#table-container');
    const paginationContainer = document.querySelector('#pagination');
    const itemsPerPage = 5;
    let tasks = [];
    let currentPage = 1;

    // Görev verilerini JSON'dan çek
    function fetchTasks() {
        return fetch('tasks.json')
            .then(response => response.json())
            .then(data => {
                tasks = data;
                renderTable();
                renderPagination();
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    function renderTable() {
        tableContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, tasks.length);

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

        for (let i = startIndex; i < endIndex; i++) {
            const task = tasks[i];
            tableHtml += `
                <tr>
                    <td>${task.name}</td>
                    <td>${task.status}</td>
                    <td>${task.startTime}</td>
                    <td>${task.endTime}</td>
                    <td><a href="#" class="show-photo" data-photo-path="${task.photoFilePath}">Show</a></td>
                </tr>
            `;
        }

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
    }

    function renderPagination() {
        paginationContainer.innerHTML = '';

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Önceki';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
                renderPagination();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page numbers
        const totalPages = Math.ceil(tasks.length / itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.textContent = i;
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.href = 'javascript:void(0)';
            pageLink.addEventListener('click', () => {
                currentPage = i;
                renderTable();
                renderPagination();
            });
            paginationContainer.appendChild(pageLink);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Sonraki';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
                renderPagination();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    fetchTasks();
});
