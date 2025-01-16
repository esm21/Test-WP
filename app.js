document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            
            sections.forEach(section => {
                section.classList.add('d-none');
            });

            document.getElementById(targetSection).classList.remove('d-none');

            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });

            link.classList.add('active');
        });
    });

    // Load and initialize each section
    loadBasicDetails();
    loadCeremony();
    loadGuests();
    loadSeating();
    loadTimeline();
    loadBanquet();
});

function loadBasicDetails() {
    const basicDetailsSection = document.getElementById('basic-details');
    basicDetailsSection.innerHTML += `
        <form id="basic-details-form" class="mt-4">
            <div class="mb-3">
                <label for="wedding-date" class="form-label">Fecha de la Boda</label>
                <input type="date" class="form-control" id="wedding-date" required>
            </div>
            <div class="mb-3">
                <label for="guest-count" class="form-label">Número de Invitados</label>
                <input type="number" class="form-control" id="guest-count" min="1" required>
            </div>
            <div class="mb-3">
                <label for="venue" class="form-label">Lugar de la Boda</label>
                <input type="text" class="form-control" id="venue" required>
            </div>
            <button type="submit" class="btn btn-primary">Guardar Detalles</button>
        </form>
    `;

    document.getElementById('basic-details-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const weddingDate = document.getElementById('wedding-date').value;
        const guestCount = document.getElementById('guest-count').value;
        const venue = document.getElementById('venue').value;

        localStorage.setItem('weddingDetails', JSON.stringify({ weddingDate, guestCount, venue }));
        alert('Detalles guardados exitosamente!');
    });

    // Load saved details if available
    const savedDetails = JSON.parse(localStorage.getItem('weddingDetails'));
    if (savedDetails) {
        document.getElementById('wedding-date').value = savedDetails.weddingDate;
        document.getElementById('guest-count').value = savedDetails.guestCount;
        document.getElementById('venue').value = savedDetails.venue;
    }
}

function loadCeremony() {
    const ceremonySection = document.getElementById('ceremony');
    ceremonySection.innerHTML += `
        <form id="ceremony-form" class="mt-4">
            <div class="mb-3">
                <label for="ceremony-type" class="form-label">Tipo de Ceremonia</label>
                <select class="form-select" id="ceremony-type" required>
                    <option value="">Seleccionar...</option>
                    <option value="civil">Civil</option>
                    <option value="religious">Religiosa</option>
                    <option value="both">Ambas</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="ceremony-venue" class="form-label">Lugar de la Ceremonia</label>
                <input type="text" class="form-control" id="ceremony-venue" required>
            </div>
            <div class="mb-3">
                <label for="ceremony-time" class="form-label">Hora de la Ceremonia</label>
                <input type="time" class="form-control" id="ceremony-time" required>
            </div>
            <div class="mb-3">
                <label for="ceremony-notes" class="form-label">Notas Adicionales</label>
                <textarea class="form-control" id="ceremony-notes" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Guardar Detalles de la Ceremonia</button>
        </form>
    `;

    document.getElementById('ceremony-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const ceremonyType = document.getElementById('ceremony-type').value;
        const ceremonyVenue = document.getElementById('ceremony-venue').value;
        const ceremonyTime = document.getElementById('ceremony-time').value;
        const ceremonyNotes = document.getElementById('ceremony-notes').value;

        localStorage.setItem('ceremonyDetails', JSON.stringify({ ceremonyType, ceremonyVenue, ceremonyTime, ceremonyNotes }));
        alert('Detalles de la ceremonia guardados exitosamente!');
    });

    // Load saved details if available
    const savedCeremonyDetails = JSON.parse(localStorage.getItem('ceremonyDetails'));
    if (savedCeremonyDetails) {
        document.getElementById('ceremony-type').value = savedCeremonyDetails.ceremonyType;
        document.getElementById('ceremony-venue').value = savedCeremonyDetails.ceremonyVenue;
        document.getElementById('ceremony-time').value = savedCeremonyDetails.ceremonyTime;
        document.getElementById('ceremony-notes').value = savedCeremonyDetails.ceremonyNotes;
    }
}

