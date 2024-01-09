sudo docker compose -f /home/nop/Projects/bmstu_5sem/RestInPeace/awesomeProject/docker-compose.yml up

cd ~/Projects/bmstu_5sem/RestInPeaceAsyncService/
. env/bin/activate
python weather_predictor/manage.py runserver 0.0.0.0:8000

cd ~/Projects/bmstu_5sem/RestInPeace/awesomeProject/
redis-server redis.conf --save 20 1 --loglevel warning --requirepass password
