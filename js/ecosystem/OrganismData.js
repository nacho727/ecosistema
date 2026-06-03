export const organisms = [
    {
        id: "planta",
        name: "Planta",
        type: "Productor",
        model: "planta",
        color: 0x22aa22,
        scale: 1.35,
        description: "Produce energia mediante fotosintesis: usa luz solar, agua y dioxido de carbono para fabricar su alimento y liberar oxigeno.",
        action: "photosynthesis"
    },
    {
        id: "grillo",
        name: "Grillo",
        type: "Consumidor primario",
        model: "grillo",
        color: 0xaaff22,
        scale: 1.05,
        description: "Se alimenta de plantas y obtiene la energia que la planta produjo con la luz del sol.",
        action: "grasshopperFeeds"
    },
    {
        id: "raton",
        name: "Raton",
        type: "Consumidor secundario",
        model: "raton",
        color: 0x999999,
        scale: 1.05,
        description: "Se alimenta de insectos como el grillo. Asi la energia sigue avanzando por la cadena alimentaria.",
        action: "mouseFeeds"
    },
    {
        id: "serpiente",
        name: "Serpiente",
        type: "Consumidor terciario",
        model: "serpiente",
        color: 0x116633,
        scale: 1.15,
        description: "Caza pequenos mamiferos como el raton y representa un nivel superior de consumidor.",
        action: "snakeFeeds"
    },
    {
        id: "aguila",
        name: "Aguila",
        type: "Depredador superior",
        model: "aguila",
        color: 0x885522,
        scale: 1.25,
        description: "Es un depredador de alto nivel. Puede cazar serpientes y casi no tiene depredadores naturales en esta cadena.",
        action: "eagleFeeds"
    },
    {
        id: "hongo",
        name: "Hongo",
        type: "Descomponedor",
        model: "hongo",
        color: 0xffffff,
        scale: 1.2,
        description: "Descompone restos de seres vivos y devuelve nutrientes al suelo para que las plantas puedan crecer.",
        action: "decompose"
    }
];
