Manager App: 
• is a Nodejs app, run inside a container with access to the host machine's docker engine (through an unix stream, i.e. "/var/run/docker.sock").
• Uses a provided "entrypoint" settings to performs commands on docker engine on the host machine, related to running different containers and compose files. 
• Provides a gateway as a CLI tool (allows choosing entrypoint setting) or GUI tool (web browser container manager interface), instead of dealing with shell commands and maintaining them. 
