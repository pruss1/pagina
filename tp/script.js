function buscar() {
  const termino = document.getElementById("buscador").value.trim().toLowerCase();
  const explosion = document.getElementById("explosion");
  const ranaepica = document.getElementById("ranaepica");
  const resultados = document.getElementById("resultados");

  resultados.innerHTML = "";
  ranaepica.style.display = "none";

  if (!termino) {
    alert("escribi xd");
  } else if (termino === "lio") {
    explosion.style.display = "block";
    setTimeout(() => {
      explosion.style.display = "none";

      const r = {
        nombre: "lio",
        imagen: "lio.jpg",
        descripcion: "omg encontraste el easter egg de lio, sos un verdadero conocedor de ranas",
        reino: "bob",
        filo: "tierno",
        clase: "4 15",
        orden: "ferg",
        ternura: "100%"
      };

      const c = document.createElement("div");
      c.className = "card m-2";
      c.style.width = "30rem";
      c.innerHTML = `
        <img src="${r.imagen}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${r.nombre}</h5>
          <p class="card-text">
            Reino: ${r.reino}<br>
            Filo: ${r.filo}<br>
            Clase: ${r.clase}<br>
            Orden: ${r.orden}<br>
            ternura: ${r.ternura}<br>
            Descripción: ${r.descripcion}
          </p>
        </div>
      `;
      resultados.appendChild(c);
    }, 800);
  } else {
    explosion.style.display = "block";
    setTimeout(() => {
      explosion.style.display = "none";

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
                resultados.innerHTML = "<h1>no ai</h1>";
              } else {
                const especie = dataGBIF.results[0];
                fetch(`https://api.gbif.org/v1/species/${especie.key}`)
                  .then(res => res.json())
                  .then(detalle => {
                    const resumen = detalle.remarks || "no ai :(";
                    const c = document.createElement("div");
                    c.className = "card m-2";
                    c.style.width = "30rem";
                    c.innerHTML = `
                      <img src="${imageURL}" class="card-img-top" alt="Imagen de rana">
                      <div class="card-body">
                        <h5 class="card-title">${especie.scientificName || "Nombre desconocido"}</h5>
                        <p class="card-text">
                          reino: ${especie.kingdom || "nose"}<br>
                          filo: ${especie.phylum || "nose"}<br>
                          clase: ${especie.class || "nose"}<br>
                          orden: ${especie.order || "nosexdd"}<br>
                          genero: ${especie.genus || "nose"}<br>
                          familia: ${especie.family || "nose"}<br>
                          autor: ${especie.authorship || "nose"}<br>
                          descripsion: ${resumen}
                        </p>
                      </div>
                    `;
                    resultados.appendChild(c);
                  })
                  .catch(err => {
                    resultados.innerHTML = "<p>errorxd</p>";
                  });
              }
            })
            .catch(err => {
              resultados.innerHTML = "<p>errorxd</p>";
            });
        })
        .catch(err => {
          resultados.innerHTML = "<p>errorxd</p>";
        });
    }, 800);
  }
}
