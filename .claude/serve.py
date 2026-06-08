#!/usr/bin/env python3
# 开发用静态服务器：禁用缓存，确保预览始终拿到最新文件
import http.server, socketserver, sys
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4178
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), H) as httpd:
    httpd.serve_forever()
