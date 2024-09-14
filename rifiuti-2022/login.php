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
        <script src="assets/javascript/common.js"></script>
        <script src="assets/javascript/auth.js"></script>
        <link href="assets/css/global.css" rel="stylesheet" type="text/css"/>
        <link href="assets/css/login.css" rel="stylesheet" type="text/css"/>
        <title>Accedi al tuo account</title>
</head>
<body>
    <h1>Accedi al tuo account</h1>
    <div class="form-container">
        <div class="form-control">
            <label for="email">Indirizzo E-Mail:</label>
            <input type="text" id="email" name="email"><br><br>
        </div>
        <div class="form-control">
            <label for="pass">Password:</label>
            <input type="text" id="pass" name="pass"><br><br>
        </div>
    </div>
    <button onclick="loginSito()">Login</button>
</body>
</html>