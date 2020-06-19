# Quorum
Material for Quorum trainings

## Directories
- *contract:* Smart contracts & Truffle config files
- *example-app:* Source code to run example application
- *run-nodes:* Config files to back up quorum-wizard generated files  
  (For a 3-node Raft Quorum network in Docker)


## Course Prerequisites:
1. Node.js and NPM package manager
1. Install Quorum Wizard:  
    - `npm install -g quorum-wizard`
  
1. Make sure you have Docker installed.
    - test with the command `docker --version`
    - [Mac install instructions](https://docs.docker.com/docker-for-mac/install/)
    - [Ubuntu install instructions](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
    - [Windows 10 + WSL install instructions](https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly)

1. Check that `docker-compose` command is available:  
    - `docker-compose --help`

1. Ensure Docker has access to enough memory. We recommend commiting at least 6 gb memory, but no more than 50% of your system's resources for this tutorial.
    -In Docker Desktop Setting, select "Advanced" and slide the Memory slider to 6144 (or higher) OR up to 50% of available memory.

1. Optional: Install Metamask wallet as browser extension on Google Chrome or Firefox