function loadGuests() {
    const guestsSection = document.getElementById('guests');
    guestsSection.innerHTML += `
        <div class="row mt-4">
            <div class="col-md-6">
                <h3>Agregar Invitado</h3>
                <form id="add-guest-form">
                    <div class="mb-3">
                        <label for="guest-name" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="guest-name" required>
                    </div>
                    <div class="mb-3">
                        <label for="guest-email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="guest-email" required>
                    </div>
                    <div class="mb-3">
                        <label for="guest-category" class="form-label">Categoría</label>
                        <select class="form-select" id="guest-category" required>
                            <option value="">Seleccionar...</option>
                            <option value="family">Familia</option>
                            <option value="friends">Amigos</option>
                            <option value="colleagues">Colegas</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Agregar Invitado</button>
                </form>
            </div>
            <div class="col-md-6">
                <h3>Lista de Invitados</h3>
                <ul id="guest-list" class="list-group">
                    <!-- Guest list items will be added here dynamically -->
                </ul>
            </div>
        </div>
    `;

    const addGuestForm = document.getElementById('add-guest-form');
    const guestList = document.getElementById('guest-list');

    addGuestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('guest-name').value;
        const email = document.getElementById('guest-email').value;
        const category = document.getElementById('guest-category').value;

        const guest = { name, email, category, rsvp: false };
        let guests = JSON.parse(localStorage.getItem('guests')) || [];
        guests.push(guest);
        localStorage.setItem('guests', JSON.stringify(guests));

        updateGuestList();
        addGuestForm.reset();
    });

    function updateGuestList() {
        const guests = JSON.parse(localStorage.getItem('guests')) || [];
        guestList.innerHTML = '';
        guests.forEach((guest, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${guest.name} (${guest.category})
                <span>
                    <button class="btn btn-sm btn-${guest.rsvp ? 'success' : 'warning'}" onclick="toggleRSVP(${index})">
                        ${guest.rsvp ? 'Confirmado' : 'Pendiente'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removeGuest(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </span>
            `;
            guestList.appendChild(li);
        });
    }

    window.toggleRSVP = function(index) {
        let guests = JSON.parse(localStorage.getItem('guests')) || [];
        guests[index].rsvp = !guests[index].rsvp;
        localStorage.setItem('guests', JSON.stringify(guests));
        updateGuestList();
    };

    window.removeGuest = function(index) {
        let guests = JSON.parse(localStorage.getItem('guests')) || [];
        guests.splice(index, 1);
        localStorage.setItem('guests', JSON.stringify(guests));
        updateGuestList();
    };

    updateGuestList();
}

function loadSeating() {
    const seatingSection = document.getElementById('seating');
    seatingSection.innerHTML += `
        <div class="row mt-4">
            <div class="col-md-6">
                <h3>Agregar Mesa</h3>
                <form id="add-table-form">
                    <div class="mb-3">
                        <label for="table-name" class="form-label">Nombre de la Mesa</label>
                        <input type="text" class="form-control" id="table-name" required>
                    </div>
                    <div class="mb-3">
                        <label for="table-capacity" class="form-label">Capacidad</label>
                        <input type="number" class="form-control" id="table-capacity" min="1" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Agregar Mesa</button>
                </form>
            </div>
            <div class="col-md-6">
                <h3>Mesas</h3>
                <div id="tables-container" class="d-flex flex-wrap">
                    <!-- Table cards will be added here dynamically -->
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <h3>Asignar Invitados a Mesas</h3>
                <div id="seating-assignment" class="d-flex flex-wrap">
                    <!-- Seating assignment interface will be added here -->
                </div>
            </div>
        </div>
    `;

    const addTableForm = document.getElementById('add-table-form');
    const tablesContainer = document.getElementById('tables-container');
    const seatingAssignment = document.getElementById('seating-assignment');

    addTableForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('table-name').value;
        const capacity = document.getElementById('table-capacity').value;

        const table = { name, capacity, guests: [] };
        let tables = JSON.parse(localStorage.getItem('tables')) || [];
        tables.push(table);
        localStorage.setItem('tables', JSON.stringify(tables));

        updateTables();
        addTableForm.reset();
    });

    function updateTables() {
        const tables = JSON.parse(localStorage.getItem('tables')) || [];
        tablesContainer.innerHTML = '';
        tables.forEach((table, index) => {
            const card = document.createElement('div');
            card.className = 'card m-2';
            card.style.width = '200px';
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${table.name}</h5>
                    <p class="card-text">Capacidad: ${table.capacity}</p>
                    <p class="card-text">Asignados: ${table.guests.length}</p>
                    <button class="btn btn-sm btn-danger" onclick="removeTable(${index})">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            `;
            tablesContainer.appendChild(card);
        });
        updateSeatingAssignment();
    }

    function updateSeatingAssignment() {
        const tables = JSON.parse(localStorage.getItem('tables')) || [];
        const guests = JSON.parse(localStorage.getItem('guests')) || [];
        seatingAssignment.innerHTML = '';

        tables.forEach((table, tableIndex) => {
            const tableDiv = document.createElement('div');
            tableDiv.className = 'card m-2';
            tableDiv.style.width = '200px';
            tableDiv.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${table.name}</h5>
                    <ul class="list-group" id="table-${tableIndex}">
                        ${table.guests.map(guest => `<li class="list-group-item">${guest}</li>`).join('')}
                    </ul>
                    <select class="form-select mt-2" onchange="assignGuest(${tableIndex}, this.value); this.value='';">
                        <option value="">Asignar invitado...</option>
                        ${guests.filter(guest => !tables.some(t => t.guests.includes(guest.name)))
                               .map(guest => `<option value="${guest.name}">${guest.name}</option>`).join('')}
                    </select>
                </div>
            `;
            seatingAssignment.appendChild(tableDiv);
        });
    }

    window.removeTable = function(index) {
        let tables = JSON.parse(localStorage.getItem('tables')) || [];
        tables.splice(index, 1);
        localStorage.setItem('tables', JSON.stringify(tables));
        updateTables();
    };

    window.assignGuest = function(tableIndex, guestName) {
        if (!guestName) return;
        let tables = JSON.parse(localStorage.getItem('tables')) || [];
        if (tables[tableIndex].guests.length < tables[tableIndex].capacity) {
            tables[tableIndex].guests.push(guestName);
            localStorage.setItem('tables', JSON.stringify(tables));
            updateTables();
        } else {
            alert('Esta mesa está llena. Por favor, elija otra mesa.');
        }
    };

    updateTables();
}

function loadTimeline() {
    const timelineSection = document.getElementById('timeline');
    timelineSection.innerHTML += `
        <div class="row mt-4">
            <div class="col-md-6">
                <h3>Agregar Tarea</h3>
                <form id="add-task-form">
                    <div class="mb-3">
                        <label for="task-name" class="form-label">Nombre de la Tarea</label>
                        <input type="text" class="form-control" id="task-name" required>
                    </div>
                    <div class="mb-3">
                        <label for="task-category" class="form-label">Categoría</label>
                        <select class="form-select" id="task-category" required>
                            <option value="">Seleccionar...</option>
                            <option value="planning">Planificación</option>
                            <option value="vendors">Proveedores</option>
                            <option value="attire">Vestimenta</option>
                            <option value="decor">Decoración</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="task-due-date" class="form-label">Fecha Límite</label>
                        <input type="date" class="form-control" id="task-due-date" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Agregar Tarea</button>
                </form>
            </div>
            <div class="col-md-6">
                <h3>Tareas Pendientes</h3>
                <ul id="task-list" class="list-group">
                    <!-- Task list items will be added here dynamically -->
                </ul>
            </div>
        </div>
    `;

    const addTaskForm = document.getElementById('add-task-form');
    const taskList = document.getElementById('task-list');

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('task-name').value;
        const category = document.getElementById('task-category').value;
        const dueDate = document.getElementById('task-due-date').value;

        const task = { name, category, dueDate, completed: false };
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        updateTaskList();
        addTaskForm.reset();
    });

    function updateTaskList() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`;
            li.innerHTML = `
                <span>
                    <strong>${task.name}</strong><br>
                    <small>${task.category} - Fecha límite: ${task.dueDate}</small>
                </span>
                <span>
                    <button class="btn btn-sm btn-${task.completed ? 'success' : 'secondary'}" onclick="toggleTaskStatus(${index})">
                        <i class="bi bi-check-circle${task.completed ? '-fill' : ''}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removeTask(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </span>
            `;
            taskList.appendChild(li);
        });
    }

    window.toggleTaskStatus = function(index) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskList();
    };

    window.removeTask = function(index) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskList();
    };

    updateTaskList();
}

