#!/usr/bin/env python3

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

########################################################
#                  constants
########################################################

PORT = 8000

########################################################
#           main class and methods
########################################################

class CustomHandler(SimpleHTTPRequestHandler):

    def do_GET(self):

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            path = os.path.join(path, 'index.html')

        if not os.path.exists(path):
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            try:
                with open('404.html', 'rb') as f:
                    self.wfile.write(f.read())
            except Exception:
                self.wfile.write(b'404')
            return
        return SimpleHTTPRequestHandler.do_GET(self)


def run(port=PORT):
    while True:
        try:
            server_address = ('', port)
            httpd = HTTPServer(server_address, CustomHandler)
            print(f"👾 starting local server on port {port}...")
            httpd.serve_forever()
        except OSError as e:
            if e.errno == 48:
                port += 1
                print(f"❌ port {port-1} in use, trying port {port}...")
            else:
                raise e


if __name__ == '__main__':
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run(port) 
