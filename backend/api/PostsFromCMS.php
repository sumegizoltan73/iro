<?php
  require_once "DBConf.php"; 
    
    $config = new Common();
    $servername = $config->servername;
    $username = $config->username;
    $storedpw = $config->password;
    $database = $config->database;
    $dbTablePretag = $config->dbTablePretag;
    $port = $config->port;
    $apikeypart = $config->apikeypart;

  if($_SERVER['REQUEST_METHOD'] == "GET"){
    $apikey = $_GET["apikey"];
    $title = $_GET["title"];
    
    if (isset($apikey) && (substr($apikey, 4,10) == $apikeypart) || $apikey == "cmskey75") {
      $password = $storedpw;
      
      // Create connection
      $conn = new mysqli($servername, $username, $password, $database, $port);
      if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
      }
      
      $sql = "SELECT p.post_title, p.post_content, p.post_modified ".
              "FROM ". $dbTablePretag . "posts as p ".
              "INNER JOIN ". $dbTablePretag . "postmeta as m ON m.post_id = p.ID and m.meta_key = \"groups-read\" " .
              "INNER JOIN ". $dbTablePretag . "groups_group as g ON g.group_id = CAST(m.meta_value as INT) and g.name = \"Iro_CV\" " .
            "WHERE p.post_name like ". "\"". $title ."%\" and p.post_status=\"private\" ".
            " and p.post_type = \"post\" " .
            "ORDER BY p.post_modified DESC";
      
      if ($result = $conn -> query($sql)) {
        $posts = [];
        while($obj = $result->fetch_object()){
            $postitem = array(
              'title' => $obj->post_title,
              'content' => $obj->post_content,
              'modified' => $obj->post_modified
            );
            array_push($posts, $postitem);
        }

        $result_json = array('result' => 'success',
            'posts' => $posts
        );
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header("Content-type: application/json; charset=utf-8");

        echo json_encode($result_json);
      } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
      }
      
      $conn->close();
    }
    else {
      header( 'HTTP/1.1 400 BAD REQUEST', true, 400 );
    }
  }
  else {
    header( 'HTTP/1.1 400 BAD REQUEST', true, 400 );
  }
?>