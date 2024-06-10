function loadHtmlContent(url, containerId) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                document.getElementById(containerId).innerHTML = html;
                resolve(); // Разрешаем промис после успешной загрузки HTML
            })
            .catch(error => {
                console.error(`Error loading ${url}:`, error);
                reject(error);
            });
    });
}

function loadModal(url, containerId, callback) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
            const modalElement = document.querySelector('.modal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                if (callback) callback(modal);
            } else {
                console.error('Modal element not found');
            }
        })
        .catch(error => console.error('Error loading modal:', error));
}

function updateTableRow(user) {
    const row = document.getElementById(`userRow-${user.id}`);
    if (!row) {
        console.error(`Row with ID userRow-${user.id} not found`);
        return;
    }
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.age}</td>
        <td>${user.email}</td>
        <td>${user.roles.map(role => role.roleName).join(' ')}</td>
        <td>
            <a class="btn btn-primary" id="editBtn-${user.id}">Edit</a>
        </td>
        <td>
            <a class="btn btn-danger" id="deleteBtn-${user.id}">Delete</a>
        </td>
    `;


    document.getElementById(`editBtn-${user.id}`).addEventListener('click', function () {
        editUser(user);
    });

    document.getElementById(`deleteBtn-${user.id}`).addEventListener('click', function () {
        deleteUser(user);
    });
}

function deleteUser(user) {
    loadModal('/admin/deleteModal.html', 'modalContainer', (modal) => {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const ageInput = document.getElementById('age');
        const emailInput = document.getElementById('email');
        if (firstNameInput && lastNameInput && ageInput && emailInput) {
            firstNameInput.value = user.firstName;
            lastNameInput.value = user.lastName;
            ageInput.value = user.age;
            emailInput.value = user.email;
        } else {
            console.error('One or more input elements not found');
        }

        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        confirmDeleteBtn.removeEventListener('click', confirmDeleteHandler);
        confirmDeleteBtn.addEventListener('click', confirmDeleteHandler);

        function confirmDeleteHandler() {
            fetch(`/api/users/${user.id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        const row = document.getElementById(`userRow-${user.id}`);
                        if (row) {
                            row.remove();
                        }
                        modal.hide();
                    } else {
                        console.error(`Error deleting user ${user.id}`);
                    }
                })
                .catch(error => console.error('Error deleting user:', error));
        }
    });
}

function editUser(user) {
    loadModal('/admin/editModal.html', 'modalContainer', (modal) => {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const ageInput = document.getElementById('age');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const roleCheckboxes = document.querySelectorAll('input[name="roles"]');

        if (firstNameInput && lastNameInput && ageInput && emailInput && passwordInput && roleCheckboxes) {
            firstNameInput.value = user.firstName;
            lastNameInput.value = user.lastName;
            ageInput.value = user.age;
            emailInput.value = user.email;
            // passwordInput.value = user.password;

            roleCheckboxes.forEach(checkbox => {
                checkbox.checked = user.roles.some(role => role.roleName === checkbox.value);
            });
        } else {
            console.error('One or more input elements not found');
        }

        const confirmEditBtn = document.getElementById('confirmEditBtn');
        confirmEditBtn.removeEventListener('click', confirmEditHandler);
        confirmEditBtn.addEventListener('click', confirmEditHandler);


        function confirmEditHandler() {
            const selectedRoles = Array.from(roleCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => ({ roleName: checkbox.value }));
            if (selectedRoles.length === 0) {
                alert('Роли, Вася, роли забыл!');
                return;
            }

            const updatedUser = {
                id: user.id,
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                age: ageInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                roles: selectedRoles
            };
            console.log("Отправляемый JSON:", JSON.stringify(updatedUser));

            fetch(`/api/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            })
                .then(response => response.json())
                .then(updatedUser => {
                    if (updatedUser) {
                        updateTableRow(updatedUser);
                        modal.hide();
                    } else {
                        console.error(`Error updating user ${user.id}`);
                    }
                })
                .catch(error => console.error('Error updating user:', error));
        }
    });
}

// Загрузка таблицы пользователей
function loadUserTable() {
    return fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const userTableBody = document.getElementById('adminTableBody');
            userTableBody.innerHTML = ''; // Очищаем таблицу перед загрузкой данных
            users.forEach(user => {
                const row = document.createElement('tr');
                row.id = `userRow-${user.id}`;
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.roleName).join(' ')}</td>
                    <td>
                        <a class="btn btn-primary" id="editBtn-${user.id}">Edit</a>
                    </td>
                    <td>
                        <a class="btn btn-danger" id="deleteBtn-${user.id}">Delete</a>
                    </td>
                `;
                userTableBody.appendChild(row);

                document.getElementById(`editBtn-${user.id}`).addEventListener('click', function () {
                    editUser(user);
                });

                document.getElementById(`deleteBtn-${user.id}`).addEventListener('click', function () {
                    deleteUser(user);
                });
            });
        })
        .catch(error => console.error('Error fetching user data:', error));
}

loadHtmlContent('/admin/adminTable.html', 'contentTableContainer')
    .then(() => {
        return loadUserTable();
    })
    .then(() => {
        document.getElementById('new-user-tab').addEventListener('click', function () {
            loadHtmlContent('/admin/newFormBody.html', 'newFormBody')
                .then(() => {
                    console.log('New User form loaded successfully');
                    const newUserForm = document.querySelector('#new-user form');
                    newUserForm.addEventListener('submit', function (event) {
                        event.preventDefault();

                        // Проверка, выбрана ли хотя бы одна роль
                        const selectedRoles = Array.from(document.querySelectorAll('input[name="newroles"]:checked'));
                        if (selectedRoles.length === 0) {
                            alert('Роли, Вася, роли забыл!');
                            return;
                        }

                        const newUser = {
                            firstName: document.getElementById('newFirstName').value,
                            lastName: document.getElementById('newLastName').value,
                            age: document.getElementById('newAge').value,
                            email: document.getElementById('newEmail').value,
                            password: document.getElementById('newPassword').value,
                            roles: selectedRoles.map(checkbox => ({roleName: checkbox.value}))
                        };
                        console.log("Отправляемый JSON:", JSON.stringify(newUser));

                        fetch('/api/users', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newUser)
                        })
                            .then(response => response.json())
                            .then(newUser => {
                                if (newUser) {
                                    loadUserTable();
                                    document.getElementById('newUserForm').reset();
                                    const usersTab = new bootstrap.Tab(document.getElementById('users-tab'));
                                    usersTab.show();
                                } else {
                                    console.error('Error creating user');
                                }
                            })
                            .catch(error => console.error('Error creating user:', error));
                    });
                })
                .catch(error => {
                    console.error('Error loading New User form:', error);
                });
        });
    })
    .catch(error => {
        console.error('Error loading admin table:', error);
    });