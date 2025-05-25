function buscar() {
  const termino = document.getElementById("buscador").value.trim().toLowerCase();
  const explosion = document.getElementById("explosion");
  const ranaepica = document.getElementById("ranaepica");
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "";
  ranaepica.style.display = "none";
  if (!termino) {
    alert("Por favor, escribe algo para buscar.");
    return;
  }
  explosion.style.display = "block";
  setTimeout(() => {
    explosion.style.display = "none";
    const lio = {
      "lio": {
        nombre: "lio",
        imagen: "lio.jpg",
        descripcion: "omg encontraste el easter egg de lio, sos un verdadero conocedor de ranas",
        reino: "bob",
        filo: "tierno",
        clase: "4 15",
        orden: "ferg",
        ternura: "100%"
      }
    }
    if (lio[termino]) {
      const r = lio[termino];
      const card = document.createElement("div");
      card.className = "card m-2";
      card.style.width = "18rem";
      card.innerHTML = `
        <img src="${r.imagen}" class="card-img-top"">
        <div class="card-body">
          <h5 class="card-title">${r.nombre}</h5>
          <p class="card-text">
            Reino: ${r.reino}<br>
            Filo: ${r.filo}<br>
            Clase: ${r.clase}<br>
            Orden: ${r.orden}<br>
            ternura:${r.ternura}<br>
            Descripción:${r.descripcion}
          </p>
        </div>
      `;
      resultados.appendChild(card);
      return;
    }
    fetch(`https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(termino)}&per_page=1`)
      .then(res => res.json())
      .then(dataINat => {
        let imageURL = "https://via.placeholder.com/320x240?text=Sin+foto";
        if (dataINat.results.length > 0 && dataINat.results[0].photos.length > 0) {
          imageURL = dataINat.results[0].photos[0].url.replace("square", "medium");
        }
        fetch(`https://api.gbif.org/v1/species/search?q=${encodeURIComponent(termino)}`)
          .then(res => res.json())
          .then(dataGBIF => {
            if (!dataGBIF.results || dataGBIF.results.length === 0) {
              resultados.innerHTML = "<p>No se encontraron resultados.</p>";
              return;
            }
            const especie = dataGBIF.results[0];
            fetch(`https://api.gbif.org/v1/species/${especie.key}`)
              .then(res => res.json())
              .then(detalle => {
                const resumen = detalle.remarks || "no ai :("
                const card = document.createElement("div");
                card.className = "card m-2";
                card.style.width = "18rem";
                card.innerHTML = `
                  <img src="${imageURL}" class="card-img-top" alt="Imagen de rana">
                  <div class="card-body">
                    <h5 class="card-title">${especie.scientificName || "Nombre desconocido"}</h5>
                    <p class="card-text">
                      Reino: ${especie.kingdom || "nose"}<br>
                      Filo: ${especie.phylum || "nose"}<br>
                      Clase: ${especie.class || "nose"}<br>
                      Orden: ${especie.order || "nosexdd"}<br>
                      Descripción:>${resumen}
                    </p>                   
                  </div>
                `;
                resultados.appendChild(card);
              })
              .catch(err => {
                resultados.innerHTML = "<p>Error al obtener detalles de la especie.</p>";
                console.error("Detalles error:", err);
              })
          })
          .catch(err => {
            resultados.innerHTML = "<p>Error al buscar en GBIF.</p>";
            console.error("GBIF error:", err);
          });
      })
      .catch(err => {
        resultados.innerHTML = "<p>Error al obtener la imagen.</p>";
        console.error("iNaturalist error:", err);
      });
  }, 800);
}