<?php
$apiUrl = 'https://xweymuycrivnwklxqhwq.supabase.co/rest/v1';
$apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXltdXljcml2bndrbHhxaHdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTc2NDM4MSwiZXhwIjoyMDM1MzQwMzgxfQ.jG4noxmSFQgQPBZ4G6b6AWtzcu5SxwBTVnR5L9gGJq0';
$nome = ''
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="jquery.js"></script>
        <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
        <script src="assets/javascript/common.js"></script>
        <script src="assets/javascript/auth.js"></script>
        <script src="assets/javascript/utenti.js"></script>
        <script src="dashboard.js" defer></script>
        <link href="assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="assets/css/dashboard.css" rel="stylesheet" type="text/css"/>
        <title>La tua Dashboard</title>
    </head>
    <body>
        <script>
            fetchLoginData();
        </script>
        <header>
            <h1>ASGR - Dashboard</h1>
        </header>

        <div class="user-page-container">
            <section>
                <h1 id="userData" class=user-name></h1>
                <p id="userEmail"></p>
                <p id="userType"></p>
            </section>
            <section>
                <button onclick="redirectToPage('turni.php', getLoginInfo())">Il mio calendario lavorativo</button>
                <!-- <button onclick="redirectToPage('accettazione-smaltimento.php', getLoginInfo())">Accettazione / smaltimento rifiuti</button> -->
                <button onclick="redirectToPage('esecuzione', getLoginInfo())">Esecuzione corse</button>
                <button onclick="redirectToPage('gestione-corse', getLoginInfo())">Gestione corse</button>
                <button onclick="redirectToPage('gestione-rotte', getLoginInfo())">Gestione rotte</button>
                <button onclick="redirectToPage('magazzino.php', getLoginInfo())">Magazzino</button>
                <button onclick="redirectToPage('statistiche', getLoginInfo())">Statistiche aziendali</button>
            </section>
        </div>
    </body>
</html>