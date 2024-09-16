// TABLES

function refreshTables(tables_loadFuncs) {
    for (const table_loadFunc of tables_loadFuncs) {
        table_loadFunc.table.innerHTML = '';
        table_loadFunc.function;
    }
}

function createTableHeader(table, columnNames) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    columnNames.forEach(name => {
        const th = document.createElement('th');
        th.textContent = name;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.insertBefore(thead, table.firstChild);
}

function addCell(row, item, hidden = false) {
    const cell = document.createElement('td');
    if (hidden) {
        cell.style.display = 'none';
    }
    if (row.classList.length > 0) {
        row.classList.forEach(c => cell.classList.add(c));
    }
    cell.textContent = item;
    row.appendChild(cell);
}

function addButtonCell(row, text, function_on_press, button) {
    const cell = document.createElement('td');
    button.textContent = text;
    cell.appendChild(button);
    button.onclick = function_on_press;
    row.appendChild(cell);
    return button;
}

function addDropdownCell(row, defaultValue, options, id) {
    const cell = document.createElement('td');
    const select = document.createElement('select');
    select.id = id;

    const defaultOption = document.createElement('option');
    defaultOption.value = defaultValue.value;
    defaultOption.text = defaultValue.text;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    options.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.text = optionData.text;
        select.appendChild(option);
    });

    cell.appendChild(select);
    row.appendChild(cell);
    return select;
}

function updateColumnValue(table, id, columnIndex, newValue, operation) {
    const rows = table.querySelectorAll('tr');
    let result = false;
    rows.forEach(row => {
        const tds = row.querySelectorAll('td');
        if (tds.length > 0 && tds[0].innerText == id) {
            if (operation != undefined) {
                operation(tds, newValue);
            } else {
                tds[columnIndex].innerText = newValue;
            }
            result = true;
        }
    });
    return result;
}

// DROPDOWNS

function createDropdown(id, options, container) {
    const select = document.createElement('select');
    select.id = id;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select an option';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    options.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.text = optionData.text;
        select.appendChild(option);
    });

    container.appendChild(select);
}

const options = [
    { value: 'option1', text: 'Option 1' },
    { value: 'option2', text: 'Option 2' },
    { value: 'option3', text: 'Option 3' }
];

function addDefaultOption(text, ddl) {
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = text;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    ddl.appendChild(defaultOption);
}

function addOption(value, text, ddl) {
    const defaultOption = document.createElement('option');
    defaultOption.value = value;
    defaultOption.text = text;
    ddl.appendChild(defaultOption);
}

// DATA TYPES

function formatDate(data) {
    const date = new Date(data);
    const formattedDate = date.toLocaleDateString('eu', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    return formattedDate;
}

function booleanToTicks(bool) {
    return bool ? '\u2705' : '\u274C';
}

// DIALOG

function createDialogFrom(elementId, extraStyle = "") {
    const container = document.getElementById(elementId);
    let style = "height: 200px; width: 70%;" 
        + "background: var(--primary-color-m);"
        + "position: fixed;"
        + "top: 40px; left: 15%;"
        + "border: 1px solid rgba(255, 255, 255, 0.18);"
        + "border-radius: 10px;"
        + "backdrop-filter: blur(5px);"
        + "box-shadow: 0 8px 32px 0 rgba(14, 61, 39, 0.37);"
        + "overflow: auto;"
        + "flex-direction: column;"
        + "gap: 2%;"
        + "padding: 2%;" + extraStyle;
    container.setAttribute("style", style);
    container.hidden = true;
}

/** Be sure to call `createDialogFrom()` to initialize the dialog.
 * @returns a promise indicating if the container is visible.
 * */
function toggleDialog(elementId) {
    const container = document.getElementById(elementId);
    container.hidden = !container.hidden;
    if (!container.hidden) {
        container.style.display = "flex";
        let closeBtn = document.createElement('button');
        closeBtn.innerText = 'X'
        closeBtn.classList.add('close-btn');
        closeBtn.onclick = () => toggleDialog(elementId);
        container.appendChild(closeBtn);
    } else {
        container.style.display = "none";
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    return new Promise(function(resolve, reject) {
        resolve(!container.hidden);
    });
}
