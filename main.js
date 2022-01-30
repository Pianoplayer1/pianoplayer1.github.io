document.getElementById('treasury').addEventListener('input', treasury)
document.getElementById('double').addEventListener('click', double)

function treasury(e) {
    if (!e.target.validity.valid) {
        e.target.style.borderColor = 'red';
    } else {
        e.target.style.borderColor = '';
        update()
    }
}

function double(e) {
    update()
}

function update() {
    const table = document.getElementById('output');
    while(table.rows.length > 1) {
        table.deleteRow(1);
    }
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 4; j++) {
            if (i == 0 && j == 0) continue;
            let multiplier = (4 + 2 * i) / (4 - j) * (1 + parseFloat(document.getElementById('treasury').value) / 100);
            console.log(parseFloat(document.getElementById('treasury')));
            if (document.getElementById('double').checked) {
                multiplier *= 2;
            }

            let cost = i == 0 ? 0 : Math.pow(2, i - 1) * 6000;
            switch (j) {
                case 3:
                    cost += 14000;
                case 2:
                    cost += 12000;
                case 1:
                    cost += 6000;
            }

            const row = table.getElementsByTagName('tbody')[0].insertRow()
            row.insertCell().innerHTML = i
            row.insertCell().innerHTML = j
            row.insertCell().innerHTML = cost
            row.insertCell().innerHTML = (multiplier * 3600).toFixed(0)
            row.insertCell().innerHTML = ((multiplier - 1) * 360000 / cost).toFixed(2)
        }
    }

    const th = document.getElementById('eff')
    Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th)))
        .forEach(tr => table.appendChild(tr) );
    
    while(table.rows.length > 11) {
        table.deleteRow(11);
    }
}

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(b, idx), getCellValue(a, idx));

update()