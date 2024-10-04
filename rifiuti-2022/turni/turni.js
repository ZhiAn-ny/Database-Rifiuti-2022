
function fetchTurni() {
    let start = document.getElementById('da').value;
    let end = document.getElementById('a').value
    start = start == '' ? new Date('2000-01-01') : new Date(start);
    end = end == '' ? new Date('2100-01-01') : new Date(end);
    fetchTurniTable(start, end);
}