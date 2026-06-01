import { organisms } from "./OrganismData.js";
import { createOrganism } from "./OrganismFactory.js";

export async function createFoodChain(scene){
    const created = [];
    const radius = 12;

    for(let i = 0; i < organisms.length; i++){
        const org = organisms[i];
        const angle = (i / organisms.length) * Math.PI * 2;
        const obj = await createOrganism(org);
        obj.position.set(
            Math.cos(angle) * radius,
            1,
            Math.sin(angle) * radius
        );
        obj.rotation.y = -angle + Math.PI / 2;
        obj.userData = {
            ...org,
            offset: Math.random() * 10
        };
        scene.add(obj);
        created.push(obj);
    }

    return created;
}
