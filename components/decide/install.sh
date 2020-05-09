sudo -i
apt update
apt-get install -y snapd
snap install docker
snap start docker

cd ~/

git clone https://github.com/loomio/loomio-deploy.git
cd loomio-deploy

#substitute
./scripts/create_env loomio.example.com you@contact.email

#replace in env
SMTP_SERVER=
SMTP_USERNAME=smtpusername
SMTP_PASSWORD=smtppassword

snap start docker.dockerd
docker-compose up -d db
docker-compose run app rake db:setup

echo "Setting up cron job"
CRON_FILE = "/var/spool/cron/root"
if [ ! -f $CRON_FILE ]; then
    touch $CRON_FILE
    crontab $CRON_FILE
fi
grep -qi "loomio-worker" $CRON_FILE
if [ $? != 0 ]; then
    echo "0 * * * *  /snap/bin/docker exec loomio-worker bundle exec rake loomio:hourly_tasks > ~/rake.log 2>&1" >> $CRON_FILE
fi
