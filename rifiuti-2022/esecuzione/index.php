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
        <script src="../queries.js"></script>
        <link href="../assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="../assets/css/esecuzione.css" rel="stylesheet" type="text/css"/>
        <title>Corse</title>

    </head>
    <body>
        <script>
            fetchLoginData();
            fetchEsecuzione();
            fetchEsecuzione_Proprie();
        </script>

        <h1>Corse da accettare</h1>
        <table>
            <td id ="esecuzioneTable"></td>
        </table>
        <hr>

        <h1>Corse accettate</h1>
        <table>
            <td id ="esecuzione_proprieTable"></td>
        </table>
    </body>
</html>