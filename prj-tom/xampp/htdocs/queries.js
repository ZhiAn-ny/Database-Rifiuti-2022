const supabaseUrl = 'https://xweymuycrivnwklxqhwq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXltdXljcml2bndrbHhxaHdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTc2NDM4MSwiZXhwIjoyMDM1MzQwMzgxfQ.jG4noxmSFQgQPBZ4G6b6AWtzcu5SxwBTVnR5L9gGJq0';
const { createClient } = supabase
const _supabase = createClient(supabaseUrl, supabaseKey);

async function callRpcFunction()
{
    // const { data, error } = await _supabase
    // .rpc('viewStabilimenti');
    const { data, error } = await _supabase
    .from('Stabilimenti')
    .select();

    if (error) {
        document.getElementById('rpcResult').textContent = 'Error: ' + error.message;
        return;
    }
    console.log(data);
    //document.getElementById('rpcResult').textContent = JSON.stringify(data, null, 2);
    
    let resultsTable = document.getElementById('resultsTable');
    data.forEach(item => {
        const newRow = document.createElement('tr');

        const indirizzoCell = document.createElement('td');
        indirizzoCell.textContent = item.indirizzo;
        newRow.appendChild(indirizzoCell);

        const descrizioneCell = document.createElement('td');
        descrizioneCell.textContent = item.descrizione;
        newRow.appendChild(descrizioneCell);

        resultsTable.appendChild(newRow);
    });
}
