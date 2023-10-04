import app from './app';
import AppConfig from '../config/application';

app.listen(AppConfig.port, () => {
  console.log(`Listening on port ${AppConfig.port}`);
});
