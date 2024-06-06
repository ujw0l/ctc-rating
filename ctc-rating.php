<?php 
/*
 Plugin Name:CTC Rating
 Plugin URI:https://github.com/ujw0l/ctc-rating
 Description: Thumb up and thumb down  rating for WordPress post
 Version: 1.7.0
 Author: Ujwol Bastakoti
 Author URI:https://ujw0l.github.io/
Text Domain:  ctc-rating
 License: GPLv2
 */

 class ctcRating{

    public function __construct(){

        define('CTCR_DIR_PATH',plugin_dir_url(__FILE__) );
        self::ctcRatingADU();
        self::ctcRatingAddActions();   
    }
/** 
* Plugin activation, deactivation and uninstall
*/
   public function ctcRatingADU(){   
    register_activation_hook(__FILE__, array($this, 'ctcRatingActivate'));
    register_deactivation_hook(__FILE__,  array($this,'ctcRatingDeactivate'));
    
    }

    /** 
    *create table on activation
    */

    public function ctcRatingActivate(){
        global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE `".$wpdb->prefix."ctcRating`(
            `postId` mediumint(11) NOT NULL,
            `thumbsUpCount` int(10) DEFAULT 0,
           `thumbsDownCount` int(10) DEFAULT 0,
           `thumbsUpUser` text NOT NULL DEFAULT '',
           `thumbsDownUser` text NOT NULL DEFAULT '',
             UNIQUE KEY (`postId`)) $charset_collate;";

      require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
      dbDelta($sql);
    }
    /** 
    * Do nothing on deactivation
    */

    public function ctcRatingDeactivate(){

        //do nothing on deactivation
    }


/** 
*Drop table on uninstall
*/
public function ctcRatingUninstall(){
  global $wpdb;
  $wpdb->query("DROP TABLES {$wpdb->prefix}ctcRating;");
}

    /** 
    *Add required actions and add shortcode
    */

    public  function ctcRatingAddActions(){

        
        add_action('wp_ajax_ctcUserRating', array($this ,'ctcUserRating'));
        add_action('wp_ajax_nopriv_ctcUserRating', array($this ,'ctcUserRating'));
        add_action('wp_ajax_ctcGetUsers', array($this ,'ctcGetUsers'));
        add_action('wp_ajax_nopriv_ctcGetUsers', array($this ,'ctcGetUsers'));
		add_action('init', array($this,'ctcRatingGutenbergBlocks'));
      
    
    }

 



/**
 * Rgister block editor scripts
 */
   public function ctcRatingGutenbergBlocks(){





  $param =  array(
    'ctcRatingAjaxUrl' =>admin_url( 'admin-ajax.php' ),
    'notLoggedIn' => __('You need to log in to rate this post.','ctc-rating'),
    'alreadyThumbedUp'=>__('You have already thumbed up this post','ctc-rating'),
    'alreadyThumbedDown'=>__('You have already thumbed down this post','ctc-rating'),
    'thumbUp'=>__('Thumb up this post','ctc-rating'),
    'thumbDown'=>__('Thumb down this post','ctc-rating')
  );


	register_block_type( __DIR__ . '/build',
    array(   
       'attributes'=> array('param'=>['type'=>'array', "default"=>$param], ),         
     'render_callback'=>array($this,'ctcDisplayRating'),

    ),
);



   }

   /** 
   * ajax function to handle thumb up and thumb down 
   */
   public function ctcUserRating(){

    $ratingData = json_decode(stripslashes($_POST['rating_data']),TRUE);
    if(is_numeric($ratingData['postId']) && is_numeric($ratingData['ratingType'])):
        $this->ctcProcessUserRating(absint($ratingData['postId']),absint($ratingData['ratingType']));
    endif;
   
    wp_die();
   }

   /** 
   *Display rating on frontend
   */

   public function ctcDisplayRating($atts, $content){
    global $wpdb;

    $needle = '~'.get_current_user_id().'~';
    $scenario  = 'ctcPostPage'; 
       
    $prpSql = $wpdb->prepare("SELECT * FROM {$wpdb->prefix}ctcRating WHERE postId=%d",get_the_ID());
   $rating = $wpdb->get_row($prpSql,ARRAY_A);


   

   $rating =  null == $rating ? ["postId"=>get_the_ID(),  "thumbsUpCount"=>'0',"thumbsDownCount"=>"0","thumbsUpUser"=>'',"thumbsDownUser"=>''] : $rating;




        $thumUpUser =  null == $rating ? '' : $rating['thumbsUpUser'];
		$thumDownUser =  null == $rating ? '' : $rating['thumbsDownUser'];

   
      $thumbUpClass =  false === strpos( $thumUpUser,$needle)?'':esc_attr('ctcUserThumbUp');
      $thumbDownClass=  false === strpos($thumDownUser,$needle) ? '':esc_attr( 'ctcUserThumbDown') ;
      $thumUpCount = empty($rating['thumbsUpCount'])? 0 : esc_html($rating['thumbsUpCount']);
      $thumbDownCount = empty($rating['thumbsDownCount']) ? 0 : esc_html($rating['thumbsDownCount']);

        ob_start();
    ?>
    <div  class="ctcItemRating" data-ctcr-param='<?php echo(json_encode( $atts['param'])); ?>'>
    				<?php if(!empty($thumbUpClass)):
          					$thumbUpTitle=__(esc_attr( "You already thumbed up this post"),'ctc-rating');
          				  endif;
          	?>	
    				<span id="ctcThumbUp-<?=esc_attr( get_the_ID())?>"  title="<?=$thumbUpTitle??__(esc_attr( 'Thumbs Up'),'ctc-rating')?>"  data-type-scenario="<?=esc_attr($scenario)?>" data-type-id="<?=get_the_ID()?>" data-type-rating="1" class=" ctcRating<?=esc_attr($rating['postId'])?>-1   dashicons dashicons-thumbs-up ctcThumbUp <?=$thumbUpClass ??'' ?>"></span>
    				<span id="ctcThumbUpCount-<?=esc_attr( get_the_ID())?>" data-get="thumb-up-count" data-post-id="<?=esc_attr( get_the_ID())?>" class="ctcThumbsUpStat ctcThumbsUpCount-<?=esc_attr( $scenario).'-'.esc_attr( $rating['postId'])?>" data-type-thumupcount="<?=esc_attr( $thumUpCount)?>"> <?=esc_html( number_format($rating['thumbsUpCount']))?></span>
    				<span id="ctcThumbDownCount-<?=esc_attr( get_the_ID())?>" data-get="thumb-down-count" data-post-id="<?=esc_attr( get_the_ID())?>" class="ctcThumbsDownStat ctcThumbsDownCount-<?=esc_attr( $scenario).'-'.esc_attr( $rating['postId'])?>" data-type-thumdowncount="<?=esc_attr( $thumbDownCount)?>" > <?=esc_html( number_format($rating['thumbsDownCount']))?></span>
          			
          	<?php if(!empty($thumbDownClass)):
          				$thumbDownTitle=__(esc_attr( "You already thumbed down this post"),'ctc-rating');
          				endif;
          	?>
          			<span id="ctcThumbDown-<?=get_the_ID()?>"  title="<?=$thumbDownTitle??__(esc_attr('Thumbs Down'),'ctc-rating')?>"  data-type-scenario="<?=esc_attr($scenario)?>" data-type-id="<?=esc_attr( get_the_ID())?>"  data-type-rating="2" class="ctcRating<?=esc_attr($rating['postId'])?>-2   dashicons dashicons-thumbs-down  ctcThumbDown <?=$thumbDownClass ??''?> "></span>
     </div>	

<?php


return ob_get_clean();


   }


   /**
 * 
 * function to handles user rating
 * @param $postId Post Id
 * @param $rating Rating cliked by user
 * @return echo action
 * 
 */	
	public function ctcProcessUserRating($postId,$rating){
		global $wpdb;
		
		$userId= get_current_user_id();
    
   
    if(is_user_logged_in()):
      
     
			  if($rating === 1):

			  if($this->ctcCheckIfUserRatedProduct($postId,$userId, 'thumbsUpUser') === '1'):
			  		 $prpsql = $wpdb->prepare("UPDATE {$wpdb->prefix}ctcRating SET thumbsUpCount = thumbsUpCount-1 , thumbsUpUser= REPLACE(thumbsUpUser,'~%d~,','') WHERE postId=%d",$userId,$postId);
			       $wpdb->query($prpsql);
			  		  echo "unThumbsUp";
			  else:
               if ($this->ctcPostThumbUpThumbDownReversal('thumbsDownUser',$postId,$userId)==='1'):
                $prpsql= $wpdb->prepare("UPDATE {$wpdb->prefix}ctcRating SET thumbsDownCount = thumbsDownCount-1 ,thumbsUpCount = thumbsUpCount+1, thumbsDownUser = REPLACE(thumbsDownUser,'~%d~,',''), thumbsUpUser= CONCAT(thumbsUpUser,'~%d~,') WHERE postId=%d",$userId,$userId,$postId);
                $wpdb->query($prpsql);
				  		  echo "thumbsDownReversed";
               else:
                $prpSql = $wpdb->prepare("INSERT INTO {$wpdb->prefix}ctcRating (postId,thumbsUpCount,thumbsUpUser) VALUES ('%d','1','~%d~,') ON DUPLICATE KEY UPDATE  thumbsUpCount = thumbsUpCount+1 , thumbsUpUser= CONCAT(thumbsUpUser,'~%d~,')",$postId,$userId,$userId );
                $result = $wpdb->query($prpSql);
                    echo "thumbsUp";
				  		  endif; 
			  endif;
			  elseif ($rating === 2):
            if($this->ctcCheckIfUserRatedProduct($postId, $userId,'thumbsDownUser') == '1'):
              $prpSql = $wpdb->prepare("UPDATE {$wpdb->prefix}ctcRating SET thumbsDownCount = thumbsDownCount-1 , thumbsDownUser = REPLACE(thumbsDownUser,'~%d~,','') WHERE postId=%d",$userId,$postId);
              $wpdb->query( $prpSql);
				       echo "unThumbsDown";
				    else:
                if ($this->ctcPostThumbUpThumbDownReversal('thumbsUpUser',$postId,$userId)==='1'):
                  $prpSql = $wpdb->prepare("UPDATE {$wpdb->prefix}ctcRating SET thumbsUpCount = thumbsUpCount-1 ,thumbsDownCount = thumbsDownCount+1, thumbsUpUser = REPLACE(thumbsUpUser,'~%d~,',''), thumbsDownUser= CONCAT(thumbsDownUser,'~%d~,') WHERE postId=%d",$userId,$userId,$postId);
					        $wpdb->query($prpSql);
					       echo "thumbsUpReversed";
               else:
                 $prpSql = $wpdb->prepare("INSERT INTO {$wpdb->prefix}ctcRating (postId,thumbsDownCount,thumbsDownUser) VALUES ('%d','1','~%d~,') ON DUPLICATE KEY UPDATE  thumbsDownCount = thumbsDownCount+1 , thumbsDownUser= CONCAT(thumbsDownUser,'~%d~,')",$postId,$userId,$userId);
					       $wpdb->query($prpSql);
					        echo "thumbsDown";
				         endif;
				  endif;  
			  endif;
     else:
		 echo 'notLoggedIn';
     endif;
		
  }

  /** 
  *Rating reversal
  *@param $reverseColumnName Column name of rating revarsal
  *@param $postId Post id for reversal 
  *@param $userId User id of user
  *
  *@return Result of reversal
  */
  public function ctcPostThumbUpThumbDownReversal($reverseColumnName,$postId,$userId){
    global $wpdb;
    $result = $wpdb->get_results('SELECT COUNT(*) FROM '.$wpdb->prefix.'ctcRating WHERE postId='.$postId.' AND '.$reverseColumnName.' RLIKE "~'.$userId.'~";',ARRAY_A);
		return $result[0]['COUNT(*)'];
		
  }
  
 /** 
  *Check if user rated post before
  *
  *@param $postId Post id for reversal 
  *@param $userId User id of user
  *@param $column Column to check if user rated
  *
  *@return Result of reversal
  */
  public function ctcCheckIfUserRatedProduct($postId, $userId, $column){
		global $wpdb;
		 $result = $wpdb->get_results('SELECT COUNT(*) FROM '.$wpdb->prefix.'ctcRating WHERE postId='.$postId.' AND '.$column.' RLIKE "~'.$userId.'~";',ARRAY_A);
		 return $result[0]['COUNT(*)'];
  }
  

  /**
   * Handle display user based on rating
   * 
   */
  public function ctcGetUsers(){

if(is_numeric($_POST['post_id'])):
  global $wpdb;

  $columnToQuery = 'thumb-up-count' == $_POST['user_to_get'] ? 'thumbsUpUser' :  'thumbsDownUser';
  $displayUsers = 'thumb-up-count' == $_POST['user_to_get'] ? '<p class="ctc-liked-by" style="margin-top:0px;text-align:center;" >'.__('Liked by','ctc-rating').'</p>' : '<p class="ctc-disliked-by" style="margin-top:0px;text-align:center;"  >'.__('Disliked by' ,'ctc-user').'</p>';
$prepSql = $wpdb->prepare("SELECT {$columnToQuery} FROM {$wpdb->prefix}ctcRating WHERE postId=%d",absint($_POST['post_id']));
$userIds = explode(',',str_replace('~','',$wpdb->get_results($prepSql, ARRAY_N )[0][0]));

for($i=0; $i< count($userIds)-1;$i++):

  $userData =  get_user_by('ID',$userIds[$i]);
  $displayUsers .="<li class='ctc-rating-users'>".ucfirst($userData->data->user_nicename)."</li>";
 
endfor;
endif;
$displayUsers .='</ul>';
echo $displayUsers;
wp_die();
  }



 }

 new ctcRating();


 register_uninstall_hook(__FILE__, 'ctcRatingUninstall');

 /** 
*Drop table on uninstall
*/
 function ctcRatingUninstall(){
	global $wpdb;
	$wpdb->query("DROP TABLES {$wpdb->prefix}ctcRating;");
  }