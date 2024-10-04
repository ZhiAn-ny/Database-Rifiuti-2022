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
        <script src="../jquery.js"></script>
        <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
        <script src="../assets/javascript/common.js"></script>
        <script src="../assets/javascript/auth.js"></script>
        <script src="../assets/javascript/utils.js"></script>
        <script src="../assets/javascript/corse.js"></script>
        <script src="../assets/javascript/rotte.js"></script>
        <script src="../assets/javascript/camion.js"></script>
        <script src="../assets/javascript/carichi.js"></script>
        <script src="../assets/javascript/magazzino.js"></script>
        <script src="gestione-corse.js" defer></script>
        <link href="../assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="../assets/css/gestione-corse.css" rel="stylesheet" type="text/css"/>
        <title>Gestione corse</title>
    </head>
    <body>
        <script>
            fetchLoginData();
        </script>
        <!-- i888eddf8 -->
        <div id="caricoPopup"></div>
        <div id="routePopup"></div>
        
        <button class="text-btn full-width"
            onclick="redirectToPageGlobal('dashboard.php', getLoginInfo())" 
        ><< Torna alla dashboard</button>

        <h1>Gestione corse</h1>
        <section>
            <h2>Aggiungi una nuova corsa</h2>
            <form id="addCorsaForm">
                <div calss="dateControl">
                    <label for="data">Data</label>
                    <input type="date" name="data" id="data" required>
                    <label for="ora">Ora</label>
                    <input type="time" name="ora" id="ora" required>
                </div>
                <div>
                    <label for="camionDdl">Camion</label>
                    <select name="camionDdl" id="camionDdl" required></select>
                    <label for="routesDdl">Rotta</label>
                    <select name="routesDdl" id="routesDdl" required></select>
                </div>
            </form>
            <button onclick="addCorsa()">Aggiungi</button>
        </section>
        <section>
            <h2>Lista corse</h2>
            <div id="corse-list-container">
                <div class="corse-header">
                    <span>Data</span>
                    <span>Camion</span>
                    <span>Lotto</span>
                    <span>Rotta</span>
                    <span></span>
                </div>
                <div id="corse-list"></div>
            </div>
        </section>

    </body>
</html>