function loadBanquet() {
    const banquetSection = document.getElementById('banquet');
    banquetSection.innerHTML += `
        <div class="row mt-4">
            <div class="col-md-6">
                <h3>Detalles del Banquete</h3>
                <form id="banquet-form">
                    <div class="mb-3">
                        <label for="banquet-venue" class="form-label">Lugar del Banquete</label>
                        <input type="text" class="form-control" id="banquet-venue" required>
                    </div>
                    <div class="mb-3">
                        <label for="banquet-date" class="form-label">Fecha del Banquete</label>
                        <input type="date" class="form-control" id="banquet-date" required>
                    </div>
                    <div class="mb-3">
                        <label for="banquet-time" class="form-label">Hora del Banquete</label>
                        <input type="time" class="form-control" id="banquet-time" required>
                    </div>
                    <div class="mb-3">
                        <label for="banquet-menu" class="form-label">Menú</label>
                        <textarea class="form-control" id="banquet-menu" rows="3" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="special-requirements" class="form-label">Requisitos Especiales</label>
                        <textarea class="form-control" id="special-requirements" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar Detalles del Banquete</button>
                </form>
            </div>
            <div class="col-md-6">
                <h3>Proveedores del Banquete</h3>
                <form id="add-vendor-form">
                    <div class="mb-3">
                        <label for="vendor-name" class="form-label">Nombre del Proveedor</label>
                        <input type="text" class="form-control" id="vendor-name" required>
                    </div>
                    <div class="mb-3">
                        <label for="vendor-service" class="form-label">Servicio</label>
                        <input type="text" class="form-control" id="vendor-service" required>
                    </div>
                    <div class="mb-3">
                        <label for="vendor-contact" class="form-label">Información de Contacto</label>
                        <input type="text" class="form-control" id="vendor-contact" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Agregar Proveedor</button>
                </form>
                <ul id="vendor-list" class="list-group mt-3">
                    <!-- Vendor list items will be added here dynamically -->
                </ul>
            </div>
        </div>
    `;

    const banquetForm = document.getElementById('banquet-form');
    const addVendorForm = document.getElementById('add-vendor-form');
    const vendorList = document.getElementById('vendor-list');

    banquetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const venue = document.getElementById('banquet-venue').value;
        const date = document.getElementById('banquet-date').value;
        const time = document.getElementById('banquet-time').value;
        const menu = document.getElementById('banquet-menu').value;
        const specialRequirements = document.getElementById('special-requirements').value;

        const banquetDetails = { venue, date, time, menu, specialRequirements };
        localStorage.setItem('banquetDetails', JSON.stringify(banquetDetails));
        alert('Detalles del banquete guardados exitosamente!');
    });

    addVendorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('vendor-name').value;
        const service = document.getElementById('vendor-service').value;
        const contact = document.getElementById('vendor-contact').value;

        const vendor = { name, service, contact };
        let vendors = JSON.parse(localStorage.getItem('vendors')) || [];
        vendors.push(vendor);
        localStorage.setItem('vendors', JSON.stringify(vendors));

        updateVendorList();
        addVendorForm.reset();
    });

    function updateVendorList() {
        const vendors = JSON.parse(localStorage.getItem('vendors')) || [];
        vendorList.innerHTML = '';
        vendors.forEach((vendor, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span>
                    <strong>${vendor.name}</strong> - ${vendor.service}<br>
                    <small>${vendor.contact}</small>
                </span>
                <button class="btn btn-sm btn-danger" onclick="removeVendor(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            vendorList.appendChild(li);
        });
    }

    window.removeVendor = function(index) {
        let vendors = JSON.parse(localStorage.getItem('vendors')) || [];
        vendors.splice(index, 1);
        localStorage.setItem('vendors', JSON.stringify(vendors));
        updateVendorList();
    };

    // Load saved banquet details if available
    const savedBanquetDetails = JSON.parse(localStorage.getItem('banquetDetails'));
    if (savedBanquetDetails) {
        document.getElementById('banquet-venue').value = savedBanquetDetails.venue;
        document.getElementById('banquet-date').value = savedBanquetDetails.date;
        document.getElementById('banquet-time').value = savedBanquetDetails.time;
        document.getElementById('banquet-menu').value = savedBanquetDetails.menu;
        document.getElementById('special-requirements').value = savedBanquetDetails.specialRequirements;
    }

    updateVendorList();
}

