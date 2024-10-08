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
        <script src="../assets/javascript/utils.js"></script>
        <script src="../assets/javascript/auth.js"></script>
        <script src="../assets/javascript/corse.js"></script>
        <script src="../assets/javascript/utenti.js"></script>
        <script src="../assets/javascript/esecuzioni.js"></script>
        <script src="assegnazione-utenti.js" defer></script>
        <link href="../assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="../assets/css/gestione-corse.css" rel="stylesheet" type="text/css"/>
        <title>La tua Dashboard</title>
    </head>
    <body>
        <script>
            fetchLoginData();
        </script>
        <!-- i888eddf8 -->
         <button onclick="back()" class="text-btn"><< Torna alla gestione delle corse</button>

        <h1 id="page-title"></h1>
        <section id="users-container"></section>
        <hr>
        <section id="assign-user-section">
            <h2>Assegna un utente</h2>
            <form id="assignUserForm">
                <select id="user-select"></select>
                <container class="switch-container">
                    <label>Addetto raccolta</label>
                    <label class="switch" onclick="toggleSwitch()">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                    <label>Guidatore</label>
                </container>
            </form>
            <button onclick="assignUser()"">Assegna</button>
        </section>
        
    </body>
</html>