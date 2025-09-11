function agregarFiguritaDesdeQR(){
  const params=new URLSearchParams(window.location.search);
  const id=parseInt(params.get('figurita'));
  if(!id) return;

  const usuario=localStorage.getItem('usuarioActivo');
  if(!usuario){ alert("Debes iniciar sesión para escanear la figurita."); return; }

  const key='user_'+usuario;
  const datos=JSON.parse(localStorage.getItem(key));

  if(!datos.figuritas.includes(id)){
    datos.figuritas.push(id);
    localStorage.setItem(key,JSON.stringify(datos));
    alert(`¡Figurita ${id} agregada a tu colección!`);
  }

  mostrarAlbum();
}
