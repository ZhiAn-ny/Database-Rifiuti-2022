async function fetchStabilimenti(tipologie = []) {
    const { data, error } = await getSupabase()
    .from('Stabilimenti')
    .select()
    .in('tipo', tipologie);
    if (error) console.error(error)
    else return data
}

function fetchAllStabilimenti() {
    return getSupabase()
        .from('Stabilimenti')
        .select()
        .then(res => dataOrNull(res));
}

async function fetchStabilimentoByID_Zona_Comune(codiceinput, zona, comune) {
    const { data, error } = await getSupabase()
        .rpc('get_stabilimento_info', { stabilimento_code: codiceinput, zona_input: zona, comune_input: comune })
        .single();
    if (error) console.error(error)
    else return data
}

async function handleStabilimentiDropdown() {
    const select = document.getElementById('stabilimentiSelect');

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Scegli uno stabilimento';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    const stabilimentiDisponibili = await fetchStabilimenti([5, 3]);
    stabilimentiDisponibili.forEach(stabilimento => {
        const option = document.createElement('option');
        option.value = stabilimento.codice + "," + stabilimento.zona + "," + stabilimento.comune;
        option.text = stabilimento.descrizione;
        select.appendChild(option);
    });
}

