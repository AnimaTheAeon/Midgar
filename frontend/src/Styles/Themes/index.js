import * as boxofx from './boxofx';
import * as midgar from './midgar';

// Midgar has two looks: the FFVII menu and "Box of X". Sonarr's old theme
// names all map to the FFVII menu so saved settings keep working.
export default {
  auto: midgar,
  light: midgar,
  dark: midgar,
  midgar,
  boxofx
};
