## [Install RabbitMQ](https://www.rabbitmq.com/install-debian.html) 
RabbitMQ necesita Erlang / OTP para ejecutarse. Los paquetes Erlang / OTP en los repositorios estándar de Debian y Ubuntu pueden estar significativamente desactualizados y no ser compatibles con las versiones modernas de RabbitMQ .
### Instalar Erlang desde un repositorio apto en Bintray
Agregar clave de repositorio
````
curl -fsSL https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc | sudo apt-key add -
````
Usamos un servidor de claves
````
sudo apt-key adv --keyserver "hkps://keys.openpgp.org" --recv-keys "0x0A9AF2115F4687BD29803A206B73A36E6026DFCA"
````
Para que apt pueda descargar los paquetes RabbitMQ y Erlang de Bintray, se debe instalar el paquete
````
sudo apt-get install apt-transport-https
````
Al igual que con todos los repositorios Apt (Debian) de terceros, se debe colocar un archivo que describa el repositorio en el directorio ``/etc/apt/sources.list.d/`` . ``/etc/apt/sources.list.d/bintray.erlang.list`` es la ubicación recomendada.

El archivo debe tener una línea de definición de origen (repositorio) que utilice el siguiente patrón:
````
deb https://dl.bintray.com/rabbitmq-erlang/debian $distribution $component
````
Para ubuntu 18, en el archivo ``/etc/apt/sources.list.d/bintray.erlang.list`` agregamos 
````
deb https://dl.bintray.com/rabbitmq-erlang/debian bionic erlang-22.x
````
Después tenemos que actualizar las fuentes de apt
````
sudo apt-get update -y
````
Y ahora instalamos
````
sudo apt-get install -y erlang-base \
                        erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
                        erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
                        erlang-runtime-tools erlang-snmp erlang-ssl \
                        erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl
````
Versión del paquete y fijación del repositorio, la fijación de paquetes se configura con un archivo ubicado en el directorio ``/etc/apt/preferences.d/`` , en nuestro caso, ``/etc/apt/preferences.d/erlang``
agregamos
````
# /etc/apt/preferences.d/erlang 
Paquete: erlang * 
Pin: release o = Bintray 
Pin-Priority: 1000
````
y actualizamos
````
sudo apt-get update -y
````
### Instalar RabbitMQ
Primero importamos la clave de PackageCloud 
````
wget -O - "https://packagecloud.io/rabbitmq/rabbitmq-server/gpgkey" | sudo apt-key add -
````
Luego configuramos la descarga de paquetes de Rabbit con el siguiente [script](https://packagecloud.io/rabbitmq/rabbitmq-server/install)
````
curl -s https://packagecloud.io/install/repositories/rabbitmq/rabbitmq-server/script.deb.sh | sudo bash
````
Luego instalamos la RabbitMQ con el siguiente comando
````
sudo apt-get install -y rabbitmq-server
````
Iniciamos rabbitmq
````
service rabbitmq-server start
````
Para habilitar la interfaz grafica
````
rabbitmq-plugins enable rabbitmq_management
````
## [Cambiar store data](https://www.rabbitmq.com/relocate.html)
Abrir/crear ``/etc/rabbitmq/rabbitmq-env.conf`` y agregar
````
RABBITMQ_MNESIA_DIR=/Mi-directorio
````
## Crear usuario 
Para crear un usuario 
````
rabbitmqctl add_user MiUsuario
````
para darle permiso de admin
````
rabbitmqctl set_user_tags MiUsuario administrator
````
