#!/usr/bin/env python3

import socketserver, subprocess, sys
from urllib.request import urlopen
from threading import Thread
from pprint import pprint
import http.server
import json
import numpy

HOST = 'localhost'
PORT = 2000
API_KEY = '3d9664bc06984271b1a8201621ddea18'
SITE_ID= '9202'

class SingleTCPHandler(socketserver.BaseRequestHandler):
    "One instance per connection.  Override handle(self) to customize action."
    def handle(self):
        # self.request is the client connection
        recv = self.request.recv(1024)  # clip input at 1Kb
        recvtext = recv.decode('utf-8')
        path = recvtext.split()[1]
        print(path)

        self.request.send(("HTTP/1.1 200 OK\n").encode('utf-8'))
        self.request.send(("Server : Slask 0.1 Beta\n").encode('utf-8'))
        self.request.send(("Access-Control-Allow-Origin: *\n").encode('utf-8'))
        self.request.send(("Content-Type: application/json\n").encode('utf-8'))
        self.request.send(("\n").encode('utf-8'))

        if path == "/api/v1/sl":
            text = urlopen('http://api.sl.se/api2/realtimedepartures.json?key='+API_KEY+'&siteid='+SITE_ID+'&timewindow=60')
            data = json.loads(text.read().decode('utf-8'))['ResponseData']['Metros']
            self.request.send("5")'''json.dumps(data).encode('utf-8'))'''
        self.request.close()

    def end_headers(self):
        self.send_my_headers()

        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")


def print_data(self, data):
    for metro in data:
        print(str.encode(str(metro['GroupOfLineId']) + " " + metro['Destination'] + " " + metro['DisplayTime'] + "\n"))
        self.request.send(str.encode(str(metro['GroupOfLineId']) + " " + metro['Destination'] + " " + metro['DisplayTime'] + "\n"))
        if 'Deviations' in metro:
            for deviation in metro['Deviations']:
                print(deviation)

class SimpleServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    # Ctrl-C will cleanly kill all spawned threads
    daemon_threads = True
    # much faster rebinding
    allow_reuse_address = True

    def __init__(self, server_address, RequestHandlerClass):
        socketserver.TCPServer.__init__(self, server_address, RequestHandlerClass)

if __name__ == "__main__":
    server = SimpleServer((HOST, PORT), SingleTCPHandler)
    # terminate with Ctrl-C
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)

