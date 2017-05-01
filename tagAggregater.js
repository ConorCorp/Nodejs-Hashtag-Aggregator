var fs = require('fs');
var Twit = require('twit');

// for sorting the tags,
// we can make an array of objects with the hashtag, and the amount of time the hastag is used
// we can then call an array.sort(function(obj1, obj2) {
//   return hashtag num > hashtag num;
// })


var T = new Twit({
  consumer_key:         'XdWUNmll91QHV4jKyGKfvZnTw',
  consumer_secret:      '2q4q8VGyG5Kz31zlt4JxrrjIdWLmKnzgUL1saC05T7rI7H7IEd',
  access_token:         '368654929-o1oNVtFCCBKBjJyYLIzgUhGtP5st8go7VkQyiy7v',
  access_token_secret:  'or476iSLA3iVfuQIXLn0kEtwJAqj8k8voxt2PHdijOt97',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});


//Globals
var maxId;
var hashtagArr = [];

//grab first tweet incase as point of reference
//incase new tweet appears
var getFirstTweet = T.get('statuses/user_timeline', { screen_name:'deeplocal', count: 1 }, function(err, data, response) {
  maxId = data[0].id;
});

getFirstTweet.then(()=> {
}).catch( (e) => {
  console.log(e);
}).then(() => {
  var currMaxId = maxId;
  var numTweets = 500; //can be changed up to 3.2k //unnecessary for deepLocal
    //get the tweets
    T.get('statuses/user_timeline', { screen_name:'deeplocal', max_id:currMaxId, count: numTweets }, function(err, data, response) {
      if(err) throw err;
      for (var i = 0; i < numTweets; i++) {
        if(data[i] == undefined) {
          console.log("No more tweets!");
          break;
        }
        //check the years //prune 2017
        var currYear = data[i].created_at.substring(data[i].created_at.length-4, data[i].created_at.length);
        if(currYear < 2016) {
          break;
        } else if (currYear > 2016) {
          continue;
        } else {
          //check if there's hashtags, if so, add 'em'
          if(!(data[i].entities.hashtags.length == 0)){
            data[i].entities.hashtags.forEach(function(element) {
              //function to find hashtag object in Arr
              function findHashtag(hashtag) {
                return hashtag.name === element.text;
              }
              var tempElement = hashtagArr.find(findHashtag);

              //if there is a hash tag add to it, else make new one
              if(!(tempElement == undefined)) {
                hashtagArr[hashtagArr.indexOf(tempElement)].count++;
              } else {
                hashtagArr.push({name:element.text, count:1});
              }
            });
          }
        }
      }
      hashtagArr.sort(function(a,b) {
        return b.count - a.count;
      });
      console.log("deeplocal's 2016 Hahstag Frequencies\nHashtag:\tCount:");
      hashtagArr.forEach(function(element) {
          console.log(element.name+"\t"+element.count);
      });
    });
}).catch( (e) => {
  console.log(e);
})
