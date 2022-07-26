# Vessel Availability Request #
###############################

POST /brcglobal/ajax/reservations/avail.php HTTP/2
Host: boatreservations.freedomboatclub.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0
Accept: application/xml, text/xml, */*; q=0.01
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Content-Length: 121
Origin: https://boatreservations.freedomboatclub.com
DNT: 1
Connection: keep-alive
Referer: https://boatreservations.freedomboatclub.com/cp/member/53/73052/reservations/avail
Cookie: BoatReservationPassport=e1322p4bqfg8t8s45oihd6u103; remember_user=freedom.boat.club.9pia13iz%40stephengfriend.com; __cf_bm=f1WOYUxITISNCcPzYtQZRGIJAr1V57R6s3D53ckWcVg-1635119405-0-ARCdHPjI4lrkjA+3+X7SNmCRAkCyuW2Gyft3isv37Ogj6hCgQZP3WQHIhHf2NjyfBKQPeGMwghAbqsWHF3hLsQUuz1i8oUN+IX9JfDzOYsf5KJiZVS8qy8MtQvuV2GZzrg==
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
TE: trailers

club=53&member=73052&location=348&date=2021-10-30&vessel=3766&type=reserve_confirm&notHiddenTimes=&passengers%5B%5D=73053

HTTP/2 200 OK
date: Sun, 24 Oct 2021 23:54:57 GMT
content-type: text/xml
expires: Thu, 19 Nov 1981 08:52:00 GMT
cache-control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0
pragma: no-cache
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
x-xss-protection: 1; mode=block
cf-cache-status: DYNAMIC
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
server: cloudflare
cf-ray: 6a37221debc6097d-MIA
content-encoding: gzip
X-Firefox-Spdy: h2

<?xml version="1.0" ?><response><type><![CDATA[success]]></type><html><![CDATA[<div class="platform mb10"><div class="platform_int">
										<div class="label left bernie3">Weekend - AM - Winter 21/22 (8:00 AM - 12:00 PM)</div><div class="reservation_button right bernie1a" onclick="make_avail('reserve_summary','6347','2021-11-07','3010--Weekend - AM - Winter 21/22--8:00 AM--12:00 PM');"><div class="int">Reserve</div></div><div class="clear"></div>
									</div></div><div class="platform mb10"><div class="platform_int">
										<div class="label left bernie3">Weekend - PM - Winter 21/22 (1:00 PM - 6:13 PM)</div><div class="reservation_button right bernie2" onclick="make_avail('waitlist_confirm','6347','2021-11-07','Bay A Weigh (21\' Cobia Bay/CC 115hp Yam)','');"><div class="int">+ Waitlist</div></div><div class="clear"></div>
									</div></div><div class="platform mb10"><div class="platform_int">
										<div class="label left bernie3">Weekend - Full Day - Winter 21/22 (8:00 AM - 6:13 PM)</div><div class="reservation_button right bernie2" onclick="make_avail('waitlist_confirm','6347','2021-11-07','Bay A Weigh (21\' Cobia Bay/CC 115hp Yam)','');"><div class="int">+ Waitlist</div></div><div class="clear"></div>
									</div></div>]]></html></response>
