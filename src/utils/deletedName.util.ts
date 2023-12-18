const deletedNameUtil = async () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultat = '';
  for (let i = 0; i < 10; i++) {
    resultat += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return "User" + resultat;
}

export default deletedNameUtil;