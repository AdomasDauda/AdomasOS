var mouseX, mouseY, key;

window.onload = function(){
    onmousemove = function(e){
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    onkeydown = function(e){
        key = e.key;
    }
}

document.getElementById('newTerminal').addEventListener('click', () => {
    new Terminal();
});

class Terminal {
    constructor() {
        this.lines = new Array();

        this.workingDirectory = '/adomasdauda/home'
        this.isMouseOverTopBar = false;
        this.closing = false;
        this.isMouseOverTerminalField = false;

        this.createElements();
        this.addEventLiteners();

        this.contentsOfFiles = new Map();
        this.contentsOfFiles.set('bio.txt', 'I am Adomas Daudaravicius. I am a developer!');
        this.contentsOfFiles.set('quotes.txt', 'Varysit kazka palost?');
        this.contentsOfFiles.set("secret.txt', 'shhhh don't tell anyone that I don't actualy study.");
        this.contentsOfFiles.set('password.txt', 'stimpee123');

        this.files = new Map();
        this.files.set('/adomasdauda/home', 'bio.txt quotes.txt secret.txt');
        this.files.set('/adomasdauda/', 'password.txt');


        this.commands = new Map();
        this.commands.set('>pwd', this.workingDirectory)
        this.commands.set('>ls', this.files.get(this.workingDirectory));
        this.commands.set('>cat bio.txt', this.contentsOfFiles.get('bio.txt'))
        this.commands.set('>cat quotes.txt', this.contentsOfFiles.get('quotes.txt'))
        this.commands.set('>cat secret.txt', this.contentsOfFiles.get('secret.txt'))
        this.terminal;
    }


    // create all of the components
    createElements = () => {
        this.terminal = document.createElement('div');
        this.terminal.className = 'terminal_window';
    
        this.topbar = document.createElement('div');
        this.topbar.className = 'topbar';
        this.terminal.appendChild(this.topbar);

        this.lowerbutton = document.createElement('button');
        this.lowerbutton.className = 'topbarelement right';
        this.lowerbutton.textContent = '_';
        this.topbar.appendChild(this.lowerbutton);
    
        this.closebutton = document.createElement('button');
        this.closebutton.className = 'topbarelement';
        this.closebutton.textContent = 'X';
        this.topbar.appendChild(this.closebutton);

        this.terminalField = document.createElement('div');
        this.terminalField.className = 'terminalfield';

        this.createNewLine('This is ADOMAS OS TERMINAL!');
        this.createNewLine('>');
        this.terminal.appendChild(this.terminalField);


        document.body.appendChild(this.terminal);
    }


    // add event listerners to all of the above interactable components
    addEventLiteners = () => {

        this.terminalField.addEventListener('mouseover', () => {
            this.isMouseOverTerminalField = true;
        });

        this.terminalField.addEventListener('mouseleave', () => {
            this.isMouseOverTerminalField = false;
        });

        document.addEventListener('click', () => {
            if (this.isMouseOverTerminalField == true){
                this.isFieldSelected = true;
                return;
            }
            this.isFieldSelected = false;
        });

        document.addEventListener('keydown', ()=> {
            if (this.isFieldSelected == true){
                setTimeout(() => {
                    if (key == 'Enter'){
                        if (this.text.textContent == '>clear'){
                            this.lines.forEach(line => {
                                this.terminalField.removeChild(line);
                            });

                            this.lines = new Array();
                            this.createNewLine('>');
                            return;
                        }

                        if (!this.commands.has(this.text.textContent)) {
                            this.createErrorLine('Invalid command. Maybe try pwd, ls or cat?');
                            this.createNewLine('>');
                            return;
                        }


                        this.createNewLine(this.commands.get(this.text.textContent));
                        this.createNewLine('>');
                        return;
                    }
                    

                    if (key == 'Backspace'){
                        if (this.text.textContent.length > 1){
                            this.text.textContent = this.text.textContent.substring(0, this.text.textContent.length-1);
                        }
                        return; 
                    }

                    this.text.textContent = this.text.textContent + key;
                }, 1)
            }
        });

        this.closebutton.addEventListener('click', () => {
            if (this.closing == false){ // to avoid multiple closes
                this.closing = true;
                this.terminal.style.width = '0%';
                this.terminal.style.height = '0%';
                this.terminal.style.opacity = 0.0;

                this.terminal.style.left = document.getElementById('newTerminal').offsetLeft + '%';
                this.terminal.style.top = document.getElementById('newTerminal').offsetHeight + '%';
                setTimeout(() => {
                    document.body.removeChild(this.terminal)
                }, 80);
            }

        });

        this.topbar.addEventListener('mouseover', () =>{
            this.isMouseOverTopBar = true;
        });
        
        this.topbar.addEventListener('mouseleave', () =>{
            this.isMouseOverTopBar = false;
        });

        document.addEventListener('mousedown', () => {
            if (this.isMouseOverTopBar == true){
                this.pickUpPosX = mouseX;
                this.pickUpPosY = mouseY;
        
                this.pickUpPosWindowX = this.terminal.offsetLeft;
                this.pickUpPosWindowY = this.terminal.offsetTop;
                
                console.log(this.pickUpPosWindowX, this.pickUpPosWindowY);

                this.loop = setInterval(() => {


                    let dx = mouseX - this.pickUpPosX + this.pickUpPosWindowX;
                    let dy = mouseY - this.pickUpPosY + this.pickUpPosWindowY;
    
                    this.terminal.style.left = dx + 'px';
                    this.terminal.style.top = dy + 'px';
                }, 0)
            }
        });
        
        document.addEventListener('mouseup', () => {
            clearInterval(this.loop)
        });
    }

    createNewLine = (text) => {
        this.text = document.createElement('p');
        this.text.className = 'terminaltext';
        this.text.textContent = text;
        this.terminalField.appendChild(this.text);
        this.lines.push(this.text);
        this.checkForTooManyLines();
    }

    createErrorLine = (text) => {
        this.text = document.createElement('p');
        this.text.className = 'terminalerror';
        this.text.textContent = text;
        this.terminalField.appendChild(this.text);
        this.lines.push(this.text);
        this.checkForTooManyLines();
    }

    checkForTooManyLines = () => {
        if (this.lines.length > 13){
            this.terminalField.removeChild(this.lines[0]);
            this.lines = this.lines.slice(1,this.lines.length);
        }
    }
}