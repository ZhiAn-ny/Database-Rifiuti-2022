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
        <script src="../assets/javascript/rotte.js"></script>
        <script src="gestione-rotte.js" defer></script>
        <link href="../assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="../assets/css/gestione-rotte.css" rel="stylesheet" type="text/css"/>
        <title>Gestione rotte</title>
    </head>
    <body>
        <script>
            fetchLoginData();
        </script>

        <h1>Gestione rotte</h1>
        <ul id="routes-list"></ul>
       
    </body>
</html>