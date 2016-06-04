import urllib.request
from urllib.parse import urlencode
import json
from gzip import decompress
from http.cookiejar import CookieJar

transmission_headers={
    'Host':'127.0.0.1:9091',
    'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Accept':'application/json, text/javascript, */*; q=0.01',
    'Accept-Language':'en-US,en;q=0.5',
    'Accept-Encoding':'gzip, deflate',
    'Content-Type':'json',
    'Authorization':'Basic d2FuZ2p1bjpXdDIwMTEwNTIz',
    #'X-Transmission-Session-Id':'8IFVvHd8xUDZsTiZ7Z2Q5GcEr4rq89z6GgdurKoXRJwo7MMI',
    'X-Requested-With':'XMLHttpRequest',
    'Referer':'http://127.0.0.1:9091/transmission/web/',
    'Content-Length':'24',
    #'Cookie':'csrftoken=IBnUqci8mL49FRlO2YFHOF8R0BamYGeA',
    'Connection':'keep-alive',
}

#headers={
#'Host':'127.0.0.1:9091',
#'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0',
#'Accept':'application/json, text/javascript, */*; q=0.01',
#'Accept-Language':'en-US,en;q=0.5',
#'Accept-Encoding':'gzip, deflate',
#'Content-Type':'json',
#'X-Requested-With':'XMLHttpRequest',
#'Referer':'http://127.0.0.1:9091/transmission/web/',
#'Authorization':'Basic d2FuZ2p1bjpXdDIwMTEwNTIz',
#'Content-Length':'24',
#'Cookie':'csrftoken=IBnUqci8mL49FRlO2YFHOF8R0BamYGeA',
#'Connection':'keep-alive',
#}

transmission_cj=CookieJar()
transmission_processor=urllib.request.HTTPCookieProcessor(transmission_cj)
transmission_opener=urllib.request.build_opener(transmission_processor)
#urllib.request.install_opener(opener)
data={"method":"session-get"}
data=json.dumps(data)
data=data.encode()
try:
    transmission_request=urllib.request.Request('http://127.0.0.1:9091/transmission/rpc/',headers=transmission_headers)
    transmission_response=transmission_opener.open(transmission_request,data=data)
    transmission_content=decompress(transmission_response.read()).decode()
    print(content)
except Exception as e:
    session_id=e.hdrs['X-Transmission-Session-Id']

def add_task_to_transmission(magnet_url):
    transmission_headers.update({'X-Transmission-Session-Id':session_id})
    post_data={"method":"torrent-add","arguments":{"paused":False,"download-dir":"/home/wangjun/下载/Transmission","filename":magnet_url}}
    post_data=json.dumps(post_data)
    post_data=post_data.encode()
    transmission_request2=urllib.request.Request('http://127.0.0.1:9091/transmission/rpc/',headers=transmission_headers)
    transmission_response2=transmission_opener.open(transmission_request2,data=post_data)
    content2=decompress(transmission_response2.read()).decode()
    print(content2)
