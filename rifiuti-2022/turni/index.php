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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
        <script src="../assets/javascript/common.js"></script>
        <script src="../assets/javascript/utils.js"></script>
        <script src="../assets/javascript/auth.js"></script>
        <script src="../assets/javascript/turniUtenti.js"></script>
        <script src="../assets/javascript/stabilimenti.js"></script>
        <script src="turni.js"></script>
        <link href="../assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="../assets/css/turni.css" rel="stylesheet" type="text/css"/>
        <title>Turni lavorativi</title>
    </head>
    <body class="flex-col gap-10">
        <script>
            fetchLoginData();
        </script>
        <h1>I miei turni</h1>
        <button onclick="redirectToPageGlobal('dashboard.php', getLoginInfo())" class="text-btn full-width"><< Torna alla dashboard</button>
        <form>
            <label for="da">Dal</label>
            <input #da type="date" id="da" name="da" required>
            <label for="a">Al</label>
            <input #a type="date" id="a" name="a" required>
            <button type="button" onclick="fetchTurni()">Cerca</button>
        </form> 
        <table>
            <tr>
                <td id ="turniTable"></td>
            </tr>
        </table>
    </body>
</html>