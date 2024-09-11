function createBabylonScene2(container) {

    if (container.babylonEngine) {
        container.babylonEngine.dispose();
    }

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);


    const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {});

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.removeEventListener('resize', () => {
        engine.resize();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });
}

// Make the function accessible globally
window.createBabylonScene2 = createBabylonScene2;

function createBabylonScene(container) {
    if (container.babylonEngine) {
        container.babylonEngine.dispose();
    }

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, -0.2+ Math.PI / 2, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.setPosition(new BABYLON.Vector3(0, 5, -10));

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    BABYLON.SceneLoader.ImportMesh("", "https://mastroalex.github.io/m2m/assets/animations/", "Pulled_tissue.glb", scene, function (newMeshes) {
        newMeshes[0].position = new BABYLON.Vector3(0, 0, 0);
    });
    

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.removeEventListener('resize', () => {
        engine.resize();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });
}

// Make the function accessible globally
window.createBabylonScene = createBabylonScene;


function createBabylonScene3(container) {
    if (container.babylonEngine) {
        container.babylonEngine.dispose();
    }

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const camera = new BABYLON.ArcRotateCamera("Camera",4.0+ Math.PI / 2, -0.2+ Math.PI / 2, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.setTarget(BABYLON.Vector3.Zero());

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    //const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "aerobatic_plane.glb", scene, function (newMeshes) {
        newMeshes[0].position = new BABYLON.Vector3(0, -1, 0);
        newMeshes[0].scaling = new BABYLON.Vector3(8,8,8);
    });

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.removeEventListener('resize', () => {
        engine.resize();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });
}

// Make the function accessible globally
window.createBabylonScene3 = createBabylonScene3;