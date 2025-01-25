 //init the stuff
 const images = document.querySelectorAll(".draggable");
 const itemsBox = document.getElementById("itemsBox");
 const soundPickUp = new Audio("sfx/pickup.mp3");
 const soundDrop = new Audio("sfx/dropped.mp3");
 soundPickUp.volume = 0.2;
 soundDrop.volume = 0.1;

 const lightsoff = new Audio("sfx/lightsoff.mp3");
 const lightson = new Audio("sfx/lightson.mp3");
 const chord = new Audio("sfx/chord.mp3");
 const soundPurr = new Audio("sfx/purr.mp3");
 const scrunch = new Audio("sfx/scrunch.mp3");
 const squeak = new Audio("sfx/squeak.mp3");
 const paper = new Audio("sfx/paper.mp3");
 soundPurr.volume = 0.5;

 const guitarPick = document.getElementById("guitar-pick");
 const guitarra = document.getElementById("guitarra");

 guitarPick.addEventListener("mousemove", isTouching);

 function isTouching() {
     const pickRect = guitarPick.getBoundingClientRect();

     const guitarRect = guitarra.getBoundingClientRect();

     if (
         !(
             pickRect.right < guitarRect.left ||
             pickRect.left > guitarRect.right ||
             pickRect.bottom < guitarRect.top ||
             pickRect.top > guitarRect.bottom
         )
     ) {
         chord.play();
     }
 }

 // just important variables
 let zIndex = 2;
 let isDarkMode = 0;
 const artTools = ["brush", "lapiz", "goma"];

 function enableInteract() {
     images.forEach((image) => {
         image.style.pointerEvents = "auto";
         if (!image.classList.contains("bowtie")) {
             image.style.filter = "drop-shadow(0px 0px 2px rgba(3, 1, 23, 0.831))";
         }
         image.addEventListener("mousedown", startDrag);
         image.addEventListener("mouseover", mouseOver);

         image.addEventListener("touchstart", startDrag, {
             passive: false,
         });
     });
 }

 function disableInteract() {
     images.forEach((image) => {
         image.style.pointerEvents = "none";

         image.removeEventListener("mouseout", mouseOut);
         image.removeEventListener("mousedown", startDrag);
         image.removeEventListener("mouseover", mouseOver);
     });
     if (paintMode) {
         images.forEach((image) => {
             if (artTools.includes(image.id)) {
                 image.style.pointerEvents = "auto";
                 image.style.cursor = "pointer";
                 image.style.filter =
                     "drop-shadow(0px 0px 6px rgba(255, 189, 197, 1))";
                 image.addEventListener("mousedown", paintMouseDown);
                 console.log("test");
             }
         });
     } else {
     }
 }

 function paintMouseDown(e) {
     this.style.filter = "drop-shadow(0px 0px 6px rgba(255, 189, 197, 1))";
     this.style.cursor = "pointer";
 }

 // for simply hovering it will brighten the image
 function mouseOver(e) {
     this.style.filter =
         "drop-shadow(0px 0px 2px rgba(3, 1, 23, 0.831)) brightness(110%) ";
     this.addEventListener("mouseout", mouseOut);
     this.style.cursor = "pointer";
     this.style.pointerEvents = "auto";
 }

 // when user stops hovering
 function mouseOut(e) {
     this.style.filter = "drop-shadow(0px 0px 3px rgba(3, 1, 23, 0.831))";
     this.removeEventListener("mouseout", mouseOut);
 }

 // gets the scale of the html element for responsive widths
 function getScaleFactor() {
     const scale = window
         .getComputedStyle(document.documentElement)
         .getPropertyValue("scale");
     return parseFloat(scale) || 1;
 }

 //when mouseclick is detected
 function startDrag(e) {
     soundPickUp.play();
     // Start dragging
     isDragging = false;

     //transformation stuff
     e.preventDefault();
     let startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
     let startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
     let newX = 0;
     let newY = 0;

     //cosmetic
     this.style.filter =
         "drop-shadow(2px 2px 4px rgba(3, 1, 23, 0.831)) brightness(110%)";
     this.style.transform = "scale(1.03)";
     soundDrop.volume = 0.02;

     const scaleFactor = getScaleFactor();

     // if user actually moves the mouse
     const drag = (e) => {
         soundDrop.volume = 0.1;
         e.preventDefault();

         //divides by scale factor because yeah
         newX =
             (startX -
                 (e.type === "touchmove" ? e.touches[0].clientX : e.clientX)) /
             scaleFactor;
         newY =
             (startY -
                 (e.type === "touchmove" ? e.touches[0].clientY : e.clientY)) /
             scaleFactor;

         startX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
         startY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

         //cosmetic
         this.style.filter =
             "drop-shadow(10px 10px 7px rgba(3, 1, 23, 0.531)) brightness(110%)";
         this.style.transform = "scale(1.05)";

         // Move the this
         this.style.top = this.offsetTop - newY + "px";
         this.style.left = this.offsetLeft - newX + "px";

         isDragging = true;

         if (this.id == "guitar-pick") {
             playGuitarSound();
         }
     };

     const endDrag = (e) => {
         soundDrop.play();

         //cosmetic effects
         this.style.filter =
             "drop-shadow(0px 0px 3px rgba(3, 1, 23, 0.831)) brightness(110%)";
         this.style.transform = "scale(1)";

         //if its a bowtie it will randomly rotate it a certain amount when its dropped
         if (e.target.id.includes("bowtie")) {
             let bowtieRotation = Math.floor(Math.random() * 80) - 40;
             this.style.transform = "rotate(" + bowtieRotation + "deg)";
         }

         // Remove event listeners when mouse is released
         document.removeEventListener("mousemove", drag);
         document.removeEventListener("mouseup", endDrag);
         this.addEventListener("mouseover", mouseOver);

         document.removeEventListener("touchmove", drag, {
             passive: false,
         });
         document.removeEventListener("touchend", endDrag, {
             passive: false,
         });
     };

     // Add event listeners for mousemove and mouseup
     document.addEventListener("mousemove", drag);
     document.addEventListener("mouseup", endDrag);

     document.addEventListener("touchmove", drag, {
         passive: false,
     });
     document.addEventListener("touchend", endDrag, {
         passive: false,
     });
 }

 //prevents link from opening if the user has dragged the thing
 this.addEventListener("click", function (e) {
     if (isDragging) {
         e.preventDefault(); // Prevent the link from being activated
     }
 });

 //adds sticky note
 function sticky(color) {
     if (!isDragging) {
         let sticky = document.getElementById(color);
         let ventana = document.getElementById("ventana");
         var imgTop = sticky.style.top;
         var imgLeft = sticky.style.left;
         var newDiv = document.createElement("div");
         newDiv.innerHTML = '<img src="img/' + color + '-one.png"/>';

         newDiv.classList.add("draggable");
         newDiv.addEventListener("mousedown", startDrag);
         newDiv.addEventListener("mouseover", mouseOver);

         newDiv.style.position = "absolute";
         newDiv.style.zIndex = sticky.style.zIndex + 2;
         newDiv.style.top = imgTop;
         newDiv.style.left = imgLeft;

         ventana.appendChild(newDiv);
     }
 }

 //changes the overlay div to be visible, it's already there but you can't see it. essentially when lamp is clicked it will change the opacity
 function lights() {
     if (!isDragging) {
         const overlay = document.getElementById("overlay");
         const bg = document.body;

         if (isDarkMode === 0) {
             overlay.style.opacity = 1;
             isDarkMode = 1;
             lightsoff.play();
         } else {
             overlay.style.opacity = 0;
             isDarkMode = 0;
             lightson.play();
         }
     } else {
     }
 }

 let painting = false;
 let paintMode = false;
 let currentTool = "brush"; // Herramienta seleccionada
 let ctx = canvas.getContext("2d");

 function paint(toolname) {
     function startPosition(e) {
         if (paintMode) {
             painting = true;
             draw(e); // Para comenzar a dibujar inmediatamente
         }
     }

     function endPosition() {
         painting = false;
         ctx.beginPath(); // Reinicia el trazo independientemente de la herramienta
     }

     function draw(e) {
         if (!painting) return;

         let x = e.clientX - canvas.offsetLeft;
         let y = e.clientY - canvas.offsetTop;

         // Configuración de la herramienta
         switch (currentTool) {
             case "brush":
                 ctx.globalCompositeOperation = "source-over";
                 ctx.lineWidth = 8;
                 ctx.strokeStyle = "#782434";
                 ctx.shadowColor = "#782434";
                 ctx.shadowBlur = 4;
                 break;

             case "lapiz":
                 ctx.globalCompositeOperation = "source-over";
                 ctx.lineWidth = 3;
                 ctx.strokeStyle = "#212233";
                 ctx.shadowColor = "#212233";
                 ctx.shadowBlur = 4;
                 break;
             case "goma":
                 ctx.globalCompositeOperation = "destination-out"; // Borra contenido
                 ctx.lineWidth = 20; // Tamaño de la goma
                 ctx.strokeStyle = "rgba(0,0,0,1)"; // No importa el color aquí
                 ctx.shadowBlur = 3; // Sin sombras
                 break;
         }

         ctx.lineCap = "round";
         ctx.lineJoin = "round";
         ctx.lineTo(x, y);
         ctx.stroke();
         ctx.beginPath();
         ctx.moveTo(x, y);
     }

     if (!paintMode && !isDragging) {
         currentTool = toolname;
         paintMode = true;
         console.log("paintmode on");
         console.log("selected tool " + toolname);
         disableInteract();
         canvas.addEventListener("mousedown", startPosition);
         canvas.addEventListener("mouseup", endPosition);
         canvas.addEventListener("mousemove", draw);
     } else {
         paintMode = false;
         enableInteract();
         console.log("paintmode off");

         canvas.removeEventListener("mousedown", startPosition);
         canvas.removeEventListener("mouseup", endPosition);
         canvas.removeEventListener("mousemove", draw);
     }
 }

 bgArray = [
     "paper",
     "balcony",
     "hmas",
     "paper",
     "sea",
     "street",
     "street2",
     "sun",
 ];

 function changeBg() {
     let newBg = bgArray[Math.floor(Math.random() * 8)];
     document.documentElement.style.backgroundImage =
         "url('img/bg/bg-" + newBg + ".jpg')";
     if (newBg != "paper") {
         document.documentElement.style.backdropFilter = "blur(10px)"; // Sin punto y coma
     } else {
         document.documentElement.style.backdropFilter = "blur(0px)";
     }
     console.log("hola");
 }

 document.getElementById("periodico").addEventListener("click", function () {
     if (!isDragging) {
         paper.play();
         const img = this;
         const srcNuevo = "img/periodico-2.png";

         img.src = srcNuevo;
     }
 });

 document.getElementById("gata").addEventListener("click", function () {
     if (!isDragging) {
         soundPurr.play();
         const img = this;
         const srcOriginal = "img/gata.png";
         const srcNuevo = "img/gata-2.png";

         //cambiar a la nueva imagen
         img.src = srcNuevo;

         setTimeout(() => {
             img.src = srcOriginal;
         }, 1000);
     }
 });

 document.getElementById("paper").addEventListener("click", function () {
     if (!isDragging) {
         scrunch.play();
         const img = this;
         const srcOriginal = "img/paper.png";
         const srcNuevo = "img/paper-2.png";
         if (img.src.includes(srcOriginal)) {
             img.src = srcNuevo;
         } else {
             img.src = srcOriginal;
         }
     }
 });

 document.getElementById("libro").addEventListener("click", function () {
     if (!isDragging) {
         paper.play();
         const img = this;
         const srcOriginal = "img/libro.png";
         const srcNuevo = "img/libro-2.png";
         if (img.src.includes(srcOriginal)) {
             img.src = srcNuevo;
         } else {
             img.src = srcOriginal;
         }
     }
 });

 document.getElementById("cuaderno").addEventListener("click", function () {
     if (!isDragging) {
         paper.play();
         const img = this;
         const srcOriginal = "img/cuaderno-1.png";
         const srcNuevo = "img/cuaderno-2.png";
         if (img.src.includes(srcOriginal)) {
             img.src = srcNuevo;
         } else {
             img.src = srcOriginal;
         }
     }
 });

 document.getElementById("rato").addEventListener("click", function () {
     if (!isDragging) {
         squeak.play();
         const windowWidth = window.innerWidth;
         const windowHeight = window.innerHeight;

         const randomX = Math.floor(
             (Math.random() / 5) * (windowWidth - this.width)
         );
         const randomY = Math.floor(
             (Math.random() / 5) * (windowHeight - this.height)
         );

         this.style.left = `${randomX}px`;
         this.style.top = `${randomY}px`;
     }
 });

 enableInteract();
 // loads the stuff in case previous 'save' is detected.

 document.addEventListener("DOMContentLoaded", () => {
     document.documentElement.style.filter = "brightness(100%)";
 });