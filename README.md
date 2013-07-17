# Node Twitter RSS

Since the new API 1.1 I was unable to retrieve a users timeline for my RSS reader so I created simple application which give's you back this functionality.

### Installing on Heroku

#### 1. Create a Twitter application

First have to create twitter application so our application can use the key's and secrets to communicate with Twitters API.

1. Create a new (twitter) application at [https://dev.twitter.com/apps](https://dev.twitter.com/apps)
2. After you created the application you must click "Create my access token"
3. At this point you have the consumer key, consumer secret, access token and access token secret.

#### 2. Create and deploy to Heroku

You should have installed the [Heroku toolbelt](https://toolbelt.heroku.com/) and exectued `heroku login` before doing the next steps.

1. Run `heroku create` on the project folder
2. Set the ENV variables with the correct values

```
heroku config:set NODE_ENV=production
heroku config:set CONSUMER_KEY=your-consumer-key
heroku config:set CONSUMER_SECRET=your-consumer-secret
heroku config:set ACCESS_TOKEN=your-access-token
heroku config:set ACCESS_TOKEN_SECRET=your-access-token-secret
```

3. Deploy your application by running `git push heroku master`
4. Visit your app by running `heroku open`

#### 3. Securing your instance

By default your app is publicly available. Because you probably don't want others to waste your rate limit you can add a simple secret to it by running:

```
heroku config:set APP_SECRET=your-top-secret-string-here
```

Now, instead of doing [http://yourapp.herokuapp.com/twitter-user/]() you should do [http://yourapp.herokuapp.com/twitter-user/your-top-secret-string-here]()

### Changelog

| Version | Notes                                                                               |
| -------:| ----------------------------------------------------------------------------------- |
|   1.0.0 | Initial release                                                                     |

### Copyright

Copyright © 2013 Manuel van Rijn. See [LICENSE](https://github.com/manuelvanrijn/node-twitter-rss/blob/master/LICENSE.md) for further details.
