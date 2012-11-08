#!/usr/bin/node

//
// Very simple kafka based chat client for node JS
//
// Basically a less crappy functional test than the can-fake-with-netcat one that
// comes with kafka
//
// David Basden <davidb@anchor.net.au>
//

"use strict";

//============================================//

var listenport = 31337;

var kafkahost = 'kafka.example.com';
var kafkaport = 9092;
var kafkatopic = 'chatroom';
var kafkapartition = 0;

//============================================//

var WebSocketServer = require('websocket').server;
var http = require('http');

// Logging 
function ln(msg) { console.log( (new Date()) + msg ); }

// Setup HTTP listener
var server = http.createServer(function(request,response) { });
server.listen(listenport, function() {});


// Websockets server 
//
var wsServer = new WebSocketServer( { httpServer: server });
wsServer.on('request', function(req) {
	ln("New connection from " + req.origin + "...");
	var conn = req.accept(null,req.origin);
	ln("... accepted. Connecting to kafka...");
	var kafka = require('kafka');

	// Connect to kafka as a producer to be able to send messages to it
	var producer = new kafka.Producer({
			host:	kafkahost,
			port:	kafkaport,
			topic:	kafkatopic,
			partition:	kafkapartition,
			}).connect().on('connect', function() {
		ln("Connected to kafka as a producer for "+conn.remoteAddress);
	})

	ln("connected.");
	
	// Handle messages from the client
	conn.on('message', function(msg) {
		if (msg.type === 'utf8') { // Only bother with text messages
			var data = msg.utf8Data;
			ln("Got message from client "+conn.remoteAddress+": " + data);
			// conn.sendUTF(data);
			//ln("echoed.");
			producer.send(data);
			ln(" ---> Relayed message to kafka: " + data)
		}
	});

	conn.on('error', function(err) { ln("websocketserver is throwing an error"); });

	// Connect to kafka and handle messages from the chatroom topic
	var consumer = new kafka.Consumer({
			host:	kafkahost,
			port:	kafkaport
	});
	consumer.connect().subscribeTopic({
			name:	kafkatopic,
			partition:	kafkapartition
	}).on('message', function(topic, message) {
		ln("Got message from kafka:    "+ message);
		conn.sendUTF(message);
		ln(" ---> Relayed message to client: "+ message);
	});
	consumer.on('error', function(err,more) { ln("consumer is throwing an error"); ln(err.toString()); });
	producer.on('error', function(err) { ln("producer is throwing an error");  ln(err.toString());});

	// Handle client disconnections
	conn.on('close', function(conn) { 
		ln(conn.remoteAddress +  " disconnected") 
		ln("closing kafka consumer");
		consumer.close();
		ln("closing kafka producer");
		producer.close();
	} );
});
