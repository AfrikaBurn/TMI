sudo docker-compose pull
sudo docker-compose down
sudo docker-compose run app rake db:migrate
sudo docker-compose up -d