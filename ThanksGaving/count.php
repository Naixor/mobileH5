<?php
	date_default_timezone_set('PRC');
	$path = "count/";

	$type = $_GET["type"];
	echo $type;
	switch ($type) {
		case 'zhongce':{
			$filename = $path."zhongce/".date('Y_m_d_H_i_s',time()).".txt";
			$file = fopen($filename,'a'); 
			fwrite($file,"ok\n"); 
			fclose($file);
			echo $filename;
			break;
		}
		case 'dida':{
			$filename = $path."dida/".date('Y_m_d_H_i_s',time()).".txt";
			$file = fopen($filename,'a'); 
			fwrite($file,"ok\n"); 
			fclose($file);
			echo $filename;

			break;
		}
		case 'waimai':{
			$filename = $path."waimai/".date('Y_m_d_H_i_s',time()).".txt";
			$file = fopen($filename,'a'); 
			fwrite($file,"ok\n"); 
			fclose($file);
			echo $filename;

			break;
		}
		default:
			break;
	}
?>