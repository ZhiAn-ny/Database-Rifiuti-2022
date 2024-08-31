async function getAllCamion() {
    const {data, error} = await getSupabase()
        .from('Camion')
        .select();
    if (error) console.error(error)
    else return data
}
