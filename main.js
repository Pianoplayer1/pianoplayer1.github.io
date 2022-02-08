document.getElementById('treasury').addEventListener('input', treasury);
document.getElementById('double').addEventListener('click', update);
document.getElementById('storage').addEventListener('click', update);

function treasury(e) {
    if ((e.target.value === '' ? '0' : e.target.value).match(/^\d{1,2}(?:[.,]\d{1,2})?$/)) {
        e.target.style.borderColor = '';
        update();
    } else {
        e.target.style.borderColor = 'red';
    }
}

function update() {
    const tbody = document.querySelector('.output tbody');
    while (tbody.rows.length) {
        tbody.deleteRow(0);
    }
    let thead = document.querySelector('.output thead');
    if (document.getElementById('storage').checked) {
        if (thead.querySelector('th').innerText !== 'Res. St.') {
            thead.querySelector('tr').insertCell(0).outerHTML = '<th>Res. St.</th>'
        }
    } else if (thead.querySelector('th').innerText === 'Res. St.') {
        thead.querySelector('th').remove();
    }

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 4; j++) {
            if (i === 0 && j === 0) continue;
            let treasury = parseFloat(document.getElementById('treasury').value);
            let multiplier = (4 + 2 * i) / (4 - j)
                * (1 + (isNaN(treasury) ? 0 : treasury) / 100)
                * (document.getElementById('double').checked ? 2 : 1);

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
            row.insertCell().innerText = ((multiplier - 1) * 360000 / cost).toFixed(2);
        }
    }

    const th = thead.querySelector('th:last-child');
    Array.from(tbody.querySelectorAll('tr:nth-child(n+1)'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th)))
        .forEach(tr => tbody.appendChild(tr));

    while (tbody.rows.length > 10) {
        tbody.deleteRow(10);
    }

    for (let row of tbody.rows) {
        row.querySelector(':last-child').innerText += '%';
    }
}

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(getCellValue(b, idx), getCellValue(a, idx));

update();