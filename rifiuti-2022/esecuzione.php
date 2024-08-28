<?php
$apiUrl = 'https://xweymuycrivnwklxqhwq.supabase.co/rest/v1';
$apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXltdXljcml2bndrbHhxaHdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTc2NDM4MSwiZXhwIjoyMDM1MzQwMzgxfQ.jG4noxmSFQgQPBZ4G6b6AWtzcu5SxwBTVnR5L9gGJq0';
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="jquery.js"></script>
        <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
        <script src="queries.js"></script>
        <link href="assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="assets/css/esecuzione.css" rel="stylesheet" type="text/css"/>
        <title>Corse</title>
        <style>
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 10px;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <script>
            fetchLoginData();
            fetchEsecuzione();
            fetchEsecuzione_Proprie();
        </script>
        <table>
            <tr>
                <td id ="esecuzioneTable"></td>
            </tr>
        </table>
        <table>
            <tr>
                <td id ="esecuzione_proprieTable"></td>
            </tr>
        </table>
    </body>
</html>