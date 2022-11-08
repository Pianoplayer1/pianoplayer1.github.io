if (localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'));
    if (localStorage.getItem('theme') === 'light') {
        document.getElementById('theme').checked = true;
    }
}
document.getElementById('theme').addEventListener('change',e => {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});


document.getElementById('treasury').addEventListener('input', treasury);
document.getElementById('double').addEventListener('click', () => update());
document.getElementById('storage').addEventListener('click', () => update());

document.querySelectorAll('th').forEach(th => th.addEventListener('click', () => {
    update(th);
}))

function treasury(e) {
    if ((e.target.value === '' ? '0' : e.target.value).match(/^\d{1,2}(?:[.,]\d{1,2})?$/)) {
        e.target.classList.remove('invalid');
        update();
    } else {
        e.target.classList.add('invalid');
    }
}

function update(columnToSortBy) {
    const tbody = document.querySelector('.output tbody');
    while (tbody.rows.length) {
        tbody.deleteRow(0);
    }
    const thead = document.querySelector('.output thead');
    if (columnToSortBy === undefined) {
        Array.from(thead.querySelectorAll('th')).forEach(th => th.classList.remove('reversed'))
        columnToSortBy = thead.querySelector('th:last-child');
        columnToSortBy.classList.add('reversed')
    }
    if (document.getElementById('storage').checked) {
        if (thead.querySelector('th').innerText !== 'Res. St.') {
            thead.querySelector('tr').insertCell(0).outerHTML = '<th>Res. St.</th>'
        }
    } else if (thead.querySelector('th').innerText === 'Res. St.') {
        thead.querySelector('th').remove();
    }

    const double = document.getElementById('double').checked
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 4; j++) {
            if (i === 0 && j === 0) continue;
            let treasury = parseFloat(document.getElementById('treasury').value);
            let multiplier = (4 + 2 * i) / (4 - j) * (1 + (isNaN(treasury) ? 0 : treasury) / 100) * (double ? 2 : 1);

            let cost = (i === 0 ? 0 : Math.pow(2, i) * 3000) + [0, 6000, 18000, 32000][j];

            const row = tbody.insertRow();
            if (document.getElementById('storage').checked) {
                let storageLevel = 0;
                while (multiplier > 5 * Math.pow(2, storageLevel)) {
                    storageLevel++;
                }
                cost += [0, 400, 800, 2000, 5000, 16000, 48000][storageLevel]
                row.insertCell().innerText = storageLevel.toString();
            }
            row.insertCell().innerText = i.toString();
            row.insertCell().innerText = j.toString();
            row.insertCell().innerText = cost.toString();
            row.insertCell().innerText = (multiplier * 3600).toFixed(0);
            row.insertCell().innerText = (100 * (multiplier - (double ? 2 : 1)) * 3600 / cost).toFixed(2);
        }
    }

    const columnIndex = Array.from(columnToSortBy.parentNode.children).indexOf(columnToSortBy)
    Array.from(tbody.querySelectorAll('tr:nth-child(n+1)'))
        .sort((row1, row2) => {
            let value1 = row1.children[columnIndex].innerText || row1.children[columnIndex].textContent;
            let value2 = row2.children[columnIndex].innerText || row2.children[columnIndex].textContent;
            return columnToSortBy.classList.contains('reversed') ? value2 - value1 : value1 - value2;
        })
        .forEach(tr => tbody.appendChild(tr));
    columnToSortBy.classList.toggle('reversed')

    while (tbody.rows.length > 10) {
        tbody.deleteRow(10);
    }

    for (let row of tbody.rows) {
        row.querySelector(':last-child').innerText += '%';
    }
}

update();