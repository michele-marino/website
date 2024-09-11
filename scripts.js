document.addEventListener('DOMContentLoaded', () => {
    function initializeScrollSection(sectionId) {
        const scrollSection = document.querySelector(`#${sectionId}`);
        const scrollContent = scrollSection.querySelector('.scroll-content');
        const contents = scrollContent.querySelectorAll('.scrolling-part');

        let index = 0;
        let scrollCounter = 0;
        const scrollThreshold = 20; // Adjust as needed to make the scroll less sensitive

        scrollSection.addEventListener('wheel', (event) => {
            event.preventDefault();

            // Update scroll counter based on scroll direction
            scrollCounter += event.deltaY;

            if (scrollCounter > scrollThreshold) {
                // Scroll down
                index = (index + 1) % contents.length;
                scrollContent.style.transform = `translateX(-${index * 100}vw)`;
                scrollCounter = 0; // Reset counter
            } else if (scrollCounter < -scrollThreshold) {
                // Scroll up
                index = (index - 1 + contents.length) % contents.length;
                scrollContent.style.transform = `translateX(-${index * 100}vw)`;
                scrollCounter = 0; // Reset counter
            }
        });

        // Handle touch events for mobile
        let touchStartX = 0;

        scrollSection.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
        });

        scrollSection.addEventListener('touchmove', (event) => {
            const touchEndX = event.touches[0].clientX;
            const touchDeltaX = touchStartX - touchEndX;

            if (touchDeltaX > scrollThreshold) {
                // Swipe left
                index = (index + 1) % contents.length;
                scrollContent.style.transform = `translateX(-${index * 100}vw)`;
                touchStartX = touchEndX; // Reset touch start
            } else if (touchDeltaX < -scrollThreshold) {
                // Swipe right
                index = (index - 1 + contents.length) % contents.length;
                scrollContent.style.transform = `translateX(-${index * 100}vw)`;
                touchStartX = touchEndX; // Reset touch start
            }
        });
    }

    // Initialize both scroll sections
    initializeScrollSection('scroll-section-1');
    initializeScrollSection('scroll-section-2');
    // Babylon.js setup
    function createScene(canvas, engine) {
        // This creates a basic Babylon Scene object (non-mesh)
        //var scene = new BABYLON.Scene(engine);

        // This creates and positions a free camera (non-mesh)
        //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        // This targets the camera to scene origin
        //camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        //camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        //var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        //light.intensity = 0.7;

        // Our built-in 'ground' shape.
        //var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
        //let groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
        //ground.material = groundMaterial;
        //let groundTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/ground.jpg", scene); // Example texture
        //groundMaterial.diffuseTexture = groundTexture;
        //const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, scene);
        // Import mesh
        //BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "alien.glb", scene, function(newMeshes){
        //    newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        //});
        //BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/", "PBR_Spheres.glb", scene);
        // Import mesh
        //BABYLON.SceneLoader.ImportMesh("", "assets/models/", "alien.glb", scene);
        //BABYLON.SceneLoader.ImportMesh("", "assets/models/", "alien.glb", scene, function (newMeshes) {
        //    // Set the target of the camera to the first imported mesh
        //    camera.target = newMeshes[0];
        //});
        var scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(65), 10, BABYLON.Vector3.Zero(), scene);
    
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    
        
    
        BABYLON.SceneLoader.ImportMesh("", "assets/models/", "alien.gbl", scene, function(newMeshes){
            newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        });
        return scene;
    }

    // Create Babylon.js scenes
    function createBabylonScene(canvasId) {
        const canvas = document.getElementById(canvasId);
        const engine = new BABYLON.Engine(canvas, true);

        const scene = createScene(canvas, engine);

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });
    }

    // Initialize Babylon.js scenes for each canvas
    createBabylonScene('renderCanvas1');
    createBabylonScene('renderCanvas2');
    createBabylonScene('renderCanvas3');
    createBabylonScene('renderCanvasA');
    createBabylonScene('renderCanvasB');
    createBabylonScene('renderCanvasC');
});