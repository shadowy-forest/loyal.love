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
            print(f"404: path not found: {path}")
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

            script_dir = os.path.dirname(os.path.abspath(__file__))
            root_dir = os.path.dirname(script_dir)
            error_page_path = os.path.join(root_dir, 'shared', '404.html')
            print(f"Looking for 404 page at: {error_page_path}")
            print(f"404 page exists: {os.path.exists(error_page_path)}")
            
            try:
                with open(error_page_path, 'rb') as f:
                    content = f.read()
                    print(f"successfully read 404 page, length: {len(content)}")
                    self.wfile.write(content)
            except Exception as e:
                print(f"error serving 404 page: {e}")
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
