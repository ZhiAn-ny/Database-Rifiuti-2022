async function loginSito() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('pass').value;

    const { data, error } = await getSupabase()
        .from('Utenti')
        .select()
        .eq('email', email)
        .single();

    if (data.password == password) {
        console.log('Logged in!');
        redirectToPage('dashboard.php', data)
    }
    else {
        console.log('Wrong password!');
    }

}

function getLoginInfo() {
    const data = JSON.parse(sessionStorage.getItem('loginInfo'));
    return data;
}

function fetchLoginData() {
    const data = getLoginInfo();
    if (!data) {
        redirectToPage('login.php');
    }
}

function getExtraData() {
    const data = JSON.parse(sessionStorage.getItem('extraData'));
    return data;
}
