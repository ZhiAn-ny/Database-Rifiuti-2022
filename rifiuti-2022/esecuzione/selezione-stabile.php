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
        <script src="../queries.js"></script>
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
        <table>
            <tr>
                <td id ="rifiutiLottoTable"></td>
            </tr>
        </table>
        <select id="stabilimentiSelect"></select>
        <button id="consegnaRifiuti" onclick="btnConsegnaLotto()">Consegna rifiuti</button>
    </body>
</html>