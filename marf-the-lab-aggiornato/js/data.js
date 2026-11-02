// =========================================
// MARF THE LAB - DATA.JS
// Product database / frontend catalog data
//
// mockup: 'hoodie' | 'tee' | 'canvas' -> il disegno in "image" viene
// mostrato stampato su felpa, t-shirt o quadro (vedi js/mockups.js).
// Se togli "mockup", la card mostra la foto così com'è.
// =========================================

const productsDB = [
    {
        id: 'p1',
        title: 'Cyber Samurai Hoodie Heavyweight',
        category: 'Anime',
        price: 89.90,
        mockup: 'hoodie',
        image: 'img/itachi-amaterasu.jpg',
        artFocus: [0.5, 0.3],
        description: 'Felpa cotone 450GSM con stampa serigrafica.'
    },
    {
        id: 'p2',
        title: 'Quadri su Tela Canvas - Neon Portrait',
        category: 'Anime',
        price: 120.00,
        mockup: 'canvas',
        image: 'img/zoro.jpg',
        description: 'Tela di cotone fine art 60x80cm.'
    },
    {
        id: 'p3',
        title: 'Ritratti Realistici Custom su Tela',
        category: 'Realistico',
        price: 150.00,
        mockup: 'canvas',
        // sostituisci con un tuo lavoro realistico (es. 'img/ritratto-1.jpg') quando ce l'hai
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        description: 'Dipinto originale digitale iperrealista.'
    },
    {
        id: 'p4',
        title: 'T-Shirt Custom Realism Eye',
        category: 'Realistico',
        price: 45.00,
        mockup: 'tee',
        // sostituisci con un tuo lavoro realistico quando ce l'hai
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        artMono: true,
        artZoom: 1.5,
        artFocus: [0.4, 0.35],
        description: 'T-shirt vintage wash nera.'
    }
];

let cartState = [];
