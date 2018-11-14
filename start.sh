# Installing npm for test cases
if [ ! -f /usr/bin/npm ]; then
    echo 'Installing npm'
    sudo apt-get install -y npm
else
    echo "npm already installed! Moving on."
fi

# Installing npm for test cases
if [ ! -f /usr/bin/mocha ]; then
    echo 'Installing mocha'
    npm i mocha
else
    echo "mocha already installed! Moving on."
fi

# Start docker 
sudo docker-compose up -d

# Start Test Cases
echo 'Test cases will follow'
npm test test/
exit 0