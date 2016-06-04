#!/usr/bin/python3.5

import argparse
import urllib.request
from urllib.parse import urlencode,quote,unquote
from gzip import decompress
import http.cookiejar
from bs4 import BeautifulSoup
import datetime
import subprocess
import transmission_daemon

parser=argparse.ArgumentParser(prog='torrent_search')
parser.add_argument('-w')
parser.add_argument('-n',type=int,default=20)
args=parser.parse_args()
word=args.w
number=args.n

class Movie():
    def __init__(self,title,url,size,create_date,click_times):
        self.title=title
        self.url=url
        self.size=size
        self.create_date=create_date
        self.click_times=click_times

    def __str__(self):
        return self.title

cj=http.cookiejar.CookieJar()
processor=urllib.request.HTTPCookieProcessor(cj)
opener=urllib.request.build_opener(processor)
urllib.request.install_opener(opener)

search_url='http://www.bt177.net/word/{}.html'.format(quote(word))

headers1={
    'Host':'www.bt177.net',
    'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language':'en-US,en;q=0.5',
    'Accept-Encoding':'gzip, deflate',
    #'Referer':'http://www.bt177.net/',
    #'Cookie':'__cfduid=d0772ab725c3bcd4faa01ceadde4c8bad1461635215; CNZZDATA1254481530=40297420-1461632283-http%253A%252F%252Fwww.baidu.com%252F%7C1463465315; tanchucookie=true; tanchucookie2=true',
    'Connection':'keep-alive',
    }

headers2={
    'Host':'api.xhub.cn',
    'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Accept':'*/*',
    'Accept-Language':'en-US,en;q=0.5',
    'Accept-Encoding':'gzip, deflate',
    #'Referer':'http://www.bt177.net/read/C8C38661DF01FA4640F6CFD1AFB331E7881B85FC.html',
    'Connection':'keep-alive',
}

movies_list=[]

def create_url(word):
    for i in range(1,6):
        yield 'http://www.bt177.net/word/{}_{}.html'.format(quote(word),str(i))

def open_url(url,headers):
    for i in range(3):
        try:
            request=urllib.request.Request(url,headers=headers)
            response=urllib.request.urlopen(request,timeout=5)
            content=decompress(response.read()).decode(encoding='utf-8',errors='ignore')
            return content
        except Exception as e:
            print(e)
            continue
    return None

def get_movie(content):
    if content:
        soup=BeautifulSoup(content)
    else:
        return
    div=soup.find('div',class_='torrentba_list')
    li_list=div.find_all('li')
    for li in li_list:
        title=li.a.get('title',None)
        url=li.a.get('href',None)
        span=li.find_all('span')
        if span:
            if len(span)==4:
                size=span[1].text
                create_date=datetime.datetime.strptime(span[2].text[3:],'%Y-%m-%d')
                click_times=span[3].text
            elif len(span)==3:
                size=span[0].text
                create_date=datetime.datetime.strptime(span[1].text[3:],'%Y-%m-%d')
                click_times=span[2].text
            temp_movie=Movie(title,url,size,create_date,click_times)
            movies_list.append(temp_movie)
        else:
            continue

def get_magnet_url(content):
    if content:
        soup=BeautifulSoup(content)
    else:
        return
    magnet_url=soup.find('textarea').text
    return magnet_url

def main():
#    with open('/home/wangjun/projects/transmission_port_number.txt','r') as f:
#        port=f.read()
    for url in create_url(word):
        content=open_url(url,headers1)
        get_movie(content)
    movies_list.sort(key=lambda x:x.create_date,reverse=True)
    for movie in movies_list:
        print(movie.create_date)
    for movie in movies_list[:number]:
        print(movie.url)
        content=urllib.request.urlopen(movie.url).read().decode()
        magnet_url=get_magnet_url(content)
        print(movie.create_date,magnet_url)
        transmission_daemon.add_task_to_transmission(magnet_url)
#        subprocess.Popen(['transmission-cli','-m','-p',str(port),'-w','/home/wangjun/下载/Transmission',magnet_url])
#        if int(port)>65535:
#            port=51413
#        else:
#            port=int(port)+1
#    with open('/home/wangjun/projects/transmission_port_number.txt','w') as f:
#        f.write(str(port))
main()
