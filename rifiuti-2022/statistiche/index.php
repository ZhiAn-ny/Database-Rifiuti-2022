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
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="../assets/javascript/common.js"></script>
        <script src="../assets/javascript/auth.js"></script>
        <script src="../assets/javascript/utils.js"></script>
        <script src="../assets/javascript/rifiuti.js"></script>
        <script src="../assets/javascript/utenti.js"></script>
        <script src="statistiche.js" defer></script>
        <link href="../assets/css/global.css" rel="stylesheet" type="text/css"/>
        <title>Statistiche aziendali</title>
    </head>
    <body>
        <script>
            fetchLoginData();
        </script>
        <button class="text-btn full-width"
            onclick="redirectToPageGlobal('dashboard.php', getLoginInfo())" 
        ><< Torna alla dashboard</button>

        <h1>Statistiche aziendali</h1>
        
        <section class="flex-row">
            <div>
                <h2>Statistiche rifiuti</h2>
                <h3>Rifiuti trattati</h3>
                <label for="rxt-viz-select">Filtra per stabiliemnto:</label>
                <select id="rxt-viz-select" onchange="filterData()"></select>

                <p id="peso-totale">Peso dei totale dei rifiuti trattati:</p>
            </div>
            <div id="chart-container">
                <!-- <div class="spinner"></div> -->
                <!-- <canvas id="rifiuti-x-tipologie"></canvas> -->
            </div>
        </section>
        
        <section>
            <h2>Statistiche utenti</h2>
            <div id="user-chart-container">
                <canvas id="user-chart" style="max-height: 500px"></canvas>
            </div>
        </section>
    </body>
</html>