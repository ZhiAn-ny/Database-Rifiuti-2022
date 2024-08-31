<button?php
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
        <script src="../assets/javascript/common.js"></script>
        <script src="../assets/javascript/utils.js"></script>
        <script src="../assets/javascript/auth.js"></script>
        <script src="../assets/javascript/carichi.js"></script>
        <script src="../assets/javascript/rifiuti.js"></script>
        <script src="../assets/javascript/stabilimenti.js"></script>
        <link href="../assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="../assets/css/esecuzione.css" rel="stylesheet" type="text/css"/>
        <title>Aggiungi rifiuti al tuo carico</title>
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
            document.addEventListener('DOMContentLoaded', function() {
                fetchRifiutiLotto(false);
                handleStabilimentiDropdown();
            });
        </script>
        <h1>Consegna carico</h1>
        <section>
            <table>
                <td id ="rifiutiLottoTable"></td>
            </table>
        </section>
        <section class="flex-row">
            <select id="stabilimentiSelect"></select>
            <button id="consegnaRifiuti" onclick="btnConsegnaLotto()">Consegna rifiuti</button>
        </section>
    </body>
</html>