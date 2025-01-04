async function fetchRifiuti() {
    const { data, error } = await getSupabase()
        .from('Rifiuti')
        .select()
        .order('descrizione', { ascending: true });
    if (error) console.error(error)
    else return data;
}

async function fetchRifiutiGenerici() {
    const { data, error } = await _supabase
        .rpc('get_rifiuti_generici', '')
    if (error) console.error(error);
    else return data;
}

async function fetchRifiutiByLotto(lotto) {
    const { data, error } = await getSupabase()
        .rpc('get_rifiuti_lotto', { lotto_input: lotto })
    if (error) console.error(error)
    else return data
}

async function handleRifiutiDropdown() {
    const select = document.getElementById('rifiutiSelect');

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Scegli un rifiuto';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    const rifiutiDisponibili = await fetchRifiutiGenerici();
    rifiutiDisponibili.forEach(rifiuto => {
        const option = document.createElement('option');
        option.value = rifiuto.tipologia_id;
        option.text = rifiuto.tipologia_des;
        select.appendChild(option);
    });
}

function getRifiutiStorageStats() {
    return getSupabase()
        .rpc('get_storage_stats', {  })
        .then(res => dataOrNull(res));
}
