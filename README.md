# canli-tv-scrape
nodejs scraping örnekleri

bikaç ay önce yazdığımdan dolayı yayınların bulunduğu siteler değişmiş olabilir çalışmayan yayınları sitelerine gidip yayın linkini bulmak için uygun regex yazıp jsonChannels.json dosyasını düzenleyebilirsiniz.

jsonChannels.json

url = yayının yayınlandığı official url.
freeStream = eğer yayında ip bazlı token koruması yoksa linki bulup direk yazabilrsiniz.
regex = yayın linkini bulmak için yazacağınız string. http://regexr.com/ burdan öğrenebilirsiniz.
get = eğer yayın linkinin bulunduğu embed link referrer korumalı ise embed linki buraya yazıp url kısmına referrer adresini yazın.

ip bazlı token korumalı yayınları oynatabilmeniz için aynı ip adresine sahip olmanız gerekir.lan üzerinden bilgisayarınızda çalıştırıp tv de kodi programında bu listeyi açabilirsiniz http://192.168.x.x/list/m3u8
bazı kanallarda ek korumalar bulunmakta onlar içinde 2 tane örnek yazdım bakıp başka kanallarada yazabilirsiniz.
