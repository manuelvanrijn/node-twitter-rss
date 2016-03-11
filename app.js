var express = require('express');
var Feed = require('feed');
var Twit = require('twit');

var twitter = new Twit({
  consumer_key: process.env.CONSUMER_KEY                || 'your-consumer-key',
  consumer_secret: process.env.CONSUMER_SECRET          || 'your-consumer-secret',
  access_token: process.env.ACCESS_TOKEN                || 'your-access-token',
  access_token_secret: process.env.ACCESS_TOKEN_SECRET  || 'your-access-token-secret'
});

var app = express();
app.use(express.logger());

app.get('/', function(req, res) {
  response = [
    'Welcome to Node Twitter RSS',
    '<br /><br />',
    '<a href="/manuelvanrijn">Feed for @manuelvanrijn</a>'
  ];
  res.send(response.join('\n'));
});

app.get('/:screen_name/:secret?', function(req, res) {
  if(process.env.APP_SECRET && process.env.APP_SECRET.length > 0) {
    if(process.env.APP_SECRET !== req.params.secret) {
      res.send('403 Forbidden', 403);
      return;
    }
  }
  twitter.get('statuses/user_timeline', {
    screen_name: req.params.screen_name,
    include_rts: false,
    count: 25
  }, function(err, tweets) {
    if(err) {
      res.send('404 Not found', 404);
    }
    else {
      var feed = null;
      for(var i=0; i<tweets.length; i++) {
        var tweet = tweets[i];
        // init new feed on first tweet
        if(feed == null) {
          feed = new Feed({
            title:          tweet.user.screen_name + ' Twitter RSS',
            description:    'A generated feed of the tweets from ' + tweet.user.screen_name,
            link:           'https://twitter.com/' + tweet.user.screen_name,
            image:          tweet.user.profile_image_url,

            author: {
              name:       tweet.user.name,
              email:      '',
              link:       'https://twitter.com/' + tweet.user.screen_name
            }
          });
        }

        feed.addItem({
          title:          tweet.text,
          link:           'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
          description:    parseTweetText(tweet.text),
          date:           new Date(tweet.created_at)
        });
      }
      res.set('Content-Type', 'text/xml');
      res.send(feed.render('rss-2.0'));
    }
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Listening on: ' + port);
});

var parseTweetText = function(text) {
  text = text.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
    var username = u.replace("@","")
    return u.link("https://twitter.com/"+username);
  });
  text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
    return url.link(url);
  });
  return text;
};
