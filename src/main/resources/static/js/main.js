document.getElementById('logoutButton').addEventListener('click', function () {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/login';
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => console.error('Error during logout:', error));
});

let user;
let scriptSrc;

function loadScript(scriptSrc) {
    const script = document.createElement('script');
    script.src = scriptSrc;
    document.body.appendChild(script);
}
function setActiveButton(activeBtn, inactiveBtn) {
    activeBtn.classList.remove('btn-secondary');
    activeBtn.classList.add('btn-primary');
    inactiveBtn.classList.remove('btn-primary');
    inactiveBtn.classList.add('btn-secondary');
}

fetch('/api')
    .then(response => response.json())
    .then(data => {
        user = data;
        const isAdmin = user.authorities.some(role => role.authority === "ROLE_ADMIN");

        const userEmailElement = document.querySelector('#userEmail');
        userEmailElement.textContent = user.email;

        const userRolesElement = document.querySelector('#userRoles');
        userRolesElement.textContent = user.roles.map(role => role.roleName).join(', ');


        if (isAdmin) {
            loadScript("/js/adminTable.js");
            fetch('admin/adminPanel.html')
                .then(response => response.text())
                .then(html => {
                    document.getElementById('adminPanelContainer').innerHTML = html;
                    setActiveButton(document.getElementById('adminBtn'), document.getElementById('userBtn'));
                    document.getElementById('adminBtn').addEventListener('click', function () {
                        fetch('admin/adminTable.html')
                            .then(response => response.text())
                            .then(html => {
                                document.getElementById('contentTableContainer').innerHTML = html;
                            })
                        loadScript("/js/adminTable.js");
                        setActiveButton(document.getElementById('adminBtn'), document.getElementById('userBtn'));
                    });
                    document.getElementById('userBtn').addEventListener('click', function () {
                        fetch('user/userTable.html')
                            .then(response => response.text())
                            .then(html => {
                                document.getElementById('contentTableContainer').innerHTML = html;
                            })
                        loadScript("/js/userTable.js");
                        setActiveButton(document.getElementById('userBtn'), document.getElementById('adminBtn'));
                    });
                })
                .catch(error => console.error('Error loading admin panel:', error));
        } else {
            fetch('user/userPanel.html')
                .then(response => response.text())
                .then(html => {
                    document.getElementById('userPanelContainer').innerHTML = html;
                })
                .catch(error => console.error('Error loading admin panel:', error));
            loadScript("/js/userTable.js");
        }
    })
    .catch(error => console.error('Error fetching user data:', error));