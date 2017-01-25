#!/usr/bin/env python3

import socketserver, subprocess, sys
from urllib.request import urlopen
from threading import Thread
from pprint import pprint
import json
import datetime

HOST = 'localhost'
PORT = 2000
API_KEY = '9454dc2de4564ac6a8290d37b731cd21'
SITE_ID= '3433'#9807, 9202

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
            text = urlopen('http://api.sl.se/api2/realtimedeparturesv4.json?key='+API_KEY+'&siteid='+SITE_ID+'&timewindow=60')
            '''print(text.read().decode('utf-8'))'''
            data = json.loads(text.read().decode('utf-8'))['ResponseData']['Buses']
            print(data)
            calculateStuff(data)
            self.request.send(json.dumps(data).encode('utf-8'))

        self.request.close()

    def end_headers(self):
        self.send_my_headers()

        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")


'''def print_data(data):
    data = OrderedDict(sorted(data.items(), key=lambda t: t[0]))
    for metro in data:
        print(str.encode(str(metro['GroupOfLineId']) + " " + metro['Destination'] + " " + metro['DisplayTime'] + "\n"))
        self.request.send(str.encode(str(metro['GroupOfLineId']) + " " + metro['Destination'] + " " + metro['DisplayTime'] + "\n"))
        if 'Deviations' in metro:
            for deviation in metro['Deviations']:
                print(deviation)'''

def calculateStuff(data):
    for bus in data:
        if(bus['LineNumber'] == str(509)):
            print(bus['ExpectedDateTime'])
            d1 = datetime.datetime.strptime(bus['ExpectedDateTime'], "%Y-%m-%dT%H:%M:%S")
            d2 = datetime.datetime.strptime(bus['TimeTabledDateTime'], "%Y-%m-%dT%H:%M:%S")
            d = d1-d2
            print(d)

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
