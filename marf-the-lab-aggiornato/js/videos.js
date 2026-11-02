// =========================================
// MARF THE LAB - VIDEOS.JS
// Elenco dei video della sezione "I miei lavori"
//
// COME AGGIUNGERE UN VIDEO:
// 1. metti il file (meglio .mp4, formato verticale 9:16) nella cartella /video
// 2. aggiungi un blocco qui sotto con src: 'video/nome-file.mp4'
// 3. (facoltativo) poster: 'img/nome-copertina.jpg' per la copertina
//
// category deve essere esattamente 'Anime' oppure 'Realistico'.
// Se src è vuoto, lo slot mostra "Video in arrivo".
// =========================================

const portfolioVideos = [
    { id: 'itachi-amaterasu', title: 'Itachi amaterasu', category: 'Anime', src: 'video/itachi-amaterasu.mp4', poster: 'img/itachi-amaterasu.jpg' },
    { id: 'zoro', title: 'Roronoa Zoro', category: 'Anime', src: 'video/zoro.mp4', poster: 'img/zoro.jpg' },
    { id: 'luffy', title: 'Monkey D. Luffy', category: 'Anime', src: 'video/luffy.mp4', poster: 'img/luffy.jpg' },
    { id: 'gohan', title: 'Son Gohan', category: 'Anime', src: 'video/gohan.mp4', poster: 'img/gohan.jpg' },
    { id: 'v2', title: 'Lavoro realistico #1', category: 'Realistico', src: '', poster: '' },
    { id: 'v4', title: 'Lavoro realistico #2', category: 'Realistico', src: '', poster: '' }
];
