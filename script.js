 // function Dog(name, color, age) {
 //     this.name = name;
 //     this.color = color;
 //     this.age = age;

 //     this.aboie = function() {
 //         console.log("wouah wouah", this.name);
 //     }

 // }

 // var canich = new Dog("choupi", "blanche", 5);

 // console.log(canich);
 // canich.aboie();

 /*fonction qui vas etre lancer lorsque la fenetre vas s'afficher 
 onload évenement js qui vas etre lancer lorque on affiche la fenetre

 */

 window.onload = function() {

     var canvasWidth = 900;
     var canvasHeigth = 600
     var ctx;

     var delay = 100;
     var snakee;
     var blocSize = 30;
     var applee;
     var widthInBlocks = canvasWidth / blocSize;
     var heightInBlocks = canvasHeigth / blocSize;
     var scrore;
     var timeout;

     init(); //executer la fonction init()

     function init() {
         // element html(canevas) qui permet de desiner dans du html
         var canvas = document.createElement('canvas'); // creation du canvas
         canvas.width = canvasWidth;
         canvas.height = canvasHeigth;
         canvas.style.border = "30px solid gray";
         canvas.style.margin = "50px auto";
         canvas.style.display = "block";
         canvas.style.backgroundColor = "#ddd";

         // pour attacher le canvas a la page html
         document.body.appendChild(canvas);
         // pour dessiner dans le canvas on as besoin du context
         ctx = canvas.getContext('2d');
         snakee = new Snake([
             [6, 4],
             [5, 4],
             [4, 4]
         ], "right");
         applee = new Apple([10, 10]);
         scrore = 0
         refraichCanvas();


     }

     function refraichCanvas() {

         if (snakee.checkCollision()) {
             // game over
             gameOver();
         } else {
             if (snakee.isEatingApple(applee)) {
                 snakee.ateApple = true;
                 scrore++;
                 do {
                     applee.setNewPosition();
                 } while (applee.isOnSnake(snakee))

             }
             ctx.clearRect(0, 0, canvasWidth, canvasHeigth); // permet d'effacer tous le canvas
             // ctx.fillStyle  donner de la couleur au contexte
             drawScore(); // desiner le score
             snakee.draw(); // appel de la fonction pour dessiner le serpent
             applee.draw();

             snakee.advance(); // appel de la fonction pour le diriger
             //ctx.fillRect(xCoord, yCoord, 100, 50);  fonction pour dessiner le rectangle

             timeout = setTimeout(refraichCanvas, delay); // pour gerer la vitesse de deplacement de notre serpent en fonction du delay fourni
         }

         //permet d 'executer la fonction refraichCanvas lorsque le delay est passer
     }

     // pour afficher le texte game over lorsque le jeux fini

     function gameOver() {
         ctx.save(); // enregistrer les param de config du canvas
         ctx.font = "bold 70px sans-serif"; // font pour la police de caractere
         ctx.fillStyle = "#000";
         ctx.textAlign = "center";
         ctx.textBaseline = "middle";
         ctx.strokeStyle = "white"; // pour mettre un peu de bordure blanc sur le texte
         ctx.lineWidth = 5;
         var centerX = canvasWidth / 2;
         var centerY = canvasHeigth / 2;
         ctx.strokeText("Game Over", centerX, centerY - 180);
         ctx.fillText("Game Over", centerX, centerY - 180); // affiche le score
         var centerX = canvasWidth / 2;
         var centerY = canvasHeigth / 2;
         ctx.font = "bold 30px sans-serif";
         ctx.strokeText("Appuyer sur la touche espace pour rejouer", centerX, centerY - 120);
         ctx.fillText(" Appuyer sur la touche espace pour rejouer", centerX, centerY - 120);

         ctx.restore();
     }
     // function restar pour relancer le cjeux apres l'appui sur la touche espace
     function restart() {
         snakee = new Snake([
             [6, 4],
             [5, 4],
             [4, 4]
         ], "right");
         applee = new Apple([10, 10]);
         scrore = 0;
         clearTimeout(timeout); // pour eviter que lorsqu'on appui sur espace de serpent se deplace vite du coup avec cette fonction il garde la meme vitesse
         refraichCanvas();
     }

     function drawScore() {
         ctx.save(); // enregistrer les param de config du canvas
         ctx.font = "bold 200px sans-serif";
         ctx.fillStyle = "gray";
         ctx.textAlign = "center";
         ctx.textBaseline = "middle";
         var centerX = canvasWidth / 2;
         var centerY = canvasHeigth / 2;
         ctx.fillText(scrore.toString(), centerX, centerY); // toString pour convertire l'affichage de score qui est un string en chaine de caractere
         ctx.restore();
     }

     function drawBlock(ctx, position) {
         var x = position[0] * blocSize;
         var y = position[1] * blocSize;
         ctx.fillRect(x, y, blocSize, blocSize);
     }
     // fonction pour manipuler le serpent

     function Snake(body, direction) {
         this.body = body;
         this.direction = direction;
         this.ateApple = false;
         this.draw = function() {
             ctx.save();
             ctx.fillStyle = "#ff0000";
             for (var i = 0; i < this.body.length; i++) {
                 drawBlock(ctx, this.body[i]);
             }
             ctx.restore();
         };
         //fonction advance permet de diriger le serpent gauche droite et .....
         this.advance = function() {
             var nextPosition = this.body[0].slice();
             switch (this.direction) {
                 case "left":
                     nextPosition[0] -= 1;
                     break;
                 case "right":
                     nextPosition[0] += 1;
                     break;
                 case "down":
                     nextPosition[1] += 1;
                     break;
                 case "up":
                     nextPosition[1] -= 1;
                     break;
                 default:
                     throw ("Invalid Direction"); // fontion qui permet de dire s'il ya une arreur et affiche le message d'erreur
             }

             this.body.unshift(nextPosition); //permet de rajouter le contenue mis en paramettre a la premiere place
             // this.body.pop(); // permet de supprimer le dernier element du tableau
             if (!this.ateApple) {
                 this.body.pop();
             } else {
                 this.ateApple = false;
             }

         };

         this.setDirection = function(newDirection) {
             var allowedDirection; // direction permisse
             switch (this.direction) {
                 case "left":
                 case "right":
                     allowedDirection = ["up", "down"];
                     break;
                 case "down":
                 case "up":
                     allowedDirection = ["left", "right"];
                     break;
                 default:
                     throw ("Invalide Direction");
             }

             if (allowedDirection.indexOf(newDirection) > -1) {
                 this.direction = newDirection;
             }
         };
         // fonction qui verifie s'il yas une collission
         this.checkCollision = function() {
             var wallCollision = false;
             var snakeCollision = false;
             var head = this.body[0];
             var rest = this.body.slice(1); // fonction slice copie tout le reste sauf la valeur 0
             var snakeX = head[0];
             var snakeY = head[1];
             var minX = 0;
             var minY = 0;
             var maxX = widthInBlocks - 1;
             var maxY = heightInBlocks - 1;
             var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
             var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY; // si le serpent c'est pris le mur d'en haut ou pas

             if (isNotBetweenVerticalWalls || isNotBetweenHorizontalWalls) {
                 wallCollision = true; //verifie s'il y'a une collision de mur
             }

             for (var i = 0; i < rest.length; i++) {
                 if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                     snakeCollision = true; // collision du serpent
                 }
             }

             return wallCollision || snakeCollision;


         };

         // fonction pour manger la pomme

         this.isEatingApple = function(appleToEat) //pomme donner en argument
             {
                 var head = this.body[0];
                 if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                     return true;
                 } else {
                     return false;
                 }


             };
     }
     // fonction pour construire la pomme
     function Apple(position) {
         this.position = position;
         this.draw = function() {
             ctx.save(); // permet de sauvegarder les ancienne configuration du canvas
             ctx.fillStyle = "#33cc33";
             ctx.beginPath();
             var raduis = blocSize / 2;
             var x = this.position[0] * blocSize + raduis;
             var y = this.position[1] * blocSize + raduis;
             ctx.arc(x, y, raduis, 0, Math.PI * 2, true);
             ctx.fill();

             ctx.restore(); // renet le config du canvas a l'etat ou on l'a laiser
         };
         // fonction qui permet de choisir une nouvelle position a la pomme apres etre manger par le serpent
         this.setNewPosition = function() {
             var newX = Math.round(Math.random() * (widthInBlocks - 1)); // round donner l'arrondi d'un chiffre compris ici entre 0 et 29
             var newY = Math.round(Math.random() * (widthInBlocks - 1)); // round donner l'arrondi d'un chiffre compris ici entre 0 et 29
             this.position = [newX, newY];
         };
         // fonction qui verifie si la pomme apparait sur le corps du serpent
         this.isOnSnake = function(snakeToCheck) {
             var isOnSnake = false; // je ne suis pas sur le serpent
             for (var i = 0; i < snakeToCheck.body.length; i++) {
                 if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                     isOnSnake = true;
                 }

             }
             return isOnSnake;
         };

     }
     // fonction pour changerf la direction a l'appui des touche du clavier
     document.onkeydown = function handlekeyDown(e) // fonction qui reagir lorsque l'utilisateur appui sur le clavier 
         {
             var key = e.keyCode;
             var newDirection;
             switch (key) {
                 case 37: // code qui correspond a la fleche qui va a gauche
                     newDirection = "left";
                     break;
                 case 38:
                     newDirection = "up";
                     break;
                 case 39:
                     newDirection = "right";
                     break;
                 case 40:
                     newDirection = "down";
                     break;
                 case 32: // code pour la touche espace
                     restart();
                     return;
                 default:
                     return;

             }
             snakee.setDirection(newDirection);
         }
 }