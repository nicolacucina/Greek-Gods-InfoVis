/* export async function loadData() {
  try {
    const response = await fetch("../data/greek-gods.json");
    const data = await response.json();
    return data.nodes; // Assume che i dati siano nell'array 'nodes'
  } catch (error) {
    console.error("Errore nel caricamento dei dati", error);
  }
} */

// Funzione per caricare i dati gerarchici
/* export async function loadHierarchicalData() {
  try {
    const response = await fetch("../data/greek-gods-hierarchy.json");
    const data = await response.json();
    return data; // Assume che i dati siano nell'array 'nodes'
  } catch (error) {
    console.error("Errore nel caricamento dei dati", error);
  }
} */

//Funzione per caricare dati con intero oggetto JSON: aggiunto per il tangleTree che ha bisogno sia di edge che di nodes
/* export async function loadAllData() {
  try {
    const response = await fetch("../data/greek-gods.json");
    const data = await response.json();
    return data; // Restituisci l'intero oggetto dati
  } catch (error) {
    console.error("Errore nel caricamento dei dati", error);
  }
} */

export async function loadData(path) {
  try {
    const response = await fetch(path);
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Errore nel caricamento dei dati", error);
  }
}
