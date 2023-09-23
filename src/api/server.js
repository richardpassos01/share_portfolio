import app from './app.js';
import AppConfig from '../config/application.js';

app.listen(AppConfig.port, () => {
  console.log(`Listening on port ${AppConfig.port}`);
});
