# Fixes Error message: 'No space left on device'

sudo service docker stop
sudo rm -rvf /var/lib/docker
sudo dockerd --storage-opt dm.basesize=20G
sudo service docker start
