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

function addCell(row, item) {
    const cell = document.createElement('td');
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

