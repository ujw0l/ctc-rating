<?php 
/*
 Plugin Name:CTC Rating
 Plugin URI:
 Description: Like and dislike rating for WordPress post
 Version: 1.0.0
 Author: Ujwol Bastakoti
 Author URI:https://ujwolbastakoti.wordpress.com/
Text Domain:  ctc-rating
 License: GPLv2
 */

 class ctcRating{

    public function __construct(){

        define('CR_DIR_PATH',plugin_dir_url(__FILE__) );
        self::ctcRatingADU();
        self::ctcRatingAddActionsShortCode();   
    }
/*
* Plugin activation, deactivation and uninstall
*/
   public function ctcRatingADU(){   
    register_activation_hook(__FILE__, array($this, 'ctcRatingActivate'));
    register_deactivation_hook(__FILE__,  array($this,'ctcRatingDeactivate'));
    register_uninstall_hook(__FILE__,array($this,'ctcRatingUninstall'));
    }

    /*
    *create table on activation
    */

    public function ctcRatingActivate(){
        global $wpdb;
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
    /*
    * Do nothing on deactivation
    */

    public function ctcRatingDeactivate(){

        //do nothing on deactivation
    }


/*
*Drop table on uninstall
*/
    public function ctcRatingUninstall(){
        global $wpdb;
        $wpdb->query("DROP TABLES {$wpdb->prefix}ctcRating;");
    }

    /*
    *Add required actions and add shortcode
    */

    public  function ctcRatingAddActionsShortCode(){

        add_action( 'wp_enqueue_scripts', array($this,'ctcRatingEnequeJs' ));
        add_action( 'wp_enqueue_scripts', array($this,'ctcRatingEnequeCss' ));
        add_action('wp_ajax_ctcUserRating', array($this ,'ctcUserRating'));
        add_action('wp_ajax_nopriv_ctcUserRating', array($this ,'ctcUserRating'));
       add_shortcode('ctc_rating', array($this,'ctcDisplayRating'));

    }

    /*
    * Eneque frontend scripts
    */
  public function ctcRatingEnequeJS(){
   wp_enqueue_script('ctcRatingFrontendlJs', CR_DIR_PATH.'js/ctc_rating.js', array());
   wp_localize_script( 'ctcRatingFrontendlJs', 'ctcRating ', array(
                                                                    'ctcRatingAjaxUrl' =>admin_url( 'admin-ajax.php' ),
                                                                    'notLoggedIn' => __('You need to log in to rate this post.','ctc-rating'),
                                                                    'alreadyThumbedUp'=>__('You have already thumbed up this post','ctc-rating'),
                                                                    'alreadyThumbedDown'=>__('You have already thumbed down this post','ctc-rating'),
                                                                    'thumbUp'=>__('Thumb up this post','ctc-rating'),
                                                                    'thumbDown'=>__('Thumb down this post','ctc-rating')
                                                                    ));
  }

  /*
    * Eneque frontend styles
    */
  public function ctcRatingEnequeCss(){
    wp_enqueue_style( 'ctcRatingFrontendCss', CR_DIR_PATH.'css/ctc_rating.css'); 
    wp_enqueue_style( 'dashicons' );  
   }

   /*
   * ajax function to handle thumb up and thumb down 
   */
   public function ctcUserRating(){

    $ratingData = json_decode(stripslashes($_POST['rating_data']),TRUE);

     $this->ctcProcessUserRating($ratingData['postId'],$ratingData['ratingType']);
   
    wp_die();
   }

   /*
   *Display rating on frontend
   */

   public function ctcDisplayRating(){
    global $wpdb;

    $needle = '~'.get_current_user_id().'~';
    $scenario  = 'ctcPostPage'; 
     	
   $rating = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}ctcRating WHERE postId=".get_the_ID(),ARRAY_A);

   
      $thumbUpClass =  false === strpos($rating['thumbsUpUser'],$needle)?'':'ctcUserThumbUp';
      $thumbDownClass=  false === strpos($rating['thumbsDownUser'],$needle) ? '':'ctcUserThumbDown' ;

        ob_start();
    ?>
    <div  class="ctcItemRating">
    				<?php if(!empty($thumbUpClass)):
          					$thumbUpTitle=__("You already thumbed up this post",'ctc-rating');
          				  endif;
          	?>	
    				<span id="ctcThumbUp-<?=get_the_ID()?>"  title="<?=$thumbUpTitle??__('Thumbs Up','ctc-rating')?>"  data-type-scenario="<?=$scenario?>" data-type-id="<?=get_the_ID()?>" data-type-rating="1" class=" ctcRating<?=$rating['postId']?>-1   dashicons dashicons-thumbs-up ctcThumbUp <?= $thumbUpClass ??'' ?>"></span>
    				<span id="ctcThumbUpCount-<?=get_the_ID()?>" class="ctcThumbsUpStat ctcThumbsUpCount-<?=$scenario.'-'.$rating['postId']?>" data-type-thumupcount="<?=$rating['thumbsUpCount']?>"> <?=number_format($rating['thumbsUpCount'])?></span>
    				<span id="ctcThumbDownCount-<?=get_the_ID()?>" class="ctcThumbsDownStat ctcThumbsDownCount-<?=$scenario.'-'.$rating['postId']?>" data-type-thumdowncount="<?=$rating['thumbsDownCount']?>" > <?=number_format($rating['thumbsDownCount'])?></span>
          			
          	<?php if(!empty($thumbDownClass)):
          				$thumbDownTitle=__("You already thumbed down this post",'ctc-rating');
          				endif;
          	?>
          			<span id="ctcThumbDown-<?=get_the_ID()?>"  title="<?=$thumbDownTitle??__('Thumbs Down','ctc-rating')?>"  data-type-scenario="<?=$scenario?>" data-type-id="<?=get_the_ID()?>"  data-type-rating="2" class="ctcRating<?=$rating['postId']?>-2   dashicons dashicons-thumbs-down  ctcThumbDown <?=$thumbDownClass ??''?> "></span>
     </div>	

<?php


return ob_get_clean();


   }


   /**
 * 
 * function to handles user rating
 * @param $postId Post Id
 * @param $rating Rating cliked by user
 * 
 */	
	public function ctcProcessUserRating($postId,$rating){
		global $wpdb;
		
		$userId= get_current_user_id();
    
   
    if(is_user_logged_in()):
      
     
			  if($rating === '1'):

			  if($this->ctcCheckIfUserRatedProduct($postId,$userId, 'thumbsUpUser') === '1'):
			  		 $sql = "UPDATE {$wpdb->prefix}ctcRating SET thumbsUpCount = thumbsUpCount-1 , thumbsUpUser= REPLACE(thumbsUpUser,'~{$userId}~,','') WHERE postId={$postId}";
			       $wpdb->query($sql);
			  		  echo "unThumbsUp";
			  else:
               if ($this->ctcPostThumbUpThumbDownReversal('thumbsDownUser',$postId,$userId)==='1'):
                $sql = "UPDATE {$wpdb->prefix}ctcRating SET thumbsDownCount = thumbsDownCount-1 ,thumbsUpCount = thumbsUpCount+1, thumbsDownUser = REPLACE(thumbsDownUser,'~{$userId}~,',''), thumbsUpUser= CONCAT(thumbsUpUser,'~{$userId}~,') WHERE postId={$postId}";
				  		   $wpdb->query($sql);
				  		  echo "thumbsDownReversed";
               else:
                $sql = "INSERT INTO {$wpdb->prefix}ctcRating (postId,thumbsUpCount,thumbsUpUser) VALUES ('{$postId}','1','~$userId~,') ON DUPLICATE KEY UPDATE  thumbsUpCount = thumbsUpCount+1 , thumbsUpUser= CONCAT(thumbsUpUser,'~{$userId}~,')";
                $result = $wpdb->query($sql);
                    echo "thumbsUp";
				  		  endif; 
			  endif;
			  elseif ($rating === '2'):
            if($this->ctcCheckIfUserRatedProduct($postId, $userId,'thumbsDownUser') == '1'):
              $sql = "UPDATE {$wpdb->prefix}ctcRating SET thumbsDownCount = thumbsDownCount-1 , thumbsDownUser = REPLACE(thumbsDownUser,'~{$userId}~,','') WHERE postId={$postId}";
				      $wpdb->query($sql);
				       echo "unThumbsDown";
				    else:
				   
                if ($this->ctcPostThumbUpThumbDownReversal('thumbsUpUser',$postId,$userId)==='1'):
                  $sql = "UPDATE {$wpdb->prefix}ctcRating SET thumbsUpCount = thumbsUpCount-1 ,thumbsDownCount = thumbsDownCount+1, thumbsUpUser = REPLACE(thumbsUpUser,'~{$userId}~,',''), thumbsDownUser= CONCAT(thumbsDownUser,'~{$userId}~,') WHERE postId={$postId}";
					        $wpdb->query($sql);
					       echo "thumbsUpReversed";
               else:
                 $sql = "INSERT INTO {$wpdb->prefix}ctcRating (postId,thumbsDownCount,thumbsDownUser) VALUES ('{$postId}','1','~$userId~,') ON DUPLICATE KEY UPDATE  thumbsDownCount = thumbsDownCount+1 , thumbsDownUser= CONCAT(thumbsDownUser,'~{$userId}~,')";
					       $wpdb->query($sql);
					        echo "thumbsDown";
				         endif;
				  endif;  
			  endif;
     else:
		 echo 'notLoggedIn';
     endif;
		
  }

  /*
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
  
 /*
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

 }

 new ctcRating();


