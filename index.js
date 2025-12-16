import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.dataset.delete) {
        handeleDeleteTweet(e.target.dataset.delete)
    }
    else if(e.target.dataset.replies) {
        handleReplyUserData(e.target.dataset.replies)
    }
    else if(e.target.dataset.deleteReply) {
        handleDeleteReply(e.target.dataset.deleteReply)
    }

    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }

})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')
    const userdata = {
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        isDelete: true,
        uuid: uuidv4(),
    }

    if(tweetInput.value){
        tweetsData.unshift(userdata)
    }
    tweetInput.value = ''
    render()
}

function handeleDeleteTweet(tweetId) {
    tweetsData.forEach(function(tweet, index){
        if (tweet.uuid === tweetId) {
            tweetsData.splice(index, 1)
        }
    })

    render()
}

function handleReplyUserData(replyId){
  const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]

    const replyInput = document.querySelector(`textarea[data-reply-input="${replyId}"]`
)

    if(replyInput.value) {
        targetTweetObj.replies.unshift({
        handle: '@Scrimba',
        profilePic: 'images/scrimbalogo.png',
        tweetText: replyInput.value,
        uuid: uuidv4(),
        isDelete: true,

        })
        replyInput.value = ''    
    }
    render()
}

function handleDeleteReply(deleteUuid){
    tweetsData.forEach(function(tweet){
        tweet.replies.forEach(function(reply,index){
            if (reply.uuid === deleteUuid) {
                tweet.replies.splice(index, 1)
            }
        })
    })
    render()
}


function getFeedHtml(){
    let feedHtml = ``
            
    tweetsData.forEach(function(tweet){   
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let deleteIconClass = '' 

        if(!tweet.isDelete) {
            deleteIconClass = 'delete'
        }

        let repliesHtml = ''
        
        if(tweet.replies.length > 0){

            tweet.replies.forEach(function(reply){

            let deleteReplayIconClass = ''

            if(!reply.isDelete) {
                deleteReplayIconClass = 'delete'
            }

                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle width">${reply.handle}</p>
                                    <p class="tweet-text width">${reply.tweetText}</p>
                                </div>
                                <span class="tweet-detail reply-delete ${deleteReplayIconClass}">
                                    <i class="fa-solid fa-delete-left"
                                    data-delete-reply="${reply.uuid}"></i>
                            </span>
                        </div>
                    </div>
                    `
            })
        }
        
          
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                             <span class="tweet-detail ${deleteIconClass}">
                                <i class="fa-solid fa-delete-left"
                                data-delete="${tweet.uuid}"
                                ></i>
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
                    <div class="tweet-reply">
                        <div class="tweet-reply-inner">
                            <img src="./images/scrimbalogo.png" class="profile-pic">
                            <textarea class="input-reply-text" data-reply-input="${tweet.uuid}"></textarea>
                            <i class="fa-solid fa-reply" data-replies="${tweet.uuid}"></i>
                        </div>
                    </div> 
                </div>
            </div>
`
   })
  
   return feedHtml
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

