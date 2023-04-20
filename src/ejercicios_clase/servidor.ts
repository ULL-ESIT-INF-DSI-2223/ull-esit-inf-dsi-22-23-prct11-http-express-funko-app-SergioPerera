import express from 'express';
import { exec } from 'child_process';

/// Generamos el servidor express
const app = express();
/// Lo ponemos a escuchar en el puerto 3000
const PORT = 3000;

/// Usamos json ya que no vamos a usar archivos estáticos
app.use(express.json());

/// Ponemos el punto de acceso json que devuelve un json
app.get('/execmd', (req, res) => {
  const cmd = req.query.cmd;
  /// Hacemos que el parámetro args sea opcional
  const args = req.query.args || '';


  /// Ponemos como obligatorio el parámetro cmd, como el args es opcional no hace falta que lo comprobemos
  if (!cmd) {
    return res.status(400).json({ error: 'Missing cmd parameter' });
  }

  /// Ejecutamos el comando que nos ha llegado
  exec(`${cmd} ${args}`, (error, stdout, stderr) => {
    /// Si el comando no existe 
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    /// Si el comando emite algún error
    if (stderr) {
      return res.status(500).json({ error: stderr });
    }

    /// Devolvemos el resultado del comando
    return res.json({ output: stdout });
  });
});

/// En caso de que no accedamos correctamente al punto de acceso
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/// Ponemos el servidor a escuchar
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
