# log2map
web app to make maps from logs

Log2Map: Upload your log files and make equidistant azimuthal maps!

By Jeff Laughlin, N1YWB, Principal, Jeff Laughlin Consulting LLC

jeff@jefflaughlinconsulting.com

http://jefflaughlinconsulting.com

Steps

1. Log in to your QRZ XML Account (Optional)
2. Upload your log files
3. Look at pretty maps! (Example)

Important

A QRZ XML subscription is highly recommended. Your password is
transmitted securely to QRZ over SSL and is not stored. If you
skip QRZ the system will only be able to look up DXCC entities
from callsign prefixes. This makes the map a lot less interesting.

In order to get the most value out of this service it's important to use QRZ.com to georeference the callsigns in your log. QRZ is the only service available with global location data.

The service does have two fallback mechanisms.

For FCC licensees the service will attempt locate the call by zipcode.

For DX stations, the service will attempt to identify the DXCC entity by callsign prefix, but this is very low accuracy and puts all QSOs in the center of their country and it breaks on funny callsigns.

QRZ data is much more interesting.

Security Note: Your password is sent from your browser directly to QRZ.com via SSL AJAX request. Your password is not sent to any other server. It is not stored anywhere. After QRZ authenticates you, it sends back a session key, which is sent to my server and used to lookup the calls in your log. Session keys are ONLY useful for looking up callsigns via QRZ XML API. They expire after 24 hours. Nevertheless I do not store the session key on my server; it's forgotten once georeferencing is complete.

I DO cache the result of QRZ lookups so repeat log uploads should be fast.

Your QRZ account must be subscribed to the QRZ.com XML Logbook Data service. Current price: $29.95/yr. If you know of a cheaper/better alternative, let me know.

Log file must contain the operators callsign

Tested with cabrillo v2

If your log file doesn't work, please email it to me at jeff@jefflaughlinconsulting.com or better yet open a ticket on github.

