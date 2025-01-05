<?php
$apiUrl = 'https://xweymuycrivnwklxqhwq.supabase.co/rest/v1';
$apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXltdXljcml2bndrbHhxaHdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTc2NDM4MSwiZXhwIjoyMDM1MzQwMzgxfQ.jG4noxmSFQgQPBZ4G6b6AWtzcu5SxwBTVnR5L9gGJq0';
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
        <script src="../assets/javascript/utenti.js"></script>
        <script src="../assets/javascript/camion.js"></script>
        <script src="amministrazione.js" defer></script>
        <link href="../assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="../assets/css/amministrazione.css" rel="stylesheet" type="text/css"/>
        <title>Amministrazione Sistema</title>
    </head>
    <body>
        <script>
            fetchLoginData();
        </script>
        
        <section>
            <h1>Amministrazione Utenti</h1>
            <div class="table-container">
                <table class="users-container"></table>
            </div>
        </section>
        
        <section>
            <h1>Amministrazioni Macchine</h1>
            <div class="table-container">
                <table class="machines-container"></table>
            </div>
        </section>

    </body>
</html>