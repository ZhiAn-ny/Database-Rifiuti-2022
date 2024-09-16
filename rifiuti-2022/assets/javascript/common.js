
const supabaseUrl = 'https://xweymuycrivnwklxqhwq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXltdXljcml2bndrbHhxaHdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTc2NDM4MSwiZXhwIjoyMDM1MzQwMzgxfQ.jG4noxmSFQgQPBZ4G6b6AWtzcu5SxwBTVnR5L9gGJq0';
const { createClient } = supabase
const _supabase = createClient(supabaseUrl, supabaseKey);
const baseProjectDir = '/Database-Rifiuti-2022/rifiuti-2022/'

function getSupabase() {
    return _supabase;
}

async function redirectToPage(url, data = "", extra_data = "") {
    sessionStorage.setItem('loginInfo', JSON.stringify(data));
    sessionStorage.setItem('extraData', JSON.stringify(extra_data));
    window.location.href = url;
}

async function redirectToPageGlobal(url, data = "", extra_data = "") {
    sessionStorage.setItem('loginInfo', JSON.stringify(data));
    sessionStorage.setItem('extraData', JSON.stringify(extra_data));
    window.location.href = baseProjectDir + url;
}

async function redirectPreviousPage(data = "", extra_data = "") {
    sessionStorage.setItem('loginInfo', JSON.stringify(data));
    sessionStorage.setItem('extraData', JSON.stringify(extra_data));
    window.history.back();
}

/** @requires toastr */
function toastSuccess(text) {
    toastr.success(text);
}
/** @requires toastr */
function toastError(text) {
    toastr.error(text);
}

/** If an error occurred, toast the error's details and return null.
 * Else return the data.
 */
function dataOrNull(res) {
    if (res.error) {
        toastError(res.error.details);
        return null;
    } else {
        return res.data;
    }
}