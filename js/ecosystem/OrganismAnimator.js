export function animateOrganisms(organisms, time, delta = 0){
    organisms.forEach((org) => {
        if(org.userData.mixer){
            org.userData.mixer.update(delta);
        }

        if(org.userData.isInAction){
            return;
        }

        org.position.y = 1 + Math.sin(time * 2 + org.userData.offset) * 0.2;

        if(org.userData.id === 'aguila'){
            org.position.y = 3.2 + Math.sin(time * 1.8 + org.userData.offset) * 0.35;
            animateFallbackWings(org, time);
        }

        if(org.userData.id === 'serpiente'){
            org.rotation.y += Math.sin(time * 2 + org.userData.offset) * 0.0015;
        }

        if(org.userData.id === 'grillo' || org.userData.id === 'raton'){
            animateFallbackLegs(org, time);
        }
    });
}

function animateFallbackLegs(org, time){
    org.traverse((node) => {
        if(node.name === 'leg'){
            node.rotation.z += Math.sin(time * 10 + node.position.x * 6) * 0.01;
        }
    });
}

function animateFallbackWings(org, time){
    org.traverse((node) => {
        if(node.name === 'leftWing'){
            node.rotation.z = Math.sin(time * 8) * 0.25;
        }
        if(node.name === 'rightWing'){
            node.rotation.z = -Math.sin(time * 8) * 0.25;
        }
    });
}
