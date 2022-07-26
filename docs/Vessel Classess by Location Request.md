# Vessel Classess by Location Request #
#######################################

POST /brcglobal/ajax/vessels/retrieve_vessel_class.php HTTP/2
Host: boatreservations.freedomboatclub.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0
Accept: application/xml, text/xml, */*; q=0.01
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Content-Length: 20
Origin: https://boatreservations.freedomboatclub.com
DNT: 1
Connection: keep-alive
Referer: https://boatreservations.freedomboatclub.com/cp/member/53/73052/reservations/avail
Cookie: BoatReservationPassport=e1322p4bqfg8t8s45oihd6u103; remember_user=freedom.boat.club.9pia13iz%40stephengfriend.com; __cf_bm=VZGuiNipr0aaZxCyz0N3YdGcOIR8hyo8ZPrr6.kbJXI-1635099566-0-ASEOEeEWgBgOkl1blVWk6b2xDoLImS8PCSKA8U1qN4tMnXpWQjeg5lp6nvir5HA9KM9N/k3C47pknlIt0zcnrpzAoexkYlhnN4X+xgWvAIrc/RcCgbABjAhYzVtxeOBpJw==
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
TE: trailers

club=53&location=159

HTTP/2 200 OK
date: Sun, 24 Oct 2021 18:30:08 GMT
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
cf-ray: 6a35464bbfe60a02-MIA
content-encoding: gzip
X-Firefox-Spdy: h2

<?xml version="1.0" ?><response><html><![CDATA[<div class="input_select mt10" onclick="select_change('open','classification')">
					<div id="classification_view" class="input_select_int select_text left">
						<span>Select Vessel Classification</span>
					</div>
					<div class="select_button right">
						<div class="input_select_int" onclick="select_change('open','classification')">
							<span>Select</span>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="input_select_data" id="classification_data">
					<div class="input_select_data_int">
						<div class="input_select_surround">
							<div class="input_selection" onclick="select_change('select','classification','','<span>All Classes</span>')">
								<div class="input_selection_int"><span>All</span></div>
							</div><div class="input_selection" onclick="select_change('select','classification','2','Cruising Only')"><div class="input_selection_int">Cruising Only</div></div><div class="input_selection" onclick="select_change('select','classification','6','Cruising/Fishing Only')"><div class="input_selection_int">Cruising/Fishing Only</div></div><div class="input_selection" onclick="select_change('select','classification','5','Pontoon Only')"><div class="input_selection_int">Pontoon Only</div></div></div></div></div>
				<input type="hidden" id="classification" value="" />]]></html></response>
