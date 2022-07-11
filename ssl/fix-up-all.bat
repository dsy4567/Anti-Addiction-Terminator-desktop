del /q rootCA.crt
del /q rootCA.key
del /q rootCA.srl

del /q server.crt
del /q server.key
del /q server.csr

.\openssl req -x509 -sha256 -days 3560 -nodes -newkey rsa:2048 -subj "/CN=dsy4567.Anti-Addiction-Terminator/C=CN/O=dsy4567" -keyout rootCA.key -out rootCA.crt
.\openssl genrsa -out server.key 2048
.\openssl req -new -key server.key -out server.csr -config csr.conf
.\openssl x509 -req -in server.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out server.crt -days 365 -sha256 -extfile cert.conf

.\rootCA.crt