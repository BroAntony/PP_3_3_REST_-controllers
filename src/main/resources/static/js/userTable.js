function loadHtmlContent(url, containerId) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
}


loadHtmlContent('/user/userTable.html', 'contentTableContainer')
    .then(() => {
        return fetch('/api')
            .then(response => response.json())
            .then(user => {
                const userTableBody = document.getElementById('userTableBody');
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.roleName).join(' ')}</td>
                `;
                userTableBody.appendChild(row);
            })
            .catch(error => console.error('Error fetching user data:', error));
    });