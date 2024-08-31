function getSupabase() {
    const supabaseUrl = 'https://xweymuycrivnwklxqhwq.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXltdXljcml2bndrbHhxaHdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTc2NDM4MSwiZXhwIjoyMDM1MzQwMzgxfQ.jG4noxmSFQgQPBZ4G6b6AWtzcu5SxwBTVnR5L9gGJq0';
    const { createClient } = supabase
    return createClient(supabaseUrl, supabaseKey);
}

async function redirectToPage(url, data = "", extra_data = "") {
    sessionStorage.setItem('loginInfo', JSON.stringify(data));
    sessionStorage.setItem('extraData', JSON.stringify(extra_data));
    window.location.href = url;
}

async function redirectPreviousPage(data = "", extra_data = "") {
    sessionStorage.setItem('loginInfo', JSON.stringify(data));
    sessionStorage.setItem('extraData', JSON.stringify(extra_data));
    window.history.back();
}