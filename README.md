pollchat
========

Pollchat is an in-browser multi-user chat app built on Apache Kafka using Websockets and Node.js

It was written by David Basden <davidb@anchor.net.au> as a demonstration/exploration of what Kafka can be used for. It's best if you read the [introductory blog post](http://www.anchor.com.au/blog/2012/11/hacking-your-way-to-enlightenment-with-kafka-zookeeper-and-nodejs/) as well to get some context.


Disclaimer
----------

This is seriously some write-once, throwaway code. The code is quick-and-dirty, has config harcoded up the wazoo, and comes with no guarantees. But it should work.


Steps to success
----------------

 1. Have a working ZooKeeper and Kafka cluster

 2. Get yourself a server with Node.js installed, and a webserver like apache or nginx

 3. You'll also need to install a couple of Node.js modules for kafka and websocket support
        npm install kafka
        npm install websocket

 4. Edit server.js and fill in your `kafkahost` and `kafkaport`. Adjust the `listenport` as well if you want

 5. Now fire up the server.js daemon, something like daemontools is recommended for serious usage

 6. Edit index.html and fill in the Node.js websocket listener details. Place it in a directory being served by apache/nginx/other

 7. Hit the page from your browser, you've just started a chat client!
