async function getAllCamion() {
    const {data, error} = await getSupabase()
        .from('Camion')
        .select();
    if (error) console.error(error)
    else return data
}

function deleteCamion(camion) {
    return getSupabase()
        .from('Camion')
        .delete()
        .eq('targa', camion.targa)
        .then(res => dataOrNull(res));
}